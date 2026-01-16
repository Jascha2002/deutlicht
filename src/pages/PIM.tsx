import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Package, ArrowRight, Globe, Zap, Database, 
  Layers, RefreshCw, CheckCircle2, ShoppingCart, FileText
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import leistungPim from "@/assets/leistung-pim.jpg";

const features = [
  {
    icon: Database,
    title: "Systemauswahl & Modellierung",
    description: "Wir finden das passende PIM-System und modellieren Ihre Produktdatenstruktur."
  },
  {
    icon: Globe,
    title: "Multi-Channel-Publishing",
    description: "Konsistente Produktdaten für Web, Print, Marktplätze und alle Verkaufskanäle."
  },
  {
    icon: ShoppingCart,
    title: "Webshop-Integration",
    description: "Nahtlose Anbindung an Shopify, WooCommerce, Magento und andere Systeme."
  },
  {
    icon: RefreshCw,
    title: "ERP-Integration",
    description: "Bidirektionaler Datenaustausch mit SAP, Dynamics, Odoo und weiteren ERP-Systemen."
  },
  {
    icon: CheckCircle2,
    title: "Datenqualitätsprüfung",
    description: "Automatisierte Validierung und Anreicherung Ihrer Produktdaten."
  },
  {
    icon: FileText,
    title: "Katalog-Automation",
    description: "Automatische Generierung von Print-Katalogen und Datenblättern."
  }
];

const benefits = [
  { text: "Konsistente Produktdaten über alle Kanäle hinweg", icon: Package },
  { text: "Multi-Channel-fähig für maximale Reichweite", icon: Globe },
  { text: "Schnellere Time-to-Market für neue Produkte", icon: Zap },
  { text: "Reduzierte Fehler durch zentrale Datenhaltung", icon: CheckCircle2 },
  { text: "Effizientere Prozesse durch Automatisierung", icon: RefreshCw },
  { text: "Skalierbare Lösung für wachsende Sortimente", icon: Layers }
];

const channels = [
  "Webshop",
  "Amazon",
  "eBay",
  "Print-Katalog",
  "Mobile App",
  "B2B-Portal",
  "Google Shopping",
  "Social Media"
];

const PIM = () => {
  return (
    <>
      <Helmet>
        <title>PIM Systeme | DeutLicht® - Product Information Management</title>
        <meta 
          name="description" 
          content="PIM-Systeme für konsistente Produktdaten über alle Verkaufskanäle. Multi-Channel-Publishing, Webshop-Integration und Datenqualitätsprüfung." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungPim} 
              alt="PIM Systeme" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Package className="w-5 h-5" />
                <span className="font-medium">Product Information Management</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                PIM Systeme
                <span className="text-accent"> für konsistente Produktdaten</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Zentrale Verwaltung Ihrer Produktinformationen für alle Verkaufskanäle – 
                vom Webshop über Marktplätze bis zum Print-Katalog.
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

        {/* Channels */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Ein System – alle Kanäle
                </h2>
              </div>
            </ScrollReveal>

            <div className="flex flex-wrap justify-center gap-4">
              {channels.map((channel, index) => (
                <ScrollReveal key={channel} delay={index * 50}>
                  <div className="px-6 py-3 bg-card rounded-full border border-border">
                    <span className="font-semibold text-foreground">{channel}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere PIM-Leistungen
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

        {/* Benefits */}
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
                Produktdaten unter Kontrolle
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam Ihre Produktdatenverwaltung optimieren.
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

export default PIM;
