import Section from "@/components/ui/Section";
import SpotlightCard from "@/components/effects/SpotlightCard";
import Reveal from "@/components/effects/Reveal";
import FlowDiagram from "@/components/effects/FlowDiagram";
import { labConcepts } from "@/content/lab";
import type { LabStatus } from "@/content/types";

const statusTone: Record<LabStatus, string> = {
  laeuft: "border-success/40 bg-success/10 text-success",
  prototyp: "border-accent/40 bg-accent/10 text-accent-soft",
  "in-arbeit": "border-warn/40 bg-warn/10 text-warn",
  konzept: "border-glow/40 bg-glow/10 text-glow-soft",
};

/** Lab / Visionen — Konzept-Karten mit ehrlichem Status-Badge + Mini-Diagramm. */
export default function LabSection() {
  return (
    <Section
      id="lab"
      eyebrow="// LAB & VISIONEN"
      title="Woran ich denke"
      intro="Zwei Ideen, an denen ich aktiv baue — mit ehrlichem Status. Beide zielen auf den gleichen Kern: leistungsfähige KI, lokal kontrolliert."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {labConcepts.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.07}>
            <SpotlightCard className="flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">
                  {c.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] ${statusTone[c.status]}`}
                >
                  {c.statusNote}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {c.pitch}
              </p>

              <div
                tabIndex={0}
                role="group"
                aria-label={`Diagramm zu ${c.title}, horizontal scrollbar`}
                className="my-5 overflow-x-auto rounded-xl border border-border bg-bg/40 p-3"
              >
                <div className="min-w-[520px]">
                  <FlowDiagram spec={c.flow} label={`Konzept: ${c.title}`} />
                </div>
              </div>

              <div className="mt-auto rounded-xl border border-glow/20 bg-glow/5 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-glow-soft">
                  Für ein KMU
                </p>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">
                  {c.kmuAngle}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
