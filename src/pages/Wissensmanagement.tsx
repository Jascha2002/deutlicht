import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  BookOpen, ArrowRight, Users, Zap, Database, 
  Search, FileText, Brain, FolderTree, Share2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import wissensmanagementHeroBg from "@/assets/wissensmanagement-hero-bg.jpg";

const features = [
  {
    icon: Database,
    title: "Wissensdatenbanken",
    description: "Zentrale, durchsuchbare Wissensdatenbanken für strukturiertes Unternehmenswissen."
  },
  {
    icon: FileText,
    title: "Dokumentenmanagement",
    description: "Effiziente Verwaltung, Versionierung und Freigabe von Dokumenten."
  },
  {
    icon: Search,
    title: "KI-gestützte Wissenssuche",
    description: "Intelligente Suche, die Inhalte versteht und relevante Ergebnisse liefert."
  },
  {
    icon: Users,
    title: "Onboarding-Plattformen",
    description: "Strukturierte Einarbeitung neuer Mitarbeiter mit interaktiven Lernpfaden."
  },
  {
    icon: Brain,
    title: "KI-Assistenten",
    description: "Chatbots, die auf Ihr Unternehmenswissen zugreifen und Fragen beantworten."
  },
  {
    icon: Share2,
    title: "Kollaboration",
    description: "Gemeinsames Arbeiten an Wissen und nahtloser Austausch zwischen Teams."
  }
];

const benefits = [
  { text: "Wissen nachhaltig sichern und vor Verlust schützen", icon: Database },
  { text: "Schnelleres Onboarding für neue Mitarbeiter", icon: Users },
  { text: "Effizientere Zusammenarbeit zwischen Teams", icon: Share2 },
  { text: "Schnellere Entscheidungen durch besseren Zugang zu Informationen", icon: Zap },
  { text: "Reduzierte Suchzeiten durch intelligente Suche", icon: Search },
  { text: "Standardisierte Prozesse durch dokumentiertes Wissen", icon: FileText }
];

const useCases = [
  {
    title: "Interne Wissensdatenbank",
    description: "Zentraler Ort für Prozessdokumentation, FAQs und Best Practices.",
    icon: FolderTree
  },
  {
    title: "Mitarbeiter-Onboarding",
    description: "Strukturierte Einarbeitung mit Lernpfaden und Fortschrittstracking.",
    icon: Users
  },
  {
    title: "KI-Wissensassistent",
    description: "Chatbot, der Fragen zu Unternehmenswissen beantwortet.",
    icon: Brain
  },
  {
    title: "Projektdokumentation",
    description: "Nachvollziehbare Dokumentation von Projekten und Entscheidungen.",
    icon: FileText
  }
];

const Wissensmanagement = () => {
  return (
    <>
      <Helmet>
        <title>Wissensmanagement | DeutLicht® - KI-gestützte Wissenslösungen</title>
        <meta 
          name="description" 
          content="Wissensdatenbanken, Dokumentenmanagement und KI-gestützte Suche für effizientes Wissensmanagement in Ihrem Unternehmen." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={wissensmanagementHeroBg} 
              alt="Wissensmanagement" 
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
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Knowledge Management</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Wissensmanagement
                <span className="text-accent"> mit KI</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Unternehmenswissen systematisch erfassen, strukturieren und 
                für alle zugänglich machen – unterstützt durch künstliche Intelligenz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Jetzt beraten lassen
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

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere Lösungen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Moderne Tools für effizientes Wissensmanagement
                </p>
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

        {/* Use Cases */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Anwendungsfälle
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <ScrollReveal key={useCase.title} delay={index * 100}>
                  <div className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
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
                Wissen ist Macht – machen Sie es zugänglich
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam eine Wissensmanagement-Lösung für Ihr Unternehmen entwickeln.
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

export default Wissensmanagement;
