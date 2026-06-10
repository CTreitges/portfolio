import Link from "next/link";
import Section from "@/components/ui/Section";
import Reveal from "@/components/effects/Reveal";
import CountUp from "@/components/effects/CountUp";
import FlowDiagram from "@/components/effects/FlowDiagram";
import TerminalShowcase from "@/components/sections/TerminalShowcase";
import {
  setupArchitecture,
  setupCapabilities,
  setupStats,
} from "@/content/setup";

/**
 * „Mein Maschinenraum" — Stats + Architektur-Diagramm.
 * (Phase 4 ergänzt den Terminal-Showcase.)
 */
export default function SetupSection() {
  return (
    <Section
      id="setup"
      eyebrow="// MEIN MASCHINENRAUM"
      title="Mein Claude-Code-Setup"
      intro="Kein Tutorial-Wissen, sondern ein über Monate gewachsenes, produktiv genutztes KI-Arbeitssystem mit persistentem Gedächtnis, Leitplanken und Automatisierung — über drei Maschinen synchron."
    >
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {setupStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface p-4 text-center"
            >
              <div className="font-display text-2xl font-bold text-accent sm:text-3xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1 text-xs text-text-faint">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          tabIndex={0}
          role="group"
          aria-label="Architektur-Diagramm, horizontal scrollbar"
          className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface/50 p-4"
        >
          <div className="min-w-[640px]">
            <FlowDiagram
              spec={setupArchitecture}
              label="Architektur meines Claude-Code-Setups über drei Maschinen"
            />
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {setupCapabilities.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.07}>
            <div className="h-full rounded-xl border border-border bg-surface p-5">
              <h3 className="font-display text-base font-semibold text-text">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {c.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Terminal-Showcase: echte Abläufe nachgespielt */}
      <Reveal delay={0.05}>
        <div className="mt-6">
          <TerminalShowcase />
        </div>
      </Reveal>

      {/* Deep-Dive: die ausgeblendete Projektkarte lebt als Case-Study weiter */}
      <Reveal delay={0.05}>
        <p className="mt-6 text-sm">
          <Link
            href="/projekte/claude-code-setup"
            className="inline-flex items-center gap-1 text-accent transition-colors hover:text-accent-soft"
          >
            Vollständige Case-Study zum Setup →
          </Link>
        </p>
      </Reveal>
    </Section>
  );
}
