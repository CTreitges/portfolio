import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Bewusst generische Metadaten: Die Site ist privat (Code-Gate) —
 * Link-Previews und Crawler bekommen nichts Inhaltliches zu sehen.
 * og.png ist öffentlich (proxy-Matcher-Ausnahme) und zeigt deshalb
 * nur Name + Rolle — so wirkt der verschickte Magic-Link hochwertig,
 * ohne Inhalte zu leaken.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  title: {
    default: "Portfolio — Zugang per Einladung",
    template: "%s",
  },
  description: "Privates Bewerbungs-Portfolio.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Christof Treitges — KI-Entwickler & Innovation Specialist",
    description: "Privates Bewerbungs-Portfolio — Zugang per Einladung.",
    type: "website",
    locale: "de_DE",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christof Treitges — KI-Entwickler & Innovation Specialist",
    description: "Privates Bewerbungs-Portfolio — Zugang per Einladung.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text">
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
