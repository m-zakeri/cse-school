#!/usr/bin/env bash
# Pull-based continuous delivery, run by a systemd timer every few minutes.
#
# The server only needs outbound access to GitHub: no inbound ports, tokens or
# runners. A new commit on the branch is deployed only once its CI run on GitHub
# has succeeded (set REQUIRE_CI=false to skip that check).
#
# Environment (all optional):
#   BRANCH      branch to follow            (default main)
#   REQUIRE_CI  wait for green CI           (default true)
#   ENV_FILE / STATE_DIR  as in deploy.sh
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${STATE_DIR:-/var/lib/ce-school}"
BRANCH="${BRANCH:-main}"
REQUIRE_CI="${REQUIRE_CI:-true}"

log() { printf '[auto-update %s] %s\n' "$(date '+%F %T')" "$*"; }

cd "$APP_DIR"
mkdir -p "$STATE_DIR"

git fetch --quiet origin "$BRANCH" || { log "cannot reach GitHub, will retry later"; exit 0; }
remote_sha="$(git rev-parse "origin/$BRANCH")"
deployed_sha="$(cat "$STATE_DIR/deployed_sha" 2>/dev/null || echo none)"
failed_sha="$(cat "$STATE_DIR/failed_sha" 2>/dev/null || echo none)"

[ "$remote_sha" != "$deployed_sha" ] || exit 0
[ "$remote_sha" != "$failed_sha" ] || exit 0   # already tried and failed; wait for a new commit

if [ "$REQUIRE_CI" = "true" ]; then
  slug="$(git config --get remote.origin.url | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')"
  ci="$(curl -fsS -m 20 -H 'Accept: application/vnd.github+json' \
      "https://api.github.com/repos/$slug/actions/workflows/ci.yml/runs?head_sha=$remote_sha&per_page=1" 2>/dev/null \
    | python3 -c '
import json, sys
try:
    runs = json.load(sys.stdin).get("workflow_runs", [])
except Exception:
    runs = []
if not runs:
    print("unknown")
elif runs[0].get("status") != "completed":
    print("pending")
else:
    print(runs[0].get("conclusion") or "unknown")
' || echo unknown)"
  case "$ci" in
    success) ;;
    failure|cancelled|timed_out)
      log "CI for ${remote_sha:0:7} is '$ci'; not deploying"
      echo "$remote_sha" >"$STATE_DIR/failed_sha"
      exit 0 ;;
    *) log "CI for ${remote_sha:0:7} is '$ci'; waiting"; exit 0 ;;
  esac
fi

log "deploying ${remote_sha:0:7} (was ${deployed_sha:0:7})"
git reset --hard "origin/$BRANCH" --quiet
if bash "$APP_DIR/deploy/deploy.sh"; then
  rm -f "$STATE_DIR/failed_sha"
else
  echo "$remote_sha" >"$STATE_DIR/failed_sha"
  log "deploy of ${remote_sha:0:7} failed and was rolled back"
  exit 1
fi
