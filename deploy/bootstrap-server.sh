#!/usr/bin/env bash
# One-time setup of a fresh Linux server. Run as root:
#
#   sudo bash bootstrap-server.sh <server-ip-or-hostname> [repo-url] [branch]
#
# It
#   1. makes sure Docker + the compose plugin are installed and start on boot,
#   2. clones the repository into /opt/ce-school,
#   3. writes /etc/ce-school/.env with freshly generated secrets (never overwritten),
#   4. installs the systemd units: the stack itself (comes back after a power cut),
#      the auto-update timer (CD) and the nightly backup timer,
#   5. runs the first deploy.
#
# Re-running is safe: it keeps the existing .env and data.
set -Eeuo pipefail

[ "$(id -u)" = 0 ] || { echo "run as root (sudo)"; exit 1; }

SERVER_HOST="${1:?usage: bootstrap-server.sh <server-ip-or-hostname> [repo-url] [branch]}"
REPO_URL="${2:-https://github.com/m-zakeri/cse-school.git}"
BRANCH="${3:-main}"
APP_DIR=/opt/ce-school
ENV_DIR=/etc/ce-school
ENV_FILE="$ENV_DIR/.env"

log() { printf '\n==> %s\n' "$*"; }

log "Docker"
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed; installing it (needs internet)."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq && apt-get install -y docker.io
  else
    curl -fsSL https://get.docker.com | sh
  fi
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "The 'docker compose' plugin is missing; installing it."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq
    apt-get install -y docker-compose-v2 || apt-get install -y docker-compose-plugin || true
  fi
  docker compose version >/dev/null 2>&1 || {
    echo "Could not install the docker compose plugin. Install it manually and re-run."; exit 1; }
fi
systemctl enable --now docker

for tool in git curl python3 flock; do
  command -v "$tool" >/dev/null 2>&1 || { echo "missing required tool: $tool"; exit 1; }
done

log "Repository -> $APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --quiet origin "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH" --quiet
else
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
chmod +x "$APP_DIR"/deploy/*.sh

log "Configuration -> $ENV_FILE"
mkdir -p "$ENV_DIR"
if [ -f "$ENV_FILE" ]; then
  echo "$ENV_FILE already exists; keeping it."
else
  rand() { python3 -c "import secrets,sys; print(secrets.token_hex(int(sys.argv[1])))" "$1"; }
  ADMIN_PASSWORD="$(rand 10)"
  umask 077
  cat >"$ENV_FILE" <<EOF
# CE School production configuration. Keep this file private (chmod 600).
SECRET_KEY=$(rand 40)
POSTGRES_PASSWORD=$(rand 16)
FIRST_SUPERUSER_EMAIL=admin@aut.ac.ir
FIRST_SUPERUSER_PASSWORD=$ADMIN_PASSWORD
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=$(rand 16)

# nginx serves everything on one address and the default HTTP port. The app ports
# (3000/8000/9000) stay on the server itself and are not reachable from outside.
HTTP_PORT=80
BIND_ADDR=127.0.0.1

# What the BROWSER uses to reach the server (baked into the frontend build).
NEXT_PUBLIC_API_URL=http://$SERVER_HOST/api/v1
S3_PUBLIC_ENDPOINT=http://$SERVER_HOST
EXTRA_CORS_ORIGINS=http://$SERVER_HOST
EOF
  chmod 600 "$ENV_FILE"
  echo "Generated secrets. Admin login: admin@aut.ac.ir / $ADMIN_PASSWORD"
  echo "(also stored in $ENV_FILE; change it after the first login)"
fi

log "systemd units"
install -m 644 "$APP_DIR"/deploy/systemd/*.service "$APP_DIR"/deploy/systemd/*.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable ce-school.service ce-school-update.timer ce-school-backup.timer ce-school-healthcheck.timer

log "First deploy"
"$APP_DIR/deploy/deploy.sh"

systemctl start ce-school-update.timer ce-school-backup.timer ce-school-healthcheck.timer

log "Done"
cat <<EOF
Site:        http://$SERVER_HOST
API docs:    http://$SERVER_HOST/docs
Port to allow through the firewall: 80 only (nginx serves the site, the API and the videos).

Status:      systemctl status ce-school ce-school-update.timer ce-school-backup.timer ce-school-healthcheck.timer
Deploy log:  journalctl -u ce-school-update -n 50
Manual run:  sudo $APP_DIR/deploy/deploy.sh
EOF
