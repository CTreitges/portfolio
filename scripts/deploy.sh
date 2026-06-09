#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Deploy: lokales Repo → VPS-Build → /opt/portfolio/app → Service-Restart.
#   bash scripts/deploy.sh            # deployt HEAD
#   SKIP_BUILD=1 bash scripts/deploy.sh   # nur Restart + Health
#
# Läuft unter Git-Bash/WSL. Überträgt den COMMITTETEN Stand (git archive) —
# uncommitted Änderungen werden bewusst nicht deployt.
# Voraussetzungen: SSH-Key für oracle-vps; sudoers-Drop-in aus vps-setup.sh.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

HOST="${DEPLOY_HOST:-oracle-vps}"
REMOTE_REPO="/home/chris/portfolio"
APP_DIR="/opt/portfolio/app"

step() { echo; echo "━━ $* ━━"; }
fail() { echo "DEPLOY ABGEBROCHEN: $*" >&2; exit 1; }

cd "$(dirname "$0")/.."
git diff --quiet HEAD -- . ':!docs' 2>/dev/null \
  || echo "HINWEIS: uncommittete Änderungen werden NICHT deployt (git archive HEAD)."

step "1/6 Pre-Check (RAM, Ollama, Port)"
ssh -o ConnectTimeout=10 "$HOST" '
  avail=$(free -m | awk "/^Mem:/{print \$7}")
  echo "RAM verfügbar: ${avail} MB"
  [ "$avail" -lt 4096 ] && echo "WARNUNG: <4 GB frei — Ollama-Modell geladen? Build könnte eng werden."
  loaded=$(curl -s --max-time 3 localhost:11434/api/ps 2>/dev/null | grep -c "\"name\"" || true)
  [ "${loaded:-0}" -gt 0 ] && echo "WARNUNG: Ollama hat ${loaded} Modell(e) geladen."
  exit 0
' || fail "VPS nicht erreichbar"

step "2/6 Code übertragen (git archive HEAD)"
ssh "$HOST" "mkdir -p $REMOTE_REPO"
git archive HEAD | ssh "$HOST" "tar -x -C $REMOTE_REPO --overwrite" \
  || fail "Code-Transfer fehlgeschlagen"

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  step "3/6 Build auf dem VPS (npm ci + next build)"
  ssh "$HOST" "
    set -e
    cd $REMOTE_REPO
    export NODE_OPTIONS=--max-old-space-size=4096
    npm ci --no-audit --no-fund 2>&1 | tail -2
    npm run build 2>&1 | tail -8
    # Standalone-Falle: static + public manuell in den standalone-Baum kopieren.
    cp -r public .next/standalone/ 2>/dev/null || true
    mkdir -p .next/standalone/.next
    cp -r .next/static .next/standalone/.next/
    test -f .next/standalone/server.js
  " || fail "Build fehlgeschlagen"

  step "4/6 Nach $APP_DIR ausrollen"
  ssh "$HOST" "
    set -e
    rsync -a --delete $REMOTE_REPO/.next/standalone/ $APP_DIR/
    mkdir -p $APP_DIR/.next/cache
    # Service-User (Gruppe portfolio) braucht Lese- bzw. Cache-Schreibrechte:
    chgrp -R portfolio $APP_DIR 2>/dev/null || true
    chmod -R g+rX $APP_DIR
    chmod -R g+rwX $APP_DIR/.next/cache
  " || fail "Ausrollen fehlgeschlagen"
fi

step "5/6 Service-Restart"
ssh "$HOST" "sudo /usr/bin/systemctl restart portfolio && sleep 2 && systemctl --no-pager is-active portfolio" \
  || fail "portfolio.service startet nicht — journalctl -u portfolio"

step "6/6 Health-Gate"
ssh "$HOST" '
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 http://127.0.0.1:3100/unlock)
  echo "lokal /unlock → HTTP $code"
  [ "$code" = "200" ] || exit 1
' || fail "Health-Check lokal fehlgeschlagen"

echo
echo "Extern prüfen (von außen):  curl -ksI https://<SERVER_IP>/unlock"
echo "DEPLOY OK ✓"
