import type { Metadata } from "next";
import UnlockForm from "@/components/auth/UnlockForm";

export const metadata: Metadata = {
  title: "Zugang — Portfolio",
};

/**
 * Das Code-Gate ist der erste Eindruck der Site — bewusst im Designsystem
 * gestaltet (Tokens, Aurora, Spotlight-Karte, Monogramm).
 */
export default function UnlockPage() {
  return (
    <main id="main" tabIndex={-1} className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <div aria-hidden className="aurora pointer-events-none absolute inset-0" />
      <div aria-hidden className="noise-overlay" />

      <section
        id="unlock-card"
        className="spotlight-card relative w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-lg font-bold text-accent-soft">
            CT
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-text">
              Privates Portfolio
            </h1>
            <p className="text-sm text-text-muted">
              Zugang per Code aus dem Anschreiben
            </p>
          </div>
        </div>

        <UnlockForm />

        <p className="mt-6 border-t border-border pt-4 text-xs text-text-muted">
          Keinen Code?{" "}
          <a
            href="mailto:Christof.Treitges@outlook.de?subject=Portfolio-Zugang"
            className="text-accent-soft underline-offset-2 hover:underline"
          >
            Kurze Mail genügt.
          </a>
        </p>
      </section>
    </main>
  );
}
