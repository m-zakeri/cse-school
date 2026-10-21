#!/usr/bin/env bash
# Watchdog, run every 2 minutes by a systemd timer.
#
#   - checks that the API and the website really answer,
#   - after two failed checks in a row, tries to heal the stack (compose up -d),
#   - tells somebody when the site goes down and when it is back (state changes only),
#   - warns when the disk is nearly full (videos and backups live on it).
#
# Alerts go to the journal always, and additionally to whichever of these is set
# in /etc/ce-school/.env:
#   ALERT_WEBHOOK_URL  an incoming-webhook URL (Slack, Mattermost, Rocket.Chat, ...);
#                      receives {"text": "..."}
#   ALERT_EMAIL        an address; needs a working `mail` command on the server
#
# Exit status is always 0 so the timer keeps running; read the journal:
#   journalctl -u ce-school-healthcheck -n 50
set -uo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-/etc/ce-school/.env}"
STATE_DIR="${STATE_DIR:-/var/lib/ce-school}"
DISK_WARN_PERCENT="${DISK_WARN_PERCENT:-90}"
mkdir -p "$STATE_DIR"

ALERT_WEBHOOK_URL=""
ALERT_EMAIL=""
if [ -f "$ENV_FILE" ]; then
  ALERT_WEBHOOK_URL="$(grep -E '^ALERT_WEBHOOK_URL=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
  ALERT_EMAIL="$(grep -E '^ALERT_EMAIL=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
fi

log() { printf '[healthcheck %s] %s\n' "$(date '+%F %T')" "$*"; }

notify() {
  local msg="CE School ($(hostname)): $*"
  log "$msg"
  if [ -n "$ALERT_WEBHOOK_URL" ]; then
    local body
    body="$(MSG="$msg" python3 -c 'import json,os; print(json.dumps({"text": os.environ["MSG"]}))')"
    curl -fsS -m 10 -H 'Content-Type: application/json' -d "$body" "$ALERT_WEBHOOK_URL" >/dev/null 2>&1 \
      || log "could not reach the alert webhook"
  fi
  if [ -n "$ALERT_EMAIL" ] && command -v mail >/dev/null 2>&1; then
    printf '%s\n' "$msg" | mail -s "CE School alert" "$ALERT_EMAIL" || log "could not send the alert e-mail"
  fi
}

healthy() {
  curl -fsS -m 8 -o /dev/null http://127.0.0.1:8000/health \
    && curl -fsS -m 8 -o /dev/null http://127.0.0.1:3000/courses/
}

fail_file="$STATE_DIR/health_failures"
down_file="$STATE_DIR/health_down"
failures="$(cat "$fail_file" 2>/dev/null || echo 0)"

if healthy; then
  echo 0 >"$fail_file"
  if [ -f "$down_file" ]; then
    rm -f "$down_file"
    notify "the site is back up"
  fi
else
  failures=$((failures + 1))
  echo "$failures" >"$fail_file"
  log "check failed ($failures in a row)"
  if [ "$failures" -ge 2 ]; then
    if [ ! -f "$down_file" ]; then
      touch "$down_file"
      notify "the site is DOWN; trying to restart the containers"
    fi
    # Containers that crashed or were stopped come back; images are not rebuilt.
    if [ -f "$ENV_FILE" ]; then
      (cd "$APP_DIR" && docker compose --env-file "$ENV_FILE" up -d --no-build) >/dev/null 2>&1 \
        || log "docker compose up failed"
    fi
  fi
fi

used="$(df --output=pcent / 2>/dev/null | tail -1 | tr -dc '0-9')"
if [ -n "$used" ] && [ "$used" -ge "$DISK_WARN_PERCENT" ]; then
  warned="$STATE_DIR/disk_warned"
  # At most one warning a day.
  if [ ! -f "$warned" ] || [ -n "$(find "$warned" -mmin +1440 2>/dev/null)" ]; then
    touch "$warned"
    notify "disk is ${used}% full; free some space or old backups in /var/backups/ce-school"
  fi
fi
exit 0
