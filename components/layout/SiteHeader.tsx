"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/** Sticky-Header mit Glas-Effekt nach Scroll, Scroll-Spy und Mobile-Overlay. */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  // Leer = nichts markiert (Besucher ist oben im Hero, der nicht in der Nav steht).
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // "top" mit beobachten, damit im Hero KEIN Nav-Eintrag fälschlich leuchtet.
    const ids = ["top", ...site.nav.map((n) => n.id)];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 font-mono text-accent">
            CT
          </span>
          <span className="hidden sm:inline">Christof Treitges</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {site.nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                active === n.id
                  ? "text-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted md:hidden"
        >
          <span aria-hidden className="font-mono text-lg leading-none">
            {open ? "✕" : "≡"}
          </span>
        </button>
      </div>

      {/* Mobile-Overlay */}
      {open && (
        <nav id="mobile-nav" className="glass border-t border-border md:hidden">
          <ul className="mx-auto max-w-6xl px-5 py-3">
            {site.nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm ${
                    active === n.id ? "text-accent" : "text-text-muted"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
