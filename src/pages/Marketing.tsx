import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Megaphone, ArrowRight, Bot, Users, BarChart3, 
  Target, Zap, TrendingUp, MessageSquare, Share2, 
  FileText, Calendar
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import leistungMarketing from "@/assets/leistung-marketing.jpg";

const features = [
  {
    icon: Share2,
    title: "Social-Media-Strategie",
    description: "Ganzheitliche Strategien für alle relevanten Plattformen – Instagram, LinkedIn, Facebook & mehr."
  },
  {
    icon: FileText,
    title: "Content-Marketing",
    description: "Überzeugende Inhalte, die Ihre Zielgruppe ansprechen und zum Handeln bewegen."
  },
  {
    icon: Target,
    title: "Performance-Kampagnen",
    description: "Datengetriebene Werbekampagnen mit messbarem ROI und kontinuierlicher Optimierung."
  },
  {
    icon: Bot,
    title: "KI-gestützte Optimierung",
    description: "Automatisierte Analysen und Empfehlungen für maximale Kampagnen-Performance."
  },
  {
    icon: Calendar,
    title: "Content-Planung",
    description: "Strategische Redaktionspläne für konsistente und zielgerichtete Kommunikation."
  },
  {
    icon: MessageSquare,
    title: "Community Management",
    description: "Aktive Betreuung Ihrer Social-Media-Kanäle und Interaktion mit Ihrer Community."
  }
];

const benefits = [
  { text: "KI-unterstützte Content-Erstellung für mehr Effizienz", icon: Bot },
  { text: "Nachhaltige Reichweite durch organische Strategien", icon: Users },
  { text: "Datengetriebene Entscheidungen für bessere Ergebnisse", icon: BarChart3 },
  { text: "Zielgruppenspezifische Ansprache für höhere Conversion", icon: Target },
  { text: "Kontinuierliche Performance-Optimierung", icon: TrendingUp },
  { text: "Transparentes Reporting und klare KPIs", icon: Zap }
];

const stats = [
  { value: "300%", label: "Mehr Reichweite", description: "durchschnittlich" },
  { value: "45%", label: "Höhere Engagement-Rate", description: "im Vergleich" },
  { value: "60%", label: "Zeitersparnis", description: "durch KI-Unterstützung" },
  { value: "2x", label: "Mehr Leads", description: "nach 6 Monaten" }
];

const Marketing = () => {
  return (
    <>
      <Helmet>
        <title>Marketing & Social Media | DeutLicht® - KI-gestützte Kampagnen</title>
        <meta 
          name="description" 
          content="Nachhaltige Marketingstrategien mit KI-Unterstützung. Social-Media-Management, Content-Marketing und Performance-Kampagnen für mehr Reichweite." 
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={leistungMarketing} 
              alt="Marketing & Social Media" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Megaphone className="w-5 h-5" />
                <span className="font-medium">Digital Marketing</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Marketing & Social Media
                <span className="text-accent"> mit KI-Power</span>
              </h1>
              
              <p className="text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground mb-10">
                Nachhaltige Marketingstrategien, die Ihre Zielgruppe erreichen. 
                Von Content-Planung über Performance-Tracking bis zur Leadgenerierung.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Strategie besprechen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projektanfrage">
                  <Button size="lg" variant="outline" className="px-8">
                    Projektanfrage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-foreground">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Unsere Marketing-Leistungen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ganzheitliche Strategien für nachhaltigen Erfolg
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={index * 100}>
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Ihre Vorteile
                  </h2>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <benefit.icon className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-foreground">{benefit.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    Warum KI-gestütztes Marketing?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Künstliche Intelligenz revolutioniert das Marketing: Von automatisierter 
                    Content-Erstellung über prädiktive Analysen bis zur personalisierten 
                    Kundenansprache – wir nutzen modernste Technologien für Ihren Erfolg.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-foreground">
                      <Bot className="w-5 h-5 text-accent" />
                      Automatisierte Content-Generierung
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      Echtzeit-Performance-Analyse
                    </li>
                    <li className="flex items-center gap-2 text-foreground">
                      <Target className="w-5 h-5 text-accent" />
                      Präzise Zielgruppen-Targeting
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Starten Sie Ihre Marketing-Transformation
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam eine Strategie entwickeln, die zu Ihren Zielen passt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kontakt">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                    Kostenlose Beratung
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/leistungen">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                    Alle Leistungen
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Marketing;
