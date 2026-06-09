#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Portfolio VPS-Setup — EINMALIG als root ausführen:
#   sudo bash /home/chris/portfolio/deploy/vps-setup.sh
#
# Idempotent: kann gefahrlos erneut laufen.
# Macht: portfolio-User, /opt+/etc-Verzeichnisse, env-Grundgerüst,
#        Caddy (ARM64) + systemd-Units, iptables 80/443, sudoers-Drop-in.
# Macht NICHT: OCI-Security-List (Cloud-Konsole, siehe ORACLE-SETUP.md),
#              ACCESS_CODES setzen (macht chris danach ohne root).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="/home/chris/portfolio"
err() { echo "FEHLER: $*" >&2; exit 1; }
[ "$(id -u)" -eq 0 ] || err "Bitte mit sudo ausführen."
[ -d "$REPO/deploy" ] || err "Repo nicht unter $REPO — erst Code syncen."

echo "── [1/8] System-User"
id -u portfolio >/dev/null 2>&1 || useradd --system --shell /usr/sbin/nologin --home /opt/portfolio portfolio
id -u caddy >/dev/null 2>&1 || useradd --system --create-home --home /var/lib/caddy --shell /usr/sbin/nologin caddy
# chris darf env editieren + Logs lesen (Gruppe portfolio):
usermod -aG portfolio chris

echo "── [2/8] Verzeichnisse"
mkdir -p /opt/portfolio/app /opt/portfolio/logs /etc/portfolio
chown chris:portfolio /opt/portfolio/app
chown portfolio:portfolio /opt/portfolio/logs
chmod 2770 /opt/portfolio/logs   # Service schreibt, Gruppe (chris) liest
chown root:portfolio /etc/portfolio
chmod 750 /etc/portfolio

echo "── [3/8] Umgebungs-Datei"
if [ ! -f /etc/portfolio/portfolio.env ]; then
  SECRET=$(openssl rand -base64 48 | tr -d '\n=' | head -c 64)
  cat > /etc/portfolio/portfolio.env <<EOF
# systemd-EnvironmentFile — '\$' wird hier NICHT expandiert (Argon2-Hashes literal ok).
SESSION_SECRET=${SECRET}
# Format: name1:hash1;name2:hash2 — Hashes erzeugen mit:
#   cd ${REPO} && node scripts/hash-code.mjs --gen itfabrik
ACCESS_CODES=
ACCESS_LOG_PATH=/opt/portfolio/logs/access.jsonl
CHAT_ENABLED=false
EOF
  echo "   portfolio.env NEU erzeugt (SESSION_SECRET generiert, ACCESS_CODES leer = noch kein Zugang)"
else
  echo "   portfolio.env existiert — unverändert gelassen"
fi
chown root:portfolio /etc/portfolio/portfolio.env
chmod 660 /etc/portfolio/portfolio.env

echo "── [4/8] Caddy (ARM64)"
if [ ! -x /usr/local/bin/caddy ]; then
  CADDY_VER=$(curl -fsSL https://api.github.com/repos/caddyserver/caddy/releases/latest \
    | grep -oP '"tag_name":\s*"v\K[0-9.]+' | head -1)
  [ -n "$CADDY_VER" ] || err "Konnte Caddy-Version nicht ermitteln."
  echo "   Lade Caddy v${CADDY_VER} (linux_arm64)…"
  curl -fsSL -o /tmp/caddy.tar.gz \
    "https://github.com/caddyserver/caddy/releases/download/v${CADDY_VER}/caddy_${CADDY_VER}_linux_arm64.tar.gz"
  tar -xzf /tmp/caddy.tar.gz -C /tmp caddy
  install -m 755 /tmp/caddy /usr/local/bin/caddy
  rm -f /tmp/caddy.tar.gz /tmp/caddy
fi
/usr/local/bin/caddy version | head -1
mkdir -p /etc/caddy
# TLS-Spike: zuerst STAGING-Caddyfile (Schritt A). Prod-Umstellung macht der
# Verify-Schritt danach bewusst separat.
if [ ! -f /etc/caddy/Caddyfile ]; then
  install -m 644 "$REPO/deploy/Caddyfile.staging" /etc/caddy/Caddyfile
  echo "   /etc/caddy/Caddyfile = STAGING-Spike installiert"
fi

echo "── [5/8] systemd-Units"
NODE_BIN=$(command -v node) || err "node nicht im PATH von root — Pfad prüfen."
sed "s|__NODE_BIN__|${NODE_BIN}|" "$REPO/deploy/portfolio.service" > /etc/systemd/system/portfolio.service
install -m 644 "$REPO/deploy/caddy.service"        /etc/systemd/system/caddy.service
install -m 755 "$REPO/deploy/cert-check.sh"        /usr/local/bin/portfolio-cert-check.sh
install -m 644 "$REPO/deploy/cert-check.service"   /etc/systemd/system/portfolio-cert-check.service
# Timer referenziert den Service-Namen mit portfolio-Präfix:
sed "s|^Description=.*|Description=Täglicher Portfolio-TLS-Zertifikats-Check|" \
  "$REPO/deploy/cert-check.timer" > /etc/systemd/system/portfolio-cert-check.timer
sed -i "s|cert-check.service|portfolio-cert-check.service|" /etc/systemd/system/portfolio-cert-check.timer 2>/dev/null || true
systemctl daemon-reload

echo "── [6/8] iptables (Oracle-Image: Regeln VOR die REJECT-Rule)"
open_port() {
  local proto="$1" port="$2"
  if ! iptables -C INPUT -p "$proto" --dport "$port" -j ACCEPT 2>/dev/null; then
    local line
    line=$(iptables -L INPUT --line-numbers -n | awk '/REJECT/{print $1; exit}')
    iptables -I INPUT "${line:-1}" -p "$proto" --dport "$port" -j ACCEPT
    echo "   geöffnet: ${proto}/${port}"
  else
    echo "   bereits offen: ${proto}/${port}"
  fi
}
open_port tcp 80
open_port tcp 443
open_port udp 443   # HTTP/3
if command -v netfilter-persistent >/dev/null 2>&1; then
  netfilter-persistent save >/dev/null && echo "   gespeichert (netfilter-persistent)"
else
  iptables-save > /etc/iptables/rules.v4 && echo "   gespeichert (rules.v4)"
fi

echo "── [7/8] sudoers-Drop-in (Deploy ohne Passwort, eng begrenzt)"
cat > /etc/sudoers.d/portfolio-deploy <<'EOF'
chris ALL=(root) NOPASSWD: /usr/bin/systemctl restart portfolio, /usr/bin/systemctl start portfolio, /usr/bin/systemctl stop portfolio, /usr/bin/systemctl reload caddy, /usr/bin/systemctl restart caddy, /usr/bin/systemctl start caddy, /usr/bin/systemctl stop caddy, /usr/local/bin/caddy validate --config /etc/caddy/Caddyfile, /usr/bin/install -m 644 /home/chris/portfolio/deploy/Caddyfile.prod /etc/caddy/Caddyfile, /usr/bin/install -m 644 /home/chris/portfolio/deploy/Caddyfile.staging /etc/caddy/Caddyfile, /usr/bin/install -m 644 /home/chris/portfolio/deploy/Caddyfile.acmesh-fallback /etc/caddy/Caddyfile
EOF
chmod 440 /etc/sudoers.d/portfolio-deploy
visudo -c -f /etc/sudoers.d/portfolio-deploy >/dev/null || err "sudoers-Drop-in ungültig!"
echo "   ok"

echo "── [8/8] Services aktivieren"
systemctl enable --now caddy
systemctl enable portfolio   # Start erst nach erstem Deploy ins /opt/portfolio/app
systemctl enable --now portfolio-cert-check.timer
sleep 2
systemctl --no-pager --quiet is-active caddy && echo "   caddy: aktiv" || echo "   caddy: NICHT aktiv → journalctl -u caddy"

echo
echo "════════════════════════════════════════════════════════════════"
echo "FERTIG. Nächste Schritte (ohne root, macht Claude):"
echo "  1. App nach /opt/portfolio/app deployen + portfolio starten"
echo "  2. ACCESS_CODES in /etc/portfolio/portfolio.env setzen"
echo "  3. TLS-Spike verifizieren → ggf. auf Caddyfile.prod wechseln"
echo "WICHTIG: OCI-Security-List 80/443 öffnen (siehe ORACLE-SETUP.md),"
echo "         falls extern weiterhin nicht erreichbar."
echo "════════════════════════════════════════════════════════════════"
