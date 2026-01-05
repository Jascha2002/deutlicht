import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Impressum = () => {
  return (
    <>
      <Helmet>
        <title>Impressum | DeutLicht® - Rechtliche Angaben</title>
        <meta name="description" content="Impressum und rechtliche Angaben der Stadtnetz UG (haftungsbeschränkt) handelnd unter der Marke DeutLicht® - Digitalisierung und KI-Lösungen." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Impressum
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Rechtliche Angaben gemäß § 5 TMG / § 18 Abs. 2 MStV
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
                  Angaben gemäß § 5 TMG / § 18 Abs. 2 MStV
                </h2>
                <div className="text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Stadtnetz UG (haftungsbeschränkt)</p>
                  <p>handelnd unter der Marke DeutLicht®</p>
                  <p>Gemeindeweg 4 (Mäuseturm)</p>
                  <p>07546 Gera (Deutschland)</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Kontakt
                </h2>
                <div className="text-muted-foreground space-y-1">
                  <p>Telefon: +49 178 5549216</p>
                  <p>E-Mail: info@deutlicht.de</p>
                  <p>Web: www.deutlicht.de</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Vertretungsberechtigte
                </h2>
                <div className="text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Geschäftsführer: Carsten van de Sand</p>
                  <p>(Stadtnetz UG (haftungsbeschränkt))</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Verantwortlich für den Inhalt
                </h2>
                <div className="text-muted-foreground space-y-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Inhaltlich verantwortlich gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV):
                  </p>
                  <p className="font-semibold text-foreground">Carsten van de Sand</p>
                  <p>Gemeindeweg 4 (Mäuseturm)</p>
                  <p>07546 Gera (Deutschland)</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Unternehmensangaben
                </h2>
                <div className="text-muted-foreground space-y-1">
                  <p><strong className="text-foreground">Rechtsform:</strong> Unternehmergesellschaft (haftungsbeschränkt)</p>
                  <p><strong className="text-foreground">Firmierung:</strong> Stadtnetz UG (haftungsbeschränkt)</p>
                  <p><strong className="text-foreground">Marke:</strong> DeutLicht®</p>
                  <p><strong className="text-foreground">Handelsregister:</strong> HRB 514530, Amtsgericht Jena</p>
                  <p><strong className="text-foreground">Betriebsnummer:</strong> 90892833</p>
                  <p><strong className="text-foreground">Steuernummer:</strong> 161/120/05343</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Hinweis zur Marke
                </h2>
                <div className="text-muted-foreground">
                  <p>
                    Die Marke DeutLicht® ist eine eingetragene bzw. angemeldete Marke der Stadtnetz UG (haftungsbeschränkt).
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  EU-Streitschlichtung
                </h2>
                <div className="text-muted-foreground">
                  <p className="mb-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  </p>
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                  <p className="mt-4">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Verbraucherstreitbeilegung/Universalschlichtungsstelle
                </h2>
                <div className="text-muted-foreground">
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Haftung für Inhalte
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                    Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                    Tätigkeit hinweisen.
                  </p>
                  <p>
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                    allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                    erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                    Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend 
                    entfernen.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.9}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Haftung für Links
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                    Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                    Seiten verantwortlich.
                  </p>
                  <p>
                    Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
                    überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. 
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
                    Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
                    Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={1.0}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Urheberrecht
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                    dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                    der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                    Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                  <p>
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen 
                    Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt 
                    wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter 
                    als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung 
                    aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von 
                    Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Impressum;