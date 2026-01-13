import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Building2, Globe, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { trackExternalLink } from "@/lib/analytics";
import AnimatedLogo from "@/components/AnimatedLogo";
import InquiryForm from "@/components/InquiryForm";
const Kontakt = () => {
  const contactInfo = [{
    icon: Building2,
    title: "Firmensitz",
    content: "Stadtnetz UG (haftungsbeschränkt)",
    subcontent: "Gemeindeweg 4, 07546 Gera"
  }, {
    icon: Phone,
    title: "Telefon",
    content: "+49 178 5549216",
    subcontent: "Mo-Fr: 9:00 - 18:00 Uhr"
  }, {
    icon: Mail,
    title: "E-Mail",
    content: "info@deutlicht.de",
    subcontent: "Antwort innerhalb von 24h"
  }, {
    icon: Globe,
    title: "Web",
    content: "www.deutlicht.de",
    subcontent: "Besuchen Sie unsere Website"
  }];
  const businessHours = [{
    day: "Montag - Donnerstag",
    hours: "09:00 - 18:00 Uhr"
  }, {
    day: "Freitag",
    hours: "09:00 - 16:00 Uhr"
  }, {
    day: "Samstag - Sonntag",
    hours: "Geschlossen"
  }];
  return <>
      <Helmet>
        <title>Kontakt | DeutLicht - Digitalisierung für den Mittelstand</title>
        <meta name="description" content="Kontaktieren Sie DeutLicht für eine unverbindliche Beratung zur Digitalisierung Ihres Unternehmens. Wir freuen uns auf Ihre Anfrage." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/videos/hintergrund-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                Kontakt aufnehmen
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Lassen Sie uns
                <span className="block mt-2 text-accent">ins Gespräch kommen</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Ob Fragen zu unseren Leistungen, eine unverbindliche Beratung oder der Start Ihres 
                Digitalisierungsprojekts – wir sind für Sie da.
              </p>
            </div>
          </div>
        </section>

        {/* Video Section - Premium Introduction Video */}
        <section className="py-12 md:py-16 bg-[#2b3d4f]">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-5xl mx-auto">
                {/* Video Container with Premium Styling */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-[#c88a04]/30 bg-black">
                  {/* Reduced Motion Fallback */}
                  <video 
                    autoPlay 
                    playsInline 
                    controls
                    preload="metadata"
                    poster="/videos/deutlicht-kontakt-intro.mp4#t=0.1"
                    className="w-full h-auto object-contain motion-reduce:hidden"
                    style={{ maxWidth: '100%' }}
                    onLoadedMetadata={(e) => {
                      // Check for reduced motion preference
                      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      if (prefersReducedMotion) {
                        (e.target as HTMLVideoElement).pause();
                      }
                    }}
                  >
                    <source src="/videos/deutlicht-kontakt-intro.mp4" type="video/mp4" />
                    Ihr Browser unterstützt keine Videos.
                  </video>
                  
                  {/* Reduced Motion Fallback Overlay */}
                  <noscript>
                    <div className="w-full aspect-video bg-[#2b3d4f] flex items-center justify-center">
                      <div className="text-center p-8">
                        <p className="text-white text-lg">Video: DeutLicht® Einführung</p>
                      </div>
                    </div>
                  </noscript>
                </div>
                
                {/* Video Caption */}
                <p className="text-center text-white/70 text-sm mt-4">
                  Wir bei DeutLicht® gehen weit über Beratung hinaus
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Quick Way CTA */}
        <section className="py-8 bg-accent/5 border-y border-accent/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Du möchtest schneller zu den Kosten?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Nutze unsere Projektanfrage für sofortige Kostenabschätzung.
                </p>
              </div>
              <Link to="/projektanfrage">
                <Button className="gap-2 whitespace-nowrap">
                  Projektanfrage starten
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Inquiry Form & Info Section */}
        <section className="py-16 md:py-24 bg-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12 bg-[#47596b]/0">
              {/* Inquiry Form */}
              <ScrollReveal className="lg:col-span-2">
                <Card className="border-border/50 shadow-xl">
                  <CardContent className="p-8 md:p-10">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Qualifizierte Anfrage stellen
                      </h2>
                      <p className="text-muted-foreground">
                        Für eine verbindliche Beratung mit persönlichem Ansprechpartner
                      </p>
                    </div>

                    <InquiryForm />
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Contact Info Sidebar */}
              <div className="space-y-6 bg-[#47596b]/0">
                {/* Contact Cards */}
                {contactInfo.map((info, index) => <ScrollReveal key={index} delay={index * 100}>
                  <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-accent">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                          <p className="text-foreground font-medium">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.subcontent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </ScrollReveal>)}

                {/* Business Hours */}
                <ScrollReveal delay={400}>
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4 bg-primary-foreground">
                      <div className="p-3 rounded-lg bg-accent">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground bg-primary-foreground">Öffnungszeiten</h3>
                    </div>
                    <div className="space-y-3">
                      {businessHours.map((item, index) => <div key={index} className="flex justify-between text-sm bg-primary-foreground">
                          <span className="text-muted-foreground bg-primary-foreground">{item.day}</span>
                          <span className="font-medium text-foreground bg-primary-foreground">{item.hours}</span>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 text-primary bg-primary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 bg-accent">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                So finden Sie uns
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Besuchen Sie uns in Gera oder vereinbaren Sie einen Termin für ein Online-Meeting.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map Placeholder */}
              <div className="lg:col-span-2 bg-primary">
                <Card className="overflow-hidden border-border/50 h-[400px]">
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Interaktive Karte
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Gemeindeweg 4, 07546 Gera
                      </p>
                      <Button variant="outline" asChild>
                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" onClick={() => trackExternalLink("google_maps")}>
                          In Google Maps öffnen
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Directions */}
              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 bg-accent">Anfahrt mit dem Auto</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Über die A4, Ausfahrt Gera. Parkplätze sind in der Umgebung verfügbar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 bg-accent">Öffentliche Verkehrsmittel</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Busverbindungen ab Gera Hauptbahnhof in die Innenstadt verfügbar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 bg-accent px-0 text-accent">Online-Meeting</h3>
                    <p className="text-sm leading-relaxed text-accent">
                      Kein Problem! Wir bieten auch virtuelle Beratungsgespräche per Video-Call an.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>;
};
export default Kontakt;