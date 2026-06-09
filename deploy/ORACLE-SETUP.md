# Oracle-Cloud-Netzwerk — die Doppeltür

Auf Oracle-Cloud-Instanzen müssen **BEIDE** Türen offen sein, sonst bleibt die
Site von außen unerreichbar:

## Tür 1 — OCI Security List (Cloud-Konsole)

1. <https://cloud.oracle.com> → Compute → Instances → Instanz (`<SERVER_INSTANCE>`)
2. Unter **Primary VNIC** → Subnet anklicken → **Security Lists** → Default Security List
3. **Add Ingress Rules** (2 Regeln):

   | Source CIDR | Protokoll | Dest. Port |
   |---|---|---|
   | `0.0.0.0/0` | TCP | `80` |
   | `0.0.0.0/0` | TCP | `443` |

   Optional für HTTP/3: UDP `443` (gleiche Source).

   *(SSH/22 existiert bereits — nicht anfassen.)*

## Tür 2 — iptables auf der Instanz

Die Ubuntu-Images von Oracle enden in `/etc/iptables/rules.v4` mit einer
REJECT-Regel. Neue Regeln müssen mit `-I` **davor** — `ufw allow` allein reicht
NICHT. → erledigt `deploy/vps-setup.sh` automatisch (idempotent, speichert via
`netfilter-persistent save`).

## Verifikation (von außen, nicht vom VPS selbst!)

```bash
curl -ksI https://<SERVER_IP>/unlock   # erwartet: HTTP/2 200 + x-robots-tag
curl -sI  http://<SERVER_IP>/          # erwartet: 308 → https://
```

Wenn Tür 2 offen ist (iptables zeigt ACCEPT 80/443) und es trotzdem Timeouts
gibt → es ist IMMER Tür 1 (Security List).

## TLS-Besonderheit: IP-Zertifikate

- Let's Encrypt stellt seit 2026-01 IP-Zertifikate aus — nur als **6-Tage-Zertifikate**
  (Profil `shortlived`), Validierung via HTTP-01/TLS-ALPN-01.
- Renewal macht Caddy automatisch (oder acme.sh im Fallback) — der tägliche
  `portfolio-cert-check.timer` warnt bei < 3 Tagen Restlaufzeit (syslog +
  `/opt/portfolio/logs/cert-warning.flag`).
- Erst-Ausstellung IMMER gegen Staging testen (`Caddyfile.staging`), dann auf
  `Caddyfile.prod` wechseln — Let's-Encrypt-Rate-Limits sind schnell verbrannt.
- Jedes Zertifikat landet in öffentlichen CT-Logs → die IP ist über crt.sh
  auffindbar. Bewusst akzeptiert: Der Schutz ist das Auth-Gate, nicht Verborgenheit.
