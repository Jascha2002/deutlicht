import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Globe, ArrowRight, CheckCircle2, ShoppingCart, TrendingUp, 
  Cog, Smartphone, Code, Database, Zap, Users, BarChart3
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import leistungWebsites from "@/assets/leistung-websites.jpg";

const features = [
  {
    icon: Smartphone,
    title: "Responsive Webdesign",
    description: "Perfekte Darstellung auf allen Geräten – vom Smartphone bis zum Desktop."
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Shopsysteme",
    description: "Professionelle Online-Shops mit WooCommerce, Shopify oder individuellen Lösungen."
  },
  {
    icon: Code,
    title: "CMS-Implementierung",
    description: "WordPress, Webflow oder individuelle Content-Management-Systeme für einfache Pflege."
  },
  {
    icon: Database,
    title: "API-Integrationen",
    description: "Nahtlose Anbindung an CRM, ERP, PIM und weitere Systeme."
  },
  {
    icon: Zap,
    title: "Performance-Optimierung",
    description: "Blitzschnelle Ladezeiten für bessere Rankings und User Experience."
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    description: "Datenbasierte Insights für kontinuierliche Optimierung."
  }
];

const benefits = [
  { text: "Höhere Conversion-Rates durch optimierte User Experience", icon: TrendingUp },
  { text: "Messbare Ergebnisse durch integriertes Tracking", icon: BarChart3 },
  { text: "Nahtlose Systemintegration mit Ihren bestehenden Tools", icon: Cog },
  { text: "Mobile-First-Ansatz für maximale Reichweite", icon: Smartphone },
  { text: "SEO-optimierte Struktur für bessere Sichtbarkeit", icon: Globe },
  { text: "Skalierbare Architektur für zukünftiges Wachstum", icon: Users }
];

const process = [
  { step: "01", title: "Analyse", description: "Bedarfsanalyse und Zieldefinition" },
  { step: "02", title: "Konzeption", description: "Wireframes und UX-Design" },
  { step: "03", title: "Design", description: "Visuelles Design nach CI" },
  { step: "04", title: "Entwicklung", description: "Technische Umsetzung" },
  { step: "05", title: "Testing", description: "Qualitätssicherung & Launch" },
  { step: "06", title: "Optimierung", description: "Kontinuierliche Verbesserung" }
];

const Websites = () => {
  return (
    <>
      <Helmet>
        <title>Websites & Shopsysteme | DeutLicht® - Professionelle Weblösungen</title>
        <meta 
          name="description" 
          content="Professionelle Websites und E-Commerce-Lösungen, die konvertieren. Responsive Webdesign, CMS-Implementierung und API-Integrationen." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungWebsites} 
              alt="Websites & Shopsysteme" 
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
                <Globe className="w-5 h-5" />
                <span className="font-medium">Webentwicklung</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Websites & Shopsysteme
                <span className="text-accent"> die konvertieren</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Professionelle Websites und E-Commerce-Lösungen mit direkter Anbindung 
                an CRM-, ERP- und PIM-Systeme für maximale Effizienz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Projekt starten
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
                  Unsere Leistungen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Von der Konzeption bis zum Launch – alles aus einer Hand
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

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Ihre Vorteile
                  </h2>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <benefit.icon className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-foreground">{benefit.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Unser Prozess
                  </h3>
                  <div className="space-y-4">
                    {process.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für Ihre neue Website?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam Ihre Vision umsetzen – professionell und zukunftssicher.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenloses Erstgespräch
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

export default Websites;
