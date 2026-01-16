import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Coins, CheckCircle2, ClipboardCheck, Calendar, Shield, TrendingUp, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import foerderberatungHeroBg from "@/assets/foerderberatung-hero-bg.jpg";
import foerderungSymbol1 from "@/assets/foerderung-symbol-1.jpg";
import foerderungSymbol2 from "@/assets/foerderung-symbol-2.jpg";
const features = [{
  icon: ClipboardCheck,
  title: "Fördermittel-Check",
  description: "Kostenlose Analyse, welche Förderprogramme für Ihr Projekt in Frage kommen."
}, {
  icon: FileText,
  title: "Antragsunterstützung",
  description: "Professionelle Erstellung und Einreichung Ihrer Förderanträge."
}, {
  icon: Calendar,
  title: "Projektplanung",
  description: "Strukturierung Ihres Projekts nach Fördervorgaben und Meilensteinen."
}, {
  icon: Shield,
  title: "Compliance",
  description: "Sicherstellung aller formalen Anforderungen und Nachweispflichten."
}, {
  icon: TrendingUp,
  title: "Projektdokumentation",
  description: "Laufende Dokumentation für Verwendungsnachweise und Prüfungen."
}, {
  icon: Award,
  title: "Begleitung bis Auszahlung",
  description: "Vollständige Betreuung bis zur erfolgreichen Auszahlung der Fördermittel."
}];
const stats = [{
  value: "bis 80%",
  label: "der Beratungskosten",
  description: "können gefördert werden"
}, {
  value: "bis 50%",
  label: "der Projektkosten",
  description: "als Zuschuss möglich"
}, {
  value: "95%",
  label: "Erfolgsquote",
  description: "unserer Anträge"
}, {
  value: "100+",
  label: "Projekte",
  description: "erfolgreich gefördert"
}];
const Foerderberatung = () => {
  return <>
      <Helmet>
        <title>Förderberatung | DeutLicht® - Bis zu 80% der Beratungskosten gefördert</title>
        <meta name="description" content="Förderberatung für Digitalisierungsprojekte. Bis zu 80% der Beratungskosten und 50% der Projektkosten möglich. Wir finden das passende Förderprogramm für Sie." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={foerderberatungHeroBg} alt="Förderberatung" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Coins className="w-5 h-5" />
                <span className="font-medium">Fördermittel</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Förderberatung
                <span className="text-accent"> – Ihr Projekt gefördert</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Wir finden das passende Förderprogramm für Ihr Vorhaben und begleiten Sie von der Analyse bis zur Auszahlung.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-white px-8">
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
              {stats.map((stat, index) => <ScrollReveal key={index} delay={index * 100}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-accent-foreground">{stat.label}</div>
                    <div className="text-sm text-accent-foreground/80">{stat.description}</div>
                  </div>
                </ScrollReveal>)}
            </div>
          </div>
        </section>

        {/* About Funding Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Fördermöglichkeiten für Ihr Unternehmen
                  </h2>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="bg-card rounded-2xl p-8 border border-border space-y-6">
                  <div className="grid md:grid-cols-2 gap-8 items-center mb-6">
                    <div>
                      <img src={foerderungSymbol1} alt="Förderung Wachstum" className="w-full rounded-xl shadow-lg" />
                    </div>
                    <div>
                      <img src={foerderungSymbol2} alt="Antragsunterstützung" className="w-full rounded-xl shadow-lg" />
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    In Deutschland und Europa gibt es eine Vielzahl attraktiver Förderprogramme, die Unternehmen bei der Digitalisierung, der Einführung von ERP- und CRM-Systemen, Beratungsleistungen oder innovativen Softwarelösungen unterstützen. Viele dieser Programme bieten nicht rückzahlbare Zuschüsse (also echte Fördergelder, die nicht zurückgezahlt werden müssen) oder günstige Darlehen mit niedrigen Zinsen – je nach Projektgröße, Region und Unternehmensgröße.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Wir bei <span className="text-accent font-semibold">DeutLicht®</span> kennen die aktuellen Möglichkeiten genau und prüfen für Sie individuell, welches Programm am besten zu Ihrem Vorhaben passt. Ob es sich um eine Beratung zu Digitalisierungsstrategien, die Einführung neuer Software oder die Optimierung Ihrer Prozesse handelt – wir finden die passende Förderung und begleiten Sie bei der Antragstellung.
                  </p>

                  <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
                    <p className="text-lg text-foreground leading-relaxed">
                      <strong className="text-accent">Wichtig:</strong> Die Förderbedingungen und -quoten können je nach Bundesland oder Region stark variieren. Was in einem Land gut gefördert wird, ist in einem anderen vielleicht anders geregelt. Wir überprüfen für Sie die regionalen Besonderheiten und stellen sicher, dass Sie die maximale Förderung erhalten.
                    </p>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Kontaktieren Sie uns für eine <span className="text-accent font-semibold">kostenlose Erstberatung</span> – wir klären gemeinsam, wie viel Fördergeld Sie erhalten können und wie wir Ihr Projekt optimal aufstellen.
                  </p>
                </div>
              </ScrollReveal>
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
              {features.map((feature, index) => <ScrollReveal key={feature.title} delay={index * 100}>
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
                </ScrollReveal>)}
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
                {[{
                step: "1",
                title: "Kostenloser Förder-Check",
                description: "Wir analysieren Ihr Vorhaben und identifizieren passende Förderprogramme."
              }, {
                step: "2",
                title: "Strategie & Planung",
                description: "Gemeinsam strukturieren wir Ihr Projekt nach Fördervorgaben."
              }, {
                step: "3",
                title: "Antragstellung",
                description: "Wir erstellen und reichen Ihren Förderantrag professionell ein."
              }, {
                step: "4",
                title: "Projektumsetzung",
                description: "Sie setzen Ihr Projekt um – wir dokumentieren förderkonfom."
              }, {
                step: "5",
                title: "Auszahlung",
                description: "Nach Prüfung erhalten Sie Ihre Fördermittel ausgezahlt."
              }].map((item, index) => <ScrollReveal key={item.step} delay={index * 100}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>)}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center bg-primary-foreground">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8">
                    Kostenloser Förder-Check
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/leistungen">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8">
                    Alle Leistungen
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>;
};
export default Foerderberatung;