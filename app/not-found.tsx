import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="aurora pointer-events-none absolute inset-0 opacity-60" />
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
        // 404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
        Seite nicht gefunden
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        Diese Adresse gibt es nicht — vielleicht ein alter Link.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
