# VPS deployment

Production: https://mater.kataakhtarnamatimnyaapayah.my.id

Debian 13 VPS, Caddy from Debian packages, Deno 2.9.6 runtime (not Deno Deploy).
Caddy serves public/ directly with compression and revalidation, and proxies /api/* including WebSockets to 127.0.0.1:8000.

- Code: /opt/mater/releases/20261117, symlink /opt/mater/current
- Unprivileged system service: mater.service (auto-start and auto-restart)
- Database: /var/lib/mater/shared-v2.sqlite, outside release directory
- Deno dependency cache: /var/cache/mater (dependencies cached before startup)
- Daily SQLite online backups: /var/backups/mater via mater-backup.timer
- Automatic HTTPS certificate renewal: Caddy
- Existing local SQLite database migrated using Python SQLite backup API.
- Credentials and private keys are not part of this repository.

## Operations

Use sudo systemctl status mater caddy and sudo journalctl -u mater to inspect.
For an update, create a new release directory, copy public/, server.ts, session-server.ts, deno.json and deno.lock, cache dependencies as the mater user, switch current, then restart mater. Keep ALIN_KV_PATH pointing at the existing database. Roll back by switching current to the previous release and restarting. Never overwrite the live database with a fresh development database.

## Validation on 17 November 2026

12 automated tests passed against a separate temporary service/database on the VPS through an SSH tunnel. Test service stopped afterward. Production HTTPS verified with a trusted certificate. Host, presenter and guest browser sessions connected without JavaScript errors. Ten application WebSocket ping round trips measured 16–20 ms from the test computer. This is network/application latency, not a guarantee of frame rate or all clients' latency. Restart and health check passed. Google public DNS resolves the hostname to 139.190.107.166. Some recursive DNS caches may retain an earlier negative response briefly.
