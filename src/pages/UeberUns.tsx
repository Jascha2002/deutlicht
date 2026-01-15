import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, Lightbulb, Target, Workflow, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import heroUeberUns from "@/assets/hero-ueber-uns.jpg";

const UeberUns = () => {
  return <>
      <Helmet>
        <title>Über uns | DeutLicht® - Ihr Partner für digitale Transformation</title>
        <meta name="description" content="Lernen Sie DeutLicht® kennen: Über 30 Jahre Erfahrung in Digitalisierung, Management und Förderberatung. Klarheit, Struktur und nachhaltige digitale Systeme." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroUeberUns} 
              alt="Über uns Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Logo */}
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-primary text-primary-foreground border border-accent/30">
                <Clock className="w-4 h-4" />
                Auf einen schnellen Blick
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Über DeutLicht®
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                Gegründet aus jahrzehntelanger Erfahrung in Digitalisierung, Management und Förderberatung. 
                Wir stehen für Klarheit, Struktur und nachhaltige digitale Systeme.
              </p>

              <p className="text-lg font-medium italic text-[#c88a04]">
                "Technologie dient dem Menschen – nicht umgekehrt."
              </p>
            </div>
          </div>
        </section>

        {/* Quick Overview Cards */}
        <section className="py-16 md:py-[23px]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ScrollReveal delay={0}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      30+ Jahre Erfahrung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]">
                      Fundiertes unternehmerisches Know-how mit über 25 Jahren Expertise im Bereich Digitalisierung.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-[#c88a04]" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      Ganzheitliche Begleitung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]">
                      Als Berater und Coach begleiten wir Sie von der strategischen Analyse bis zur erfolgreichen Umsetzung.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      Förderberatung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]">
                      Wir unterstützen Sie bei förderfähigen Digitalisierungsprojekten zur Maximierung Ihrer Investitionen.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Leistungsspektrum */}
        <section className="py-16 md:py-[29px] bg-inherit">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Unser Leistungsspektrum
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Ganzheitliche Lösungen für Ihre digitale Transformation – von CRM-Systemen bis zu Marketing-Strategien.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                <ScrollReveal delay={0}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Workflow className="w-5 h-5 text-[#c88a04]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          Websites & Shopsysteme
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Responsive, skalierbare Weblösungen mit direkter Anbindung an CRM-, ERP- und PIM-Systeme. 
                          Fokus auf Conversion, Automatisierung und Wachstum.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-[#c88a04]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          Social Media & Marketing
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          KI-gestützte Kampagnen, Content-Planung, Performance-Tracking und nachhaltige Leadgenerierung.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Prozesse */}
        <section className="py-16 md:py-20 bg-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-inherit">
                      Projekte & Prozesse
                    </h2>
                    <p className="leading-relaxed mb-6 text-inherit">
                      Unsere Projekte folgen klaren Strukturen: Analyse, Roadmap, Umsetzung. 
                      Alles integriert in unser CRM-/ERP-System – von Lead bis Abrechnung.
                    </p>
                    <ul className="space-y-3">
                      {["Automatisierte Lead-Erfassung", "Projektmanagement & Zeittracking", "SEO & Online-Marketing", "Förderfähige Digitalisierungsprojekte"].map((item, index) => <li key={index} className="flex items-center gap-3 text-[#c88a04] font-bold">
                          <span className="w-2 h-2 rounded-full flex-shrink-0 bg-primary" />
                          {item}
                        </li>)}
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="gradient-gold rounded-xl p-8 shadow-xl">
                    <h3 className="font-display text-2xl font-semibold text-accent-foreground mb-4">
                      Mehr erfahren
                    </h3>
                    <p className="text-accent-foreground/90 leading-relaxed mb-6">
                      Entdecken Sie unsere Geschichte, Vision und was uns antreibt – 
                      in der ausführlichen Darstellung auf der Hintergrund-Seite.
                    </p>
                    <Link to="/ueber-uns/hintergrund">
                      <Button variant="secondary" className="group">
                        Zur Hintergrund-Seite
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary">
                Bereit für Ihre digitale Transformation?
              </h2>
              <p className="text-lg mb-8 text-primary">
                Lassen Sie uns gemeinsam Ihre Vision verwirklichen.
              </p>
              <Link to="/kontakt">
                <Button size="lg" variant="secondary" className="group">
                  Beratung anfragen
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>;
};
export default UeberUns;