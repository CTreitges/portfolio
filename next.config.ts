import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimaler Server für den VPS-Deploy (systemd startet .next/standalone/server.js).
  output: "standalone",
  // Ohne das inferiert Next ein Lockfile im Home-Verzeichnis als Workspace-Root
  // und verschachtelt standalone/ unter einem Extra-Ordner.
  outputFileTracingRoot: __dirname,

  // Defense-in-Depth zusätzlich zu metadata.robots + robots.txt.
  // In Produktion setzt Caddy den Header ebenfalls global (inkl. Assets).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
