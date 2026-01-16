import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Cog, ArrowRight, Database, Zap, BarChart3, 
  Users, Settings, RefreshCw, Cloud, Shield,
  CheckCircle2, Layers, Globe, ExternalLink
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import crmErpDashboard from "@/assets/crm-erp-dashboard.jpg";

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

const odooFeatures = [
  "Integrierte Buchhaltung und Finanzen",
  "Vertrieb und CRM in einer Lösung",
  "Lagerverwaltung und Logistik",
  "E-Commerce und Point of Sale",
  "Projektmanagement und Zeiterfassung",
  "HR und Personalverwaltung",
  "Marketing-Automatisierung",
  "Über 30.000 Apps im Marketplace"
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
              src={crmErpDashboard}
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

        {/* Dashboard Image Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <img 
                    src={crmErpDashboard} 
                    alt="CRM & ERP Dashboard Übersicht" 
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center mt-4 text-muted-foreground">
                  Zentrale Steuerung aller Geschäftsprozesse in einem modernen Dashboard
                </p>
              </div>
            </ScrollReveal>
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

        {/* Expertise Section (replaces Systems) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                    <Layers className="w-5 h-5" />
                    <span className="font-medium">Unsere Expertise</span>
                  </div>
                  
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Das passende System für
                    <span className="text-accent"> Ihre Anforderungen</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Durch unsere langjährige Erfahrung kennen wir die Stärken und Schwächen verschiedenster 
                    CRM- und ERP-Lösungen. Ob Branchensoftware, Open-Source-Lösung oder etablierter 
                    Marktführer – wir finden gemeinsam mit Ihnen das System, das zu Ihren Prozessen, 
                    Ihrem Budget und Ihren Wachstumszielen passt.
                  </p>
                  
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    <strong className="text-foreground">Unser Ansatz:</strong> Wir beraten herstellerunabhängig 
                    und stellen Ihre Anforderungen in den Mittelpunkt. Dabei unterstützen wir Sie von der 
                    Bedarfsanalyse über die Implementierung bis hin zur Schulung Ihrer Mitarbeiter.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground">
                      Open Source
                    </div>
                    <div className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground">
                      Cloud-native
                    </div>
                    <div className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground">
                      On-Premise
                    </div>
                    <div className="px-4 py-2 bg-muted rounded-full text-sm font-medium text-foreground">
                      Hybrid
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-2xl p-8 border border-border">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Odoo – All-in-One Business Suite
                      </h3>
                      <p className="text-muted-foreground">Open Source ERP & CRM</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Odoo ist eine der führenden Open-Source-Lösungen für Unternehmen jeder Größe. 
                    Mit über 12 Millionen Nutzern weltweit bietet Odoo eine vollständig integrierte 
                    Suite aus mehr als 80 Geschäftsanwendungen – von CRM über ERP bis hin zu 
                    E-Commerce und Marketing.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {odooFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="https://www.odoo.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
                  >
                    Mehr über Odoo erfahren
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </ScrollReveal>
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
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
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
