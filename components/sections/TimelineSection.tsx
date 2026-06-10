import Section from "@/components/ui/Section";
import Reveal from "@/components/effects/Reveal";
import { timeline } from "@/content/timeline";
import type { TimelineEntry } from "@/content/types";

const typeLabel: Record<TimelineEntry["type"], string> = {
  ausbildung: "Ausbildung",
  job: "Beruf",
  selbststaendig: "Selbstständig",
  lernreise: "KI-Weg",
};

function Entry({ e }: { e: TimelineEntry }) {
  const isKi = e.track === "ki";
  return (
    <div className="relative pl-8">
      <span
        className={`absolute left-[3px] top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 ${
          isKi
            ? "border-accent bg-bg shadow-[0_0_10px_var(--color-accent)]"
            : "border-border-glow bg-surface"
        }`}
      />
      {/* Tabellarisch (DE-CV): Zeitraum als feste Spalte links, Inhalt rechts */}
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[7.5rem_1fr]">
        <div className="flex flex-row items-baseline gap-x-3 sm:flex-col sm:gap-y-1.5 sm:pt-0.5">
          <span className="font-mono text-xs text-text-faint">
            {e.placeholder ? "·····" : e.period}
          </span>
          <span
            className={`w-fit rounded-full border px-2 py-0.5 font-mono text-[10px] ${
              isKi
                ? "border-accent/30 text-accent"
                : "border-border text-text-faint"
            }`}
          >
            {typeLabel[e.type]}
          </span>
        </div>
        <div>
          <h3 className="mt-1 font-display text-base font-semibold text-text sm:mt-0">
            {e.title}
            {e.org && (
              <span className="font-sans font-normal text-text-muted">
                {" "}
                · {e.org}
              </span>
            )}
          </h3>
          {e.desc && (
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-faint">
              {e.desc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Werdegang in zwei Spuren: Hauptweg + KI-Lernreise, antichronologisch. */
export default function TimelineSection() {
  const haupt = timeline.filter((e) => e.track === "haupt");
  const ki = timeline.filter((e) => e.track === "ki");

  return (
    <Section
      id="werdegang"
      eyebrow="// WERDEGANG"
      title="Zwei Spuren, ein Weg"
      intro="Links der formale Weg, rechts die KI-Lernreise, die parallel dazu Fahrt aufgenommen hat — jeweils mit dem Aktuellsten zuerst."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-wider text-text-faint">
            Hauptweg
          </p>
          <div className="space-y-7 border-l border-border pl-1">
            {haupt.map((e, i) => (
              <Reveal key={i} delay={0.03 * i}>
                <Entry e={e} />
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-wider text-accent">
            KI-Lernreise
          </p>
          <div className="space-y-7 border-l border-accent/20 pl-1">
            {ki.map((e, i) => (
              <Reveal key={i} delay={0.03 * i}>
                <Entry e={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
