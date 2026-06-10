"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AuroraBackdrop from "@/components/effects/AuroraBackdrop";
import MagneticButton from "@/components/effects/MagneticButton";
import { site } from "@/content/site";

// Rein clientseitig: 3D-Partikelfeld liegt hinter dem Aurora-Glow.
const HeroBackdrop = dynamic(
  () => import("@/components/effects/HeroBackdrop"),
  { ssr: false }
);

/* Entrance läuft als CSS-Animation (.hero-rise in globals.css) statt über
   Motion: sie startet beim First Paint statt nach der Hydration — sonst
   bleibt die Subline (das LCP-Element) sekundenlang auf opacity 0. */
const rise = (s: number) => ({ "--hero-delay": `${s}s` }) as React.CSSProperties;

export default function Hero() {
  // three.js-Chunk nur dort laden, wo er auch rendert (Desktop, volle
  // Motion): auf Mobile/reduced spart das den kompletten Download.
  // Hydration-sicher: Server wie erster Client-Render zeigen false.
  const [showBackdrop, setShowBackdrop] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (desktop && !reduced) setShowBackdrop(true);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center"
    >
      <AuroraBackdrop className="[mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_85%)]" />
      {showBackdrop && <HeroBackdrop />}

      <p
        style={rise(0)}
        className="hero-rise mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent sm:text-sm"
      >
        {site.eyebrow}
      </p>

      <h1
        style={rise(0.08)}
        className="hero-rise font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
      >
        {site.name}
      </h1>

      <p
        style={rise(0.16)}
        className="hero-rise mt-6 max-w-2xl text-balance text-lg leading-relaxed text-text-muted sm:text-xl"
      >
        {site.heroSubline}
      </p>

      <div
        style={rise(0.24)}
        className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        {site.proofChips.map((c) => (
          <div
            key={c.label}
            className="rounded-full border border-border bg-surface/60 px-4 py-2"
          >
            <span className="font-display text-lg font-semibold text-text">
              {c.value}
            </span>{" "}
            <span className="text-sm text-text-faint">{c.label}</span>
          </div>
        ))}
      </div>

      <div
        style={rise(0.32)}
        className="hero-rise mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton href="#projekte">Projekte ansehen</MagneticButton>
        <MagneticButton href="#kontakt" variant="ghost">
          Kontakt
        </MagneticButton>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-text-faint"
      >
        <span className="inline-block animate-bounce">↓</span> scrollen
      </div>
    </section>
  );
}
