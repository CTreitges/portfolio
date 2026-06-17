import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/layout/LegalPage";
import { site } from "@/content/site";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
};

/**
 * Öffentliche Datenschutzerklärung (vor dem Auth-Gate erreichbar,
 * proxy.ts-Matcher-Ausnahme). Beschreibt die tatsächliche Verarbeitung:
 * Server-Logfiles (IP via Rate-Limit/Access-Log), technisch notwendiges
 * Session-Cookie nach Code-Eingabe, lokal ausgelieferte Schriftarten, keine
 * Tracker. Kein Rechtsrat — Transparenz-Template.
 */
export default function DatenschutzPage() {
  const { legal } = site;

  return (
    <LegalPage title="Datenschutzerklärung" updated="Juni 2026">
      <LegalSection heading="Verantwortlicher">
        {legal.addressPlaceholder ? (
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist{" "}
            {legal.holder}. Die vollständige Anschrift wird im{" "}
            <a
              className="text-accent-soft underline"
              href={withBasePath("/impressum")}
            >
              Impressum
            </a>{" "}
            ergänzt. Kontakt:{" "}
            <a
              className="text-accent-soft underline"
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </a>
            .
          </p>
        ) : (
          <p>
            {legal.holder}
            <br />
            {legal.addressLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            E-Mail:{" "}
            <a
              className="text-accent-soft underline"
              href={`mailto:${site.contact.email}`}
            >
              {site.contact.email}
            </a>
          </p>
        )}
      </LegalSection>

      <LegalSection heading="Hosting und Server-Logfiles">
        <p>
          Diese Website wird auf einem Server der {legal.hostingProvider} in{" "}
          {legal.hostingLocation} betrieben. Beim Aufruf erfasst der Server
          automatisch technische Daten in Logfiles: IP-Adresse, Datum und
          Uhrzeit des Zugriffs, die angeforderte Ressource sowie den
          übermittelten Browsertyp (User-Agent). Diese Daten dienen
          ausschließlich dem sicheren Betrieb, der Fehleranalyse und der Abwehr
          von Missbrauch (u. a. Begrenzung der Anmeldeversuche am Zugangs-Gate).
          Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und
          funktionsfähigen Angebot (Art. 6 Abs. 1 lit. f DSGVO). Die Daten
          werden nur so lange gespeichert, wie es für diese Zwecke erforderlich
          ist, und anschließend gelöscht.
        </p>
      </LegalSection>

      <LegalSection heading="Zugangsschutz und Session-Cookie">
        <p>
          Die Inhalte dieses Portfolios sind durch ein Zugangs-Gate geschützt.
          Nach Eingabe eines gültigen Zugangscodes wird ein technisch
          notwendiges, signiertes Session-Cookie gesetzt, das den Zugang für die
          Dauer der Sitzung erlaubt. Es dient ausschließlich der
          Zugangskontrolle, enthält kein Tracking und wird nicht an Dritte
          weitergegeben. Rechtsgrundlage für die Speicherung ist § 25 Abs. 2
          Nr. 2 TDDDG (für den Dienst unbedingt erforderlich) in Verbindung mit
          dem berechtigten Interesse an der Zugangskontrolle (Art. 6 Abs. 1
          lit. f DSGVO).
        </p>
      </LegalSection>

      <LegalSection heading="Schriftarten">
        <p>
          Die verwendeten Schriftarten werden lokal vom Server dieser Website
          ausgeliefert. Es findet beim Aufruf kein Verbindungsaufbau zu Servern
          Dritter (etwa Google Fonts) statt; Ihre IP-Adresse wird hierfür nicht
          an Dritte übertragen.
        </p>
      </LegalSection>

      <LegalSection heading="Keine Analyse- und Tracking-Dienste">
        <p>
          Diese Website nutzt keine Analyse-, Tracking- oder Werbedienste und
          bindet keine Inhalte Dritter ein. Es werden keine personenbezogenen
          Daten zu Werbezwecken verarbeitet oder weitergegeben.
        </p>
      </LegalSection>

      <LegalSection heading="Kontaktaufnahme">
        <p>
          Wenn Sie mich per E-Mail kontaktieren, verarbeite ich die übermittelten
          Angaben ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Die Daten werden gelöscht,
          sobald sie für den Zweck nicht mehr erforderlich sind und keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection heading="Verschlüsselung">
        <p>
          Die Verbindung zu dieser Website ist per TLS verschlüsselt (erkennbar
          am „https&ldquo; in der Adresszeile), um die Übertragung Ihrer Daten zu
          schützen.
        </p>
      </LegalSection>

      <LegalSection heading="Ihre Rechte">
        <p>
          Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf Auskunft
          (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit
          (Art. 20) sowie ein Widerspruchsrecht gegen die Verarbeitung
          (Art. 21). Zudem steht Ihnen ein Beschwerderecht bei einer
          Datenschutz-Aufsichtsbehörde zu. Für die Ausübung Ihrer Rechte genügt
          eine formlose Nachricht an die oben genannte E-Mail-Adresse.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
