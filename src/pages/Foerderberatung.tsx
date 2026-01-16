import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  FileText, ArrowRight, Coins, CheckCircle2, 
  ClipboardCheck, Calendar, Shield, TrendingUp, Award
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import leistungFoerderung from "@/assets/leistung-foerderung.jpg";

const features = [
  {
    icon: ClipboardCheck,
    title: "Fördermittel-Check",
    description: "Kostenlose Analyse, welche Förderprogramme für Ihr Projekt in Frage kommen."
  },
  {
    icon: FileText,
    title: "Antragsunterstützung",
    description: "Professionelle Erstellung und Einreichung Ihrer Förderanträge."
  },
  {
    icon: Calendar,
    title: "Projektplanung",
    description: "Strukturierung Ihres Projekts nach Fördervorgaben und Meilensteinen."
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "Sicherstellung aller formalen Anforderungen und Nachweispflichten."
  },
  {
    icon: TrendingUp,
    title: "Projektdokumentation",
    description: "Laufende Dokumentation für Verwendungsnachweise und Prüfungen."
  },
  {
    icon: Award,
    title: "Begleitung bis Auszahlung",
    description: "Vollständige Betreuung bis zur erfolgreichen Auszahlung der Fördermittel."
  }
];

const programs = [
  { name: "Digital Jetzt", funding: "bis 50.000€", description: "Investitionen in digitale Technologien" },
  { name: "go-digital", funding: "bis 16.500€", description: "Digitalisierung für KMU" },
  { name: "BAFA Unternehmensberatung", funding: "bis 3.200€", description: "Geförderte Beratungsleistungen" },
  { name: "KfW Digitalisierungskredit", funding: "bis 25 Mio€", description: "Zinsgünstige Kredite" },
  { name: "Regionale Förderprogramme", funding: "variabel", description: "Landesspezifische Förderungen" },
  { name: "EU-Förderprogramme", funding: "variabel", description: "Europäische Förderungen" }
];

const stats = [
  { value: "50%", label: "Max. Förderung", description: "der Projektkosten" },
  { value: "95%", label: "Erfolgsquote", description: "unserer Anträge" },
  { value: "2-4", label: "Wochen", description: "Bearbeitungszeit" },
  { value: "100+", label: "Projekte", description: "erfolgreich gefördert" }
];

const Foerderberatung = () => {
  return (
    <>
      <Helmet>
        <title>Förderberatung | DeutLicht® - Bis zu 50% Förderung sichern</title>
        <meta 
          name="description" 
          content="Zertifizierte Förderberatung für Digitalisierungsprojekte. Bis zu 50% Förderung möglich. Fördermittel-Check, Antragsstellung und Begleitung." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungFoerderung} 
              alt="Förderberatung" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Coins className="w-5 h-5" />
                <span className="font-medium">Fördermittel</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Förderberatung
                <span className="text-accent"> – bis zu 50% sparen</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Maximieren Sie Ihre Investitionen durch staatliche Förderprogramme. 
                Wir begleiten Sie von der Analyse bis zur Auszahlung.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenlosen Förder-Check
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

        {/* Stats */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-accent-foreground">{stat.label}</div>
                    <div className="text-sm text-accent-foreground/80">{stat.description}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Förderprogramme im Überblick
                </h2>
                <p className="text-lg text-muted-foreground">
                  Wir finden das passende Programm für Ihr Vorhaben
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <ScrollReveal key={program.name} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {program.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                        {program.funding}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{program.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere Leistungen
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

        {/* Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  So funktioniert's
                </h2>
              </div>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  { step: "1", title: "Kostenloser Förder-Check", description: "Wir analysieren Ihr Vorhaben und identifizieren passende Förderprogramme." },
                  { step: "2", title: "Strategie & Planung", description: "Gemeinsam strukturieren wir Ihr Projekt nach Fördervorgaben." },
                  { step: "3", title: "Antragstellung", description: "Wir erstellen und reichen Ihren Förderantrag professionell ein." },
                  { step: "4", title: "Projektumsetzung", description: "Sie setzen Ihr Projekt um – wir dokumentieren förderkonfom." },
                  { step: "5", title: "Auszahlung", description: "Nach Prüfung erhalten Sie Ihre Fördermittel ausgezahlt." }
                ].map((item, index) => (
                  <ScrollReveal key={item.step} delay={index * 100}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Jetzt Fördermittel sichern
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Vereinbaren Sie Ihren kostenlosen Förder-Check und erfahren Sie, 
                wie viel Förderung für Ihr Projekt möglich ist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenloser Förder-Check
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

export default Foerderberatung;
