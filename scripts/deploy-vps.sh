#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Deploy DIREKT AUF DEM VPS (Variante von scripts/deploy.sh ohne SSH-Hülle):
# baut den AKTUELLEN Stand von ~/portfolio und rollt nach /opt/portfolio/app.
#   bash scripts/deploy-vps.sh              # Build + Rollout + Restart + Health
#   SKIP_BUILD=1 bash scripts/deploy-vps.sh # nur Restart + Health
# Voraussetzung: sudoers-Drop-in aus deploy/vps-setup.sh (restart portfolio).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="/opt/portfolio/app"

step() { echo; echo "━━ $* ━━"; }
fail() { echo "DEPLOY ABGEBROCHEN: $*" >&2; exit 1; }

cd "$(dirname "$0")/.."

# Service-Env (root:portfolio, 0640, nur auf dem Server). Den basePath früh
# lesen: die Health-Checks unten müssen den Unterpfad kennen, weil die App
# unter NEXT_PUBLIC_BASE_PATH läuft (z. B. /portfolio) — "/unlock" gäbe 404.
ENV_FILE="${PORTFOLIO_ENV:-/etc/portfolio/portfolio.env}"
# basePath für die Health-Checks: explizit übergebene Env hat Vorrang, sonst
# aus der Service-Env (nur lesbar mit aktiver Gruppe 'portfolio').
BASE="${NEXT_PUBLIC_BASE_PATH:-}"
if [ -z "$BASE" ] && [ -r "$ENV_FILE" ]; then
  BASE=$(grep -E '^NEXT_PUBLIC_BASE_PATH=' "$ENV_FILE" | head -1 | cut -d= -f2- || true)
fi

step "1/5 Pre-Check (RAM, Ollama)"
avail=$(free -m | awk '/^Mem:/{print $7}')
echo "RAM verfügbar: ${avail} MB"
[ "$avail" -lt 4096 ] && echo "WARNUNG: <4 GB frei — Build könnte eng werden."
loaded=$(curl -s --max-time 3 localhost:11434/api/ps 2>/dev/null | grep -c '"name"' || true)
[ "${loaded:-0}" -gt 0 ] && echo "WARNUNG: Ollama hat ${loaded} Modell(e) geladen."

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  step "2/5 Build (next build, standalone)"
  export NODE_OPTIONS=--max-old-space-size=4096
  # Build-Zeit-Env aus der Service-Env laden (Public-URL + basePath +
  # Impressum-Anschrift), damit static-prerenderte Seiten und die Client-Bundles
  # echte Werte bekommen statt Platzhalter/Fallback.
  # NICHT sourcen: die Datei ist systemd-EnvironmentFile-Syntax, kein Shell-
  # Skript. Werte enthalten '$' (argon2-Hashes in ACCESS_CODES) und Leerzeichen
  # (Anschrift) — bash würde sie expandieren bzw. als Kommando interpretieren
  # und unter `set -e` den Deploy abbrechen. Darum nur die Build-Keys literal
  # einlesen und exportieren.
  if [ -r "$ENV_FILE" ]; then
    echo "Build-Env aus $ENV_FILE (NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_BASE_PATH, LEGAL_ADDRESS_LINES)"
    while IFS='=' read -r key val || [ -n "$key" ]; do
      case "$key" in
        NEXT_PUBLIC_SITE_URL | NEXT_PUBLIC_BASE_PATH | LEGAL_ADDRESS_LINES)
          # explizit übergebene Env nicht überschreiben (env > file)
          [ -z "${!key:-}" ] && export "$key=$val" ;;
      esac
    done < "$ENV_FILE"
  else
    echo "WARNUNG: $ENV_FILE nicht lesbar — URL/basePath/Impressum nutzen Platzhalter/Fallback."
  fi
  npm run build 2>&1 | tail -8
  # Standalone-Falle: static + public manuell in den standalone-Baum kopieren.
  cp -r public .next/standalone/
  mkdir -p .next/standalone/.next
  cp -r .next/static .next/standalone/.next/
  test -f .next/standalone/server.js || fail "standalone/server.js fehlt"

  step "3/5 Nach $APP_DIR ausrollen"
  rsync -a --delete .next/standalone/ "$APP_DIR"/
  mkdir -p "$APP_DIR/.next/cache"
  chgrp -R portfolio "$APP_DIR" 2>/dev/null || true
  chmod -R g+rX "$APP_DIR"
  chmod -R g+rwX "$APP_DIR/.next/cache"
fi

step "4/5 Service-Restart"
sudo /usr/bin/systemctl restart portfolio
sleep 2
systemctl --no-pager is-active portfolio || fail "portfolio.service startet nicht — journalctl -u portfolio"

step "5/5 Health-Gate"
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:3100${BASE}/unlock")
echo "lokal ${BASE}/unlock → HTTP $code"
[ "$code" = "200" ] || fail "Health-Check lokal fehlgeschlagen"
code=$(curl -ks -o /dev/null -w "%{http_code}" --max-time 8 "https://${SITE_HOST:-your.server.ip}${BASE}/unlock")
echo "extern ${BASE}/unlock → HTTP $code"

echo
echo "DEPLOY OK ✓"
