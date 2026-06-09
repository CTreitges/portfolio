import type { ReactNode } from "react";
import Reveal from "@/components/effects/Reveal";

/** Standard-Sektions-Schale mit Anker, Eyebrow und H2. */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:py-28 ${className}`}
    >
      <Reveal>
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2
            id={`${id}-title`}
            className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl"
          >
            {title}
          </h2>
          {intro && (
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {intro}
            </p>
          )}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
