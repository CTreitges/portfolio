import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy ohne Nonce: Die Site bleibt bewusst statisch —
 * nonce-basierte CSP würde dynamic rendering erzwingen (LCP/Caching-Verlust).
 * Kompromiss daraus:
 *  - 'unsafe-inline' bei style/script ist nötig (Motion/GSAP setzen Inline-
 *    Styles, Next injiziert ein Inline-Bootstrap-Script); in dev zusätzlich
 *    'unsafe-eval'/ws: für React-Refresh + HMR.
 *  - img-src erlaubt https:, weil die eingebetteten research-pitch-HTMLs
 *    externe Produktbilder laden (sonst bräche der Research-Viewer). Sie laden
 *    NUR Bilder — keine externen Skripte/Styles/Fonts (verifiziert).
 *  - frame-ancestors/X-Frame-Options auf 'self'/SAMEORIGIN (NICHT none/DENY):
 *    der Research-Viewer bettet /research-docs/*.html in ein eigenes iframe ein.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Hardening-Header für die self-hosted App mit Cookie-Session.
const securityHeaders = [
  // Defense-in-Depth zusätzlich zu metadata.robots + robots.txt.
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HSTS: auf reinen IP-Hosts vom Browser ignoriert, aber harmlos und
  // zukunftssicher, sobald eine Domain davor steht. Nur über HTTPS (Prod).
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  // App unter einem Unterpfad ausliefern (z. B. /portfolio). Muss zur Build-Zeit
  // feststehen — der Wert wird in die Client-Bundles inlined. Leer/ungesetzt →
  // App läuft auf "/" (Default, z. B. lokal). Quelle für den manuellen Präfix
  // (fetch/Cookie/<a>): lib/base-path.ts.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Minimaler Server für den VPS-Deploy (systemd startet .next/standalone/server.js).
  output: "standalone",
  // Ohne das inferiert Next ein Lockfile im Home-Verzeichnis als Workspace-Root
  // und verschachtelt standalone/ unter einem Extra-Ordner.
  outputFileTracingRoot: __dirname,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
