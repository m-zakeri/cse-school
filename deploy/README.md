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

Open these ports in the server firewall: **3000** (site), **8000** (API), **9000** (video files).
The MinIO console (9001), PostgreSQL and Redis are bound to `127.0.0.1` only.

Then: site at `http://<server>:3000`, API docs at `http://<server>:8000/docs`.

## What keeps it running

| Unit | What it does |
|---|---|
| Docker `restart: unless-stopped` | every container restarts with Docker after a reboot or crash |
| `ce-school.service` | at boot, re-creates any missing container (`compose up -d --no-build`, no internet needed) |
| `ce-school-update.timer` | every 5 min: deploy the newest commit on `main` **if its CI run succeeded** |
| `ce-school-backup.timer` | nightly 03:00 backup of the database and uploaded videos (runs at next boot if the server was off) |

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

## Security notes

* **Do not put server passwords in the repository, in chat, or in a GitHub secret** if it can be
  avoided. A password that has been pasted into a chat should be treated as exposed and changed
  (`passwd` on the server). Prefer SSH keys: `ssh-copy-id user@server`, then disable password login.
* `/etc/ce-school/.env` holds every secret and is `chmod 600`; it is not in git.
* The site is plain HTTP on a private network. If it is ever exposed beyond the university network,
  put a TLS terminator (nginx/Caddy) in front and change the three URLs in `.env`.

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
