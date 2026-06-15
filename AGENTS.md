<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Portfolio — Agent-Leitfaden

Persönliches Bewerbungs-Portfolio von Christof Treitges: eine Single-Page-Site
(Next.js 16 / React 19 / TypeScript) hinter einem selbst gebauten Code-Gate,
selbst gehostet auf einem ARM-Server. Diese Datei orientiert KI-Coding-Agenten;
die ausführliche Engineering-Doku steht im [README](./README.md).

> Der Block oben wird automatisch gepflegt (`BEGIN/END:nextjs-agent-rules`) —
> nicht von Hand ändern. Projektspezifisches gehört hierunter.

## Next 16 — projektspezifische Fallstricke

Zusätzlich zur Auto-Regel oben (immer `node_modules/next/dist/docs/` prüfen):

- **`proxy.ts` statt `middleware.ts`** — das Auth-Gate läuft im Node-Runtime.
- **`params` ist ein `Promise`** und muss `await`ed werden; unbekannte Slugs
  lösen `notFound()` aus.
- **Error-Boundaries:** die Retry-Prop heißt `unstable_retry`, nicht `reset`.

## Befehle

```bash
npm install
npm run dev         # http://localhost:3000
npm run lint        # eslint (next/core-web-vitals + next/typescript)
npm run typecheck   # tsc --noEmit
npm test            # vitest run (Unit-Tests, Auth-Logik)
npm run test:e2e    # playwright (gegen den Dev-Server)
npm run build       # next build (standalone)
```

Das CI-Gate (`.github/workflows/ci.yml`) verlangt `lint → typecheck → test →
build` grün. **Vor jedem Commit mindestens `lint` + `typecheck` + `test`
laufen lassen.**

## Architektur in Kürze

- **Server-First:** `app/page.tsx` komponiert Server-Components; interaktive
  Teile sind isolierte `"use client"`-Inseln.
- **Auth-Gate:** `proxy.ts` schützt die **gesamte** Site; offen sind nur
  `/unlock`, `/impressum`, `/datenschutz` + statische Assets (der `matcher` ist
  segment-verankert, damit keine Präfix-Route durchrutscht).
- **`lib/auth/*`:** reine, einzeln testbare Module (`session`/`codes`/
  `rate-limit`/`access-log`). Jede Logik-Änderung hier braucht einen Unit-Test.
- **Getypter Content:** aller Inhalt liegt in `content/*.ts` (Interfaces in
  `content/types.ts`), getrennt vom UI. Texte/Projektdaten **hier** ändern,
  nicht im JSX.

## Konventionen & Leitplanken

- **TypeScript `strict`** — keine `any`-Flucht; lieber Typen modellieren.
- **Kein `next/image`** (bewusst — der Optimizer-Pfad läge vor dem Auth-Gate).
  Stattdessen vorab optimierte WebP mit festen `width`/`height`.
- **Tests sind Pflicht** bei Logik-Änderungen (Repo-Standard + CI-Gate).
- **Keine Secrets/PII/Server-IP im Repo.** Zugangscodes und `SESSION_SECRET`
  nur in `.env.local` (gitignored) bzw. in der Server-`EnvironmentFile`. Die
  ladungsfähige Impressum-Anschrift kommt zur Build-Zeit aus
  `LEGAL_ADDRESS_LINES` (Server-Env) — im Repo steht nur ein Platzhalter. Den
  Server-Host als `{$SITE_HOST}` / `<SERVER_IP>` halten.
- **Reduced Motion** ist erstklassig behandelt (`useReducedMotionMounted` via
  `useSyncExternalStore`, CSS-Ersatzzustände) — bei Animationen mitdenken,
  nicht nur abschalten.

## Deploy

Der komplette Self-Hosting-Pfad liegt versioniert unter `deploy/` + `scripts/`.
`scripts/deploy.sh` (vom PC) bzw. `scripts/deploy-vps.sh` (direkt auf dem
Server) bauen den **committeten** Stand, rollen nach `/opt/portfolio/app` aus
und starten den systemd-Service neu. Einrichtung: `deploy/ORACLE-SETUP.md`.
