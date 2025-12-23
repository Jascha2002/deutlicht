import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Monitor, 
  Cog, 
  TrendingUp, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Database,
  ShoppingCart,
  Globe,
  BarChart3,
  Users,
  Bot,
  FileText,
  Coins
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "digitalisierung",
    icon: Monitor,
    title: "Digitalisierung",
    subtitle: "Strategische Transformation für Ihr Unternehmen",
    description: "Wir begleiten Sie bei der digitalen Transformation – von der Analyse bestehender Prozesse bis zur Implementierung moderner Lösungen. Mit über 25 Jahren Erfahrung verstehen wir die Herausforderungen und Chancen der Digitalisierung.",
    features: [
      "Prozessanalyse und Optimierung",
      "Digitalisierungsstrategie entwickeln",
      "Change Management begleiten",
      "Förderfähige Projekte identifizieren",
      "Schulung und Wissenstransfer"
    ],
    benefits: [
      { icon: Zap, text: "Effizienzsteigerung um bis zu 40%" },
      { icon: Coins, text: "Fördermittel bis zu 50% nutzen" },
      { icon: Users, text: "Mitarbeiter erfolgreich einbinden" }
    ]
  },
  {
    id: "crm-erp",
    icon: Cog,
    title: "CRM & ERP Systeme",
    subtitle: "Kundenmanagement und Unternehmenssteuerung",
    description: "Von der Auswahl über die Einführung bis zur Optimierung – wir implementieren CRM- und ERP-Systeme, die Ihre Geschäftsprozesse nahtlos unterstützen und messbare Ergebnisse liefern.",
    features: [
      "Bedarfsanalyse und Systemauswahl",
      "Individuelle Anpassung und Konfiguration",
      "Datenmigration und Integration",
      "Automatisierung von Workflows",
      "Training und Support"
    ],
    benefits: [
      { icon: Database, text: "360° Kundenübersicht" },
      { icon: Zap, text: "Automatisierte Prozesse" },
      { icon: BarChart3, text: "Echtzeit-Reporting" }
    ]
  },
  {
    id: "web",
    icon: Globe,
    title: "Websites & Shopsysteme",
    subtitle: "Responsive, skalierbare Weblösungen",
    description: "Professionelle Websites und E-Commerce-Lösungen, die nicht nur gut aussehen, sondern auch konvertieren. Mit direkter Anbindung an CRM-, ERP- und PIM-Systeme für maximale Effizienz.",
    features: [
      "Responsive Webdesign",
      "E-Commerce & Shopsysteme",
      "CMS-Implementierung",
      "API-Integrationen",
      "SEO-Optimierung"
    ],
    benefits: [
      { icon: ShoppingCart, text: "Höhere Conversion-Rates" },
      { icon: TrendingUp, text: "Messbare Ergebnisse" },
      { icon: Cog, text: "Nahtlose Systemintegration" }
    ]
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing & Social Media",
    subtitle: "KI-gestützte Kampagnen und Content-Strategien",
    description: "Nachhaltige Marketingstrategien, die Ihre Zielgruppe erreichen. Von Content-Planung über Performance-Tracking bis zur Leadgenerierung – alles aus einer Hand.",
    features: [
      "Social-Media-Strategie",
      "Content-Marketing & Planung",
      "Performance-Kampagnen",
      "KI-gestützte Optimierung",
      "Leadgenerierung"
    ],
    benefits: [
      { icon: Bot, text: "KI-unterstützte Inhalte" },
      { icon: Users, text: "Nachhaltige Reichweite" },
      { icon: BarChart3, text: "Datengetriebene Entscheidungen" }
    ]
  },
  {
    id: "foerderung",
    icon: FileText,
    title: "Förderberatung",
    subtitle: "Maximieren Sie Ihre Investitionen",
    description: "Als zertifizierte Berater unterstützen wir Sie bei der Identifikation und Beantragung von Fördermitteln für Ihre Digitalisierungsprojekte. So reduzieren Sie Ihre Investitionskosten erheblich.",
    features: [
      "Fördermittel-Check",
      "Antragsunterstützung",
      "Projektdokumentation",
      "Verwendungsnachweis",
      "Begleitung bis zur Auszahlung"
    ],
    benefits: [
      { icon: Coins, text: "Bis zu 50% Förderung" },
      { icon: FileText, text: "Professionelle Anträge" },
      { icon: CheckCircle2, text: "Hohe Erfolgsquote" }
    ]
  }
];

const Leistungen = () => {
  return (
    <>
      <Helmet>
        <title>Leistungen | DeutLicht® - Digitalisierung, CRM, Web & Marketing</title>
        <meta
          name="description"
          content="Ganzheitliche Lösungen für digitale Transformation: Digitalisierung, CRM & ERP Systeme, Webentwicklung, Marketing und Förderberatung. Jetzt informieren!"
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unsere Dienstleistungen
              </span>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 leading-tight">
                Ganzheitliche Lösungen für Ihre
                <span className="text-accent"> digitale Zukunft</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                DeutLicht® bietet umfassende Lösungen für digitale Transformation. 
                Von CRM- und ERP-Systemen über Websites und Shops bis hin zu 
                Social-Media-Strategien verbinden wir Technologie mit Mensch und Prozess.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-card border-y border-border sticky top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-accent/20 text-muted-foreground hover:text-accent transition-colors text-sm font-medium"
                >
                  <service.icon className="w-4 h-4" />
                  {service.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Services Detail Sections */}
        {services.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className={`py-20 md:py-24 ${index % 2 === 1 ? "bg-muted/30" : ""}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                        <service.icon className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                          {service.title}
                        </h2>
                        <p className="text-accent font-medium">{service.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link to="/kontakt">
                      <Button className="group">
                        Beratung anfragen
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>

                  {/* Benefits Card */}
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                        Ihre Vorteile
                      </h3>
                      <div className="space-y-6">
                        {service.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <benefit.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="pt-3">
                              <p className="text-foreground font-medium">{benefit.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info Card for some services */}
                    {service.id === "foerderung" && (
                      <div className="gradient-gold rounded-2xl p-8 shadow-xl mt-6">
                        <h4 className="font-display text-xl font-semibold text-accent-foreground mb-3">
                          Kostenloser Fördermittel-Check
                        </h4>
                        <p className="text-accent-foreground/90 text-sm leading-relaxed">
                          Prüfen Sie jetzt, welche Förderprogramme für Ihr Unternehmen in Frage kommen. 
                          Unverbindlich und kostenlos.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für den nächsten Schritt?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Lassen Sie uns gemeinsam herausfinden, wie wir Ihr Unternehmen 
                digital nach vorne bringen können.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Kostenlose Erstberatung
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projekte">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Referenzen ansehen
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

export default Leistungen;
