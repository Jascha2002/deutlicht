import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  Phone, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Database,
  TrendingUp,
  Headphones,
  FileSearch,
  Settings
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import VoiceAgentDemo from "@/components/VoiceAgentDemo";

// Images
import aiAgentHero from "@/assets/ai-agent-hero.jpg";
import aiAgentChatbot from "@/assets/ai-agent-chatbot.jpg";
import aiAgentWorkflow from "@/assets/ai-agent-workflow.jpg";
import aiAgentAnalytics from "@/assets/ai-agent-analytics.jpg";
import aiAgentenHeroBg from "@/assets/ai-agenten-hero-bg.jpg";

const agentTypes = [
  {
    id: "chatbot",
    icon: MessageSquare,
    title: "Intelligente Chatbots",
    description: "KI-gestützte Chatbots für Website, App und Social Media. Beantworten Kundenanfragen rund um die Uhr mit natürlicher Sprache.",
    image: aiAgentChatbot,
    features: [
      "Natural Language Processing (NLP)",
      "Kontextverständnis über mehrere Nachrichten",
      "Nahtlose Übergabe an Mitarbeiter",
      "Multi-Channel-Einsatz (Web, WhatsApp, etc.)"
    ],
    stats: { value: "80%", label: "der Anfragen automatisch beantwortet" }
  },
  {
    id: "voice",
    icon: Phone,
    title: "Voice Agents",
    description: "Sprachgesteuerte KI-Assistenten für Telefon und Call Center. Natürliche Gespräche mit modernster Spracherkennung.",
    image: null, // Will show VoiceAgentDemo instead
    features: [
      "Natürliche Sprachausgabe (Text-to-Speech)",
      "Echtzeit-Spracherkennung",
      "Emotionserkennung und Anpassung",
      "Integration in Telefonanlagen"
    ],
    stats: { value: "24/7", label: "Erreichbarkeit ohne Wartezeiten" }
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Workflow-Automatisierung",
    description: "Autonome Agenten, die komplexe Geschäftsprozesse über verschiedene Systeme hinweg automatisieren.",
    image: aiAgentWorkflow,
    features: [
      "Multi-Step Workflow-Ausführung",
      "System-übergreifende Integration",
      "Fehlerbehandlung und Eskalation",
      "Lernfähige Prozessoptimierung"
    ],
    stats: { value: "70%", label: "Zeitersparnis bei Routineaufgaben" }
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analyse & Insights Agents",
    description: "KI-Agenten für Datenanalyse, Reporting und Business Intelligence. Verwandeln Daten in actionable Insights.",
    image: aiAgentAnalytics,
    features: [
      "Automatisierte Datenanalyse",
      "Natürlichsprachliche Abfragen",
      "Predictive Analytics",
      "Automatische Report-Generierung"
    ],
    stats: { value: "10x", label: "schnellere Datenauswertung" }
  }
];

const useCases = [
  {
    icon: Headphones,
    title: "Kundenservice",
    description: "Automatisierte Beantwortung von FAQs, Bestellstatus, Reklamationen",
    result: "Bis zu 80% weniger Support-Tickets"
  },
  {
    icon: TrendingUp,
    title: "Vertrieb & Marketing",
    description: "Lead-Qualifizierung, personalisierte Kampagnen, Marktanalysen",
    result: "35% höhere Conversion-Rate"
  },
  {
    icon: FileSearch,
    title: "Wissensmanagement",
    description: "Intelligente Dokumentensuche, automatische Zusammenfassungen",
    result: "90% schnellerer Informationszugriff"
  },
  {
    icon: Settings,
    title: "Prozessautomatisierung",
    description: "Rechnungsverarbeitung, Dateneingabe, Berichterstellung",
    result: "70% Zeitersparnis bei Routineaufgaben"
  }
];

const benefits = [
  { icon: Clock, title: "24/7 Verfügbarkeit", description: "Ihre KI-Agenten arbeiten rund um die Uhr ohne Pause" },
  { icon: Zap, title: "Sofortige Reaktion", description: "Antworten in Millisekunden statt Minuten oder Stunden" },
  { icon: Shield, title: "Konsistente Qualität", description: "Immer die gleiche hohe Servicequalität" },
  { icon: TrendingUp, title: "Skalierbar", description: "Von 10 bis 10.000 gleichzeitige Anfragen" },
  { icon: Database, title: "Lernfähig", description: "Verbessert sich kontinuierlich durch Machine Learning" },
  { icon: Users, title: "Entlastet Mitarbeiter", description: "Mehr Zeit für komplexe und wertschöpfende Aufgaben" }
];

const implementationSteps = [
  { step: 1, title: "Analyse", description: "Wir analysieren Ihre Prozesse und identifizieren Automatisierungspotenziale" },
  { step: 2, title: "Konzept", description: "Gemeinsam entwickeln wir eine maßgeschneiderte KI-Strategie" },
  { step: 3, title: "Entwicklung", description: "Wir implementieren und trainieren Ihre KI-Agenten" },
  { step: 4, title: "Integration", description: "Nahtlose Anbindung an Ihre bestehenden Systeme (CRM, ERP, etc.)" },
  { step: 5, title: "Optimierung", description: "Kontinuierliche Verbesserung durch Monitoring und Feedback" }
];

const AIAgenten = () => {
  return (
    <>
      <Helmet>
        <title>KI-Agenten (AI-Agents) | DeutLicht® - Intelligente Automatisierung für Ihr Unternehmen</title>
        <meta
          name="description"
          content="KI-gestützte Agenten für Kundenservice, Prozessautomatisierung und Business Intelligence. Chatbots, Voice Agents und Workflow-Automatisierung von DeutLicht®."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={aiAgentenHeroBg} 
              alt="AI Agenten Technologie" 
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
                Künstliche Intelligenz für Ihr Unternehmen
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                KI-Agenten (AI-Agents): Ihre digitalen
                <span className="text-accent"> Mitarbeiter</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Intelligente KI-Agenten automatisieren Kundenservice, Geschäftsprozesse und 
                Datenanalysen. Sie arbeiten 24/7, lernen kontinuierlich und entlasten Ihr Team 
                für wertschöpfende Aufgaben.
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
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "80%", label: "Automatisierung möglich" },
                { value: "24/7", label: "Verfügbarkeit" },
                { value: "98%", label: "Kundenzufriedenheit" },
                { value: "14%", label: "Kostenreduktion (Klarna)" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/80 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agent Types */}
        <section id="agent-types" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unsere Lösungen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Typen von KI-Agenten (AI-Agents)
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Je nach Anwendungsfall setzen wir unterschiedliche Arten von KI-Agenten ein – 
                von Chatbots bis hin zu autonomen Workflow-Agenten.
              </p>
            </ScrollReveal>

            <div className="space-y-20">
              {agentTypes.map((agent, index) => (
                <ScrollReveal key={agent.id} direction={index % 2 === 0 ? "left" : "right"}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    {/* Content */}
                    <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                          <agent.icon className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                            {agent.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        {agent.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {agent.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/50 rounded-xl p-6 inline-block">
                        <p className="font-display text-3xl font-bold text-accent">{agent.stats.value}</p>
                        <p className="text-muted-foreground text-sm">{agent.stats.label}</p>
                      </div>
                    </div>

                    {/* Image or Demo */}
                    <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                      {agent.id === "voice" ? (
                        <VoiceAgentDemo />
                      ) : (
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
                          <img 
                            src={agent.image!} 
                            alt={agent.title} 
                            className="w-full h-80 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Anwendungsbereiche
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Wo KI-Agenten Mehrwert schaffen
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border h-full hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <useCase.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {useCase.description}
                    </p>
                    <div className="pt-4 border-t border-border">
                      <p className="text-accent font-medium text-sm">{useCase.result}</p>
                    </div>
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
                Warum KI-Agenten?
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

        {/* Implementation Process */}
        <section className="py-20 md:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Unser Vorgehen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                In 5 Schritten zu Ihrem AI Agent
              </h2>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                
                <div className="space-y-8">
                  {implementationSteps.map((step, i) => (
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

        {/* Technology Stack */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Technologie
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Moderne KI-Architektur
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Unsere KI-Agenten basieren auf modernsten Large Language Models und bewährten Frameworks.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <ScrollReveal delay={0}>
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">LLM-Kern</h3>
                  <p className="text-muted-foreground text-sm">
                    GPT-4, Claude, Gemini und Open-Source-Modelle als intelligentes Herzstück
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={100}>
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Database className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">RAG-Systeme</h3>
                  <p className="text-muted-foreground text-sm">
                    Retrieval-Augmented Generation für Zugriff auf Ihre Unternehmensdaten
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Workflow className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Tool-Integration</h3>
                  <p className="text-muted-foreground text-sm">
                    Nahtlose Anbindung an CRM, ERP und weitere Geschäftssysteme
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Branchenlösungen Section */}
        <section className="py-20 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Branchenspezifisch
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Branchenlösungen: Maßgeschneiderte KI-Agenten
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Wir entwickeln maßgeschneiderte KI-Agenten (AI-Agents) für verschiedene Branchen wie 
                <strong> Handwerk, Gesundheit, Gastronomie, Einzelhandel, Kanzleien </strong> 
                und viele mehr. Jede Lösung wird individuell auf die spezifischen Anforderungen 
                und Prozesse Ihrer Branche angepasst.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { title: "Handwerk", description: "HandwerksBot für Terminierung, Angebote & Kundenkommunikation" },
                { title: "Gesundheit", description: "CareBot für Patientenmanagement & Terminvergabe" },
                { title: "Gastronomie", description: "Bestell- und Reservierungsassistenten" },
                { title: "Einzelhandel", description: "ShopBot für Kundenberatung & Bestellstatus" }
              ].map((branche, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 shadow-lg border border-border h-full hover:shadow-xl transition-shadow">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {branche.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {branche.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center">
              <Link to="/leistungen/branchen-loesungen">
                <Button size="lg" variant="outline" className="group">
                  Alle Branchenlösungen entdecken
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Bot className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit für Ihre digitalen Mitarbeiter?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Unsere Projektanfrage hilft Ihnen herauszufinden, welche KI-Lösung zu Ihnen passt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projektanfrage">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Projektanfrage starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Direkt Kontakt aufnehmen
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

export default AIAgenten;
