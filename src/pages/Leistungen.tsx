import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Monitor, Cog, TrendingUp, Megaphone, ArrowRight, CheckCircle2, 
  Zap, Database, ShoppingCart, Globe, BarChart3, Users, Bot, 
  FileText, Coins, Building2, BookOpen, Package, Smartphone, 
  Phone, Headphones, Clock, Search, GraduationCap, Lock, 
  Sparkles, Target, Eye, MessageSquare, Layers
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

// Import service images
import heroLeistungen from "@/assets/hero-leistungen.jpg";
import leistungKiAgenten from "@/assets/leistung-ki-agenten.jpg";
import leistungSeoNew from "@/assets/leistung-seo-new.jpg";
import leistungSchulung from "@/assets/leistung-schulung.jpg";
import leistungSchloesserRoboter from "@/assets/leistung-schloesser-roboter.jpg";
import leistungBranchenloesungenKi from "@/assets/leistung-branchenloesungen-ki.jpg";
import voiceAgentHero from "@/assets/voice-agent-hero.jpg";
import leistungWebsites from "@/assets/leistung-websites-new.jpg";
import leistungMarketing from "@/assets/leistung-marketing-new.jpg";
import leistungWissensmanagement from "@/assets/leistung-wissensmanagement.jpg";
import leistungSelforder from "@/assets/leistung-selforder.jpg";
import leistungCrmErp from "@/assets/crm-erp-dashboard.jpg";
import leistungBim from "@/assets/leistung-bim.jpg";
import leistungPim from "@/assets/leistung-pim.jpg";
import leistungFoerderung from "@/assets/leistung-foerderung-new.jpg";

// Service data with new order and structure
const services = [
  {
    id: "digitalisierung",
    icon: Monitor,
    title: "Digitalisierung",
    subtitle: "Strategische Transformation für Ihr Unternehmen",
    image: heroLeistungen,
    description: "Wir begleiten Sie bei der digitalen Transformation – von der Analyse bestehender Prozesse bis zur Implementierung moderner Lösungen.",
    features: [
      "Prozessanalyse und Optimierung",
      "Digitalisierungsstrategie entwickeln",
      "Change Management begleiten",
      "Förderfähige Projekte identifizieren"
    ],
    benefits: [
      { icon: Zap, text: "Effizienzsteigerung bis zu 40%" },
      { icon: Coins, text: "Fördermittel bis 80% nutzen" },
      { icon: Users, text: "Mitarbeiter erfolgreich einbinden" }
    ],
    link: "/leistungen/digitalisierung",
    detailLink: "/leistungen/digitalisierung"
  },
  {
    id: "websites",
    icon: Globe,
    title: "Websites & Shopsysteme",
    subtitle: "Responsive, skalierbare Weblösungen",
    image: leistungWebsites,
    description: "Professionelle Websites und E-Commerce-Lösungen, die konvertieren. Mit direkter Anbindung an CRM-, ERP- und PIM-Systeme.",
    features: [
      "Responsive Webdesign",
      "E-Commerce & Shopsysteme",
      "CMS-Implementierung",
      "API-Integrationen"
    ],
    benefits: [
      { icon: ShoppingCart, text: "Höhere Conversion-Rates" },
      { icon: TrendingUp, text: "Messbare Ergebnisse" },
      { icon: Cog, text: "Nahtlose Systemintegration" }
    ],
    link: "/leistungen/websites",
    detailLink: "/leistungen/websites"
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing & Social Media",
    subtitle: "KI-gestützte Kampagnen und Content",
    image: leistungMarketing,
    description: "Nachhaltige Marketingstrategien, die Ihre Zielgruppe erreichen. Von Content-Planung über Performance-Tracking bis zur Leadgenerierung.",
    features: [
      "Social-Media-Strategie",
      "Content-Marketing & Planung",
      "Performance-Kampagnen",
      "KI-gestützte Optimierung"
    ],
    benefits: [
      { icon: Bot, text: "KI-unterstützte Inhalte" },
      { icon: Users, text: "Nachhaltige Reichweite" },
      { icon: BarChart3, text: "Datengetriebene Entscheidungen" }
    ],
    link: "/leistungen/marketing",
    detailLink: "/leistungen/marketing"
  },
  {
    id: "branchenloesungen-ki",
    icon: Layers,
    title: "Branchenlösungen mit KI",
    subtitle: "Maßgeschneiderte KI für Ihre Branche",
    image: leistungBranchenloesungenKi,
    description: "Individuelle KI-Lösungen für Handel, Handwerk, Gastronomie, Gesundheit und mehr. Optimiert für Ihre spezifischen Anforderungen.",
    features: [
      "Branchenspezifische KI-Modelle",
      "Automatisierte Workflows",
      "Predictive Analytics",
      "Intelligente Empfehlungen"
    ],
    benefits: [
      { icon: Target, text: "Passgenaue Lösungen" },
      { icon: Sparkles, text: "Wettbewerbsvorteile" },
      { icon: Zap, text: "Schnelle Implementierung" }
    ],
    link: "/branchen",
    detailLink: "/branchen"
  },
  {
    id: "ki-agenten",
    icon: Bot,
    title: "KI-Agenten",
    subtitle: "Intelligente Automatisierung & Assistenten",
    image: leistungKiAgenten,
    description: "Autonome KI-Agenten, die komplexe Aufgaben selbstständig erledigen, von Datenanalyse bis Kundeninteraktion.",
    features: [
      "Autonome Aufgabenbearbeitung",
      "Multimodale Interaktion",
      "Kontinuierliches Lernen",
      "Nahtlose Systemintegration"
    ],
    benefits: [
      { icon: Bot, text: "24/7 verfügbare Assistenten" },
      { icon: Zap, text: "Automatisierung bis 80%" },
      { icon: Target, text: "Präzise Ergebnisse" }
    ],
    link: "/leistungen/ki-agenten",
    detailLink: "/leistungen/ki-agenten"
  },
  {
    id: "voice-agents",
    icon: Phone,
    title: "KI Voice Agents",
    subtitle: "Sprachgesteuerte Kundenservice-Automatisierung",
    image: voiceAgentHero,
    description: "KI-gestützte Sprachassistenten, die natürliche Sprache verstehen, Anfragen automatisch beantworten und 24/7 erreichbar sind.",
    features: [
      "Natural Language Understanding",
      "24/7 ohne Wartezeiten",
      "Automatische Kundenidentifikation",
      "CRM-Integration"
    ],
    benefits: [
      { icon: Clock, text: "24/7 Verfügbarkeit" },
      { icon: Headphones, text: "Bis zu 70% Automatisierung" },
      { icon: Users, text: "98% Kundenzufriedenheit" }
    ],
    link: "/leistungen/voicebot-demos",
    detailLink: "/leistungen/ki-agenten"
  },
  {
    id: "seo",
    icon: Search,
    title: "SEO & Sichtbarkeit",
    subtitle: "Gefunden werden, wenn es zählt",
    image: leistungSeoNew,
    description: "Nachhaltige Suchmaschinenoptimierung für mehr organische Reichweite, bessere Rankings und qualifizierte Besucher.",
    features: [
      "Technische SEO-Optimierung",
      "Content-Strategie & Keywords",
      "Lokale SEO für regionale Sichtbarkeit",
      "Performance-Monitoring"
    ],
    benefits: [
      { icon: Eye, text: "Mehr organische Reichweite" },
      { icon: TrendingUp, text: "Bessere Rankings" },
      { icon: Target, text: "Qualifizierte Besucher" }
    ],
    link: "/leistungen/seo",
    detailLink: "/leistungen/seo"
  },
  {
    id: "schulung",
    icon: GraduationCap,
    title: "Schulung & Beratung",
    subtitle: "Wissen vermitteln, Kompetenz aufbauen",
    image: leistungSchulung,
    description: "Praxisnahe Schulungen und strategische Beratung für Ihr Team. Von Digitalisierung über KI bis hin zu spezifischen Tools.",
    features: [
      "Individuelle Schulungskonzepte",
      "Workshops & Trainings",
      "Strategieberatung",
      "Change-Begleitung"
    ],
    benefits: [
      { icon: Users, text: "Kompetente Mitarbeiter" },
      { icon: Zap, text: "Schnelle Umsetzung" },
      { icon: Target, text: "Nachhaltige Ergebnisse" }
    ],
    link: "/leistungen/schulung",
    detailLink: "/leistungen/schulung"
  },
  {
    id: "wissensmanagement",
    icon: BookOpen,
    title: "Wissensmanagement",
    subtitle: "Unternehmenswissen systematisch nutzen",
    image: leistungWissensmanagement,
    description: "Wissensdatenbanken, Dokumentenmanagement und KI-gestützte Suche für effizientes Wissensmanagement.",
    features: [
      "Wissensdatenbanken aufbauen",
      "Dokumentenmanagement",
      "KI-gestützte Wissenssuche",
      "Onboarding-Plattformen"
    ],
    benefits: [
      { icon: BookOpen, text: "Wissen nachhaltig sichern" },
      { icon: Users, text: "Schnelleres Onboarding" },
      { icon: Zap, text: "Effizientere Zusammenarbeit" }
    ],
    link: "/leistungen/wissensmanagement",
    detailLink: "/leistungen/wissensmanagement"
  },
  {
    id: "selforder",
    icon: Smartphone,
    title: "Self-Order & 24/7 Lösungen",
    subtitle: "Digitale Bestell- und Bezahlsysteme",
    image: leistungSelforder,
    description: "Self-Order-Systeme für Gastronomie, Einzelhandel und 24/7-Geschäftsmodelle mit chayns® von Tobit.",
    features: [
      "Self-Order-Terminals & Mobile Ordering",
      "Kontaktlose Bezahlung",
      "24/7 Zugangssysteme via Bluetooth",
      "Reservierungs- und Ticketsysteme"
    ],
    benefits: [
      { icon: Smartphone, text: "Moderne Kundenerfahrung" },
      { icon: ShoppingCart, text: "Höhere Umsätze" },
      { icon: Zap, text: "Automatisierte Abläufe" }
    ],
    link: "/leistungen/chayns-loesungen",
    detailLink: "/leistungen/chayns-loesungen"
  },
  {
    id: "schloesser-roboter",
    icon: Lock,
    title: "Schlösser & Roboter",
    subtitle: "Smarte Zugangslösungen & Serviceroboter",
    image: leistungSchloesserRoboter,
    description: "Bluetooth-Schlösser, digitale Zugangssysteme und Serviceroboter für Hotels, Büros und 24/7-Konzepte.",
    features: [
      "Bluetooth-Schlösser & Smart Locks",
      "Digitale Zugangskontrolle",
      "Serviceroboter-Integration",
      "Automatisierte Check-in/Check-out"
    ],
    benefits: [
      { icon: Lock, text: "Sichere Zugangskontrolle" },
      { icon: Bot, text: "Automatisierter Service" },
      { icon: Clock, text: "24/7 Betrieb" }
    ],
    link: "/leistungen/chayns-hardware",
    detailLink: "/leistungen/chayns-hardware"
  },
  {
    id: "crm-erp",
    icon: Cog,
    title: "CRM & ERP Systeme",
    subtitle: "Kundenmanagement & Unternehmenssteuerung",
    image: leistungCrmErp,
    description: "Auswahl, Einführung und Optimierung von CRM- und ERP-Systemen für nahtlose Geschäftsprozesse.",
    features: [
      "Bedarfsanalyse & Systemauswahl",
      "Individuelle Anpassung",
      "Datenmigration & Integration",
      "Workflow-Automatisierung"
    ],
    benefits: [
      { icon: Database, text: "360° Kundenübersicht" },
      { icon: Zap, text: "Automatisierte Prozesse" },
      { icon: BarChart3, text: "Echtzeit-Reporting" }
    ],
    link: "/leistungen/crm-erp",
    detailLink: "/leistungen/crm-erp"
  },
  {
    id: "bim",
    icon: Building2,
    title: "BIM Systeme",
    subtitle: "Building Information Management",
    image: leistungBim,
    description: "BIM-Systeme für die Bau- und Immobilienbranche, die alle Projektbeteiligten vernetzen.",
    features: [
      "BIM-Strategieberatung",
      "3D-Modellierung & Datenmanagement",
      "Kollaborationsplattformen",
      "ERP-Integration"
    ],
    benefits: [
      { icon: Building2, text: "Transparente Projektabwicklung" },
      { icon: Database, text: "Zentrale Datenhaltung" },
      { icon: Zap, text: "Weniger Planungsfehler" }
    ],
    link: "/leistungen/bim",
    detailLink: "/leistungen/bim",
    hasVideo: true,
    videoSrc: "/videos/deutlicht-bim.mp4"
  },
  {
    id: "pim",
    icon: Package,
    title: "PIM Systeme",
    subtitle: "Product Information Management",
    image: leistungPim,
    description: "PIM-Systeme für konsistente Produktdaten über alle Verkaufskanäle hinweg.",
    features: [
      "Systemauswahl & Modellierung",
      "Multi-Channel-Publishing",
      "Webshop & ERP-Integration",
      "Automatisierte Datenqualitätsprüfung"
    ],
    benefits: [
      { icon: Package, text: "Konsistente Produktdaten" },
      { icon: Globe, text: "Multi-Channel-fähig" },
      { icon: Zap, text: "Schnellere Time-to-Market" }
    ],
    link: "/leistungen/pim",
    detailLink: "/leistungen/pim"
  },
  {
    id: "foerderung",
    icon: FileText,
    title: "Förderberatung",
    subtitle: "Maximieren Sie Ihre Investitionen",
    image: leistungFoerderung,
    description: "Zertifizierte Beratung für Fördermittel Ihrer Digitalisierungsprojekte. Bis zu 50% Förderung möglich.",
    features: [
      "Fördermittel-Check",
      "Antragsunterstützung",
      "Projektdokumentation",
      "Begleitung bis Auszahlung"
    ],
    benefits: [
      { icon: Coins, text: "Bis zu 50% Förderung" },
      { icon: FileText, text: "Professionelle Anträge" },
      { icon: CheckCircle2, text: "Hohe Erfolgsquote" }
    ],
    link: "/leistungen/foerderberatung",
    detailLink: "/leistungen/foerderberatung",
    isHighlighted: true
  }
];

// Quick access buttons for prominent services
const quickAccessButtons = [
  { label: "KI-Agenten", link: "/leistungen/ki-agenten", icon: Bot },
  { label: "SEO & Sichtbarkeit", link: "/leistungen/seo", icon: Search },
  { label: "Schulung & Beratung", link: "/leistungen/schulung", icon: GraduationCap }
];

const Leistungen = () => {
  return (
    <>
      <Helmet>
        <title>Unsere Leistungen | DeutLicht® - Ihr Weg in die digitale Zukunft</title>
        <meta 
          name="description" 
          content="Von Websites über KI-Agenten bis hin zu Förderberatung – maßgeschneiderte Digitalisierungslösungen für Ihren Erfolg. Jetzt beraten lassen!" 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroLeistungen} 
              alt="Leistungen Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 leading-tight">
                Unsere Leistungen – Ihr Weg in die
                <span className="text-accent"> digitale Zukunft</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Von Websites über KI-Agenten bis hin zu Förderberatung – 
                maßgeschneidert für Ihren Erfolg
              </p>

              <Link to="/kontakt">
                <Button size="lg" className="group bg-accent hover:bg-accent/90 text-white px-8">
                  Jetzt beraten lassen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <ScrollReveal key={service.id} delay={index * 50}>
                  <div 
                    className={`group h-full rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      index % 2 === 0 
                        ? 'bg-card border-border' 
                        : 'bg-muted/30 border-border/50'
                    } ${service.isHighlighted ? 'ring-2 ring-accent' : ''}`}
                  >
                    {/* Image or Icon Header */}
                    <div className="relative h-48 overflow-hidden">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
                          <service.icon className="w-20 h-20 text-accent/60 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}
                      {/* BIM Video overlay */}
                      {service.hasVideo && (
                        <div className="absolute inset-0">
                          <video 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="w-full h-full object-cover"
                          >
                            <source src={service.videoSrc} type="video/mp4" />
                          </video>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title with Icon */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground leading-tight">
                            {service.title}
                          </h3>
                          <p className="text-sm text-accent font-medium">{service.subtitle}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Features (compact) */}
                      <div className="space-y-1.5 mb-4">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                            <span className="text-foreground/80">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Benefits Box */}
                      <div className="bg-muted/50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-foreground mb-2">Ihre Vorteile:</p>
                        <div className="space-y-1.5">
                          {service.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <benefit.icon className="w-3.5 h-3.5 text-accent" />
                              <span className="text-xs text-foreground/80">{benefit.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-2">
                        {service.detailLink ? (
                          <Link to={service.detailLink} className="w-full">
                            <Button 
                              className="w-full group bg-accent hover:bg-accent/90 text-white"
                              size="sm"
                            >
                              Mehr erfahren
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        ) : (
                          <Link to={service.link} className="w-full">
                            <Button 
                              className="w-full group bg-accent hover:bg-accent/90 text-white"
                              size="sm"
                            >
                              Details anfragen
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        )}
                        <Link to="/kontakt" className="w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            Kontakt aufnehmen
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access Buttons Section */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Schnellzugriff auf Top-Leistungen
              </h2>
              <p className="text-muted-foreground">
                Entdecken Sie unsere gefragtesten Services
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {quickAccessButtons.map((btn) => (
                <Link key={btn.label} to={btn.link}>
                  <Button 
                    size="lg" 
                    className="group bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <btn.icon className="w-5 h-5 mr-2" />
                    {btn.label}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Teaser Videos Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  <Bot className="w-4 h-4" />
                  KI in Aktion
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Erleben Sie unsere KI-Agenten
                </h2>
                <p className="text-lg text-muted-foreground">
                  Komplexes wird klarer – Klarheit schaffen, Wirkung erzielen
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ScrollReveal direction="left">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border group">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full aspect-video object-cover"
                  >
                    <source src="/videos/ki-agenten-teaser-1.mp4" type="video/mp4" />
                  </video>
                  <div className="p-4 bg-card">
                    <p className="text-sm font-medium text-foreground">Klarheit schaffen – Wirkung erzielen</p>
                    <p className="text-xs text-muted-foreground mt-1">DeutLicht® KI-Agenten im Einsatz</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border group">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full aspect-video object-cover"
                  >
                    <source src="/videos/ki-agenten-teaser-2.mp4" type="video/mp4" />
                  </video>
                  <div className="p-4 bg-card">
                    <p className="text-sm font-medium text-foreground">Komplexes wird klarer</p>
                    <p className="text-xs text-muted-foreground mt-1">Intelligente Automatisierung</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="text-center mt-8">
              <Link to="/leistungen/ki-agenten">
                <Button size="lg" className="group bg-accent hover:bg-accent/90 text-white">
                  Alle KI-Agenten entdecken
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
                Welche Leistung passt zu Ihnen?
              </h2>
              <p className="text-xl mb-4 text-primary-foreground/90">
                Lassen Sie uns sprechen!
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80">
                In einem kostenlosen Beratungsgespräch finden wir gemeinsam die optimale Lösung für Ihr Unternehmen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button 
                    size="lg" 
                    className="group w-full sm:w-auto bg-accent hover:bg-accent/90 text-white px-8"
                  >
                    Beratung vereinbaren
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projektanfrage">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                  >
                    Projektanfrage starten
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
