import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Target, 
  FileText,
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Eye,
  MousePointer,
  Zap,
  Award,
  LineChart,
  MapPin,
  Smartphone
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

import seoHeroBg from "@/assets/seo-hero-bg.jpg";

const seoServices = [
  {
    icon: Search,
    title: "Keyword-Analyse & Strategie",
    description: "Wir identifizieren die relevantesten Suchbegriffe für Ihr Unternehmen und entwickeln eine maßgeschneiderte SEO-Strategie.",
    features: [
      "Umfassende Keyword-Recherche",
      "Wettbewerbsanalyse",
      "Suchintention-Analyse",
      "Long-Tail-Keyword-Strategie"
    ]
  },
  {
    icon: FileText,
    title: "OnPage-Optimierung",
    description: "Technische und inhaltliche Optimierung Ihrer Website für bessere Rankings und Nutzererfahrung.",
    features: [
      "Meta-Tags & Strukturierte Daten",
      "Content-Optimierung",
      "Interne Verlinkung",
      "Core Web Vitals"
    ]
  },
  {
    icon: Globe,
    title: "OffPage-SEO",
    description: "Aufbau von Autorität und Vertrauen durch qualitativ hochwertige Backlinks und Online-Präsenz.",
    features: [
      "Linkbuilding-Strategie",
      "Local Citations",
      "Brand Mentions",
      "Digital PR"
    ]
  },
  {
    icon: MapPin,
    title: "Local SEO",
    description: "Optimieren Sie Ihre lokale Sichtbarkeit für Kunden in Ihrer Nähe.",
    features: [
      "Google Business Profile",
      "Lokale Keywords",
      "Bewertungsmanagement",
      "NAP-Konsistenz"
    ]
  }
];

const benefits = [
  { icon: Eye, title: "Mehr Sichtbarkeit", description: "Werden Sie von potenziellen Kunden gefunden" },
  { icon: Target, title: "Qualifizierter Traffic", description: "Besucher mit echtem Interesse an Ihrem Angebot" },
  { icon: TrendingUp, title: "Nachhaltige Ergebnisse", description: "Langfristige Rankings statt kurzfristiger Werbung" },
  { icon: MousePointer, title: "Höhere Klickraten", description: "Top-Positionen = mehr Klicks und Anfragen" },
  { icon: Award, title: "Vertrauensaufbau", description: "Gute Rankings stärken Ihre Glaubwürdigkeit" },
  { icon: LineChart, title: "Messbare Erfolge", description: "Transparente Reports und KPIs" }
];

const processSteps = [
  { step: 1, title: "Audit & Analyse", description: "Umfassende Analyse Ihrer aktuellen SEO-Performance und Identifikation von Optimierungspotenzialen" },
  { step: 2, title: "Strategie", description: "Entwicklung einer individuellen SEO-Strategie basierend auf Ihren Zielen und Ihrer Branche" },
  { step: 3, title: "Umsetzung", description: "Technische Optimierungen, Content-Erstellung und OffPage-Maßnahmen" },
  { step: 4, title: "Monitoring", description: "Kontinuierliches Tracking von Rankings, Traffic und Conversions" },
  { step: 5, title: "Optimierung", description: "Regelmäßige Anpassung der Strategie basierend auf Daten und Algorithmus-Updates" }
];

const stats = [
  { value: "68%", label: "aller Online-Erfahrungen beginnen mit einer Suchmaschine" },
  { value: "75%", label: "der Nutzer scrollen nie über Seite 1 hinaus" },
  { value: "14.6%", label: "Conversion-Rate bei SEO-Leads (vs. 1.7% bei Outbound)" },
  { value: "53%", label: "des Website-Traffics kommt über organische Suche" }
];

const SEO = () => {
  return (
    <>
      <Helmet>
        <title>SEO & Sichtbarkeit | DeutLicht® - Gefunden werden, wenn es zählt</title>
        <meta
          name="description"
          content="Professionelle Suchmaschinenoptimierung von DeutLicht®. Steigern Sie Ihre Online-Sichtbarkeit, gewinnen Sie qualifizierten Traffic und mehr Kunden durch bessere Rankings."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={seoHeroBg} 
              alt="SEO & Sichtbarkeit" 
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
                Suchmaschinenoptimierung
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                SEO & Sichtbarkeit:
                <span className="text-accent"> Gefunden werden</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Steigern Sie Ihre Online-Präsenz und werden Sie von potenziellen Kunden gefunden. 
                Mit professioneller Suchmaschinenoptimierung bringen wir Ihr Unternehmen auf die 
                erste Seite bei Google.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/angebotsgenerator">
                  <Button size="lg" className="group w-full sm:w-auto">
                    SEO-Analyse anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Kostenlose Beratung
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/80 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Services */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unsere Leistungen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Umfassende SEO-Services
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Von der Keyword-Analyse bis zum Linkbuilding – wir bieten alle SEO-Maßnahmen 
                aus einer Hand für nachhaltige Top-Rankings.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {seoServices.map((service, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                        <service.icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-foreground">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3">
                      {service.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Ihre Vorteile
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Warum SEO unverzichtbar ist
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 md:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unser Vorgehen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Der Weg zu Top-Rankings
              </h2>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                
                <div className="space-y-8">
                  {processSteps.map((step, i) => (
                    <ScrollReveal key={i} delay={i * 100}>
                      <div className="flex gap-6 items-start">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-accent-foreground font-display text-2xl font-bold relative z-10">
                          {step.step}
                        </div>
                        <div className="pt-3">
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  Warum DeutLicht®
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                  SEO mit Expertise & Transparenz
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Wir setzen auf nachhaltige SEO-Strategien statt kurzfristiger Tricks. 
                    Unser Team kombiniert technisches Know-how mit kreativem Content-Marketing 
                    für langfristige Erfolge.
                  </p>
                  <p>
                    Transparente Reporting-Dashboards zeigen Ihnen jederzeit den Fortschritt 
                    Ihrer SEO-Kampagne. Sie sehen genau, wie sich Rankings, Traffic und 
                    Conversions entwickeln.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-xl p-6">
                    <Zap className="w-8 h-8 text-accent mb-3" />
                    <h4 className="font-display text-lg font-semibold text-foreground mb-2">Schnelle Ergebnisse</h4>
                    <p className="text-sm text-muted-foreground">Quick Wins innerhalb von 4-8 Wochen sichtbar</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6">
                    <Smartphone className="w-8 h-8 text-accent mb-3" />
                    <h4 className="font-display text-lg font-semibold text-foreground mb-2">Mobile First</h4>
                    <p className="text-sm text-muted-foreground">Optimiert für die mobile Suche von Google</p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="right">
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <h3 className="font-display text-2xl font-bold mb-6">Kostenloser SEO-Check</h3>
                  <p className="mb-6 text-primary-foreground/80">
                    Erhalten Sie eine erste Einschätzung Ihrer Website-Performance und 
                    konkrete Handlungsempfehlungen – kostenlos und unverbindlich.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      "Technische Analyse Ihrer Website",
                      "Keyword-Potenzial-Check",
                      "Wettbewerbsvergleich",
                      "Konkrete Optimierungstipps"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/kontakt">
                    <Button size="lg" variant="secondary" className="w-full">
                      SEO-Check anfordern
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für bessere Rankings?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Lassen Sie uns gemeinsam Ihre Online-Sichtbarkeit verbessern. 
                Kontaktieren Sie uns für ein unverbindliches Erstgespräch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/angebotsgenerator">
                  <Button size="lg" className="group w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                    SEO-Projekt starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Beratungsgespräch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SEO;
