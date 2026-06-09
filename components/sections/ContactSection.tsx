"use client";

import { useState } from "react";
import AuroraBackdrop from "@/components/effects/AuroraBackdrop";
import MagneticButton from "@/components/effects/MagneticButton";
import Reveal from "@/components/effects/Reveal";
import { site } from "@/content/site";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard nicht verfügbar — mailto-Link bleibt als Fallback */
    }
  }

  return (
    <section
      id="kontakt"
      aria-labelledby="kontakt-title"
      className="relative overflow-hidden px-5 py-28"
    >
      <AuroraBackdrop className="[mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]" />
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            // KONTAKT
          </p>
          <h2
            id="kontakt-title"
            className="font-display text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            Lassen Sie uns über KI bei der{" "}
            <span className="text-gradient">IT-Fabrik</span> sprechen.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-muted">
            Ich freue mich über eine Nachricht — ob zur Stelle, zu einem der
            Projekte oder zu einer Idee aus dem Lab.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </MagneticButton>
            <button
              type="button"
              onClick={copyEmail}
              className="rounded-full border border-border px-4 py-3 text-sm text-text-muted transition-colors hover:border-border-glow hover:text-text"
            >
              {copied ? "Kopiert ✓" : "E-Mail kopieren"}
            </button>
            <MagneticButton href={site.contact.github} variant="ghost">
              GitHub · {site.contact.githubHandle}
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
