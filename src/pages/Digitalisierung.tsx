import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Monitor, ArrowRight, Zap, Coins, Users, 
  CheckCircle2, TrendingUp, RefreshCw, Settings,
  Target, BarChart3, Layers, Lightbulb, Rocket
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import digitalisierungHero from "@/assets/digitalisierung-hero.jpg";
import digitalisierungProzesse from "@/assets/digitalisierung-prozesse.jpg";

const features = [
  {
    icon: Target,
    title: "Prozessanalyse & Optimierung",
    description: "Wir identifizieren Schwachstellen in Ihren Abläufen und entwickeln konkrete Verbesserungsmaßnahmen für messbare Effizienzgewinne."
  },
  {
    icon: Lightbulb,
    title: "Digitalisierungsstrategie",
    description: "Gemeinsam erarbeiten wir eine maßgeschneiderte Roadmap, die Ihre Unternehmensziele mit digitalen Lösungen verbindet."
  },
  {
    icon: Users,
    title: "Change Management",
    description: "Wir begleiten Ihre Mitarbeiter durch den Wandel – mit Schulungen, Workshops und kontinuierlicher Unterstützung."
  },
  {
    icon: Coins,
    title: "Fördermittelberatung",
    description: "Wir identifizieren passende Förderprogramme und unterstützen Sie bei der Antragstellung für maximale Förderquoten."
  },
  {
    icon: Settings,
    title: "Systemintegration",
    description: "Nahtlose Verbindung Ihrer bestehenden Systeme mit neuen digitalen Lösungen für durchgängige Prozesse."
  },
  {
    icon: RefreshCw,
    title: "Kontinuierliche Betreuung",
    description: "Auch nach der Implementierung stehen wir Ihnen mit Support, Updates und Weiterentwicklung zur Seite."
  }
];

const benefits = [
  { 
    icon: Zap, 
    title: "Effizienzsteigerung bis zu 40%",
    description: "Automatisierte Workflows und optimierte Prozesse reduzieren manuelle Arbeit und Fehlerquoten."
  },
  { 
    icon: Coins, 
    title: "Fördermittel bis 80% nutzen",
    description: "Je nach Bundesland und Programm können Sie erhebliche Zuschüsse für Ihre Digitalisierungsprojekte erhalten."
  },
  { 
    icon: Users, 
    title: "Mitarbeiter erfolgreich einbinden",
    description: "Strukturierte Schulungen und Begleitung sorgen für hohe Akzeptanz und schnelle Produktivität."
  },
  { 
    icon: TrendingUp, 
    title: "Zukunftssichere Investition",
    description: "Skalierbare Lösungen, die mit Ihrem Unternehmen wachsen und auf neue Anforderungen reagieren können."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Ist-Analyse",
    description: "Bestandsaufnahme Ihrer aktuellen Prozesse, Systeme und Herausforderungen."
  },
  {
    step: "02",
    title: "Strategie & Konzeption",
    description: "Entwicklung einer individuellen Digitalisierungsstrategie mit klaren Zielen und Meilensteinen."
  },
  {
    step: "03",
    title: "Fördermittel-Check",
    description: "Prüfung relevanter Förderprogramme und Unterstützung bei der Antragstellung."
  },
  {
    step: "04",
    title: "Implementierung",
    description: "Schrittweise Umsetzung mit regelmäßigen Reviews und Anpassungen."
  },
  {
    step: "05",
    title: "Schulung & Go-Live",
    description: "Umfassende Einarbeitung Ihrer Mitarbeiter und begleiteter Produktivstart."
  },
  {
    step: "06",
    title: "Optimierung & Support",
    description: "Kontinuierliche Betreuung, Erfolgsmessung und Weiterentwicklung."
  }
];

const Digitalisierung = () => {
  return (
    <>
      <Helmet>
        <title>Digitalisierung | DeutLicht® - Strategische Transformation für Ihr Unternehmen</title>
        <meta 
          name="description" 
          content="Digitale Transformation mit bis zu 80% Förderung. Prozessanalyse, Strategie, Change Management und Implementierung aus einer Hand." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={digitalisierungHero} 
              alt="Digitalisierung" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Monitor className="w-5 h-5" />
                <span className="font-medium">Digitale Transformation</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Digitalisierung mit
                <span className="text-accent"> Strategie & Förderung</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Wir begleiten Sie bei der digitalen Transformation – von der Analyse bestehender Prozesse 
                bis zur erfolgreichen Implementierung moderner Lösungen. Mit bis zu 80% Förderung möglich.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenlose Erstberatung
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leistungen/foerderberatung">
                  <Button size="lg" variant="outline" className="px-8">
                    Zur Förderberatung
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ihre Vorteile auf einen Blick
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Digitalisierung schafft messbare Mehrwerte für Ihr Unternehmen
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all h-full">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <ScrollReveal>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                    <Layers className="w-5 h-5" />
                    <span className="font-medium">Unser Leistungsspektrum</span>
                  </div>
                  
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Ganzheitliche Begleitung
                    <span className="text-accent"> Ihrer Transformation</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Digitalisierung ist mehr als nur Technik. Wir verstehen uns als Partner, der Sie strategisch 
                    berät, Ihre Mitarbeiter mitnimmt und nachhaltige Lösungen implementiert. Von der ersten 
                    Idee bis zur erfolgreichen Umsetzung – und darüber hinaus.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                  <img 
                    src={digitalisierungProzesse} 
                    alt="Digitale Prozessoptimierung" 
                    className="w-full h-auto"
                  />
                </div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow h-full">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unser Vorgehen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Strukturiert, transparent und auf Ihre Bedürfnisse abgestimmt
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow h-full">
                    <div className="text-5xl font-bold text-accent/20 mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Förderung Highlight */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-transparent rounded-3xl p-8 md:p-12 border border-accent/30">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-accent mb-6">
                      <Coins className="w-5 h-5" />
                      <span className="font-medium">Fördermittel</span>
                    </div>
                    
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                      Bis zu 80% Förderung
                      <span className="text-accent"> für Ihre Projekte</span>
                    </h2>
                    
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Je nach Bundesland und Förderprogramm können Sie erhebliche Zuschüsse für Ihre 
                      Digitalisierungsvorhaben erhalten. Wir kennen die relevanten Programme und 
                      unterstützen Sie bei der Antragstellung – von der Beratung bis zur Auszahlung.
                    </p>

                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">Bundes- und Landesprogramme</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">Zertifizierte Förderberatung</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">Hohe Erfolgsquote bei Anträgen</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">Begleitung bis zur Auszahlung</span>
                      </li>
                    </ul>

                    <Link to="/leistungen/foerderberatung">
                      <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Mehr zur Förderberatung
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-accent/30 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl md:text-7xl font-bold text-accent">80%</div>
                          <div className="text-lg text-foreground font-medium">Förderung möglich</div>
                        </div>
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für die digitale Zukunft?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam Ihre Digitalisierungsstrategie entwickeln.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenlose Beratung
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/projektanfrage">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                    Projektanfrage starten
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Digitalisierung;
