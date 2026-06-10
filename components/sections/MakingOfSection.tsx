import Section from "@/components/ui/Section";
import Reveal from "@/components/effects/Reveal";
import CountUp from "@/components/effects/CountUp";
import FlowDiagram from "@/components/effects/FlowDiagram";
import {
  makingOfFlow,
  makingOfIntro,
  makingOfStats,
  makingOfSteps,
} from "@/content/makingof";

/**
 * Making-of: das Portfolio als eigenes Arbeitsbeispiel — Plan-Modus,
 * KI-Interview, Memory/Git als Wissensbasis, ultracode-Workflows,
 * Verifikation. Trägt den Effizienz-Beleg (<5h reale Arbeitszeit).
 */
export default function MakingOfSection() {
  return (
    <Section
      id="making-of"
      eyebrow="// META"
      title="Wie dieses Portfolio entstand"
      intro={makingOfIntro}
    >
      <Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {makingOfStats.map((s) => (
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

      <Reveal delay={0.08}>
        <div
          tabIndex={0}
          role="group"
          aria-label="Ablauf-Diagramm, horizontal scrollbar"
          className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface/50 p-4"
        >
          <div className="min-w-[640px]">
            <FlowDiagram
              spec={makingOfFlow}
              label="Wie dieses Portfolio entstand: vom Plan-Modus über Memory und Agenten-Workflows bis zum Deploy"
            />
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {makingOfSteps.map((s, i) => (
          <Reveal key={s.title} delay={(i % 3) * 0.07}>
            <div className="h-full rounded-xl border border-border bg-surface p-5">
              <p className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold text-text">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
