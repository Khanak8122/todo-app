# Incident Runbook — Todo App Down Alert

## Alert: "todo-app is down"
Triggers when the /metrics endpoint is unreachable for 30+ seconds.

## Steps to diagnose
1. SSH into the server: `ssh -i todo-app.pem ubuntu@`
2. Check container status: `docker compose ps`
3. Check app logs: `docker compose logs app --tail=50`
4. Check if database is reachable: `docker compose logs db --tail=20`

## Common causes
- App container crashed → `docker compose up -d` to restart
- Database connection refused → check db container is healthy
- Out of disk space → `df -h` to check, `docker system prune` to clean up

## Resolution
Once the app responds at /metrics again, the alert auto-resolves within 30s.