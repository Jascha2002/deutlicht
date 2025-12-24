import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Cog, 
  Globe, 
  FileText,
  Users,
  Building2,
  Target,
  MessageSquare,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

const Schnelluebersicht = () => {
  return (
    <>
      <Helmet>
        <title>Schnellübersicht | DeutLicht® - Klarheit für digitale Entscheidungen</title>
        <meta
          name="description"
          content="DeutLicht® steht für Struktur, Orientierung und umsetzbare Digitalisierung. Erfahren Sie alles Wichtige auf einen Blick."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                DeutLicht®
              </h1>
              
              <p className="text-2xl md:text-3xl text-accent font-medium mb-6">
                Klarheit für digitale Entscheidungen
              </p>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Digitale Projekte scheitern selten an Technik – sondern an fehlender Klarheit. 
                DeutLicht® steht für Struktur, Orientierung und umsetzbare Digitalisierung. 
                Wir helfen Unternehmen, Prozesse zu verstehen, Systeme sinnvoll zu verknüpfen 
                und digitale Lösungen so einzusetzen, dass sie messbar wirken.
              </p>
              
              <p className="text-lg text-accent font-semibold italic">
                Nicht lauter. Sondern klarer.
              </p>
            </div>
          </div>
        </section>

        {/* Was wir für Sie tun */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Was wir für Sie tun
                  </h2>
                  <p className="text-muted-foreground">Kurzübersicht auf einen Blick</p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-3 gap-8">
                <ScrollReveal delay={0}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Cog className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Digitalisierung mit System
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Wir analysieren bestehende Abläufe, identifizieren Brüche und entwickeln 
                      daraus klare, tragfähige digitale Strukturen – vom ersten Prozess bis zur 
                      integrierten Lösung.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Web, CRM & Automatisierung
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Webseiten, Portale und Systeme sind kein Selbstzweck. Wir verbinden 
                      Webauftritt, Kundenprozesse und Automatisierung zu einem funktionierenden 
                      Gesamtsystem.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                      Beratung, die wirkt
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Über 25 Jahre Erfahrung in Digitalisierung, Prozessdenken und Systemlogik 
                      fließen in jede Beratung ein. Pragmatisch, verständlich und auf Augenhöhe.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Warum DeutLicht */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                      Warum DeutLicht®
                    </h2>
                    <div className="space-y-4">
                      {[
                        "Klar strukturierte Vorgehensweise statt Aktionismus",
                        "Menschlich, verständlich, nachvollziehbar",
                        "Fokus auf Nachhaltigkeit und langfristige Wirkung",
                        "Erfahrung aus Mittelstand, Projekten und gewachsenen Strukturen"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-lg">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-8 text-lg text-accent font-medium italic">
                      DeutLicht® ist kein Agenturversprechen – sondern ein Arbeitsprinzip.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                      Für wen wir arbeiten
                    </h3>
                    <div className="space-y-4">
                      {[
                        { icon: Building2, text: "Mittelständische Unternehmen" },
                        { icon: Users, text: "Selbstständige und Entscheider" },
                        { icon: Target, text: "Organisationen mit gewachsenen Strukturen" },
                        { icon: Cog, text: "Menschen, die Ordnung in digitale Prozesse bringen wollen" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-foreground">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Digitalisierung beginnt mit Verstehen */}
        <section className="py-16 md:py-20 gradient-gold">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
                Digitalisierung beginnt mit Verstehen
              </h2>
              <p className="text-xl text-accent-foreground/90 leading-relaxed mb-8">
                Ob Website, CRM, ERP oder Prozessberatung – der erste Schritt ist immer Klarheit. 
                Lassen Sie uns gemeinsam herausfinden, wo Sie stehen und was wirklich sinnvoll ist.
              </p>
              <Link to="/kontakt">
                <Button size="lg" variant="secondary" className="group">
                  Jetzt ins Gespräch kommen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dienstleistungen */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Dienstleistungen
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Digitalisierung mit Struktur statt Aktionismus
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-muted-foreground text-center max-w-4xl mx-auto mb-12 leading-relaxed">
                  DeutLicht® begleitet Unternehmen ganzheitlich durch ihre digitale Transformation. 
                  Wir denken Digitalisierung nicht als Einzelmaßnahme, sondern als Zusammenspiel aus 
                  Mensch, Prozess und System. Unsere Leistungen setzen dort an, wo Unklarheit, 
                  Reibungsverluste oder ineffiziente Abläufe entstehen.
                </p>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "1. Analyse & Klarheit",
                    description: "Wir beginnen immer mit dem Verstehen:",
                    items: [
                      "Analyse bestehender Prozesse",
                      "Identifikation von Medienbrüchen und Ineffizienzen",
                      "Bewertung digitaler Reifegrade"
                    ],
                    result: "Eine klare Ausgangsbasis für sinnvolle Entscheidungen."
                  },
                  {
                    title: "2. Systeme & Automatisierung",
                    description: "Wir konzipieren und implementieren:",
                    items: [
                      "CRM- und ERP-Strukturen",
                      "Automatisierte Workflows",
                      "Schnittstellen zwischen Website, Vertrieb und Abrechnung"
                    ],
                    result: "Weniger manuelle Arbeit, mehr Übersicht und Verlässlichkeit."
                  },
                  {
                    title: "3. Web, Sichtbarkeit & Leadprozesse",
                    description: "Websites und Online-Kanäle als Teil des Systems:",
                    items: [
                      "Strukturierte, professionelle Websites",
                      "Conversion-orientierte Inhalte",
                      "Saubere Lead-Erfassung und CRM-Integration"
                    ],
                    result: "Ein funktionierender digitaler Vertriebsweg."
                  },
                  {
                    title: "4. Förderfähige Digitalisierung",
                    description: "Dank Erfahrung in Förderprogrammen:",
                    items: [
                      "Auswahl geeigneter Fördermittel",
                      "Strukturierung förderfähiger Maßnahmen",
                      "Begleitung von Beratung und Umsetzung"
                    ],
                    result: "Bis zu 80% Förderung für Ihre Digitalisierung."
                  }
                ].map((service, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      <ul className="space-y-2 mb-4">
                        {service.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-accent font-medium text-sm">{service.result}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projekte */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Projekte
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Projekte mit klarer Systemlogik
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12 leading-relaxed">
                  Unsere Projekte folgen keiner Agentur-Show, sondern einer nachvollziehbaren Struktur. 
                  Jeder Schritt ist dokumentiert, messbar und in ein zentrales System eingebunden.
                </p>
              </ScrollReveal>

              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { step: "1", title: "Erstgespräch", desc: "Klärung von Ziel, Ausgangslage und Rahmenbedingungen." },
                  { step: "2", title: "Analyse", desc: "Prozessaufnahme, Priorisierung und Definition sinnvoller Hebel." },
                  { step: "3", title: "Systemaufbau", desc: "CRM, Projektstrukturen und Automatisierungen einrichten." },
                  { step: "4", title: "Umsetzung", desc: "Schrittweise Implementierung – verständlich und anpassbar." },
                  { step: "5", title: "Übergabe", desc: "Dokumentation, Schulung und langfristige Begleitung." }
                ].map((item, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <div className="bg-card rounded-xl p-6 shadow-lg border border-border text-center h-full">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        {item.step}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={500}>
                <p className="text-center text-accent font-medium mt-8 text-lg">
                  Ergebnis: Projekte, die nicht nur starten, sondern dauerhaft funktionieren.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Über uns */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                      Über uns
                    </h2>
                    <p className="text-xl text-accent font-medium mb-6">
                      Erfahrung. Haltung. Weitblick.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      DeutLicht® ist aus jahrzehntelanger Praxis entstanden. Aus Beratung, Umsetzung, 
                      Management und der täglichen Arbeit mit gewachsenen Unternehmensstrukturen.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Unsere Stärke liegt nicht im schnellen Tool-Wechsel, sondern im Verständnis 
                      für Zusammenhänge: Menschen, die mit Systemen arbeiten. Prozesse, die historisch 
                      gewachsen sind. Technik, die unterstützen soll – nicht dominieren.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                      Unsere Haltung
                    </h3>
                    <div className="space-y-4">
                      {[
                        "Klarheit vor Komplexität",
                        "Struktur vor Aktionismus",
                        "Nachhaltigkeit vor kurzfristigen Effekten"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 text-muted-foreground italic">
                      Wir glauben: Gute Digitalisierung fühlt sich ruhig an – weil sie funktioniert.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-primary-foreground">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    Kontakt
                  </h2>
                  <p className="text-xl mb-6">
                    Der nächste sinnvolle Schritt
                  </p>
                  <p className="text-primary-foreground/80 leading-relaxed mb-8">
                    Digitale Transformation beginnt nicht mit einem Tool, sondern mit einem Gespräch. 
                    Wenn Sie Orientierung suchen, Prozesse ordnen oder Systeme sinnvoll einsetzen möchten, 
                    laden wir Sie zu einem unverbindlichen Erstgespräch ein.
                  </p>

                  <div className="bg-primary-foreground/10 rounded-xl p-6 mb-8">
                    <h4 className="font-semibold mb-3">Förder-Hinweis</h4>
                    <p className="text-primary-foreground/80 text-sm leading-relaxed">
                      Viele unserer Leistungen sind förderfähig. Abhängig von Unternehmensgröße 
                      und Vorhaben können Zuschüsse von bis zu 80% möglich sein. Wir unterstützen 
                      bei Einordnung, Antrag und Strukturierung.
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-xl p-8 shadow-xl">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Kontaktmöglichkeiten
                  </h3>
                  <div className="space-y-4">
                    <a href="mailto:info@DeutLicht.de" className="flex items-center gap-4 text-foreground hover:text-accent transition-colors">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-accent" />
                      </div>
                      <span>info@DeutLicht.de</span>
                    </a>
                    <a href="tel:+491785549216" className="flex items-center gap-4 text-foreground hover:text-accent transition-colors">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <span>+49 178 5549216</span>
                    </a>
                    <div className="flex items-center gap-4 text-foreground">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <span>Gemeindeweg 4, 07546 Gera</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link to="/kontakt">
                      <Button className="w-full group">
                        Lassen Sie uns gemeinsam Klarheit schaffen
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Quote */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="text-center text-xl text-accent font-medium italic">
              DeutLicht® – Orientierung im digitalen Raum.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Schnelluebersicht;
