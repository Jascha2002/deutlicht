import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Quote, 
  TrendingUp, 
  Users, 
  Building2, 
  ShoppingBag, 
  Utensils,
  Factory,
  Heart,
  Briefcase,
  CheckCircle2,
  Star
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

const caseStudies = [
  {
    id: "handwerk",
    icon: Factory,
    industry: "Handwerk & Produktion",
    client: "Metallbau Schmidt GmbH",
    title: "Digitalisierung eines traditionellen Handwerksbetriebs",
    challenge: "Veraltete Prozesse, manuelle Auftragserfassung und fehlende Übersicht über laufende Projekte führten zu Ineffizienzen und verpassten Chancen.",
    solution: "Implementierung eines integrierten CRM- und ERP-Systems mit automatisierter Auftragserfassung, digitalem Projektmanagement und Echtzeit-Reporting.",
    results: [
      { metric: "40%", label: "Zeitersparnis bei der Auftragsbearbeitung" },
      { metric: "25%", label: "Steigerung der Kundenzufriedenheit" },
      { metric: "50%", label: "Förderung durch go-digital" }
    ],
    quote: "DeutLicht® hat uns geholfen, den Sprung ins digitale Zeitalter zu schaffen – ohne unsere bewährten Werte zu verlieren.",
    author: "Thomas Schmidt, Geschäftsführer"
  },
  {
    id: "einzelhandel",
    icon: ShoppingBag,
    industry: "Einzelhandel",
    client: "Modehaus Berger",
    title: "E-Commerce-Transformation mit CRM-Integration",
    challenge: "Ein etabliertes Modehaus wollte seine Reichweite durch einen Onlineshop erweitern, ohne die persönliche Kundenbeziehung zu verlieren.",
    solution: "Aufbau eines responsiven Shopsystems mit nahtloser CRM-Anbindung, automatisierten E-Mail-Kampagnen und Kundenbindungsprogramm.",
    results: [
      { metric: "120%", label: "Umsatzsteigerung im ersten Jahr" },
      { metric: "3x", label: "Höhere Wiederkaufrate" },
      { metric: "60%", label: "Automatisierte Kundenansprache" }
    ],
    quote: "Die Kombination aus Online-Shop und CRM hat unsere Kundenbindung auf ein neues Level gehoben.",
    author: "Claudia Berger, Inhaberin"
  },
  {
    id: "gastronomie",
    icon: Utensils,
    industry: "Gastronomie",
    client: "Restaurant-Gruppe Rheintal",
    title: "Multi-Location Management & Marketing",
    challenge: "Drei Restaurants an verschiedenen Standorten mit unterschiedlichen Systemen, keine einheitliche Marketingstrategie und fehlende Datenauswertung.",
    solution: "Zentrales CRM-System für alle Standorte, einheitliche Social-Media-Strategie mit lokalen Anpassungen und KI-gestütztes Performance-Tracking.",
    results: [
      { metric: "35%", label: "Mehr Reservierungen durch Online-Marketing" },
      { metric: "200%", label: "Reichweitensteigerung auf Social Media" },
      { metric: "1", label: "Zentrales Dashboard für alle Standorte" }
    ],
    quote: "Endlich haben wir den Überblick über alle drei Standorte – und unsere Online-Präsenz spricht unsere Gäste wirklich an.",
    author: "Michael Rheinberger, Geschäftsführer"
  },
  {
    id: "gesundheit",
    icon: Heart,
    industry: "Gesundheitswesen",
    client: "Praxisgemeinschaft Wellness+",
    title: "Digitale Patientenreise optimieren",
    challenge: "Hoher administrativer Aufwand bei Terminbuchungen, fehlende Patientenkommunikation zwischen den Terminen und manuelle Dokumentation.",
    solution: "Online-Terminbuchungssystem, automatisierte Terminerinnerungen, digitale Patientenakte und Newsletter-Automatisierung.",
    results: [
      { metric: "70%", label: "Weniger No-Shows durch Erinnerungen" },
      { metric: "50%", label: "Zeitersparnis bei Administration" },
      { metric: "90%", label: "Positive Patientenbewertungen" }
    ],
    quote: "Unsere Patienten schätzen die digitalen Services und wir haben endlich mehr Zeit für das, was zählt.",
    author: "Dr. Sarah Weber"
  }
];

const industries = [
  { icon: Factory, name: "Handwerk & Produktion" },
  { icon: ShoppingBag, name: "Einzelhandel" },
  { icon: Utensils, name: "Gastronomie" },
  { icon: Heart, name: "Gesundheitswesen" },
  { icon: Building2, name: "Immobilien" },
  { icon: Briefcase, name: "Dienstleistungen" }
];

const stats = [
  { value: "50+", label: "Erfolgreiche Projekte" },
  { value: "30+", label: "Jahre Erfahrung" },
  { value: "95%", label: "Kundenzufriedenheit" },
  { value: "€2M+", label: "Eingeworbene Fördermittel" }
];

const Projekte = () => {
  return (
    <>
      <Helmet>
        <title>Projekte & Referenzen | DeutLicht® - Erfolgsgeschichten unserer Kunden</title>
        <meta
          name="description"
          content="Entdecken Sie unsere Erfolgsgeschichten: Fallstudien aus Handwerk, Einzelhandel, Gastronomie und mehr. Digitale Transformation mit messbaren Ergebnissen."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Projekte & Referenzen
              </span>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 leading-tight">
                Erfolgsgeschichten, die
                <span className="text-accent"> inspirieren</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Von der Idee bis zur Umsetzung – entdecken Sie, wie wir Unternehmen 
                verschiedener Branchen bei ihrer digitalen Transformation begleitet haben.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="text-center">
                    <p className="font-display text-3xl md:text-4xl font-bold text-accent mb-2">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Branchen, in denen wir Erfahrung haben
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Unsere Lösungen sind branchenübergreifend einsetzbar und werden individuell angepasst.
                  </p>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {industries.map((industry, index) => (
                  <ScrollReveal key={index} delay={index * 50}>
                    <div 
                      className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border border-border hover:border-accent/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                        <industry.icon className="w-6 h-6 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center">
                        {industry.name}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Fallstudien
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Detaillierte Einblicke in ausgewählte Projekte – von der Herausforderung bis zum messbaren Erfolg.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-16">
                {caseStudies.map((study, index) => (
                  <ScrollReveal key={study.id} delay={100}>
                    <div 
                      className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
                        index % 2 === 1 ? "" : ""
                      }`}
                    >
                    {/* Content */}
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <study.icon className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-accent font-medium text-sm">
                          {study.industry}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {study.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-6">
                        Kunde: {study.client}
                      </p>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-destructive rounded-full" />
                            Herausforderung
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                            {study.challenge}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full" />
                            Lösung
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                            {study.solution}
                          </p>
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="bg-card rounded-xl p-6 border border-border">
                        <Quote className="w-8 h-8 text-accent/50 mb-3" />
                        <p className="text-foreground italic leading-relaxed mb-4">
                          "{study.quote}"
                        </p>
                        <p className="text-muted-foreground text-sm font-medium">
                          – {study.author}
                        </p>
                      </div>
                    </div>

                    {/* Results Card */}
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border h-full">
                        <div className="flex items-center gap-2 mb-6">
                          <TrendingUp className="w-5 h-5 text-accent" />
                          <h4 className="font-display text-lg font-semibold text-foreground">
                            Ergebnisse
                          </h4>
                        </div>

                        <div className="space-y-6">
                          {study.results.map((result, i) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-16 text-center">
                                <span className="font-display text-2xl font-bold text-accent">
                                  {result.metric}
                                </span>
                              </div>
                              <div className="flex-1 pt-1">
                                <p className="text-foreground text-sm leading-relaxed">
                                  {result.label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                          </div>
                          <p className="text-muted-foreground text-sm mt-2">
                            Kundenbewertung
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                      Unser Ansatz für Ihren Erfolg
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Jedes Projekt beginnt mit einer gründlichen Analyse Ihrer aktuellen Situation. 
                      Gemeinsam entwickeln wir eine maßgeschneiderte Roadmap und begleiten Sie 
                      von der Planung bis zur erfolgreichen Umsetzung.
                    </p>

                    <div className="space-y-4">
                      {[
                        "Individuelle Bedarfsanalyse",
                        "Maßgeschneiderte Lösungskonzepte",
                        "Agile Umsetzung mit regelmäßigem Feedback",
                        "Schulung und nachhaltiger Support",
                        "Messbare Ergebnisse und Optimierung"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="gradient-gold rounded-2xl p-8 shadow-xl">
                    <h3 className="font-display text-2xl font-semibold text-accent-foreground mb-4">
                      Ihr Projekt könnte das nächste sein
                    </h3>
                    <p className="text-accent-foreground/90 leading-relaxed mb-6">
                      Lassen Sie uns gemeinsam herausfinden, wie wir Ihre digitale 
                      Transformation vorantreiben können. Das erste Gespräch ist kostenlos.
                    </p>
                    <Link to="/kontakt">
                      <Button variant="secondary" className="group">
                        Projekt besprechen
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für Ihre Erfolgsgeschichte?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Kontaktieren Sie uns für ein unverbindliches Erstgespräch. 
                Gemeinsam bringen wir Ihr Unternehmen digital nach vorne.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Kontakt aufnehmen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/leistungen">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Leistungen ansehen
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

export default Projekte;
