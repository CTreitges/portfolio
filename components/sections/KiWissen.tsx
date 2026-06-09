import Section from "@/components/ui/Section";
import Reveal from "@/components/effects/Reveal";
import KnowledgeExplorer from "@/components/sections/KnowledgeExplorer";

/**
 * KI-Wissen & Interessen — als klarer Kategorie-Explorer (Master-Detail).
 * Jede Unterkategorie verweist auf ein Projekt oder mein Setup (Beweis statt
 * Behauptung).
 */
export default function KiWissen() {
  return (
    <Section
      id="ki-wissen"
      eyebrow="// KI-WISSEN & INTERESSEN"
      title="Eine Landkarte meiner Praxis"
      intro="Keine Schlagwortwolke: Wähle eine Kategorie — jede Unterkategorie verweist auf ein Projekt oder mein Setup, in dem ich das tatsächlich einsetze."
    >
      <Reveal>
        <KnowledgeExplorer />
      </Reveal>
    </Section>
  );
}
