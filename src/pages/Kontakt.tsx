import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, Building2, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmission, trackCTAClick, trackExternalLink } from "@/lib/analytics";
import AnimatedLogo from "@/components/AnimatedLogo";

const Kontakt = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      trackFormSubmission("contact_form", true);
      
      toast({
        title: "Nachricht gesendet!",
        description: "Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      trackFormSubmission("contact_form", false);
      
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Building2,
      title: "Firmensitz",
      content: "DeutLicht GmbH",
      subcontent: "Musterstraße 123, 12345 Berlin"
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+49 (0) 30 123 456 78",
      subcontent: "Mo-Fr: 9:00 - 18:00 Uhr"
    },
    {
      icon: Mail,
      title: "E-Mail",
      content: "info@deutlicht.de",
      subcontent: "Antwort innerhalb von 24h"
    },
    {
      icon: Globe,
      title: "Web",
      content: "www.deutlicht.de",
      subcontent: "Besuchen Sie unsere Website"
    }
  ];

  const businessHours = [
    { day: "Montag - Donnerstag", hours: "09:00 - 18:00 Uhr" },
    { day: "Freitag", hours: "09:00 - 16:00 Uhr" },
    { day: "Samstag - Sonntag", hours: "Geschlossen" }
  ];

  return (
    <>
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
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
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
                <span className="text-primary block mt-2">ins Gespräch kommen</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Ob Fragen zu unseren Leistungen, eine unverbindliche Beratung oder der Start Ihres 
                Digitalisierungsprojekts – wir sind für Sie da.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <ScrollReveal className="lg:col-span-2">
                <Card className="border-border/50 shadow-xl">
                  <CardContent className="p-8 md:p-10">
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Schreiben Sie uns
                      </h2>
                      <p className="text-muted-foreground">
                        Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ihr vollständiger Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ihre@email.de"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+49 123 456789"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Unternehmen</Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Ihr Unternehmen"
                            value={formData.company}
                            onChange={handleChange}
                            className="bg-background"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Betreff *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Worum geht es?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Ihre Nachricht *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Beschreiben Sie Ihr Anliegen..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="bg-background resize-none"
                        />
                      </div>

                      <div className="flex items-start gap-3 text-sm text-muted-foreground">
                        <p>
                          Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu. 
                          Ihre Daten werden vertraulich behandelt.
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Wird gesendet..."
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Nachricht senden
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Contact Cards */}
                {contactInfo.map((info, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                  <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
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
                  </ScrollReveal>
                ))}

                {/* Business Hours */}
                <ScrollReveal delay={400}>
                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Öffnungszeiten</h3>
                    </div>
                    <div className="space-y-3">
                      {businessHours.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.day}</span>
                          <span className="font-medium text-foreground">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                So finden Sie uns
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Besuchen Sie uns in unserem Büro in Berlin oder vereinbaren Sie einen Termin für ein Online-Meeting.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Map Placeholder */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border-border/50 h-[400px]">
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Interaktive Karte
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Musterstraße 123, 12345 Berlin
                      </p>
                      <Button variant="outline" asChild>
                        <a 
                          href="https://maps.google.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => trackExternalLink("google_maps")}
                        >
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
                    <h3 className="font-semibold text-foreground mb-4">Anfahrt mit dem Auto</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Über die A100, Ausfahrt Musterstraße. Parkplätze sind direkt vor dem Gebäude 
                      sowie im Parkhaus nebenan verfügbar.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Öffentliche Verkehrsmittel</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      U-Bahn: Linie U1, U2 bis Haltestelle Musterplatz (5 Min. Fußweg)<br />
                      Bus: Linie 100, 200 bis Haltestelle Musterstraße
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Online-Meeting</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Kein Termin vor Ort möglich? Gerne treffen wir uns auch virtuell per Video-Call.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Termin vereinbaren
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für die digitale Transformation?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Vereinbaren Sie jetzt Ihr kostenloses Erstgespräch und erfahren Sie, 
              wie wir Ihr Unternehmen voranbringen können.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => trackExternalLink("phone_cta")}
                asChild
              >
                <a href="tel:+4930123456789">
                  <Phone className="w-5 h-5 mr-2" />
                  +49 (0) 30 123 456 78
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => trackExternalLink("email_cta")}
                asChild
              >
                <a href="mailto:info@deutlicht.de">
                  <Mail className="w-5 h-5 mr-2" />
                  info@deutlicht.de
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Kontakt;
