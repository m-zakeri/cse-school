# Deploying CE School to a server

The whole stack (frontend, API, PostgreSQL, Redis, MinIO) runs with Docker Compose on one Linux
server. This folder contains everything needed to install it, update it automatically and keep
it alive after a power cut.

```
 you push to main ──► GitHub Actions "CI" (build + API smoke test)
                                │ green
                                ▼
 server, every 5 min:  auto-update.sh ── sees a new green commit ──► deploy.sh
                                                                      │ build, start, wait healthy
                                                                      └─ unhealthy? roll back to previous images
```

The server only needs **outbound** access to github.com. Nothing connects *into* it except people
using the site, so it works for a server on a private university network.

## One-time setup (≈5 minutes)

On the server, as a user with `sudo`:

```bash
git clone https://github.com/m-zakeri/cse-school.git /tmp/ce-school-setup
sudo bash /tmp/ce-school-setup/deploy/bootstrap-server.sh <SERVER_IP_OR_HOSTNAME>
```

`<SERVER_IP_OR_HOSTNAME>` is the address people will type in their browser (for example
`172.23.131.11`). The script:

1. installs Docker + compose if missing and enables it at boot,
2. clones the repo to `/opt/ce-school`,
3. creates `/etc/ce-school/.env` with **freshly generated** secrets (and prints the admin login once),
4. installs and enables the systemd units below,
5. builds and starts the stack and waits until it is healthy.

Open **only port 80** in the server firewall. An nginx container (`deploy/nginx/default.conf`) is the
single entry point and routes by path, so visitors never see a port number:

| Address | Goes to |
|---|---|
| `http://<server>/` | the website (Next.js production build) |
| `http://<server>/api/...` | the API (FastAPI) |
| `http://<server>/course-videos/...` | the lecture videos (MinIO, signed time-limited links, read-only) |

The app ports (3000, 8000, 9000), the MinIO console (9001), PostgreSQL and Redis are bound to
`127.0.0.1` (`BIND_ADDR` in `.env`) and are not reachable from outside.

The interactive API documentation (`/docs`, `/redoc`, the OpenAPI schema) is **not published**: nginx
answers 404. A developer opens it through an SSH tunnel to the API port that only the server itself can reach:

```bash
ssh -L 8000:127.0.0.1:8000 <user>@<server>     # then browse http://localhost:8000/docs
```

### A server that was installed before nginx (one-time switch)

If the server still serves the site on `:3000`, run once (it backs up `.env`, rewrites the address
settings, updates the code and redeploys; data is untouched):

```bash
sudo bash /opt/ce-school/deploy/enable-port-80.sh
```

Afterwards the site is at `http://<server>/` and the old `:3000/:8000/:9000` addresses stop working
from outside. Anything that used `--api http://<server>:8000/api/v1` (e.g. `publish_course.py`) now
uses `--api http://<server>/api/v1`.

## What keeps it running

| Unit | What it does |
|---|---|
| Docker `restart: unless-stopped` | every container restarts with Docker after a reboot or crash |
| `ce-school.service` | at boot, re-creates any missing container (`compose up -d --no-build`, no internet needed) |
| `ce-school-update.timer` | every 5 min: deploy the newest commit on `main` **if its CI run succeeded** |
| `ce-school-backup.timer` | nightly 03:00 backup of the database and uploaded videos (runs at next boot if the server was off) |
| `ce-school-healthcheck.timer` | every 2 min: checks the site and API, restarts the containers after two failed checks, alerts on down/up and on a nearly full disk |

Units added in a later release are installed and enabled by the next deploy; no manual step.

### Alerts and off-machine backups

Optional keys in `/etc/ce-school/.env`. The watchdog and the backup read them on every run, so no redeploy is needed:

```
ALERT_WEBHOOK_URL=https://chat.example.ir/hooks/xxxx   # Slack/Mattermost/Rocket.Chat-style webhook, receives {"text": "..."}
ALERT_EMAIL=ops@example.ir                              # needs a working `mail` command on the server
OFFSITE_DEST=backup@10.0.0.5:/srv/ce-school/            # rsync target (or a mounted folder) for every nightly backup
```

Without them the watchdog still heals the stack and writes to the journal
(`journalctl -u ce-school-healthcheck -n 50`).

Data lives in named Docker volumes (`ce_school_postgres_data`, `ce_school_minio_data`,
`ce_school_redis_data`) and survives restarts, deploys and power cuts. **Never** run
`docker compose down -v` on the server: `-v` deletes the volumes.

## Day-to-day

```bash
systemctl status ce-school ce-school-update.timer ce-school-backup.timer
journalctl -u ce-school-update -n 50        # what the auto-deploy did
sudo /opt/ce-school/deploy/deploy.sh        # deploy now, by hand
docker compose -p ce_school ps              # container status
docker compose -p ce_school logs -f backend # live API log
```

* **Release:** merge/push to `main`. CI runs on GitHub; within ~5 minutes of it passing the server
  deploys. A failed CI run is never deployed. A deploy whose services do not become healthy is
  rolled back automatically to the previous images and not retried until a new commit arrives.
* **Change a secret or an address:** edit `/etc/ce-school/.env`, then `sudo /opt/ce-school/deploy/deploy.sh`.
  `NEXT_PUBLIC_API_URL` is baked into the frontend, so changing it needs that rebuild.
* **Pause auto-deploy:** `sudo systemctl stop ce-school-update.timer`.
* **Deploy without waiting for CI:** set `Environment=REQUIRE_CI=false` in
  `ce-school-update.service` (`systemctl edit ce-school-update`).

## Backups and restore

Backups go to `/var/backups/ce-school` (7 days kept): `db-*.dump` and `media-*.tgz`.
Copy them off the machine regularly; a backup on the same disk does not survive a dead disk.

```bash
# run one now
sudo /opt/ce-school/deploy/backup.sh

# restore the database (stack running)
cat /var/backups/ce-school/db-YYYYmmdd-HHMMSS.dump | \
  docker exec -i ce-school-postgres pg_restore -U postgres -d ce_school_db --clean --if-exists

# restore uploaded videos (stop MinIO first)
docker compose -p ce_school stop minio
docker run --rm -v ce_school_minio_data:/data -v /var/backups/ce-school:/backup \
  --entrypoint sh postgres:16-alpine -c 'rm -rf /data/* && tar xzf /backup/media-YYYYmmdd-HHMMSS.tgz -C /data'
docker compose -p ce_school start minio
```

## Accounts

* **Forgot password:** the student asks the secretariat; an admin opens the panel's **Users** tab,
  searches the student and presses **Temporary password**. The password is shown once; the student
  must choose a new one right after logging in.
* **Admin password:** the first admin password lives in `/etc/ce-school/.env`
  (`FIRST_SUPERUSER_PASSWORD`). It is only used when the admin account is first created, so changing it
  later must be done from the account's profile page, not by editing `.env`.

## Security notes

* **Do not put server passwords in the repository, in chat, or in a GitHub secret** if it can be
  avoided. A password that has been pasted into a chat should be treated as exposed and changed
  (`passwd` on the server). Prefer SSH keys: `ssh-copy-id user@server`, then disable password login.
* `/etc/ce-school/.env` holds every secret and is `chmod 600`; it is not in git.
* The site is plain HTTP on a private network. If it is ever exposed beyond the university network,
  add a certificate to nginx (listen on 443, redirect 80 to it) and change the three URLs in `.env`
  to `https://`.
* nginx overwrites `X-Forwarded-For` with the real client address, which the login rate limit relies on;
  keep the app ports bound to `127.0.0.1` so nothing can reach the API around nginx.

## Optional: push-based deploy with a GitHub runner

If you prefer "deploy the moment CI finishes" over the 5-minute poll, register a
[self-hosted runner](https://docs.github.com/actions/hosting-your-own-runners) on the server (needs
admin on the GitHub repo to get the registration token) and add a job to `ci.yml`:

```yaml
  deploy:
    needs: [backend, frontend, e2e]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: [self-hosted, ce-school]
    steps:
      - run: sudo -n /opt/ce-school/deploy/auto-update.sh
```

The runner service starts at boot, so it also survives power cuts.
