import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  ShoppingCart, 
  CreditCard, 
  Clock, 
  Users, 
  Lock, 
  Utensils, 
  Store, 
  Building, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Globe,
  MessageSquare,
  QrCode,
  Ticket
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import chaynsHeroBg from "@/assets/chayns-hero-bg.jpg";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

const useCases = [
  {
    id: "gastronomie",
    icon: Utensils,
    title: "Gastronomie & Restaurants",
    description: "Digitale Speisekarten, Self-Ordering am Tisch oder an Terminals, kontaktlose Bezahlung und Reservierungsmanagement – alles in einem System.",
    features: [
      "QR-Code Bestellung am Tisch",
      "Self-Order-Terminals",
      "Digitale Speisekarten",
      "Tischreservierungen",
      "Trinkgeld-Funktion",
      "Anbindung an Kassensysteme"
    ]
  },
  {
    id: "einzelhandel",
    icon: Store,
    title: "Einzelhandel & Shops",
    description: "Click & Collect, digitale Kundenkarten, Gutschein-Systeme und nahtlose Integration in bestehende Warenwirtschaft.",
    features: [
      "Click & Collect",
      "Digitale Kundenkarten",
      "Gutschein- und Voucher-System",
      "Produktkataloge",
      "Loyalty-Programme",
      "Bestandsabfrage in Echtzeit"
    ]
  },
  {
    id: "247",
    icon: Clock,
    title: "24/7 Geschäftsmodelle",
    description: "Automatisierte Shops, Selbstbedienungsstationen und kontaktlose Zugangssysteme für rund-um-die-Uhr Betrieb.",
    features: [
      "Bluetooth-Zugangssysteme",
      "Automatisierte Bezahlung",
      "Fernüberwachung",
      "Sharing-Konzepte",
      "Automaten-Integration",
      "24/7 Support-Chat"
    ],
    hasHardwarePage: true
  },
  {
    id: "events",
    icon: Ticket,
    title: "Events & Veranstaltungen",
    description: "Ticketverkauf, Einlassmanagement, bargeldloses Bezahlen und Kommunikation mit Besuchern über eine Plattform.",
    features: [
      "Online-Ticketverkauf",
      "QR-Code Einlass",
      "Bargeldlose Zahlung",
      "Push-Benachrichtigungen",
      "Interaktive Event-Seiten",
      "Besucheranalysen"
    ]
  }
];

const benefits = [
  {
    icon: Smartphone,
    title: "Eine App für alles",
    description: "Kunden nutzen eine einzige chaynsID für Bestellung, Bezahlung und Kommunikation bei über 150.000 Standorten."
  },
  {
    icon: CreditCard,
    title: "Flexible Bezahlung",
    description: "Google Pay, direkte Überweisungen, Gutscheine und mehr – kontaktlos und sicher."
  },
  {
    icon: Lock,
    title: "Sichere Zugänge",
    description: "Bluetooth-basierte Türöffnung für Sharing-Modelle und automatisierte Standorte."
  },
  {
    icon: MessageSquare,
    title: "Direkte Kommunikation",
    description: "Integriertes Chat-System, Push-Benachrichtigungen und Intercom für Kundenservice."
  },
  {
    icon: Globe,
    title: "Web & App",
    description: "Funktioniert als Progressive Web App und native App – keine Installation nötig."
  },
  {
    icon: Zap,
    title: "Schnelle Einrichtung",
    description: "Eigene Seiten in Minuten erstellen, anpassen und live schalten."
  }
];

const ChaynsLoesungen = () => {
  return (
    <>
      <Helmet>
        <title>Self-Order & 24/7 Lösungen | DeutLicht® - chayns® Partner</title>
        <meta
          name="description"
          content="Digitale Bestell- und Bezahlsysteme für Gastronomie, Einzelhandel und 24/7-Geschäfte. Self-Order, kontaktlose Zahlung und automatisierte Abläufe mit chayns®."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={chaynsHeroBg} 
              alt="chayns Self-Order Lösungen" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/30" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollReveal>
                <div className="mb-8 flex justify-center">
                  <AnimatedLogo size="md" />
                </div>
                
                <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground border border-accent/30 rounded-full px-4 py-2 mb-6">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Self-Order & 24/7 Lösungen</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 leading-tight">
                  Digitale Bestell- und Bezahlsysteme mit
                  <span className="text-accent"> chayns®</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                  Mit chayns® von Tobit bieten wir Ihnen ein umfassendes Ökosystem für 
                  digitale Geschäftsmodelle. Von Self-Order in der Gastronomie bis zum 
                  24/7-Shop – alles aus einer Hand.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/projektanfrage">
                    <Button size="lg" className="group w-full sm:w-auto">
                      Projektanfrage starten
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/kontakt">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Kostenlose Beratung
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Warum chayns®?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Eine Plattform, die Menschen, Unternehmen und Organisationen verbindet.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="bg-card rounded-xl p-6 shadow-sm border border-border h-full">
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

        {/* Use Cases */}
        <section id="anwendungen" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Anwendungsbereiche
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  chayns® passt sich Ihrem Geschäftsmodell an – von Gastronomie bis Einzelhandel.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-12">
              {useCases.map((useCase, index) => (
                <ScrollReveal key={useCase.id} delay={index * 100}>
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <useCase.icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {useCase.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg mb-6">
                        {useCase.description}
                      </p>
                      <Link to="/kontakt">
                        <Button variant="outline" className="group">
                          Mehr erfahren
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      {useCase.hasHardwarePage && (
                        <Link to="/leistungen/chayns-hardware">
                          <Button variant="ghost" className="group text-accent">
                            Hardware-Lösungen
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </div>
                    <div className={`bg-card rounded-2xl p-6 border border-border ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <h4 className="font-semibold text-foreground mb-4">Features</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {useCase.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  So funktioniert es
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  In wenigen Schritten zu Ihrem digitalen Bestell- und Bezahlsystem.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Beratung", desc: "Wir analysieren Ihre Anforderungen und zeigen passende Lösungen." },
                { step: "2", title: "Einrichtung", desc: "Wir konfigurieren Ihre chayns-Seite und integrieren Ihre Systeme." },
                { step: "3", title: "Schulung", desc: "Ihr Team wird umfassend in die Nutzung eingeführt." },
                { step: "4", title: "Live", desc: "Start mit vollem Support – wir begleiten Sie langfristig." }
              ].map((item, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für Ihr digitales Geschäftsmodell?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Unsere Projektanfrage hilft Ihnen in wenigen Minuten herauszufinden,
                welche Lösung zu Ihrem Unternehmen passt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projektanfrage">
                  <Button size="lg" className="group w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                    Projektanfrage starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leistungen">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Alle Leistungen
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

export default ChaynsLoesungen;