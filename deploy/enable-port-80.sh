#!/usr/bin/env bash
# One-time switch of a server that is already running to "everything on port 80
# behind nginx": the site, the API and the videos all come from
# http://<server>/ and the app ports (3000/8000/9000) stop being reachable from
# outside. New servers installed with bootstrap-server.sh are set up this way already.
#
#   sudo bash /opt/ce-school/deploy/enable-port-80.sh [server-ip-or-hostname]
#   (SKIP_GIT=1 sudo -E bash ... when the code was copied onto the server by hand)
#
# It backs up /etc/ce-school/.env, rewrites the address settings, pulls the newest
# code and redeploys. The database and the uploaded videos are not touched.
# Re-running is safe.
set -Eeuo pipefail

[ "$(id -u)" = 0 ] || { echo "run as root (sudo)"; exit 1; }

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-/etc/ce-school/.env}"
BRANCH="${BRANCH:-main}"
[ -f "$ENV_FILE" ] || { echo "$ENV_FILE not found (run bootstrap-server.sh first)"; exit 1; }

HOST="${1:-}"
if [ -z "$HOST" ]; then
  # Reuse the address the site is already configured with.
  HOST="$(grep -E '^NEXT_PUBLIC_API_URL=' "$ENV_FILE" | tail -1 | sed -E 's#^[^=]*=https?://([^/:]+).*#\1#')"
fi
[ -n "$HOST" ] || { echo "could not work out the server address; pass it as an argument"; exit 1; }

# Something else already listening on :80 would make nginx fail to start.
if ss -ltn 2>/dev/null | awk '{print $4}' | grep -qE '(^|:)80$'; then
  if ! docker ps --format '{{.Names}} {{.Ports}}' | grep -q '^ce-school-nginx .*:80->'; then
    echo "Port 80 is already in use by another program on this server:"
    ss -ltnp 2>/dev/null | grep -E ':80[[:space:]]' || true
    echo "Stop it (or tell me) and run this script again."
    exit 1
  fi
fi

cp -a "$ENV_FILE" "$ENV_FILE.bak-$(date +%Y%m%d-%H%M%S)"

set_kv() {
  local key="$1" value="$2"
  if grep -qE "^$key=" "$ENV_FILE"; then
    sed -i "s|^$key=.*|$key=$value|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >>"$ENV_FILE"
  fi
}

set_kv HTTP_PORT 80
set_kv BIND_ADDR 127.0.0.1
set_kv NEXT_PUBLIC_API_URL "http://$HOST/api/v1"
set_kv S3_PUBLIC_ENDPOINT "http://$HOST"
set_kv EXTRA_CORS_ORIGINS "http://$HOST"

if [ "${SKIP_GIT:-0}" = 1 ]; then
  # The code was already copied onto the server by hand (e.g. a git bundle), because
  # github.com is not reachable from here.
  echo "==> using the code already on the server (SKIP_GIT=1)"
else
  echo "==> updating the code"
  git -C "$APP_DIR" fetch --quiet origin "$BRANCH"
  git -C "$APP_DIR" reset --hard --quiet "origin/$BRANCH"
fi
chmod +x "$APP_DIR"/deploy/*.sh

echo "==> redeploying"
"$APP_DIR/deploy/deploy.sh"

cat <<EOF

Done. The whole site is now at:  http://$HOST/
API docs:                         http://$HOST/docs

Only port 80 needs to be open in the firewall. The old addresses with :3000 / :8000 / :9000
no longer work from outside the server (that is intended).
EOF
