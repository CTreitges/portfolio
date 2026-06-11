import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Impressum",
};

/**
 * Öffentliche Pflichtangaben nach § 5 DDG (vor dem Auth-Gate erreichbar,
 * proxy.ts-Matcher-Ausnahme). Kein Rechtsrat — Standard-Template; die
 * ladungsfähige Anschrift pflegt der Inhaber über site.legal.
 */
export default function ImpressumPage() {
  const { legal } = site;

  if (legal.addressPlaceholder) {
    return (
      <LegalPage title="Impressum">
        <LegalSection heading="Pflichtangaben werden ergänzt">
          <p>
            Die vollständigen Anbieterangaben nach § 5 DDG — insbesondere die
            ladungsfähige Anschrift — werden derzeit ergänzt.
          </p>
          <p>
            Kontakt:{" "}
            <a
              className="text-accent-soft underline"
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </a>
          </p>
        </LegalSection>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Impressum">
      <LegalSection heading="Angaben gemäß § 5 DDG">
        <p>
          {legal.holder}
          <br />
          {legal.addressLines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          E-Mail:{" "}
          <a
            className="text-accent-soft underline"
            href={`mailto:${site.contact.email}`}
          >
            {site.contact.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>{legal.holder} (Anschrift wie oben)</p>
      </LegalSection>

      <LegalSection heading="Verbraucherstreitbeilegung">
        <p>
          Ich bin nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <p>
          Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG bin ich als Diensteanbieter jedoch nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder
          nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Dieses Angebot kann Links zu externen Websites Dritter enthalten, auf
          deren Inhalte ich keinen Einfluss habe. Für diese fremden Inhalte kann
          ich keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
          stets der jeweilige Anbieter oder Betreiber verantwortlich.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind
          als solche gekennzeichnet.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
