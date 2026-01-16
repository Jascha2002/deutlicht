import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Cog, ArrowRight, Database, Zap, BarChart3, 
  Users, Settings, RefreshCw, Cloud, Shield
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import leistungCrmErp from "@/assets/leistung-crm-erp.jpg";

const features = [
  {
    icon: Settings,
    title: "Bedarfsanalyse & Systemauswahl",
    description: "Wir analysieren Ihre Anforderungen und finden das passende System für Ihr Unternehmen."
  },
  {
    icon: Cog,
    title: "Individuelle Anpassung",
    description: "Konfiguration und Customizing des Systems nach Ihren spezifischen Prozessen."
  },
  {
    icon: RefreshCw,
    title: "Datenmigration",
    description: "Sichere Überführung Ihrer bestehenden Daten ins neue System."
  },
  {
    icon: Cloud,
    title: "Cloud- oder On-Premise",
    description: "Flexible Deployment-Optionen je nach Ihren Anforderungen und Sicherheitsvorgaben."
  },
  {
    icon: Zap,
    title: "Workflow-Automatisierung",
    description: "Automatisieren Sie wiederkehrende Aufgaben und optimieren Sie Ihre Prozesse."
  },
  {
    icon: Shield,
    title: "Schulung & Support",
    description: "Umfassende Einarbeitung Ihrer Mitarbeiter und kontinuierlicher Support."
  }
];

const benefits = [
  { text: "360° Kundenübersicht für bessere Beziehungen", icon: Users },
  { text: "Automatisierte Prozesse sparen Zeit und Kosten", icon: Zap },
  { text: "Echtzeit-Reporting für fundierte Entscheidungen", icon: BarChart3 },
  { text: "Zentrale Datenhaltung verhindert Informationsverlust", icon: Database },
  { text: "Skalierbare Lösung, die mitwächst", icon: RefreshCw },
  { text: "Nahtlose Integration mit bestehenden Tools", icon: Cog }
];

const systems = [
  { name: "Salesforce", category: "CRM" },
  { name: "HubSpot", category: "CRM/Marketing" },
  { name: "Microsoft Dynamics", category: "CRM/ERP" },
  { name: "SAP Business One", category: "ERP" },
  { name: "Odoo", category: "ERP/CRM" },
  { name: "Pipedrive", category: "CRM" },
  { name: "Zoho", category: "CRM/Suite" },
  { name: "lexoffice/sevDesk", category: "Buchhaltung" }
];

const CrmErp = () => {
  return (
    <>
      <Helmet>
        <title>CRM & ERP Systeme | DeutLicht® - Kundenmanagement & Unternehmenssteuerung</title>
        <meta 
          name="description" 
          content="Auswahl, Einführung und Optimierung von CRM- und ERP-Systemen für nahtlose Geschäftsprozesse. Beratung, Migration und Support." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungCrmErp} 
              alt="CRM & ERP Systeme" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Cog className="w-5 h-5" />
                <span className="font-medium">Business Software</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                CRM & ERP Systeme
                <span className="text-accent"> für Ihr Wachstum</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Auswahl, Einführung und Optimierung von CRM- und ERP-Systemen 
                für nahtlose Geschäftsprozesse und bessere Kundenbeziehungen.
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

        {/* Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere Leistungen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Von der Analyse bis zum Go-Live und darüber hinaus
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

        {/* Systems */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Systeme, mit denen wir arbeiten
                </h2>
              </div>
            </ScrollReveal>

            <div className="flex flex-wrap justify-center gap-4">
              {systems.map((system, index) => (
                <ScrollReveal key={system.name} delay={index * 50}>
                  <div className="px-6 py-3 bg-card rounded-full border border-border">
                    <span className="font-semibold text-foreground">{system.name}</span>
                    <span className="text-muted-foreground ml-2 text-sm">({system.category})</span>
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
                Bereit für effizientere Geschäftsprozesse?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam das passende System für Ihr Unternehmen finden.
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

export default CrmErp;
