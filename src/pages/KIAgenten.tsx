import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Bot, Brain, Search, FileCheck, Database, Workflow, 
  MessageSquare, Clock, Headphones, BarChart3, AlertTriangle,
  CheckCircle2, ArrowRight, Sparkles, Shield, Settings,
  Building2, Users, Briefcase, Landmark, Scale
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

// Images
import aiAgentenHeroBg from "@/assets/ai-agenten-hero-bg.jpg";
import techLlmKern from "@/assets/tech-llm-kern.jpg";
import techRagSystem from "@/assets/tech-rag-system.jpg";
import techToolIntegration from "@/assets/tech-tool-integration.jpg";
import usecaseProzessautomatisierung from "@/assets/usecase-prozessautomatisierung.jpg";
import usecaseKundenservice from "@/assets/usecase-kundenservice.jpg";
import usecaseWissensmanagement from "@/assets/usecase-wissensmanagement.jpg";

const agentCapabilities = [
  {
    icon: Search,
    title: "Informationen sammeln & auswerten",
  },
  {
    icon: Brain,
    title: "Entscheidungen vorbereiten",
  },
  {
    icon: Settings,
    title: "Digitale Tools & Schnittstellen nutzen",
  },
  {
    icon: Workflow,
    title: "Prozesse ausführen und überwachen",
  },
];

const useCaseAreas = [
  {
    icon: Workflow,
    title: "Prozessautomatisierung",
    image: usecaseProzessautomatisierung,
    items: [
      "Dokumentenprüfung & Datenerfassung",
      "Workflows zwischen CRM, ERP & Fachsoftware",
      "Regelbasierte Entscheidungen",
    ],
  },
  {
    icon: Headphones,
    title: "Service & Kommunikation",
    image: usecaseKundenservice,
    items: [
      "Digitale Assistenten für Bürger:innen & Kund:innen",
      "24/7 Erreichbarkeit ohne Personalbindung",
      "Vorqualifizierung & Fallanlage",
    ],
  },
  {
    icon: BarChart3,
    title: "Analyse & Monitoring",
    image: usecaseWissensmanagement,
    items: [
      "Recherchen über mehrere Datenquellen",
      "Berichte, Zusammenfassungen & Risikoanalysen",
      "Frühwarnsysteme & Kennzahlenüberwachung",
    ],
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Praxisnah statt theoretisch",
    description: "Wir entwickeln Agenten für reale Prozesse – nicht für Demos.",
  },
  {
    icon: Settings,
    title: "Systemoffen & integrierbar",
    description: "Anbindung an bestehende Software, APIs & Datenquellen.",
  },
  {
    icon: Shield,
    title: "Sicher & verantwortungsvoll",
    description: "Datenschutz, Nachvollziehbarkeit & Human-in-the-Loop optional integriert.",
  },
  {
    icon: Scale,
    title: "Skalierbar",
    description: "Vom Pilotprojekt bis zur organisationsweiten Lösung.",
  },
];

const techFeatures = [
  {
    icon: Brain,
    title: "Large Language & Reasoning Models",
    image: techLlmKern,
  },
  {
    icon: Database,
    title: "Externer Wissensspeicher (RAG / Datenbanken)",
    image: techRagSystem,
  },
  {
    icon: Settings,
    title: "Modulare Architektur & standardisierte Schnittstellen",
    image: techToolIntegration,
  },
];

const targetGroups = [
  { icon: Building2, title: "KMU & Mittelstand" },
  { icon: Landmark, title: "Verwaltungen & Kommunen" },
  { icon: Users, title: "Organisationen & Verbände" },
  { icon: Briefcase, title: "Dienstleister mit komplexen Abläufen" },
];

const KIAgenten = () => {
  return (
    <>
      <Helmet>
        <title>KI-Agenten für Unternehmen & Verwaltung | DeutLicht</title>
        <meta 
          name="description" 
          content="KI-Agenten automatisieren Prozesse, entlasten Teams und schaffen Klarheit. Jetzt Einsatzmöglichkeiten prüfen mit DeutLicht." 
        />
        <meta 
          name="keywords" 
          content="KI Agenten, KI Agenten Unternehmen, KI Agenten Verwaltung, Prozessautomatisierung KI, KI Automatisierung, Digitale Prozessoptimierung, autonome KI Systeme, KI Workflows, KI Agenten DSGVO, KI für Organisationen" 
        />
        <link rel="canonical" href="https://deutlicht.de/ki-agenten" />
        
        {/* Open Graph */}
        <meta property="og:title" content="KI-Agenten für Unternehmen & Verwaltung | DeutLicht" />
        <meta property="og:description" content="KI-Agenten automatisieren Prozesse, entlasten Teams und schaffen Klarheit. Jetzt Einsatzmöglichkeiten prüfen mit DeutLicht." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deutlicht.de/ki-agenten" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "KI-Agenten",
            "provider": {
              "@type": "Organization",
              "name": "DeutLicht",
              "url": "https://deutlicht.de"
            },
            "description": "KI-Agenten automatisieren Prozesse, entlasten Teams und schaffen Klarheit für Unternehmen und Verwaltungen.",
            "serviceType": "KI Automatisierung",
            "areaServed": "DE"
          })}
        </script>
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={aiAgentenHeroBg} 
              alt="KI-Agenten Technologie" 
              className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/30" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6 border border-accent/30">
                <Sparkles className="w-4 h-4" />
                Digitale Entlastung mit System
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                KI-Agenten, die Prozesse
                <span className="text-accent"> selbstständig erledigen.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-4">
                Mehr Klarheit. Weniger Aufwand. Digitale Entlastung mit System.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
                Automatisieren Sie komplexe Abläufe, entlasten Sie Mitarbeitende und schaffen Sie 
                messbaren Mehrwert – mit intelligenten KI-Agenten von DeutLicht.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ki-check">
                  <Button size="lg" className="group w-full sm:w-auto">
                    <Search className="mr-2 w-5 h-5" />
                    Bedarf klären
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leistungen/ki-branchen-loesungen">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Branchenlösungen entdecken
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Explanation */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
                KI-Agenten sind mehr als Chatbots.
              </h2>
              <p className="text-lg text-primary-foreground/90 leading-relaxed mb-8">
                Sie analysieren Informationen, planen eigenständig Arbeitsschritte, nutzen vorhandene 
                Systeme und setzen Prozesse automatisiert um – sicher, nachvollziehbar und DSGVO-konform.
              </p>
              <Link 
                to="/leistungen/ki-branchen-loesungen" 
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
              >
                👉 Ideal für Unternehmen, Organisationen & öffentliche Einrichtungen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* What are KI-Agenten */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Grundlagen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Was sind KI-Agenten?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                KI-Agenten sind begrenzt autonome KI-Systeme, die ein definiertes Ziel verfolgen 
                und dabei selbstständig arbeiten:
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
              {agentCapabilities.map((cap, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 border border-border text-center h-full hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <cap.icon className="w-7 h-7 text-accent" />
                    </div>
                    <p className="text-foreground font-medium">{cap.title}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="text-center">
              <div className="bg-muted/50 rounded-xl p-8 max-w-2xl mx-auto">
                <p className="text-lg text-foreground font-medium">
                  Der Mensch gibt den Rahmen vor – der Agent übernimmt die operative Arbeit.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Use Case Areas */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Anwendungsbereiche
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Typische Einsatzbereiche
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {useCaseAreas.map((area, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl shadow-lg border border-border h-full overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={area.image} 
                        alt={area.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <area.icon className="w-5 h-5 text-accent" />
                          </div>
                          <h3 className="font-display text-xl font-bold text-primary-foreground">
                            {area.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {area.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why DeutLicht */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unsere Stärken
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Warum KI-Agenten mit DeutLicht?
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 border border-border h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
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

        {/* Technical Approach */}
        <section className="py-20 md:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Technologie
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Technischer Ansatz
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unsere KI-Agenten basieren auf bewährten, zukunftssicheren Technologien:
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {techFeatures.map((tech, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="relative rounded-xl overflow-hidden h-64 group">
                    <img 
                      src={tech.image} 
                      alt={tech.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <tech.icon className="w-5 h-5 text-accent" />
                        </div>
                        <p className="text-primary-foreground font-medium text-sm">
                          {tech.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                So bleiben Systeme wartbar, erweiterbar und zukunftssicher.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Target Groups */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Zielgruppen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Für wen eignen sich KI-Agenten?
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {targetGroups.map((group, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <group.icon className="w-7 h-7 text-accent" />
                    </div>
                    <p className="text-foreground font-medium text-sm">{group.title}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Sie möchten wissen, ob KI-Agenten für Ihren<br className="hidden md:block" /> 
                Anwendungsfall sinnvoll sind?
              </h2>
              
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                Unser digitaler KI-Check zeigt in wenigen Minuten:
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                {[
                  "Welche Automatisierung möglich ist",
                  "Wo der größte Hebel liegt",
                  "Wie der Einstieg aussehen kann",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-primary-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ki-check">
                  <Button 
                    size="lg" 
                    className="group w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Search className="mr-2 w-5 h-5" />
                    Jetzt Bedarf klären
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projektanfrage">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Klarheit gewinnen
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Internal Links */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/leistungen/voicebot-demos">
                <Button variant="ghost" className="text-muted-foreground hover:text-accent">
                  → Voicebots entdecken
                </Button>
              </Link>
              <Link to="/leistungen/digitalisierung">
                <Button variant="ghost" className="text-muted-foreground hover:text-accent">
                  → Digitalstrategie
                </Button>
              </Link>
              <Link to="/leistungen/ki-agenten">
                <Button variant="ghost" className="text-muted-foreground hover:text-accent">
                  → Automatisierung verstehen
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default KIAgenten;
