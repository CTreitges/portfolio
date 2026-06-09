import { site } from "@/content/site";

/** Footer — bewusst auch Beweisführung (Tech-Stack der Seite selbst). */
export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-mono text-xs leading-relaxed text-text-faint">
          {site.footerTech}
        </p>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <a
            href={`mailto:${site.contact.email}`}
            className="hover:text-accent-soft"
          >
            E-Mail
          </a>
          <a
            href={site.contact.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent-soft"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
