# portfolio

![CI](https://github.com/CTreitges/portfolio/actions/workflows/ci.yml/badge.svg)

Privates Bewerbungs-Portfolio von Christof Treitges — eine Single-Page-Site (Next.js 16 / React 19 / TypeScript), hinter einem selbst gebauten Code-Gate, selbst gehostet auf einem eigenen ARM-Server (kein Hosting-Dienst, keine Tracker, kein Analytics).

Diese README beschreibt die **Engineering-Substanz**: Architektur, Security-Design, Test-Strategie und den Self-Hosting-Deploy. Der inhaltliche Teil (Projekte, Texte) liegt typisiert unter `content/` und ist nicht Gegenstand dieses Dokuments.

> **Live-Site:** Die gesamte Site liegt hinter einem Auth-Gate und ist bewusst nicht öffentlich indexierbar. Der Zugang (Code bzw. Magic-Link) liegt dem Anschreiben bei. Echte Server-Adresse und Zugangscodes stehen nicht in diesem Repo — überall nur Platzhalter (`<SERVER_IP>`, `{$SITE_HOST}`) bzw. Env-Var-Namen.

---

## Stack

| Bereich        | Technologie                                                          |
| -------------- | ------------------------------------------------------------------- |
| Framework      | Next.js `16.2.7` (App Router, `proxy.ts`, `output: "standalone"`)    |
| UI             | React `19.2.4` / React DOM `19.2.4`                                  |
| Styling        | Tailwind CSS v4 (`@tailwindcss/postcss`), Design-Tokens via `@theme` |
| Auth           | `@node-rs/argon2` (Argon2id), `jose` (JWT, HS256)                    |
| Motion / 3D    | `motion`, `gsap` (+ ScrollTrigger), `lenis`, `three` + `@react-three/fiber` |
| Sprache        | TypeScript `^5` (`strict: true`)                                     |
| Unit-Tests     | Vitest `^4.1.8` (Node-Environment)                                   |
| E2E / a11y     | Playwright `^1.60`, `@axe-core/playwright`                           |
| Tooling        | ESLint `^9` (`next/core-web-vitals` + `next/typescript`), `tsc --noEmit`, GitHub Actions |
| Runtime        | Node `>=20`                                                          |
| Reverse-Proxy  | Caddy (TLS, systemd-managed)                                         |

> 3D: Die Hero-Szene (`HeroBackdrop.tsx`) nutzt `three` + `@react-three/fiber` direkt, ohne zusätzlichen Helper-Layer.

---

## Architektur

### App Router, Server-First

Die Site ist eine einzige gescrollte Startseite (`app/page.tsx`), die ihre Sections aus Server-Components zusammensetzt; interaktive Teile (Unlock-Form, Konstellation, Effekte) sind isolierte `"use client"`-Inseln. Dynamische Routen sind statisch vorbereitet:

- `app/projekte/[slug]/page.tsx` — Case-Study-Seiten, `generateStaticParams()` aus `content/projects.ts`
- `app/research/[slug]/page.tsx` — Recherche-Viewer, `generateStaticParams()` aus `content/research.ts`

`params` wird als `Promise` awaited (Next-16-Konvention); unbekannte Slugs lösen `notFound()` aus.

### `proxy.ts` statt `middleware.ts`

Das Auth-Gate für die **gesamte** Site läuft in `proxy.ts` (Next 16: `proxy.ts` ersetzt `middleware.ts` und läuft im Node-Runtime — relevant, weil die Session-Verifikation `jose` mit dem `SESSION_SECRET` braucht).

Ablauf pro Request:

1. Session-Cookie lesen → bei gültigem JWT `NextResponse.next()`.
2. Sonst: `/api/*` → `401 JSON`; HTML → `303`-Redirect nach `/unlock` mit `?from=<originalpfad>` für den Rücksprung nach dem Login.

Der `matcher` gibt nur das Minimum frei, das **ohne** Login erreichbar sein muss:

```
/unlock, /api/unlock, /impressum, /datenschutz,
/_next/static, favicon.ico, favicon.svg, icon.svg, apple-icon,
og.png, robots.txt
```

Bewusste Entscheidung: `_next/image` bleibt **hinter** dem Gate. Der Image-Optimizer könnte sonst geschützte Screenshots über einen öffentlichen Pfad ausliefern — daher nutzt die Site `next/image` gar nicht (siehe Performance).

### Getypter Content-Layer

Aller Inhalt liegt typisiert in `content/*.ts` mit zentralen Interfaces in `content/types.ts` (`Project`, `ProjectScreenshot`, `KnowledgeNode`, …). Vorteil: Slug-Querverweise (Konstellation → Case-Study) sind Compile-Zeit-geprüft, Screenshots tragen feste `width`/`height`, und die Routen mappen direkt über vorberechnete Lookups (`projectsBySlug`, `researchBySlug`).

### `lib/auth/*` — geschichtet, einzeln testbar

Jede Verantwortung ist ein eigenes, seiteneffektarmes Modul — reine Funktionen, die ohne Next-Runtime testbar sind:

| Modul              | Verantwortung                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `session.ts`       | JWT signieren/verifizieren (HS256, `sub` = Code-Name), Cookie-Konstanten  |
| `codes.ts`         | `ACCESS_CODES` parsen, Code gegen alle benannten Argon2-Hashes prüfen      |
| `rate-limit.ts`    | In-Memory-Rate-Limiter + Client-IP-Bestimmung (rightmost-XFF)             |
| `access-log.ts`    | datenminimiertes JSONL-Zugriffslog (IP-Truncation, fire-and-forget)       |

`proxy.ts` und die API-Routen (`app/api/unlock`, `app/api/logout`) konsumieren ausschließlich diese Module.

---

## Security-Engineering

Das Gate ist das Herzstück und entsprechend bewusst gebaut. Die folgenden Punkte sind alle im Code belegt und durch Tests abgesichert.

### Passwort-Hashing — Argon2id

Codes werden mit **Argon2id** gehasht, Parameter aus `scripts/hash-code.mjs`:

```js
hash(code, { memoryCost: 65536 /* 64 MiB */, timeCost: 3, parallelism: 4 })
```

`verifyCode` (`@node-rs/argon2` `verify`) liest die Kostenparameter aus dem gespeicherten Hash — die Verifikation ist also parameter-agnostisch; die obigen Werte gelten zum Zeitpunkt der Hash-**Erzeugung**.

Mehrere **benannte** Codes werden in einer Variablen gehalten:

```
ACCESS_CODES = name1:$argon2id$...;name2:$argon2id$...
```

Das Splitting ist eindeutig, weil Argon2-Hashes weder `:` noch `;` enthalten. `verifyCode` läuft **bewusst ohne Early-Return** über alle Einträge, damit die Antwortzeit nicht verrät, welcher Eintrag getroffen wurde, und überspringt kaputte Hash-Einträge ohne Crash. Der Name des Treffers wandert als JWT-`sub` ins Zugriffslog („welcher Code wurde benutzt").

### Sessions — JWT (HS256) via `jose`

`session.ts` signiert ein HS256-JWT (7 Tage Laufzeit). `SESSION_SECRET` wird beim Start geprüft (≥ 32 Zeichen, sonst Fehler). Die Verifikation pinnt den Algorithmus explizit:

```ts
jwtVerify(token, getSecret(), { algorithms: ["HS256"] })
```

Damit ist die klassische **`alg: "none"`-Confusion-Attacke** abgewehrt — ein eigener Unit-Test schreibt einen `alg:none`-Header und erwartet `null`.

### Session-Cookie

Gesetzt in `app/api/unlock/route.ts`:

```ts
res.cookies.set(SESSION_COOKIE, await signSession(codeName), {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: SESSION_MAX_AGE_S, // 7 Tage
});
```

`httpOnly` (kein JS-Zugriff), `sameSite: "strict"` (CSRF-Härtung), `secure` in Produktion. Logout (`app/api/logout/route.ts`) überschreibt mit `maxAge: 0` und liegt selbst hinter dem Gate.

### Rate-Limiting & korrekte Client-IP

In-Memory-Limiter: **5 Versuche / 15 Minuten / IP**, danach `429` mit `Retry-After`. Memory-Cap (10.000 Einträge, Eviction des ältesten) gegen IP-Flooding, periodischer Sweep abgelaufener Fenster, `globalThis`-Singleton (übersteht Dev-HMR).

Sicherheitskritisch ist die IP-Bestimmung hinter dem Reverse-Proxy. Caddy **hängt** die echte Peer-IP rechts an einen ggf. mitgeschickten (spoofbaren) `X-Forwarded-For` an. `getClientIp` nimmt deshalb **immer den rechtesten** Eintrag — niemals den linken, angreifer-kontrollierten:

```ts
const parts = xff.split(",").map(p => p.trim()).filter(Boolean);
const last = parts[parts.length - 1]; // rightmost = von Caddy gesetzt
```

Der Next-Prozess lauscht nur auf `127.0.0.1`; extern kommt alles durch Caddy. Das XFF-Spoofing-Verhalten ist in den Unit-Tests explizit fixiert.

### Magic-Link im URL-Fragment

`UnlockForm.tsx` unterstützt `/unlock#code=XYZ`: Der Code steht im **URL-Fragment** und wird daher nie an den Server gesendet — er taucht in keinem Server- oder Proxy-Log auf. Der Client liest ihn, **entfernt den Hash sofort** aus der Adresszeile (`history.replaceState`) und submittet automatisch. So lässt sich ein 24-stelliger base62-Zufallscode (`scripts/hash-code.mjs`, 24 Zufalls-Bytes als Quelle) per Link verschicken, ohne dass ihn jemand tippen oder merken muss.

### Open-Redirect-Schutz

Der `from`-Parameter wird nur akzeptiert, wenn er site-relativ ist:

```ts
const redirect = from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
```

`//evil.com/phish` fällt damit auf `/` zurück (E2E-getestet).

### Datenschutz im Zugriffslog (`access-log.ts`)

JSONL-Log nur, wenn `ACCESS_LOG_PATH` gesetzt ist. Datenminimierung vor dem Schreiben:

- IPv4 → letztes Oktett genullt (`203.0.113.7` → `203.0.113.0`)
- IPv6 → auf /64 gekürzt
- User-Agent auf 200 Zeichen gekappt

Fire-and-forget: Log-Fehler dürfen den Unlock-Flow nie brechen. Festgehalten werden nur `unlock_ok` / `unlock_fail` / `rl_block` mit Zeitstempel und Code-Namen.

### Generische Fehlermeldungen, CSP & Crawler-Sperre

- API-Antworten sind bewusst uniform (`invalid_code`, `too_many_attempts`) — kein Oracle für Angreifer.
- Hardening-Header über `next.config.ts`: CSP (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'self'`), `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, HSTS in Produktion.
- Indexierung mehrschichtig gesperrt (Defense-in-Depth): `metadata.robots` (`index:false, follow:false, noarchive`), `app/robots.ts` (`Disallow: /`), `X-Robots-Tag` über `next.config.ts` **und** in Produktion zusätzlich global über Caddy.
- Metadaten und das öffentliche `og.png` zeigen nur Name + Rolle — verschickte Links wirken hochwertig, ohne Inhalte zu leaken.

---

## Features / Sektionen

Die Startseite (`app/page.tsx`) ist eine durchgehende Scroll-Erzählung: Hero, Über mich, Projekte, KI-Wissen, Setup, Recherchen, Lab, Werdegang (Timeline), Making-of, Kontakt (+ Header/Footer).

- **Projekte** — kuratierte Case-Studies (Flagship laut Content: *Lieferschein-Processor*, dort als produktiv im Echtbetrieb beschrieben). Detailseiten unter `/projekte/[slug]` mit Screenshot-Galerie.
- **KI-Wissen** — interaktive, zoombare Wissens-Konstellation (Cluster wie LLM-Orchestrierung, lokale LLMs, MCP, Memory/RAG, Automatisierung, Security …), jeder Knoten mit Praxis-Beleg.
- **Setup** — eigene Entwickler-Infrastruktur als animiertes Architektur-Diagramm.
- **Recherchen** — eigene Single-File-HTML-Dokumente, Detailansicht unter `/research/[slug]`.
- **Rechtstexte** — `/impressum` und `/datenschutz`, gesetzlich vorgeschrieben und daher bewusst auch ohne Login erreichbar.

Inhalte sind datengetrieben in `content/*.ts` gepflegt — Texte und Projektdaten liegen getrennt vom UI-Code.

---

## Test-Strategie

Zweistufig: schnelle, deterministische Unit-Tests für die Auth-Logik; E2E gegen den echten Dev-Server für die Strecke, die nur im Browser/HTTP-Kontext stimmt.

### Unit (Vitest, Node) — 24 Tests

`tests/unit/`, ausgeführt mit `npm test` (`vitest run`):

| Datei                  | Fokus                                                              | Tests |
| ---------------------- | ----------------------------------------------------------------- | ----- |
| `codes.test.ts`        | `ACCESS_CODES`-Parsing, Argon2-Verify, kaputte Einträge            | 6     |
| `rate-limit.test.ts`   | rightmost-XFF, 5/15min-Fenster, Memory-Cap, Fenster-Reset          | 8     |
| `session.test.ts`      | JWT-Roundtrip, Manipulation, fremdes Secret, Expiry, `alg:none`    | 5     |
| `access-log.test.ts`   | IP-Truncation (IPv4/IPv6), UA-Kürzung, Datenminimierung            | 5     |

Diese Schicht braucht keine Next-Runtime — die Auth-Module sind reine Funktionen.

### E2E (Playwright) — Assertion-Suites vs. Generatoren

Die Specs unter `tests/e2e/` zerfallen in zwei Klassen — sauber unterschieden, weil nicht jeder `test(...)`-Block eine Assertion ist.

**Assertion-tragende Tests (14):**

| Datei              | Inhalt                                                                                                                                                              | Tests |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `auth.spec.ts`     | Security-Strecke: Redirect ohne Session, `?from=`, `401` für API, robots/`X-Robots-Tag`, falscher Code, `429`+Retry-After, HttpOnly/SameSite-Cookie, Magic-Link, Open-Redirect-Schutz, Rechtstexte öffentlich + Gegenprobe | 11 |
| `a11y.spec.ts`     | axe-Scan (`wcag2a/aa`, `wcag21a/aa`) auf `/unlock`, `/`, `/impressum`, `/datenschutz` — `serious`/`critical` = Fehler                                              | 2 |
| `anchors.spec.ts`  | Regression: Anker-Links scrollen bei **aktivem** Lenis                                                                                                             | 1 |

`auth.spec.ts` ist das stärkste Einzel-Artefakt — eine vollständige Sicherheits-Strecke gegen den laufenden Server.

**Generator-/Sweep-Specs (keine Assertions, 6 `test()`-Blöcke):** `visual.spec.ts` (Full-Page-Screenshots, 4 Blöcke), `thumbs.spec.ts` (Research-Thumbnails, explizit „kein echter Test"), `review.spec.ts` (Viewport-/Console-Sweep mit Annotations). Sie nutzen die Playwright-Mechanik, prüfen aber nichts — und sind hier bewusst als das ausgewiesen, was sie sind.

### Test-Disziplin

- **axe-Integration** scheitert hart bei `serious`/`critical`-Verstößen.
- **Reduced-Motion beidseitig:** `visual`/`review` setzen `emulateMedia({ reducedMotion: "reduce" })` (Lenis aus, Reveals sofort sichtbar → vollständige Full-Page-Shots), während `anchors.spec.ts` **bewusst ohne** reduced-motion läuft, um Lenis wie beim echten Nutzer zu prüfen.
- **Rate-Limiter-Bewusstsein:** Jede Spec-Datei nutzt eine eigene `X-Forwarded-For`-IP (`test.use`), weil das Unlock-Limit auch erfolgreiche Logins zählt — sonst blockt der Suite-Lauf sich selbst. `playwright.config.ts` läuft daher `fullyParallel: false`.

### CI

`.github/workflows/ci.yml` (ein `quality`-Job, Push/PR auf `main`, Node 20): `lint` → `typecheck` → `npm test` → `build`. Der Build bekommt **Dummy**-`SESSION_SECRET`/`NEXT_PUBLIC_SITE_URL` — keine echten Secrets im CI. E2E ist nicht Teil des CI-Gates, da es den laufenden Dev-Server braucht.

```bash
npm run lint        # eslint (next/core-web-vitals + next/typescript)
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run test:e2e    # playwright test (lokal, gegen Dev-Server)
npm run build       # next build (standalone)
```

---

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local                    # SESSION_SECRET + ACCESS_CODES setzen
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"  # SESSION_SECRET
node scripts/hash-code.mjs --gen itfabrik     # Zugangscode + Argon2-Hash erzeugen
npm run dev                                    # http://localhost:3000
```

Ohne gültige Session leitet die Seite auf `/unlock` weiter — dort den unter `ACCESS_CODES` hinterlegten Code eingeben (oder Magic-Link `/unlock#code=…`).

> Hinweis zu `.env.local`: Argon2-Hashes enthalten `$`. In Next-eigenen `.env`-Dateien müssen diese als `\$` escaped werden, sonst zerstört `dotenv-expand` die Hashes. Die systemd-`EnvironmentFile` in Produktion expandiert `$` **nicht** — dort bleiben Hashes literal. Details in `.env.example`.

### Env-Variablen

| Variable               | Zweck                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `SESSION_SECRET`       | HS256-Signatur, ≥ 32 Zeichen (Pflicht)                        |
| `ACCESS_CODES`         | `name:$argon2id$...;…` (in `.env.local` jedes `$` als `\$`)    |
| `NEXT_PUBLIC_SITE_URL` | Basis-URL für `metadataBase`/OG (Fallback `https://example.com`) |
| `ACCESS_LOG_PATH`      | Pfad zum JSONL-Log; leer = Logging aus                        |

---

## Build & Deploy (Self-Hosting)

Kein Hosting-Dienst — die Site läuft auf einem eigenen ARM-Server (Oracle Cloud). Der komplette Self-Hosting-Pfad liegt versioniert unter `deploy/` und `scripts/`.

### Standalone-Build

`next.config.ts` setzt `output: "standalone"` (minimaler `server.js`-Bundle) und `outputFileTracingRoot: __dirname` (sonst inferiert Next ein Lockfile im Home als Workspace-Root und verschachtelt den `standalone/`-Baum falsch). Die Deploy-Skripte kopieren `public/` und `.next/static` manuell in den standalone-Baum (bekannte standalone-Falle) und prüfen die Existenz von `server.js`, bevor sie ausrollen.

### Prozess-Topologie

```
Internet ──443──> Caddy (TLS, X-Robots-Tag, zstd/gzip) ──> 127.0.0.1:3100 ──> Next standalone (systemd)
```

- **`deploy/portfolio.service`** — Next-Standalone als systemd-Service unter eigenem `portfolio`-User, lauscht nur auf `127.0.0.1:3100`. Gehärtet: `NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome=yes`, `PrivateTmp`, `RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX`, `MemoryMax=2G`, explizite `ReadWritePaths` (nur Logs + `.next/cache`).
- **`deploy/caddy.service`** — Caddy als Reverse-Proxy mit `CAP_NET_BIND_SERVICE` (Port 443 ohne root).

### TLS auf eine IP — Let's-Encrypt-Kurzläufer

Die Site läuft auf einer **IP ohne Domain**, daher Let's-Encrypt-IP-Zertifikate (6-Tage-`shortlived`-Profil). Die Caddyfiles decken den Rollout gestaffelt ab:

| Datei                        | Zweck                                                                        |
| ---------------------------- | --------------------------------------------------------------------------- |
| `Caddyfile.staging`          | Test gegen LE-**Staging** (nie zuerst Prod testen → Rate-Limits)             |
| `Caddyfile.prod`             | Produktion, `issuer acme { profile shortlived }`                            |
| `Caddyfile.acmesh-fallback`  | Fallback via `acme.sh`, falls Caddy IP-Subjects nicht selbst ausstellen kann |

Detail: IP-Clients senden **kein SNI** — `default_sni {$SITE_HOST}` behandelt SNI-lose Handshakes als die IP-Site, sonst schlägt der TLS-Handshake fehl.

Wegen der kurzen Laufzeit gibt es einen **Zertifikats-Watchdog**: `cert-check.timer` (täglich, mit Jitter) → `cert-check.sh` liest die Restlaufzeit per `openssl s_client` und warnt bei `< 3 Tagen` via syslog + Flag-Datei.

### Skripte

| Skript                  | Funktion                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| `deploy/vps-setup.sh`   | Einmaliges, idempotentes VPS-Setup (User, Verzeichnisse, env-Grundgerüst, Caddy-ARM64, systemd-Units, Firewall, sudoers-Drop-in) |
| `scripts/deploy.sh`     | Deploy vom lokalen Rechner: Pre-Check (RAM/Ollama/Port) → `git archive HEAD` → VPS-Build → Rollout → Restart → Health-Gate (`/unlock`). Deployt nur den **committeten** Stand. |
| `scripts/deploy-vps.sh` | Variante direkt auf dem VPS (ohne SSH-Hülle), ebenfalls mit Pre-Check         |
| `scripts/hash-code.mjs` | Zugangscode generieren/hashen → fertiger `ACCESS_CODES`-Eintrag + Magic-Link    |

Eine ausführliche Einrichtungs-Anleitung liegt unter `deploy/ORACLE-SETUP.md`.

### Secrets-Handling

Produktion: `EnvironmentFile=/etc/portfolio/portfolio.env` (`root:portfolio`, `0640`). systemd-`EnvironmentFile` expandiert `$` **nicht** → Argon2-Hashes sind dort literal sicher. Produktions-Secrets liegen ausschließlich auf dem Server, nicht im Repo.

---

## Performance & Accessibility

- **Kein `next/image`** (bewusst — der Optimizer-Pfad läge vor dem Auth-Gate, siehe Architektur; im Code per `eslint-disable` begründet). Stattdessen vorab optimierte **WebP** unter `public/projects/` (Galerie max 1600 px, Thumbs 800×500 / 16:10 via `scripts/optimize-screenshots.mjs`) mit **festen `width`/`height`** → CLS-minimierend ohne Optimizer.
- **Fonts** über `next/font` (`Space Grotesk`, `Inter`, `JetBrains Mono`) mit `display: "swap"`, self-hosted, ohne externe Requests.
- **Reduced Motion ist erstklassig behandelt**, nicht nur abgeschaltet:
  - `app/globals.css` definiert unter `@media (prefers-reduced-motion: reduce)` **statische Ersatzzustände** (`scroll-behavior: auto`, `.reveal-init` sofort sichtbar) statt Inhalte versehentlich auf `opacity: 0` hängen zu lassen.
  - `lib/animation/useReducedMotionMounted.ts` liest die Präferenz **hydration-sicher** (via `useSyncExternalStore`, Server-Snapshot `false` → kein Hydration-Mismatch).
- **a11y by default:** `aria-invalid`/`aria-describedby` am Code-Input, `role="status"` für Fehlermeldungen; durch axe abgesichert (`serious`/`critical` = harter Fehler).
- **Caddy** liefert `zstd`/`gzip`.

---

## Bewusste Tradeoffs

Dokumentiert, nicht versehentlich:

- **In-Memory-Rate-Limiter** — Reset bei Service-Restart wird akzeptiert. Tragfähig, weil hinter Caddy genau **ein** Node-Prozess läuft; ein verteilter Store wäre für eine private Single-Node-Site Overengineering.
- **Single-Process-Annahme** — `getClientIp`'s rightmost-XFF-Strategie und der Memory-Limiter setzen die Topologie `Caddy → genau ein Next auf 127.0.0.1` voraus.
- **Kein `next/image`** — Trade-off zugunsten der Gate-Dichte (keine öffentlichen Bild-URLs); kompensiert durch vorab optimierte, fix dimensionierte WebP.
- **6-Tage-TLS-Zertifikate** — mehr Renewals, dafür IP-TLS ohne Domain; abgefangen durch automatisches Caddy-Renewal + täglichen Watchdog.

---

## Verzeichnisstruktur

```
app/                  App-Router: Seiten, dynamische Routen, API-Routen, robots, layout
  api/{unlock,logout} Auth-Endpunkte
  {projekte,research}/[slug]  statisch generierte Detailseiten
components/           UI: auth/, sections/, effects/, layout/, ui/
content/              getypter Content-Layer (types.ts + Daten)
lib/auth/             session · codes · rate-limit · access-log
lib/animation/        SmoothScroll (Lenis), gsap, reduced-motion-Hook
proxy.ts              Auth-Gate für die gesamte Site (ersetzt middleware.ts)
deploy/               systemd-Units, Caddyfiles, TLS-Watchdog, VPS-Setup, ORACLE-SETUP.md
scripts/              Deploy, Code-Hashing, OG-/Screenshot-Generatoren
tests/unit/           Vitest (Auth-Logik)
tests/e2e/            Playwright (Security-Strecke, a11y, Anchors) + Generatoren
```

---

## Lizenz

Proprietär (`UNLICENSED`) — siehe [`LICENSE`](./LICENSE). Veröffentlicht ausschließlich zur Begutachtung im Rahmen einer Bewerbung; keine Nutzungs- oder Verbreitungsrechte.

## Kontakt

Christof Treitges · <Christof.Treitges@outlook.de> · [github.com/CTreitges](https://github.com/CTreitges)
