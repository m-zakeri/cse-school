#!/usr/bin/env bash
# Build and (re)start the stack from the current checkout.
#
# Idempotent and safe to run by hand, from cron/systemd or from CI:
#   - builds the new images, keeping the previous ones as ":previous"
#   - starts them and waits until the API reports healthy
#   - if that fails, rolls back to the previous images and exits non-zero
#
# Configuration (environment variables, all optional):
#   ENV_FILE   secrets/config file       (default /etc/ce-school/.env)
#   STATE_DIR  where bookkeeping lives   (default /var/lib/ce-school)
#   WAIT_SECS  health wait budget        (default 240)
#   NO_BUILD=1 use prebuilt images ce-school/{backend,frontend}:incoming instead of building
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-/etc/ce-school/.env}"
STATE_DIR="${STATE_DIR:-/var/lib/ce-school}"
WAIT_SECS="${WAIT_SECS:-240}"
SERVICES=(backend frontend)

log() { printf '[deploy %s] %s\n' "$(date '+%F %T')" "$*"; }
die() { log "ERROR: $*"; exit 1; }

cd "$APP_DIR"
mkdir -p "$STATE_DIR"

# One deploy at a time (the update timer and a manual run must not overlap).
exec 9>"$STATE_DIR/deploy.lock"
flock -n 9 || die "another deploy is already running"

command -v docker >/dev/null || die "docker is not installed"
docker compose version >/dev/null 2>&1 || die "the docker compose plugin is missing"
[ -f "$ENV_FILE" ] || die "$ENV_FILE not found (run deploy/bootstrap-server.sh first)"

# Refuse to deploy with a half-filled config: compose would only complain later.
set -a; . "$ENV_FILE"; set +a
for var in SECRET_KEY POSTGRES_PASSWORD FIRST_SUPERUSER_PASSWORD MINIO_ROOT_PASSWORD \
           NEXT_PUBLIC_API_URL S3_PUBLIC_ENDPOINT; do
  [ -n "${!var:-}" ] || die "$var is empty in $ENV_FILE"
done

COMPOSE=(docker compose --env-file "$ENV_FILE")
"${COMPOSE[@]}" config -q || die "docker-compose.yml is invalid"

REV="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
log "deploying revision $REV"

# Keep the running images so a bad release can be undone.
for svc in "${SERVICES[@]}"; do
  if docker image inspect "ce-school/$svc:latest" >/dev/null 2>&1; then
    docker tag "ce-school/$svc:latest" "ce-school/$svc:previous"
  fi
done

rollback() {
  log "rolling back to the previous images"
  local did=0
  for svc in "${SERVICES[@]}"; do
    if docker image inspect "ce-school/$svc:previous" >/dev/null 2>&1; then
      docker tag "ce-school/$svc:previous" "ce-school/$svc:latest"
      did=1
    fi
  done
  if [ "$did" = 1 ]; then
    "${COMPOSE[@]}" up -d --no-build "${SERVICES[@]}" || true
  else
    log "no previous images to roll back to (first deploy)"
  fi
}

on_failure() {
  trap - ERR
  log "deploy failed; recent backend log:"
  "${COMPOSE[@]}" logs --tail 40 backend 2>&1 || true
  rollback
  exit 1
}
# Anything that goes wrong from here on (build error, unhealthy service) rolls back.
deploy_fail() { log "ERROR: $*"; on_failure; }
trap on_failure ERR

if [ "${NO_BUILD:-0}" = 1 ]; then
  # Images were built elsewhere and loaded with `docker load` as ce-school/<svc>:incoming
  # (needed when this server cannot reach the registries/package mirrors a build uses).
  for svc in "${SERVICES[@]}"; do
    docker image inspect "ce-school/$svc:incoming" >/dev/null 2>&1 \
      || deploy_fail "NO_BUILD=1 but image ce-school/$svc:incoming is not loaded"
    docker tag "ce-school/$svc:incoming" "ce-school/$svc:latest"
  done
  log "using the prebuilt images"
  "${COMPOSE[@]}" up -d --no-build --remove-orphans
else
  "${COMPOSE[@]}" build
  "${COMPOSE[@]}" up -d --remove-orphans
fi

log "waiting for the API to become healthy (up to ${WAIT_SECS}s)"
deadline=$((SECONDS + WAIT_SECS))
until [ "$(docker inspect -f '{{.State.Health.Status}}' ce-school-backend 2>/dev/null)" = "healthy" ]; do
  [ "$SECONDS" -lt "$deadline" ] || deploy_fail "backend did not become healthy"
  sleep 3
done

# The frontend has no healthcheck of its own; make sure it really answers.
until curl -fsS -o /dev/null -m 5 http://127.0.0.1:3000/courses/; do
  [ "$SECONDS" -lt "$deadline" ] || deploy_fail "frontend did not answer on :3000"
  sleep 3
done
curl -fsS -o /dev/null -m 5 http://127.0.0.1:8000/health || deploy_fail "API /health failed"

# What visitors actually use: nginx in front of everything (HTTP_PORT, 80 in production).
HTTP_PORT="${HTTP_PORT:-8080}"
until curl -fsS -o /dev/null -m 5 "http://127.0.0.1:$HTTP_PORT/nginx-health"; do
  [ "$SECONDS" -lt "$deadline" ] || deploy_fail "nginx did not answer on :$HTTP_PORT"
  sleep 3
done
curl -fsS -o /dev/null -m 5 "http://127.0.0.1:$HTTP_PORT/api/v1/" || deploy_fail "API not reachable through nginx"
curl -fsS -o /dev/null -m 5 "http://127.0.0.1:$HTTP_PORT/courses/" || deploy_fail "site not reachable through nginx"

trap - ERR
echo "$(git rev-parse HEAD 2>/dev/null || echo unknown)" >"$STATE_DIR/deployed_sha"

# Keep the systemd units in step with the repository: a release can bring a new
# timer (e.g. the watchdog) and the server picks it up here without a manual step.
if [ "$(id -u)" = 0 ] && command -v systemctl >/dev/null 2>&1 && [ -d /etc/systemd/system ]; then
  changed=0
  for unit in "$APP_DIR"/deploy/systemd/*.service "$APP_DIR"/deploy/systemd/*.timer; do
    dest="/etc/systemd/system/$(basename "$unit")"
    cmp -s "$unit" "$dest" || { install -m 644 "$unit" "$dest"; changed=1; }
  done
  if [ "$changed" = 1 ]; then
    systemctl daemon-reload
    for timer in "$APP_DIR"/deploy/systemd/*.timer; do
      systemctl enable --now "$(basename "$timer")" >/dev/null 2>&1 || true
    done
    log "systemd units updated"
  fi
fi

docker image prune -f >/dev/null 2>&1 || true
log "deploy of $REV finished, all services healthy"
