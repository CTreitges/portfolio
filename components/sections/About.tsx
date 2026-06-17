import Section from "@/components/ui/Section";
import SpotlightCard from "@/components/effects/SpotlightCard";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import Reveal from "@/components/effects/Reveal";
import { withBasePath } from "@/lib/base-path";
import Marquee from "@/components/effects/Marquee";
import Link from "next/link";
import { about } from "@/content/about";

/** Bento-Grid. Foto-Slot + Profil, Warum-KI-Anekdote, Fähigkeiten,
 *  Stärken und „Abseits des Rechners" (geerdet, fürs KMU greifbar). */
export default function About() {
  return (
    <Section id="about" eyebrow="// PROFIL" title="Über mich">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Foto-Slot */}
        <Reveal>
          <SpotlightCard className="flex h-full min-h-[200px] flex-col items-center justify-center p-6 text-center">
            <ProfilePhoto src={withBasePath("/profil.webp")} alt="Christof Treitges" />
            <p className="mt-4 text-sm text-text-muted">Christof Treitges</p>
            <p className="mt-1 font-mono text-xs text-text-faint">
              KI-Entwickler
            </p>
          </SpotlightCard>
        </Reveal>

        {/* Kurzprofil */}
        <Reveal delay={0.05} className="md:col-span-2">
          <SpotlightCard className="h-full p-6">
            <h3 className="font-display text-lg font-semibold">Kurzprofil</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {about.profile}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {about.profileDrive}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-faint">
              {about.profilePersonal}
            </p>
            <Link
              href="/studienleistungen"
              className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              Studienleistungen ansehen →
            </Link>
          </SpotlightCard>
        </Reveal>

        {/* Warum KI — Anekdote */}
        <Reveal delay={0.1} className="md:col-span-2">
          <SpotlightCard className="h-full p-6">
            <h3 className="font-display text-lg font-semibold">Warum KI</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {about.whyAI}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-faint">
              {about.howIWork}
            </p>
          </SpotlightCard>
        </Reveal>

        {/* Stärken */}
        <Reveal delay={0.15}>
          <SpotlightCard className="h-full p-6">
            <h3 className="font-display text-lg font-semibold">Stärken</h3>
            <ul className="mt-3 space-y-2">
              {about.strengths.map((s) => (
                <li
                  key={s}
                  className="flex gap-2 text-sm leading-snug text-text-muted"
                >
                  <span className="text-accent">▹</span>
                  {s}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>

        {/* Was ich mit KI baue */}
        <Reveal delay={0.1} className="md:col-span-3">
          <SpotlightCard className="h-full p-6">
            <h3 className="font-display text-lg font-semibold">
              Was ich mit KI baue
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {about.buildCapabilities.map((c) => (
                <div key={c.title}>
                  <p className="text-sm font-medium text-text">{c.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-faint">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Abseits des Rechners */}
        <Reveal delay={0.1} className="md:col-span-3">
          <SpotlightCard className="h-full p-6">
            <h3 className="font-display text-lg font-semibold">
              Abseits des Rechners
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {about.beyondCode.map((b) => (
                <div key={b.label} className="rounded-xl border border-border bg-bg/40 p-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">
                    {b.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Tech-Marquee */}
        <Reveal delay={0.1} className="md:col-span-3">
          <div className="rounded-2xl border border-border bg-surface py-4">
            <Marquee items={[...about.techStack]} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
