import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Play } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedLogo from "@/components/AnimatedLogo";
import hintergrundHeroBg from "@/assets/hintergrund-hero-bg.jpg";

const Hintergrund = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsVideoPlaying(true);
  };

  return (
    <>
      <Helmet>
        <title>Hintergrund – Die Geschichte von DeutLicht® | Digitalisierung & Beratung</title>
        <meta 
          name="description" 
          content="Erfahren Sie mehr über DeutLicht® – über 30 Jahre Erfahrung im Management und 25+ Jahre Digitalisierung. Ihr Partner für die digitale Zukunft." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section with Background Image */}
        <section className="relative py-16 lg:py-24">
          {/* Hero Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={hintergrundHeroBg} 
              alt="DeutLicht Hintergrund" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            {/* Video with Poster and Play Button */}
            <div className="mb-12 rounded-lg overflow-hidden shadow-2xl relative">
              {!isVideoPlaying ? (
                <div className="relative cursor-pointer group" onClick={handlePlayClick}>
                  <img 
                    src={hintergrundHeroBg}
                    alt="Video Vorschau"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-10 h-10 text-primary fill-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Video abspielen</p>
                  </div>
                </div>
              ) : (
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  autoPlay
                  poster={hintergrundHeroBg}
                >
                  <source src="/videos/hintergrund-video.mp4" type="video/mp4" />
                  Ihr Browser unterstützt keine Videos.
                </video>
              )}
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              <div className="flex items-center gap-6 mb-8">
                <AnimatedLogo size="sm" />
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight m-0">
                  Die Geschichte und Vision von DeutLicht®
                </h1>
              </div>

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

                {/* Gründer-Profil */}
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 via-card to-primary/5 p-8 md:p-10 shadow-2xl border border-accent/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full uppercase tracking-wider">
                        Der Gründer
                      </span>
                      <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                        Expertenprofil
                      </span>
                    </div>
                    
                    <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      Carsten van de Sand
                    </h2>
                    <p className="text-lg md:text-xl text-accent font-medium mb-6">
                      C-Level-Partner für Digitalisierung & Vertrieb
                    </p>
                    
                    <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                      Mit über 30 Jahren Vertriebserfahrung – davon viele Jahre als Vertriebsleiter und Geschäftsführer auf C-Level – und mehr als 25 Jahren Praxis in Web- und Digitaltechnologien ist Carsten van de Sand einer der wenigen Experten, die beides hochprofessionell verbinden: <strong className="text-foreground">Technologie verstehen und sie erfolgreich verkaufen.</strong>
                    </p>

                    <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <span className="w-8 h-0.5 bg-accent"></span>
                      Kernkompetenzen im Überblick
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                        <div className="text-3xl font-bold text-accent mb-2">30+</div>
                        <div className="font-semibold text-foreground mb-2">Jahre Vertrieb auf C-Level</div>
                        <p className="text-sm text-muted-foreground">
                          Strategische Vertriebsleitung, Aufbau und Führung von Vertriebsteams, Großkundenbetreuung in internationalen Konzernen und Startups.
                        </p>
                      </div>

                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                        <div className="text-3xl font-bold text-accent mb-2">25+</div>
                        <div className="font-semibold text-foreground mb-2">Jahre Web- & Digitaltechnologie</div>
                        <p className="text-sm text-muted-foreground">
                          Seit den Pionierjahren des Internets aktiv: Webentwicklung, SEO/SEA, App-Entwicklung, KI-Sprachlösungen, Prozessautomatisierung und digitale Produktmanagement.
                        </p>
                      </div>

                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                        <div className="text-xl font-bold text-accent mb-2">🎯</div>
                        <div className="font-semibold text-foreground mb-2">Frühe Zusammenarbeit auf Managementebene</div>
                        <p className="text-sm text-muted-foreground">
                          Bereits um die Jahrtausendwende fachliche Diskussionen und Machbarkeitsbewertungen auf höchster Ebene zu Business Intelligence, Relevanzbewertung und Wertermittlung von Informationen (u. a. mit Dr. Bernd Ullrich Kaiser, damaliger Leiter Knowledge Management bei Bayer).
                        </p>
                      </div>

                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                        <div className="text-xl font-bold text-accent mb-2">💡</div>
                        <div className="font-semibold text-foreground mb-2">Spezialist für förderfähige Digitalisierungsprojekte</div>
                        <p className="text-sm text-muted-foreground">
                          Umfassendes Know-how bei EFRE, BAFA, INQA-Coaching, ZIM und weiteren Programmen – von der Antragstellung bis zur erfolgreichen Abrechnung.
                        </p>
                      </div>
                    </div>

                    <div className="bg-accent/10 rounded-xl p-6 border-l-4 border-accent">
                      <p className="text-foreground font-medium mb-2">Ergebnisorientiert & marktnah</p>
                      <p className="text-muted-foreground">
                        Er konzipiert nicht nur – er setzt um, verkauft und macht Projekte profitabel.
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/50">
                      <p className="text-lg text-foreground italic">
                        „Wer einen Partner sucht, der seit über drei Jahrzehnten Technologie auf höchstem Niveau diskutiert, entwickelt und vor allem verkauft – ist bei Carsten van de Sand genau richtig."
                      </p>
                    </div>
                  </div>
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

      <Footer />
    </>
  );
};

export default Hintergrund;
