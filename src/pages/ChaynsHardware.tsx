import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Lock, 
  Bike, 
  Building2, 
  Key, 
  Smartphone, 
  Bot, 
  Utensils, 
  Hotel,
  ArrowRight, 
  CheckCircle2,
  Wifi,
  Shield,
  Clock,
  MapPin
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

import smartlockImage from "@/assets/chayns-smartlock.jpg";
import servicerobotImage from "@/assets/chayns-servicerobot.jpg";
import bikerentalImage from "@/assets/chayns-bikerental.jpg";
import lockersImage from "@/assets/chayns-lockers.jpg";

const lockSolutions = [
  {
    id: "fahrradverleih",
    icon: Bike,
    image: bikerentalImage,
    title: "Fahrrad- & E-Bike-Verleih",
    description: "24/7 automatisierter Fahrradverleih ohne Personal. Kunden buchen online, bezahlen kontaktlos und erhalten den Schlüssel per Bluetooth direkt auf ihr Smartphone.",
    features: [
      "Online-Buchung & Bezahlung",
      "Bluetooth-Schlüsselübergabe",
      "24/7 Verfügbarkeit",
      "Automatische Schadensdokumentation",
      "GPS-Tracking optional",
      "Wartungsplanung integriert"
    ],
    reference: "Bereits erfolgreich im Einsatz: z.B. E-Bike-Verleih Klappholttal auf Sylt"
  },
  {
    id: "schliessanlagen",
    icon: Building2,
    image: lockersImage,
    title: "Schließfächer & Spind-Systeme",
    description: "Smarte Schließfachlösungen für Fitnessstudios, Schwimmbäder, Büros oder öffentliche Einrichtungen. Zugang per App, zeitlich begrenzt und vollständig automatisiert.",
    features: [
      "App-basierte Öffnung",
      "Zeitlich begrenzte Zugänge",
      "Belegungsübersicht in Echtzeit",
      "Automatische Abrechnung",
      "Integration in Mitgliederverwaltung",
      "Fernsteuerung für Betreiber"
    ],
    reference: "Ideal für Fitness, Schwimmbäder, Coworking-Spaces"
  },
  {
    id: "ferienwohnungen",
    icon: Key,
    image: smartlockImage,
    title: "Ferienwohnungen & Hotels",
    description: "Schlüsselboxen mit Bluetooth-Öffnung für den kontaktlosen Check-in. Gäste erhalten den Zugangscode automatisch nach erfolgreicher Buchung.",
    features: [
      "Kontaktloser Self-Check-in",
      "Automatische Zugangscodes",
      "Zeitfenster-basierte Berechtigung",
      "Protokollierung aller Zugriffe",
      "Integration in Buchungssysteme",
      "Notfall-Masterzugang"
    ],
    reference: "Perfekt für Airbnb, Booking.com und eigene Buchungsportale"
  }
];

const robotSolutions = [
  {
    id: "servicerobot",
    icon: Utensils,
    image: servicerobotImage,
    title: "Dinerbot – Service-Roboter für Gastronomie",
    description: "Autonome Service-Roboter liefern Speisen und Getränke direkt an den Tisch. Entlasten Sie Ihr Personal und bieten Sie Ihren Gästen ein einzigartiges Erlebnis.",
    features: [
      "Autonome Navigation",
      "LiDAR & 3D-Sensorik",
      "Hindernisvermeidung",
      "Mehrere Ablagefächer",
      "Sprachausgabe möglich",
      "Integration in chayns-Bestellsystem"
    ],
    models: [
      { name: "Dinerbot T5", capacity: "2 Ebenen, bis zu 20kg" },
      { name: "Dinerbot T8", capacity: "3 Ebenen, bis zu 30kg" },
      { name: "Dinerbot T10", capacity: "4 Ebenen, bis zu 40kg" }
    ]
  },
  {
    id: "butlerbot",
    icon: Hotel,
    title: "Butlerbot – Room-Service-Roboter für Hotels",
    description: "Lieferroboter für den Hotelbereich. Rufen selbstständig Aufzüge, navigieren zu Zimmern und liefern Bestellungen sicher ab.",
    features: [
      "Selbstständige Aufzugnutzung",
      "Lieferung bis zur Zimmertür",
      "Passwortgeschützte Fächer",
      "Echtzeit-Tracking für Gäste",
      "Integration in Hotel-PMS",
      "24/7 Betrieb möglich"
    ],
    models: [
      { name: "Butlerbot W3", capacity: "Geschlossenes Fach, Hygiene-optimiert" },
      { name: "Butlerbot T3", capacity: "Offene Regale für Room-Service" }
    ]
  }
];

const benefits = [
  {
    icon: Clock,
    title: "24/7 Betrieb",
    description: "Automatisierte Systeme ermöglichen Geschäfte rund um die Uhr ohne Personaleinsatz."
  },
  {
    icon: Smartphone,
    title: "App-Steuerung",
    description: "Alles wird über die chayns-App gesteuert – für Betreiber und Kunden gleichermaßen."
  },
  {
    icon: Shield,
    title: "Sichere Zugänge",
    description: "Bluetooth-Verschlüsselung und Protokollierung aller Zugriffe für maximale Sicherheit."
  },
  {
    icon: Wifi,
    title: "Cloud-Verwaltung",
    description: "Zentrale Verwaltung aller Schlösser und Roboter über das chayns-Backend."
  },
  {
    icon: MapPin,
    title: "Standortübergreifend",
    description: "Verwalten Sie mehrere Standorte und Geräte von einer zentralen Stelle aus."
  },
  {
    icon: Bot,
    title: "Volle Integration",
    description: "Nahtlose Anbindung an Buchungs-, Bestell- und Bezahlsysteme von chayns."
  }
];

const ChaynsHardware = () => {
  return (
    <>
      <Helmet>
        <title>Smarte Schlösser & Roboter | chayns® Hardware | DeutLicht®</title>
        <meta
          name="description"
          content="Smarte Schließsysteme für Fahrradverleih, Schließfächer & Hotels. Service-Roboter für Gastronomie und Hotels. Automatisierte Hardware-Lösungen mit chayns®."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-accent/10 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollReveal>
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  chayns® Hardware
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 leading-tight">
                  Smarte Schlösser &
                  <span className="text-accent"> Service-Roboter</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                  Automatisieren Sie Ihren Betrieb mit intelligenten Hardware-Lösungen. 
                  Von Bluetooth-Schlüsselboxen für den 24/7-Verleih bis zu Service-Robotern, 
                  die Speisen und Getränke liefern.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/kontakt">
                    <Button size="lg" className="group w-full sm:w-auto">
                      Beratungstermin vereinbaren
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <a href="#schloesser">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Schlösser entdecken
                    </Button>
                  </a>
                  <a href="#roboter">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Roboter entdecken
                    </Button>
                  </a>
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
                  Vorteile der Automatisierung
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Intelligente Hardware-Lösungen, die Ihren Betrieb effizienter machen.
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

        {/* Lock Solutions */}
        <section id="schloesser" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Smarte Schließsysteme</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Schlösser & Zugangssysteme
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Bluetooth-basierte Schließlösungen für Verleih, Vermietung und Zugangskontrolle.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-16">
              {lockSolutions.map((solution, index) => (
                <ScrollReveal key={solution.id} delay={index * 100}>
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? '' : ''}`}>
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        <img 
                          src={solution.image} 
                          alt={solution.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                          <solution.icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {solution.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg mb-6">
                        {solution.description}
                      </p>
                      <div className="bg-card rounded-xl p-6 border border-border mb-4">
                        <h4 className="font-semibold text-foreground mb-4">Funktionen</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {solution.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-accent italic">{solution.reference}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Robot Solutions */}
        <section id="roboter" className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Service-Roboter</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Autonome Liefer-Roboter
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Intelligente Roboter für Gastronomie und Hotellerie – liefern Speisen, 
                  Getränke und Room-Service vollautomatisch.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-16">
              {robotSolutions.map((solution, index) => (
                <ScrollReveal key={solution.id} delay={index * 100}>
                  <div className={`grid lg:grid-cols-2 gap-8 items-center`}>
                    <div className={index % 2 === 0 ? 'lg:order-2' : ''}>
                      {solution.image && (
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                          <img 
                            src={solution.image} 
                            alt={solution.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {!solution.image && (
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <solution.icon className="w-24 h-24 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className={index % 2 === 0 ? 'lg:order-1' : ''}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                          <solution.icon className="w-7 h-7 text-accent" />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {solution.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg mb-6">
                        {solution.description}
                      </p>
                      <div className="bg-card rounded-xl p-6 border border-border mb-6">
                        <h4 className="font-semibold text-foreground mb-4">Funktionen</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {solution.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {solution.models && (
                        <div className="bg-primary/5 rounded-xl p-6">
                          <h4 className="font-semibold text-foreground mb-4">Verfügbare Modelle</h4>
                          <div className="space-y-3">
                            {solution.models.map((model, i) => (
                              <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                                <span className="font-medium text-foreground">{model.name}</span>
                                <span className="text-sm text-muted-foreground">{model.capacity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg text-center">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Nahtlose Integration
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                    Alle Hardware-Komponenten werden direkt in das chayns-Ökosystem integriert. 
                    Buchungen, Zahlungen und Zugänge laufen über eine zentrale Plattform – 
                    verwaltet über Ihre chayns-Seite.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/chayns-loesungen">
                      <Button variant="outline" className="group">
                        chayns® Plattform kennenlernen
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
                Interesse an smarter Hardware?
              </h2>
              <p className="text-accent-foreground/80 text-lg mb-8">
                Lassen Sie uns gemeinsam herausfinden, welche Hardware-Lösung 
                zu Ihrem Geschäftsmodell passt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Kostenlose Beratung anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/chayns-loesungen">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                    Zurück zur Übersicht
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

export default ChaynsHardware;
