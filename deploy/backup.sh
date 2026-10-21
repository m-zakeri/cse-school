#!/usr/bin/env bash
# Nightly backup of the database and the uploaded videos.
#
# Writes into BACKUP_DIR (default /var/backups/ce-school):
#   db-YYYYmmdd-HHMMSS.dump   PostgreSQL custom-format dump (pg_restore)
#   media-YYYYmmdd-HHMMSS.tgz MinIO data (course videos)
# and deletes files older than KEEP_DAYS (default 7).
#
# Optional off-machine copy: set OFFSITE_DEST in /etc/ce-school/.env (or the
# environment) to an rsync target such as "backup@10.0.0.5:/srv/ce-school/" or a
# local mount point such as "/mnt/nas/ce-school/". A backup on the same disk does
# not survive a dead disk. A failed copy is reported but does not fail the backup.
#
# Restore: see deploy/README.md.
set -Eeuo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/ce-school}"
KEEP_DAYS="${KEEP_DAYS:-7}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"
umask 077

echo "[backup] database"
docker exec ce-school-postgres pg_dump -U postgres -Fc ce_school_db >"$BACKUP_DIR/db-$STAMP.dump.partial"
mv "$BACKUP_DIR/db-$STAMP.dump.partial" "$BACKUP_DIR/db-$STAMP.dump"

echo "[backup] media"
# Any image that already exists on the host works; the postgres image ships tar.
docker run --rm \
  -v ce_school_minio_data:/data:ro \
  -v "$BACKUP_DIR":/backup \
  --entrypoint tar postgres:16-alpine \
  czf "/backup/media-$STAMP.tgz.partial" -C /data .
mv "$BACKUP_DIR/media-$STAMP.tgz.partial" "$BACKUP_DIR/media-$STAMP.tgz"

if [ -z "${OFFSITE_DEST:-}" ] && [ -f /etc/ce-school/.env ]; then
  OFFSITE_DEST="$(grep -E '^OFFSITE_DEST=' /etc/ce-school/.env | tail -1 | cut -d= -f2- || true)"
fi
if [ -n "${OFFSITE_DEST:-}" ]; then
  echo "[backup] copying to $OFFSITE_DEST"
  rsync -a "$BACKUP_DIR/db-$STAMP.dump" "$BACKUP_DIR/media-$STAMP.tgz" "$OFFSITE_DEST"     || echo "[backup] WARNING: off-site copy to $OFFSITE_DEST failed"
fi

find "$BACKUP_DIR" -maxdepth 1 -type f \( -name 'db-*.dump' -o -name 'media-*.tgz' \) -mtime +"$KEEP_DAYS" -delete
echo "[backup] done: $BACKUP_DIR"
