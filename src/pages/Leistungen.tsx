import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Monitor, Cog, TrendingUp, Megaphone, ArrowRight, CheckCircle2, Zap, Database, ShoppingCart, Globe, BarChart3, Users, Bot, FileText, Coins, Building2, BookOpen, Package, Smartphone, Phone, Headphones, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import VoiceAgentDemo from "@/components/VoiceAgentDemo";
import voiceAgentHero from "@/assets/voice-agent-hero.jpg";
const services = [{
  id: "digitalisierung",
  icon: Monitor,
  title: "Digitalisierung",
  subtitle: "Strategische Transformation für Ihr Unternehmen",
  description: "Wir begleiten Sie bei der digitalen Transformation – von der Analyse bestehender Prozesse bis zur Implementierung moderner Lösungen. Mit über 25 Jahren Erfahrung verstehen wir die Herausforderungen und Chancen der Digitalisierung.",
  features: ["Prozessanalyse und Optimierung", "Digitalisierungsstrategie entwickeln", "Change Management begleiten", "Förderfähige Projekte identifizieren", "Schulung und Wissenstransfer"],
  benefits: [{
    icon: Zap,
    text: "Effizienzsteigerung um bis zu 40%"
  }, {
    icon: Coins,
    text: "Fördermittel bis zu 50% nutzen"
  }, {
    icon: Users,
    text: "Mitarbeiter erfolgreich einbinden"
  }]
}, {
  id: "crm-erp",
  icon: Cog,
  title: "CRM & ERP Systeme",
  subtitle: "Kundenmanagement und Unternehmenssteuerung",
  description: "Von der Auswahl über die Einführung bis zur Optimierung – wir implementieren CRM- und ERP-Systeme, die Ihre Geschäftsprozesse nahtlos unterstützen und messbare Ergebnisse liefern.",
  features: ["Bedarfsanalyse und Systemauswahl", "Individuelle Anpassung und Konfiguration", "Datenmigration und Integration", "Automatisierung von Workflows", "Training und Support"],
  benefits: [{
    icon: Database,
    text: "360° Kundenübersicht"
  }, {
    icon: Zap,
    text: "Automatisierte Prozesse"
  }, {
    icon: BarChart3,
    text: "Echtzeit-Reporting"
  }]
}, {
  id: "bim",
  icon: Building2,
  title: "BIM Systeme",
  subtitle: "Building Information Management für Bau & Immobilien",
  description: "Building Information Management (BIM) revolutioniert die Bau- und Immobilienbranche. Wir implementieren und integrieren BIM-Systeme, die alle Projektbeteiligten vernetzen und den gesamten Lebenszyklus eines Gebäudes digital abbilden.",
  features: ["BIM-Strategieberatung und Einführung", "3D-Modellierung und Datenmanagement", "Kollaborationsplattformen einrichten", "Integration mit ERP und Projektmanagement", "Schulung für alle Projektbeteiligten"],
  benefits: [{
    icon: Building2,
    text: "Transparente Projektabwicklung"
  }, {
    icon: Database,
    text: "Zentrale Datenhaltung"
  }, {
    icon: Zap,
    text: "Weniger Planungsfehler"
  }]
}, {
  id: "pim",
  icon: Package,
  title: "PIM Systeme",
  subtitle: "Product Information Management für den Handel",
  description: "Product Information Management (PIM) zentralisiert alle Produktdaten und sorgt für konsistente Informationen über alle Verkaufskanäle. Wir helfen bei der Auswahl, Implementierung und Integration von PIM-Systemen.",
  features: ["Anforderungsanalyse und Systemauswahl", "Produktdatenmodellierung", "Multi-Channel-Publishing", "Integration mit Webshop und ERP", "Automatisierte Datenqualitätsprüfung"],
  benefits: [{
    icon: Package,
    text: "Konsistente Produktdaten"
  }, {
    icon: Globe,
    text: "Multi-Channel-fähig"
  }, {
    icon: Zap,
    text: "Schnellere Time-to-Market"
  }]
}, {
  id: "wissensmanagement",
  icon: BookOpen,
  title: "Wissensmanagement",
  subtitle: "Unternehmenswissen systematisch erfassen und nutzen",
  description: "Wissen ist der wichtigste Rohstoff moderner Unternehmen. Wir implementieren Wissensmanagement-Systeme, die Erfahrungen, Prozesse und Know-how strukturiert erfassen, teilen und für die Zukunft sichern.",
  features: ["Wissensdatenbanken aufbauen", "Dokumentenmanagement-Systeme", "Onboarding- und Schulungsplattformen", "KI-gestützte Wissenssuche", "Prozessdokumentation"],
  benefits: [{
    icon: BookOpen,
    text: "Wissen nachhaltig sichern"
  }, {
    icon: Users,
    text: "Schnelleres Onboarding"
  }, {
    icon: Zap,
    text: "Effizientere Zusammenarbeit"
  }]
}, {
  id: "voice-agents",
  icon: Phone,
  title: "KI Voice Agents",
  subtitle: "Sprachgesteuerte Kundenservice-Automatisierung",
  description: "KI-gestützte Sprachassistenten revolutionieren Ihren Kundenservice. Unsere Voice Agents verstehen natürliche Sprache, beantworten Anfragen automatisch und sind rund um die Uhr erreichbar – mit Automatisierungsraten von bis zu 70%.",
  features: ["Natural Language Understanding (NLU)", "24/7 Erreichbarkeit ohne Wartezeiten", "Automatische Kundenidentifikation", "Nahtlose CRM-Integration", "Übergabe an Mitarbeiter bei Bedarf"],
  benefits: [{
    icon: Clock,
    text: "24/7 Verfügbarkeit"
  }, {
    icon: Headphones,
    text: "Bis zu 70% Automatisierung"
  }, {
    icon: Users,
    text: "98% Kundenzufriedenheit"
  }],
  hasVoiceDemo: true,
  hasAIAgentPage: true
}, {
  id: "selforder",
  icon: Smartphone,
  title: "Self-Order & 24/7 Lösungen",
  subtitle: "Digitale Bestell- und Bezahlsysteme mit chayns®",
  description: "Mit chayns® von Tobit bieten wir innovative Self-Order-Systeme für Gastronomie, Einzelhandel und 24/7-Geschäftsmodelle. Digitale Bestellung, kontaktlose Bezahlung und automatisierte Abläufe – alles aus einer Hand.",
  features: ["Self-Order-Terminals und Mobile Ordering", "Kontaktlose Bezahlung (Google Pay, etc.)", "24/7 Zugangssysteme via Bluetooth", "Reservierungs- und Ticketsysteme", "Integration in bestehende Systeme"],
  benefits: [{
    icon: Smartphone,
    text: "Moderne Kundenerfahrung"
  }, {
    icon: ShoppingCart,
    text: "Höhere Umsätze"
  }, {
    icon: Zap,
    text: "Automatisierte Abläufe"
  }],
  hasDetailPage: true
}, {
  id: "web",
  icon: Globe,
  title: "Websites & Shopsysteme",
  subtitle: "Responsive, skalierbare Weblösungen",
  description: "Professionelle Websites und E-Commerce-Lösungen, die nicht nur gut aussehen, sondern auch konvertieren. Mit direkter Anbindung an CRM-, ERP- und PIM-Systeme für maximale Effizienz.",
  features: ["Responsive Webdesign", "E-Commerce & Shopsysteme", "CMS-Implementierung", "API-Integrationen", "SEO-Optimierung"],
  benefits: [{
    icon: ShoppingCart,
    text: "Höhere Conversion-Rates"
  }, {
    icon: TrendingUp,
    text: "Messbare Ergebnisse"
  }, {
    icon: Cog,
    text: "Nahtlose Systemintegration"
  }]
}, {
  id: "marketing",
  icon: Megaphone,
  title: "Marketing & Social Media",
  subtitle: "KI-gestützte Kampagnen und Content-Strategien",
  description: "Nachhaltige Marketingstrategien, die Ihre Zielgruppe erreichen. Von Content-Planung über Performance-Tracking bis zur Leadgenerierung – alles aus einer Hand.",
  features: ["Social-Media-Strategie", "Content-Marketing & Planung", "Performance-Kampagnen", "KI-gestützte Optimierung", "Leadgenerierung"],
  benefits: [{
    icon: Bot,
    text: "KI-unterstützte Inhalte"
  }, {
    icon: Users,
    text: "Nachhaltige Reichweite"
  }, {
    icon: BarChart3,
    text: "Datengetriebene Entscheidungen"
  }]
}, {
  id: "foerderung",
  icon: FileText,
  title: "Förderberatung",
  subtitle: "Maximieren Sie Ihre Investitionen",
  description: "Als zertifizierte Berater unterstützen wir Sie bei der Identifikation und Beantragung von Fördermitteln für Ihre Digitalisierungsprojekte. So reduzieren Sie Ihre Investitionskosten erheblich.",
  features: ["Fördermittel-Check", "Antragsunterstützung", "Projektdokumentation", "Verwendungsnachweis", "Begleitung bis zur Auszahlung"],
  benefits: [{
    icon: Coins,
    text: "Bis zu 50% Förderung"
  }, {
    icon: FileText,
    text: "Professionelle Anträge"
  }, {
    icon: CheckCircle2,
    text: "Hohe Erfolgsquote"
  }]
}];
const Leistungen = () => {
  return <>
      <Helmet>
        <title>Leistungen | DeutLicht® - Digitalisierung, CRM, Web & Marketing</title>
        <meta name="description" content="Ganzheitliche Lösungen für digitale Transformation: Digitalisierung, CRM & ERP Systeme, Webentwicklung, Marketing und Förderberatung. Jetzt informieren!" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/5 bg-[#96b8cf]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <span className="text-accent font-xl uppercase tracking-widest text-sm bg-primary font-extrabold px-[16px]">
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
        <section className="py-8 border-y border-border sticky top-20 z-40 bg-accent">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {services.map(service => <a key={service.id} href={`#${service.id}`} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/80 shadow-md hover:shadow-lg transition-all text-sm font-medium text-accent">
                  <service.icon className="w-4 h-4" />
                  {service.title}
                </a>)}
            </div>
          </div>
        </section>

        {/* Services Detail Sections */}
        {services.map((service, index) => <section key={service.id} id={service.id} className={`py-20 md:py-24 ${index % 2 === 1 ? "bg-muted/30" : ""}`}>
            <div className="container mx-auto px-4 bg-primary-foreground">
              <div className="max-w-6xl mx-auto">
                <div className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Content */}
                  <ScrollReveal direction={index % 2 === 0 ? "left" : "right"} className={index % 2 === 1 ? "lg:order-2" : ""}>
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
                      {service.features.map((feature, i) => <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>)}
                    </div>

                    {/* Hint text */}
                    <p className="text-sm text-muted-foreground mb-3">
                      Kosten für Ihre Situation? → Jetzt Angebot erstellen
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link to="/kontakt">
                        <Button variant="outline" className="group">
                          Beratung anfragen
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/projektanfrage">
                        <Button className="group">
                          Projektanfrage stellen
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      {(service as any).hasDetailPage && <Link to="/leistungen/chayns-loesungen">
                          <Button variant="ghost" className="group text-accent">
                            Mehr erfahren
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>}
                      {(service as any).hasAIAgentPage && <Link to="/leistungen/ai-agenten">
                          <Button variant="ghost" className="group text-accent">
                            Alle AI Agenten entdecken
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>}
                    </div>
                  </ScrollReveal>

                  {/* Benefits Card */}
                  <ScrollReveal direction={index % 2 === 0 ? "right" : "left"} delay={200} className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="rounded-2xl p-8 shadow-lg border border-border bg-slate-400">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                        Ihre Vorteile
                      </h3>
                      <div className="space-y-6">
                        {service.benefits.map((benefit, i) => <div key={i} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent">
                              <benefit.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="pt-3">
                              <p className="text-foreground font-medium">{benefit.text}</p>
                            </div>
                          </div>)}
                      </div>
                    </div>

                    {/* BIM Video */}
                    {service.id === "bim" && <div className="mt-6 rounded-xl overflow-hidden shadow-lg border border-border">
                        <video autoPlay muted playsInline className="w-full max-h-48 object-cover" onEnded={e => {
                    const video = e.currentTarget;
                    const playCount = parseInt(video.dataset.playCount || "1");
                    if (playCount < 5) {
                      video.dataset.playCount = (playCount + 1).toString();
                      video.play();
                    }
                  }}>
                          <source src="/videos/deutlicht-bim.mp4" type="video/mp4" />
                        </video>
                      </div>}

                    {/* Voice Agent Demo */}
                    {(service as any).hasVoiceDemo && <div className="mt-6">
                        <VoiceAgentDemo />
                        
                        {/* Voice Agent Hero Image */}
                        <div className="mt-6 rounded-xl overflow-hidden shadow-lg border border-border">
                          <img src={voiceAgentHero} alt="KI Voice Agent Technologie" className="w-full h-48 object-cover" />
                        </div>
                        
                        {/* Use Cases */}
                        <div className="mt-6 bg-muted/30 rounded-xl p-6">
                          <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                            Typische Anwendungsfälle
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent" />
                              <span>Bestellstatus-Abfragen</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent" />
                              <span>Terminvereinbarungen</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent" />
                              <span>FAQ-Beantwortung</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent" />
                              <span>Kundenidentifikation</span>
                            </div>
                          </div>
                        </div>
                      </div>}

                    {/* Additional Info Card for some services */}
                    {service.id === "foerderung" && <div className="gradient-gold rounded-2xl p-8 shadow-xl mt-6">
                        <h4 className="font-display text-xl font-semibold text-accent-foreground mb-3">
                          Kostenloser Fördermittel-Check
                        </h4>
                        <p className="text-accent-foreground/90 text-sm leading-relaxed mb-4">
                          Prüfen Sie jetzt, welche Förderprogramme für Ihr Unternehmen in Frage kommen. 
                          Unverbindlich und kostenlos.
                        </p>
                        <Link to="/kontakt#anfrage-formular">
                          <Button variant="secondary" className="group">
                            Jetzt Anfrage stellen
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>}
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>)}

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für den nächsten Schritt?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Unsere Projektanfrage erstellt Ihnen in wenigen Minuten ein personalisiertes Angebot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projektanfrage">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Projektanfrage starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Direkt Kontakt aufnehmen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>;
};
export default Leistungen;