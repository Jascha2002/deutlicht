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
import kontaktHeroBg from "@/assets/kontakt-hero-bg.jpg";
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
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={kontaktHeroBg} alt="Digitale Transformation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-primary text-primary-foreground border border-accent/30">
                <Mail className="w-4 h-4" />
                Kontakt aufnehmen
              </div>
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

        {/* Video Section - Premium Teaser Video */}
        <section className="py-12 md:py-20 bg-[#2b3d4f]">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              {/* Video Wrapper - kleinere Maße: max-width 800px */}
              <div className="mx-auto overflow-hidden rounded-xl md:rounded-[12px] bg-[#111] shadow-2xl" style={{
              maxWidth: '800px',
              aspectRatio: '16 / 9'
            }}>
                <video autoPlay playsInline controls poster="/images/kontakt-poster.png" className="w-full h-full" style={{
                objectFit: 'cover',
                opacity: 0.92
              }}>
                  <source src="/videos/deutlicht-kontakt-video.mov" type="video/mp4" />
                  <source src="/videos/deutlicht-kontakt-video.mp4" type="video/mp4" />
                  Ihr Browser unterstützt keine Videos.
                </video>
              </div>
              
              {/* Video Caption */}
              <p className="text-center text-white/70 text-sm mt-6">
                "Wir bei DeutLicht® gehen weit über Beratung hinaus" – Carsten van de Sand & Junior No. 1
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Quick Way CTA */}
        <section className="py-8 bg-accent/5 border-y border-accent/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-[#c88a04]">Sie möchten schneller die Kosten ermitteln?</h3>
                <p className="text-sm text-[#c88a04]">
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
        <section className="py-16 bg-primary-foreground md:py-[12px]">
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
        <section className="py-16 bg-[#155f75] mx-0 px-0 md:py-12">
          <div className="container px-4 py-0 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                So finden Sie uns
              </h2>
              <p className="text-lg max-w-2xl mx-auto text-white/80">
                Besuchen Sie uns in Gera oder vereinbaren Sie einen Termin für ein Online-Meeting.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Map Placeholder */}
              <Card className="overflow-hidden border-white/20 bg-white/10 backdrop-blur-sm h-full min-h-[400px]">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Interaktive Karte
                    </h3>
                    <p className="text-white/70 mb-4">
                      Gemeindeweg 4, 07546 Gera
                    </p>
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" onClick={() => trackExternalLink("google_maps")}>
                        In Google Maps öffnen
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Directions - 3 cards stacked */}
              <div className="flex flex-col gap-4 h-full">
                <Card className="border-white/20 bg-white/10 backdrop-blur-sm flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <h3 className="font-semibold text-white mb-2">Anfahrt mit dem Auto</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Über die A4, Ausfahrt Gera. Parkplätze sind in der Umgebung verfügbar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-white/10 backdrop-blur-sm flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <h3 className="font-semibold text-white mb-2">Öffentliche Verkehrsmittel</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Busverbindungen ab Gera Hauptbahnhof in die Innenstadt verfügbar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-white/20 bg-[#0d4545] flex-1">
                  <CardContent className="p-6 h-full flex flex-col justify-center">
                    <h3 className="text-accent mb-2 font-bold text-xl">Online-Meeting</h3>
                    <p className="text-white/80 leading-relaxed font-semibold text-base">
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