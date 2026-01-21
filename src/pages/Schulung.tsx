import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Target, 
  Lightbulb,
  MessageCircle,
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  Zap,
  Video,
  FileText,
  Headphones,
  Calendar
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";

import schulungHeroBg from "@/assets/schulung-hero-bg.jpg";

const trainingTopics = [
  {
    icon: Lightbulb,
    title: "Digitalisierung verstehen",
    description: "Grundlagen der Digitalisierung und wie Sie diese für Ihr Unternehmen nutzen können.",
    features: [
      "Digitale Geschäftsmodelle",
      "Prozessoptimierung durch Digitalisierung",
      "Cloud-Lösungen verstehen",
      "Datensicherheit & DSGVO"
    ]
  },
  {
    icon: Target,
    title: "KI & Automatisierung",
    description: "Praktischer Einstieg in Künstliche Intelligenz und deren Anwendung im Geschäftsalltag.",
    features: [
      "KI-Grundlagen verständlich erklärt",
      "ChatGPT & Co. effektiv nutzen",
      "Automatisierungspotenziale erkennen",
      "KI-Tools für den Alltag"
    ]
  },
  {
    icon: BookOpen,
    title: "Software & Tools",
    description: "Hands-on Schulungen für die wichtigsten digitalen Werkzeuge und Plattformen.",
    features: [
      "CRM- & ERP-Systeme",
      "Projektmanagement-Tools",
      "Collaboration-Plattformen",
      "Branchenspezifische Software"
    ]
  },
  {
    icon: MessageCircle,
    title: "Online-Marketing",
    description: "Strategien und Taktiken für erfolgreiches digitales Marketing.",
    features: [
      "Social Media Marketing",
      "SEO & Content Marketing",
      "E-Mail-Marketing",
      "Paid Advertising (Google, Meta)"
    ]
  }
];

const formats = [
  {
    icon: Users,
    title: "Vor-Ort-Workshops",
    description: "Intensive Präsenzschulungen direkt in Ihrem Unternehmen",
    details: "Ideal für Teams von 5-20 Personen"
  },
  {
    icon: Video,
    title: "Online-Seminare",
    description: "Interaktive Live-Webinare mit Praxisübungen",
    details: "Flexibel von überall teilnehmen"
  },
  {
    icon: Headphones,
    title: "1:1 Coaching",
    description: "Individuelle Beratung für Führungskräfte und Entscheider",
    details: "Maßgeschneidert auf Ihre Bedürfnisse"
  },
  {
    icon: FileText,
    title: "E-Learning",
    description: "Selbstlern-Module für zeitlich flexibles Lernen",
    details: "Inklusive Zertifikat bei Abschluss"
  }
];

const benefits = [
  { icon: Target, title: "Praxisorientiert", description: "Sofort anwendbares Wissen für Ihren Arbeitsalltag" },
  { icon: Users, title: "Individuell", description: "Angepasst an Ihre Branche und Vorkenntnisse" },
  { icon: Award, title: "Zertifiziert", description: "Teilnahmezertifikate für alle Schulungen" },
  { icon: Clock, title: "Flexibel", description: "Termine und Formate nach Ihren Wünschen" },
  { icon: Zap, title: "Aktuell", description: "Immer auf dem neuesten Stand der Technik" },
  { icon: Headphones, title: "Support", description: "Nachbetreuung und Ansprechpartner inklusive" }
];

const processSteps = [
  { step: 1, title: "Bedarfsanalyse", description: "Wir ermitteln den Wissensstand und die Lernziele Ihres Teams" },
  { step: 2, title: "Konzeption", description: "Entwicklung eines maßgeschneiderten Schulungskonzepts" },
  { step: 3, title: "Durchführung", description: "Interaktive Schulungen mit erfahrenen Trainern" },
  { step: 4, title: "Praxistransfer", description: "Übungen und Use Cases aus Ihrem Arbeitsalltag" },
  { step: 5, title: "Nachbetreuung", description: "Follow-up und Support für nachhaltigen Lernerfolg" }
];

const stats = [
  { value: "500+", label: "geschulte Mitarbeiter" },
  { value: "98%", label: "Teilnehmerzufriedenheit" },
  { value: "50+", label: "Unternehmen vertrauen uns" },
  { value: "4.9/5", label: "durchschnittliche Bewertung" }
];

const Schulung = () => {
  return (
    <>
      <Helmet>
        <title>Schulung & Beratung | DeutLicht® - Digitales Wissen für Ihr Team</title>
        <meta
          name="description"
          content="Praxisnahe Schulungen und Beratung zu Digitalisierung, KI und modernen Technologien. Workshops, Webinare und Coaching für Unternehmen von DeutLicht®."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={schulungHeroBg} 
              alt="Schulung & Beratung" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/30" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6 border border-accent/30">
                <Sparkles className="w-4 h-4" />
                Wissen ist Wettbewerbsvorteil
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Schulung & Beratung:
                <span className="text-accent"> Kompetenz aufbauen</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Befähigen Sie Ihr Team für die digitale Zukunft. Unsere praxisnahen 
                Schulungen und Beratungen machen komplexe Themen wie KI, Digitalisierung 
                und moderne Tools verständlich und anwendbar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/angebotsgenerator">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Schulung anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Beratungsgespräch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/80 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Topics */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Schulungsthemen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Wissen, das bewegt
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Von Digitalisierungsgrundlagen bis hin zu spezialisierten KI-Workshops – 
                wir bieten Schulungen für jeden Kenntnisstand.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {trainingTopics.map((topic, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border h-full hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                        <topic.icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-foreground">
                        {topic.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {topic.description}
                    </p>
                    
                    <div className="space-y-3">
                      {topic.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Schulungsformate
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Lernen wie es zu Ihnen passt
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formats.map((format, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border h-full text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <format.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {format.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {format.description}
                    </p>
                    <p className="text-accent text-sm font-medium">
                      {format.details}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Ihre Vorteile
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Warum Schulungen bei DeutLicht®?
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 md:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unser Vorgehen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Von der Anfrage zur Schulung
              </h2>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                
                <div className="space-y-8">
                  {processSteps.map((step, i) => (
                    <ScrollReveal key={i} delay={i * 100}>
                      <div className="flex gap-6 items-start">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-accent-foreground font-display text-2xl font-bold relative z-10">
                          {step.step}
                        </div>
                        <div className="pt-3">
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consulting CTA */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  Beratung
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                  Individuelle Digitalberatung
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Neben unseren Schulungsangeboten bieten wir auch strategische Beratung 
                    für Ihre Digitalisierungsprojekte. Wir begleiten Sie von der ersten Idee 
                    bis zur erfolgreichen Umsetzung.
                  </p>
                  <p>
                    Unsere Berater bringen langjährige Erfahrung aus verschiedenen Branchen 
                    mit und sprechen Ihre Sprache – verständlich, praxisnah und lösungsorientiert.
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-xl p-6">
                    <Calendar className="w-8 h-8 text-accent mb-3" />
                    <h4 className="font-display text-lg font-semibold text-foreground mb-2">Strategie-Workshop</h4>
                    <p className="text-sm text-muted-foreground">Gemeinsame Entwicklung Ihrer Digitalstrategie</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-6">
                    <GraduationCap className="w-8 h-8 text-accent mb-3" />
                    <h4 className="font-display text-lg font-semibold text-foreground mb-2">Change Management</h4>
                    <p className="text-sm text-muted-foreground">Begleitung des digitalen Wandels im Team</p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="right">
                <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                  <h3 className="font-display text-2xl font-bold mb-6">Kostenlose Erstberatung</h3>
                  <p className="mb-6 text-primary-foreground/80">
                    Lassen Sie uns gemeinsam herausfinden, welche Schulungs- und 
                    Beratungsangebote am besten zu Ihren Zielen passen.
                  </p>
                  <div className="space-y-3 mb-8">
                    {[
                      "Bedarfsanalyse Ihres Teams",
                      "Vorstellung passender Formate",
                      "Individuelles Angebot",
                      "Unverbindlich & kostenlos"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/kontakt">
                    <Button size="lg" variant="secondary" className="w-full">
                      Beratungstermin vereinbaren
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für die digitale Zukunft?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Investieren Sie in das Wissen Ihres Teams. 
                Kontaktieren Sie uns für ein individuelles Schulungskonzept.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/angebotsgenerator">
                  <Button size="lg" className="group w-full sm:w-auto bg-accent hover:bg-accent/90 text-white">
                    Schulung anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Kontakt aufnehmen
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

export default Schulung;
