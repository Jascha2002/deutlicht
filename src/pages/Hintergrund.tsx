import { Helmet } from "react-helmet-async";

const Hintergrund = () => {
  return (
    <>
      <Helmet>
        <title>Hintergrund – Die Geschichte von DeutLicht® | Digitalisierung & Beratung</title>
        <meta 
          name="description" 
          content="Erfahren Sie mehr über DeutLicht® – über 30 Jahre Erfahrung im Management und 25+ Jahre Digitalisierung. Ihr Partner für die digitale Zukunft." 
        />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section with Video */}
        <section className="relative py-16 lg:py-24">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Video */}
            <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
              <video
                className="w-full aspect-video object-cover"
                controls
                poster="/videos/hintergrund-poster.jpg"
              >
                <source src="/videos/hintergrund-video.mp4" type="video/mp4" />
                Ihr Browser unterstützt keine Videos.
              </video>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                Die Geschichte und Vision von DeutLicht®
              </h1>

              <p className="text-xl md:text-2xl text-accent font-medium mb-12 leading-relaxed">
                DeutLicht® ist mehr als eine Agentur – wir sind Ihr Partner für die digitale Zukunft.
              </p>

              <div className="space-y-12">
                {/* Erfahrung */}
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 border-l-4 border-accent pl-4">
                    Über 30 Jahre Erfahrung
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Gegründet von einem Unternehmer mit über 30 Jahren Erfahrung im Management, davon mehr als 25 Jahre im Bereich Digitalisierung, vereint unser Team fundiertes unternehmerisches Know-how mit tiefem Verständnis für digitale Transformationsprozesse.
                  </p>
                </section>

                {/* Beratung */}
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 border-l-4 border-accent pl-4">
                    Ganzheitliche Begleitung
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Als Berater für Förderprogramme und Coach begleiten wir Unternehmen ganzheitlich – von der strategischen Analyse bis zur erfolgreichen Umsetzung. Unsere Erfahrung umfasst unter anderem die Einführung von CRM-Systemen, Shoplösungen sowie die Entwicklung und Umsetzung nachhaltiger Social-Media-Strategien.
                  </p>
                </section>

                {/* Wurzeln */}
                <section className="bg-card rounded-xl p-8 shadow-lg border border-border">
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Unsere Wurzeln
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Unsere Expertise stammt aus der Praxis – von der strategischen Planung in der Agenturbranche bis zur operativen Digitalisierung von KMU. Diese Erfahrung nutzen wir, um Websites, Shopsysteme und Marketinglösungen zu entwickeln, die messbare Ergebnisse liefern.
                  </p>
                </section>

                {/* Philosophie */}
                <section className="bg-card rounded-xl p-8 shadow-lg border border-border">
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Unsere Philosophie
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Wir glauben an klare Visionen und starke Präsenz – durch datengetriebene Tools und KI-Integrationen setzen wir diese in die Tat um.
                  </p>
                </section>

                {/* Ausblick */}
                <section>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 border-l-4 border-accent pl-4">
                    Ausblick
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In den kommenden Monaten erweitern wir unser Portfolio mit KI-gestütztem Marketing, Prozessanalysen und einem eigenen Kundenportal für zentrale Verwaltung von Aufträgen, Berichten und Förderdokumenten.
                  </p>
                </section>

                {/* Vertrauen */}
                <section className="gradient-gold rounded-xl p-8 shadow-xl">
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-accent-foreground mb-4">
                    Ihr Vertrauen
                  </h2>
                  <p className="text-accent-foreground/90 leading-relaxed">
                    Mit DeutLicht® erhalten Sie einen Partner, der nicht nur Theorie liefert, sondern durch jahrelange Erfolge inspiriert – unterstützt durch Förderungen, die Ihre Investitionen maximieren.
                  </p>
                </section>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default Hintergrund;
