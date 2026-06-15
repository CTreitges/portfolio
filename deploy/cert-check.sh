#!/usr/bin/env bash
# Täglicher Zertifikats-Check (Pflicht bei 6-Tage-IP-Zertifikaten).
# Restlaufzeit < WARN_DAYS → Eintrag in syslog + Flag-Datei.
# TODO (Phase 5): Telegram-Alarm anbinden, sobald Token-Quelle geklärt.
set -u

HOST="${SITE_HOST:-your.server.ip}"
PORT=443
WARN_DAYS=3
FLAG="/opt/portfolio/logs/cert-warning.flag"

end_date=$(echo | timeout 10 openssl s_client -connect "127.0.0.1:${PORT}" \
  -servername "${HOST}" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null \
  | cut -d= -f2)

if [ -z "${end_date:-}" ]; then
  logger -t portfolio-cert "FEHLER: Konnte Zertifikat auf :${PORT} nicht lesen"
  echo "cert-read-failed $(date -Is)" > "$FLAG" 2>/dev/null || true
  exit 1
fi

end_epoch=$(date -d "$end_date" +%s)
now_epoch=$(date +%s)
days_left=$(( (end_epoch - now_epoch) / 86400 ))

if [ "$days_left" -lt "$WARN_DAYS" ]; then
  logger -t portfolio-cert "WARNUNG: Zertifikat läuft in ${days_left} Tag(en) ab (${end_date})"
  echo "expires-in ${days_left}d (${end_date}) $(date -Is)" > "$FLAG" 2>/dev/null || true
  exit 2
fi

logger -t portfolio-cert "OK: Zertifikat gültig für ${days_left} Tage (${end_date})"
rm -f "$FLAG" 2>/dev/null || true
exit 0
