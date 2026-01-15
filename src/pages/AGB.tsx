import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const AGB = () => {
  return (
    <>
      <Helmet>
        <title>Allgemeine Geschäftsbedingungen | DeutLicht®</title>
        <meta name="description" content="Allgemeine Geschäftsbedingungen (AGB) der Stadtnetz UG (haftungsbeschränkt) handelnd unter der Marke DeutLicht®." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Vertragsbedingungen für unsere Dienstleistungen
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <ScrollReveal>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 1 Geltungsbereich
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der 
                    Stadtnetz UG (haftungsbeschränkt), handelnd unter der Marke DeutLicht® (nachfolgend 
                    „Auftragnehmer" genannt) und dem Auftraggeber über die Erbringung von Beratungs-, 
                    Entwicklungs- und Digitalisierungsdienstleistungen.
                  </p>
                  <p>
                    (2) Abweichende Bedingungen des Auftraggebers werden nicht anerkannt, es sei denn, 
                    der Auftragnehmer stimmt ihrer Geltung ausdrücklich schriftlich zu.
                  </p>
                  <p>
                    (3) Diese AGB gelten auch für alle zukünftigen Geschäftsbeziehungen, auch wenn sie 
                    nicht nochmals ausdrücklich vereinbart werden.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 2 Vertragsschluss
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Angebote des Auftragnehmers sind freibleibend und unverbindlich, sofern sie nicht 
                    ausdrücklich als verbindlich gekennzeichnet sind.
                  </p>
                  <p>
                    (2) Der Vertrag kommt durch schriftliche Auftragsbestätigung des Auftragnehmers oder 
                    durch Beginn der Leistungserbringung zustande.
                  </p>
                  <p>
                    (3) Die digitale Annahme eines Angebots durch elektronische Signatur steht der 
                    schriftlichen Annahme gleich.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 3 Leistungsumfang
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Der Umfang der zu erbringenden Leistungen ergibt sich aus dem jeweiligen Angebot 
                    bzw. der Auftragsbestätigung.
                  </p>
                  <p>
                    (2) Änderungen und Ergänzungen des Leistungsumfangs bedürfen der Schriftform.
                  </p>
                  <p>
                    (3) Der Auftragnehmer ist berechtigt, Teilleistungen zu erbringen, soweit dies 
                    für den Auftraggeber zumutbar ist.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 4 Mitwirkungspflichten des Auftraggebers
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Der Auftraggeber stellt dem Auftragnehmer alle für die Leistungserbringung 
                    erforderlichen Informationen, Unterlagen und Zugänge rechtzeitig zur Verfügung.
                  </p>
                  <p>
                    (2) Der Auftraggeber benennt einen Ansprechpartner, der für Abstimmungen und 
                    Entscheidungen zur Verfügung steht.
                  </p>
                  <p>
                    (3) Verzögerungen, die durch nicht rechtzeitige oder unvollständige Mitwirkung des 
                    Auftraggebers entstehen, gehen nicht zu Lasten des Auftragnehmers.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 5 Vergütung und Zahlungsbedingungen
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Die Vergütung ergibt sich aus dem jeweiligen Angebot. Alle Preise verstehen sich 
                    zuzüglich der gesetzlichen Mehrwertsteuer.
                  </p>
                  <p>
                    (2) Bei einmaligen Leistungen sind 50% der Vergütung bei Auftragserteilung und 50% 
                    bei Fertigstellung fällig, sofern nicht anders vereinbart.
                  </p>
                  <p>
                    (3) Monatliche Leistungen werden jeweils zum Monatsanfang in Rechnung gestellt und 
                    sind innerhalb von 14 Tagen nach Rechnungsdatum zahlbar.
                  </p>
                  <p>
                    (4) Bei Zahlungsverzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem 
                    Basiszinssatz berechnet.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 6 Nutzungsrechte
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Der Auftraggeber erhält nach vollständiger Zahlung das einfache, zeitlich und 
                    räumlich unbeschränkte Nutzungsrecht an den vereinbarten Arbeitsergebnissen für 
                    den vertragsgemäßen Zweck.
                  </p>
                  <p>
                    (2) Das Urheberrecht an den erstellten Werken verbleibt beim Auftragnehmer.
                  </p>
                  <p>
                    (3) Der Auftragnehmer ist berechtigt, die erstellten Arbeiten als Referenz zu nutzen, 
                    sofern keine gegenteilige Vereinbarung getroffen wurde.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 7 Gewährleistung und Haftung
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Der Auftragnehmer gewährleistet, dass die erbrachten Leistungen den vertraglichen 
                    Anforderungen entsprechen.
                  </p>
                  <p>
                    (2) Die Gewährleistungsfrist beträgt 12 Monate ab Abnahme der Leistung.
                  </p>
                  <p>
                    (3) Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit es sich nicht 
                    um die Verletzung wesentlicher Vertragspflichten, Schäden aus der Verletzung des 
                    Lebens, des Körpers oder der Gesundheit handelt.
                  </p>
                  <p>
                    (4) Die Haftung ist der Höhe nach auf den vorhersehbaren, vertragstypischen Schaden 
                    begrenzt.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 8 Vertraulichkeit
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Beide Parteien verpflichten sich, alle im Rahmen der Zusammenarbeit erhaltenen 
                    vertraulichen Informationen geheim zu halten.
                  </p>
                  <p>
                    (2) Diese Verpflichtung gilt auch nach Beendigung des Vertragsverhältnisses.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 9 Kündigung
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Verträge über laufende Leistungen können mit einer Frist von 3 Monaten zum 
                    Quartalsende gekündigt werden.
                  </p>
                  <p>
                    (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                  </p>
                  <p>
                    (3) Die Kündigung bedarf der Schriftform.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.9}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 10 Datenschutz
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Die Verarbeitung personenbezogener Daten erfolgt gemäß den geltenden 
                    datenschutzrechtlichen Bestimmungen, insbesondere der DSGVO.
                  </p>
                  <p>
                    (2) Soweit der Auftragnehmer im Rahmen der Leistungserbringung personenbezogene 
                    Daten im Auftrag verarbeitet, wird eine gesonderte Auftragsverarbeitungsvereinbarung 
                    geschlossen.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.0}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  § 11 Schlussbestimmungen
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    (1) Es gilt das Recht der Bundesrepublik Deutschland.
                  </p>
                  <p>
                    (2) Gerichtsstand ist der Sitz des Auftragnehmers, sofern der Auftraggeber Kaufmann, 
                    juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
                  </p>
                  <p>
                    (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit 
                    der übrigen Bestimmungen unberührt.
                  </p>
                  <p>
                    (4) Änderungen und Ergänzungen dieser AGB bedürfen der Schriftform.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.1}>
              <div className="p-6 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Stand:</strong> Januar 2025
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong className="text-foreground">Anbieter:</strong> Stadtnetz UG (haftungsbeschränkt) 
                  handelnd unter der Marke DeutLicht® | Gemeindeweg 4, 07546 Gera
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AGB;