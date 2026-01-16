import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users, Lightbulb, Target, Workflow, Award, Brain, Sparkles, Globe, Zap, TrendingUp, Bot } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import heroUeberUns from "@/assets/hero-ueber-uns.jpg";
import kiPionierImg from "@/assets/ki-pionier-gera.jpg";
import projekteProzesseImg from "@/assets/projekte-prozesse.jpg";
import leistungWebsitesMarketingImg from "@/assets/leistung-websites-marketing.jpg";
import kiVoicebotsImg from "@/assets/ueber-uns-ki-voicebots.jpg";
import marketingImg from "@/assets/ueber-uns-marketing.jpg";
const UeberUns = () => {
  return <>
      <Helmet>
        <title>Über uns | DeutLicht® - Erste KI-Agentur in Gera</title>
        <meta name="description" content="DeutLicht® - Die erste KI-Agentur in Gera. Über 30 Jahre Erfahrung in Digitalisierung, Management und Förderberatung. Pionier der KI in Ostthüringen." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src={heroUeberUns} alt="Über uns Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Logo */}
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>

              {/* KI-Pionier Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#c88a04] text-primary border-2 border-[#c88a04] shadow-lg">
                  <Brain className="w-4 h-4" />
                  Erste KI-Agentur in Gera
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-primary text-[#c88a04] border-2 border-[#c88a04]">
                  <Sparkles className="w-4 h-4" />
                  Pionier der KI in Ostthüringen
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Über DeutLicht®
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                Gegründet aus jahrzehntelanger Erfahrung in Digitalisierung, Management und Förderberatung. 
                Als <span className="text-[#c88a04] font-semibold">erste KI-Agentur in Gera</span> stehen wir für 
                Innovation, Klarheit und nachhaltige digitale Systeme.
              </p>

              <p className="text-lg font-medium italic text-[#c88a04]">
                "Technologie dient dem Menschen – nicht umgekehrt."
              </p>
            </div>
          </div>
        </section>

        {/* Highlight Cards - Hauptthemen */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Was uns auszeichnet
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Erfahrung trifft Innovation – unsere Stärken für Ihren Erfolg
                  </p>
                </div>
              </ScrollReveal>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScrollReveal delay={0}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary h-full hover:shadow-xl hover:scale-105">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      30+ Jahre Erfahrung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]/90">
                      Fundiertes unternehmerisches Know-how im Management. Bewährte Strategien für nachhaltiges Wachstum.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary h-full hover:shadow-xl hover:scale-105">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      25+ Jahre Digitalisierung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]/90">
                      Seit den Anfängen des Internets dabei. Expertise in Webentwicklung, E-Commerce und digitaler Transformation.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary h-full hover:shadow-xl hover:scale-105">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      Erste KI-Agentur
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]/90">
                      Pionier für Künstliche Intelligenz in Gera und Ostthüringen. Modernste KI-Lösungen für Ihr Unternehmen.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                  <div className="rounded-xl p-6 shadow-lg border transition-all duration-300 border-[#c88a04] bg-primary h-full hover:shadow-xl hover:scale-105">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-[#c88a04]">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-[#c88a04]">
                      Förderberatung
                    </h3>
                    <p className="text-sm leading-relaxed text-[#c88a04]/90">
                      Maximieren Sie Ihre Investitionen. Wir unterstützen bei förderfähigen Digitalisierungsprojekten.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* KI-Pionier Section mit Bild */}
        <section className="py-16 md:py-20 bg-primary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div className="relative">
                    <img src={kiPionierImg} alt="KI-Pionier in Gera - Künstliche Intelligenz Netzwerk" className="rounded-xl shadow-2xl w-full h-auto" />
                    <div className="absolute -bottom-4 -right-4 bg-[#c88a04] text-primary px-6 py-3 rounded-lg font-bold shadow-lg">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        KI-Pionier
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-[#c88a04]/20 text-[#c88a04] border border-[#c88a04]/30">
                      <Sparkles className="w-4 h-4" />
                      Innovation aus Ostthüringen
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground">
                      Pionier der KI in Gera
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Als <strong className="text-[#c88a04]">erste KI-Agentur in Gera</strong> verbinden wir 
                      über 25 Jahre Digitalisierungserfahrung mit modernster Künstlicher Intelligenz. 
                      Wir sind Vorreiter für innovative KI-Lösungen in der Region Ostthüringen.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {["KI-gestützte Automatisierung & Chatbots", "Voice Agents für Kundenservice", "Intelligente Datenanalyse & Prozessoptimierung", "Individuelle KI-Lösungen für Ihr Unternehmen"].map((item, index) => <li key={index} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#c88a04] flex items-center justify-center flex-shrink-0">
                            <Zap className="w-3 h-3 text-primary" />
                          </span>
                          <span className="text-foreground">{item}</span>
                        </li>)}
                    </ul>
                    <Link to="/leistungen/ki-agenten">
                      <Button className="group bg-[#c88a04] hover:bg-[#a87304] text-primary">
                        Unsere KI-Lösungen entdecken
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Leistungsspektrum - Überarbeitet */}
        <section className="py-16 md:py-20 bg-inherit">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Unser Leistungsspektrum
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Ganzheitliche Digitallösungen – von der Website bis zur KI-gestützten Automatisierung
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid lg:grid-cols-3 gap-8">
                <ScrollReveal delay={0}>
                  <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden h-full hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={leistungWebsitesMarketingImg} alt="Websites und E-Commerce" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#c88a04]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-[#c88a04]" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          Websites & E-Commerce
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Moderne, conversion-optimierte Weblösungen mit KI-Integration. 
                        Responsive Design, Shopsysteme und nahtlose CRM/ERP-Anbindung für maximalen Geschäftserfolg.
                      </p>
                      <Link to="/leistungen/websites" className="text-[#c88a04] text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Mehr erfahren <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden h-full hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={kiVoicebotsImg} alt="KI-Agenten und Voicebots" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#c88a04]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-[#c88a04]" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          KI-Agenten & Voicebots
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Als KI-Pionier entwickeln wir intelligente Chatbots, Voice Agents und 
                        Automatisierungslösungen. 24/7 Kundenservice und Prozessoptimierung durch KI.
                      </p>
                      <Link to="/leistungen/ki-agenten" className="text-[#c88a04] text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Mehr erfahren <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden h-full hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={marketingImg} alt="Marketing und Sichtbarkeit" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#c88a04]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-5 h-5 text-[#c88a04]" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          Marketing & Sichtbarkeit
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        KI-gestützte Kampagnen, SEO-Optimierung und Content-Strategien. 
                        Datenbasiertes Performance-Marketing für nachhaltige Leadgenerierung.
                      </p>
                      <Link to="/leistungen/marketing" className="text-[#c88a04] text-sm font-medium hover:underline inline-flex items-center gap-1">
                        Mehr erfahren <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={300}>
                <div className="text-center mt-10">
                  <Link to="/leistungen">
                    <Button variant="outline" className="group border-[#c88a04] text-[#c88a04] hover:text-primary bg-secondary py-0">
                      Alle Leistungen entdecken
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Prozesse mit Bild */}
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left">
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-inherit">
                      Projekte & Prozesse
                    </h2>
                    <p className="leading-relaxed mb-4 text-inherit">
                      Mit über <strong className="text-[#c88a04]">30 Jahren unternehmerischer Erfahrung</strong> und 
                      mehr als <strong className="text-[#c88a04]">25 Jahren im Bereich Digitalisierung</strong> haben 
                      wir unsere Projektmethodik perfektioniert.
                    </p>
                    <p className="leading-relaxed mb-6 text-inherit">
                      Unsere Projekte folgen klaren Strukturen: <strong>Analyse → Roadmap → Umsetzung</strong>. 
                      Alles integriert in unser CRM-/ERP-System – von Lead bis Abrechnung. 
                      Als KI-Agentur setzen wir modernste Technologien für effiziente Workflows ein.
                    </p>
                    <ul className="space-y-3">
                      {["Automatisierte Lead-Erfassung mit KI-Qualifizierung", "Projektmanagement & Zeittracking", "SEO & datenbasiertes Online-Marketing", "KI-gestützte Prozessautomatisierung", "Förderfähige Digitalisierungsprojekte"].map((item, index) => <li key={index} className="flex items-center gap-3 text-[#c88a04] font-bold">
                          <span className="w-2 h-2 rounded-full flex-shrink-0 bg-primary" />
                          {item}
                        </li>)}
                    </ul>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="space-y-6">
                    <div className="relative">
                      <img src={projekteProzesseImg} alt="Projektmanagement und Prozessautomatisierung" className="rounded-xl shadow-2xl w-full h-auto" />
                    </div>
                    <div className="gradient-gold rounded-xl p-8 shadow-xl">
                      <h3 className="font-display text-2xl font-semibold text-accent-foreground mb-4">
                        Mehr erfahren
                      </h3>
                      <p className="text-accent-foreground/90 leading-relaxed mb-6">
                        Entdecken Sie unsere Geschichte, Vision und was uns als erste KI-Agentur 
                        in Gera antreibt – in der ausführlichen Darstellung.
                      </p>
                      <Link to="/ueber-uns/hintergrund">
                        <Button variant="secondary" className="group">
                          Zur Hintergrund-Seite
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Ganzheitliche Begleitung */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="text-center mb-12">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Ganzheitliche Begleitung
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Von der ersten Analyse bis zur erfolgreichen Umsetzung – wir sind Ihr verlässlicher Partner
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid md:grid-cols-2 gap-8">
                <ScrollReveal delay={0}>
                  <div className="bg-primary rounded-xl p-8 shadow-lg border border-[#c88a04]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#c88a04] rounded-xl flex items-center justify-center">
                        <Users className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-[#c88a04]">
                          Beratung & Coaching
                        </h3>
                        <p className="text-[#c88a04]/80 text-sm">Strategische Partnerschaft</p>
                      </div>
                    </div>
                    <p className="text-[#c88a04]/90 leading-relaxed">
                      Als erfahrene Berater und Coaches begleiten wir Sie von der strategischen Analyse 
                      bis zur erfolgreichen Implementierung. Mit 30+ Jahren Erfahrung kennen wir die 
                      Herausforderungen und Chancen der digitalen Transformation.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bg-primary rounded-xl p-8 shadow-lg border border-[#c88a04]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#c88a04] rounded-xl flex items-center justify-center">
                        <Workflow className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-[#c88a04]">
                          Umsetzung & Support
                        </h3>
                        <p className="text-[#c88a04]/80 text-sm">Hands-on Realisierung</p>
                      </div>
                    </div>
                    <p className="text-[#c88a04]/90 leading-relaxed">
                      Wir setzen nicht nur Konzepte, sondern realisieren Ihre Projekte vollständig. 
                      Von der Website über KI-Agenten bis zur Marketing-Automatisierung – 
                      inklusive langfristigem Support und kontinuierlicher Optimierung.
                    </p>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 bg-primary text-[#c88a04] border border-[#c88a04]">
                <Brain className="w-4 h-4" />
                Erste KI-Agentur in Gera
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary">
                Bereit für Ihre digitale Transformation?
              </h2>
              <p className="text-lg mb-8 text-primary">
                Lassen Sie uns gemeinsam Ihre Vision verwirklichen – mit über 30 Jahren Erfahrung 
                und modernster KI-Technologie.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/kontakt">
                  <Button size="lg" variant="secondary" className="group">
                    Beratung anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/ki-check">
                  <Button size="lg" variant="outline" className="group border-primary text-primary hover:bg-primary hover:text-[#c88a04]">
                    Kostenloser KI-Check
                    <Sparkles className="ml-2 w-5 h-5" />
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
export default UeberUns;