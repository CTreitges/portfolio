"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import AuroraBackdrop from "@/components/effects/AuroraBackdrop";
import MagneticButton from "@/components/effects/MagneticButton";
import { site } from "@/content/site";

// Rein clientseitig: 3D-Partikelfeld liegt hinter dem Aurora-Glow.
// Rendert auf Mobile/reduced-motion nichts → dann greift allein Aurora.
const HeroBackdrop = dynamic(
  () => import("@/components/effects/HeroBackdrop"),
  { ssr: false }
);

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center"
    >
      <AuroraBackdrop className="[mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_85%)]" />
      <HeroBackdrop />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent sm:text-sm"
      >
        {site.eyebrow}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
      >
        {site.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-text-muted sm:text-xl"
      >
        {site.heroSubline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <MagneticButton href="#projekte">Projekte ansehen</MagneticButton>
        <MagneticButton href="#kontakt" variant="ghost">
          Kontakt
        </MagneticButton>
      </motion.div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-text-faint"
      >
        <span className="inline-block animate-bounce">↓</span> scrollen
      </div>
    </section>
  );
}
