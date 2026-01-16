import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Building2, ArrowRight, Database, Zap, Users, 
  Layers, Eye, FileText, Share2, CheckCircle2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import leistungBim from "@/assets/leistung-bim.jpg";

const features = [
  {
    icon: Layers,
    title: "BIM-Strategieberatung",
    description: "Entwicklung einer maßgeschneiderten BIM-Strategie für Ihr Unternehmen."
  },
  {
    icon: Building2,
    title: "3D-Modellierung",
    description: "Erstellung und Verwaltung von 3D-Gebäudemodellen mit allen relevanten Informationen."
  },
  {
    icon: Database,
    title: "Datenmanagement",
    description: "Zentrale Verwaltung aller Projektdaten für alle Beteiligten."
  },
  {
    icon: Share2,
    title: "Kollaborationsplattformen",
    description: "Gemeinsame Arbeitsumgebungen für Architekten, Ingenieure und Auftraggeber."
  },
  {
    icon: FileText,
    title: "Dokumentation",
    description: "Automatisierte Dokumentenerstellung und -verwaltung aus dem BIM-Modell."
  },
  {
    icon: Eye,
    title: "Visualisierung",
    description: "Fotorealistische Renderings und virtuelle Begehungen für Präsentationen."
  }
];

const benefits = [
  { text: "Transparente Projektabwicklung für alle Beteiligten", icon: Eye },
  { text: "Zentrale Datenhaltung verhindert Informationsverlust", icon: Database },
  { text: "Weniger Planungsfehler durch 3D-Kollisionsprüfung", icon: CheckCircle2 },
  { text: "Bessere Kostenkontrolle durch verknüpfte Daten", icon: Zap },
  { text: "Effizientere Zusammenarbeit aller Gewerke", icon: Users },
  { text: "Nachhaltige Dokumentation für den Betrieb", icon: FileText }
];

const phases = [
  { phase: "Planung", description: "BIM-konforme Entwurfsplanung mit 3D-Modellen" },
  { phase: "Ausführung", description: "Koordination aller Gewerke im digitalen Modell" },
  { phase: "Betrieb", description: "Facility Management mit BIM-Daten" },
  { phase: "Umbau/Abriss", description: "Dokumentierte Grundlage für Änderungen" }
];

const BIM = () => {
  return (
    <>
      <Helmet>
        <title>BIM Systeme | DeutLicht® - Building Information Modeling</title>
        <meta 
          name="description" 
          content="BIM-Systeme für die Bau- und Immobilienbranche. 3D-Modellierung, Datenmanagement und Kollaborationsplattformen für effiziente Projektabwicklung." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungBim} 
              alt="BIM Systeme" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Building Information Modeling</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                BIM Systeme
                <span className="text-accent"> für die Baubranche</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Digitale Zwillinge Ihrer Bauprojekte – von der Planung über die Ausführung 
                bis zum Facility Management. Alle Projektbeteiligten vernetzt in einem System.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Beratung anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projektanfrage">
                  <Button size="lg" variant="outline" className="px-8">
                    Projektanfrage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full aspect-video object-cover"
                  >
                    <source src="/videos/deutlicht-bim.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere BIM-Leistungen
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
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

        {/* Lifecycle */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  BIM über den gesamten Lebenszyklus
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-4 gap-6">
              {phases.map((item, index) => (
                <ScrollReveal key={item.phase} delay={index * 100}>
                  <div className="text-center p-6 bg-card rounded-2xl border border-border">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {item.phase}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ihre Vorteile
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 50}>
                  <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-foreground">{benefit.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Starten Sie Ihre BIM-Transformation
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam Ihre Bauprojekte digitalisieren.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenlose Beratung
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/leistungen">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                    Alle Leistungen
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

export default BIM;
