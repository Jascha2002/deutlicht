import { useState, useRef, useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  Loader2, 
  ArrowRight,
  CheckCircle2,
  PhoneIncoming,
  PhoneOutgoing,
  Sparkles,
  Play,
  Building2,
  Shield,
  Home,
  Zap,
  Stethoscope,
  Wrench,
  Package,
  Clock,
  TrendingDown,
  Users,
  MessageSquare,
  Bot
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedLogo from "@/components/AnimatedLogo";
import { 
  voicebotScenarios, 
  voicebotCategories, 
  type VoicebotScenario 
} from "@/data/voicebotScenarios";

// Industry images
import imgHausverwaltung from "@/assets/voicebot-hausverwaltung.jpg";
import imgVersicherung from "@/assets/voicebot-versicherung.jpg";
import imgImmobilien from "@/assets/voicebot-immobilien.jpg";
import imgAblesung from "@/assets/voicebot-ablesung.jpg";
import imgArztpraxis from "@/assets/voicebot-arztpraxis.jpg";
import imgWerkstatt from "@/assets/voicebot-werkstatt.jpg";
import imgAbholung from "@/assets/voicebot-abholung.jpg";

// Scenario-specific images for demo cards
import demoArzttermin from "@/assets/demo-arzttermin.jpg";
import demoBesichtigung from "@/assets/demo-besichtigung.jpg";
import demoWerkstatt from "@/assets/demo-werkstatt.jpg";
import demoAblesung from "@/assets/demo-ablesung.jpg";
import demoWerkstattErinnerung from "@/assets/demo-werkstatt-erinnerung.jpg";
import demoArztErinnerung from "@/assets/demo-arzt-erinnerung.jpg";
import demoTherapie from "@/assets/demo-therapie.jpg";
import demoEinzelhandel from "@/assets/demo-einzelhandel.jpg";
import demoWerkstattFertig from "@/assets/demo-werkstatt-fertig.jpg";
import demoApotheke from "@/assets/demo-apotheke.jpg";
import demoBibliothek from "@/assets/demo-bibliothek.jpg";
import demoPaketstation from "@/assets/demo-paketstation.jpg";
import demoHausverwaltung from "@/assets/demo-hausverwaltung.jpg";
import demoVersicherung from "@/assets/demo-versicherung.jpg";
import demoMietzahlung from "@/assets/demo-mietzahlung.jpg";
import demoVersicherungVerlaengerung from "@/assets/demo-versicherung-verlaengerung.jpg";

// Scenario ID to image mapping
const scenarioImages: Record<string, string> = {
  "arzt": demoArzttermin,
  "immobilien": demoBesichtigung,
  "werkstatt": demoWerkstatt,
  "ablesung": demoAblesung,
  "werkstatt-erinnerung": demoWerkstattErinnerung,
  "arzt-erinnerung": demoArztErinnerung,
  "therapie-erinnerung": demoTherapie,
  "einzelhandel-abholung": demoEinzelhandel,
  "werkstatt-fertig": demoWerkstattFertig,
  "apotheke-abholung": demoApotheke,
  "bibliothek-abholung": demoBibliothek,
  "logistik-abholung": demoPaketstation,
  "hausverwaltung": demoHausverwaltung,
  "versicherung": demoVersicherung,
  "mietzahlung": demoMietzahlung,
  "versicherung-verlaengerung": demoVersicherungVerlaengerung,
};

type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";

// Voice IDs for ElevenLabs - Male and Female options
const MALE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - male voice
const FEMALE_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah - female voice

// Determine gender based on scenario conversation
const detectAgentGender = (scenario: VoicebotScenario): "male" | "female" => {
  const firstAgentMsg = scenario.conversation.find(c => c.role === "agent")?.text || "";
  
  // Check for female agent indicators
  if (firstAgentMsg.includes("Therapeutin") || firstAgentMsg.includes("Ärztin")) {
    return "female";
  }
  // Default: female voice for most service scenarios
  return "female";
};

// Determine customer gender based on how they are addressed
const detectCustomerGender = (scenario: VoicebotScenario): "male" | "female" => {
  const fullText = scenario.conversation.map(c => c.text).join(" ");
  
  // Check if customer is addressed as "Herr" or "Frau"
  if (fullText.includes("Spreche ich mit Herrn") || 
      fullText.includes("mit Herrn") ||
      fullText.includes("Herr Schmidt") ||
      fullText.includes("Herr Müller") ||
      fullText.includes("Herr Bergmann") ||
      fullText.includes("Herr Schulz") ||
      fullText.includes("Herr Fischer")) {
    return "male";
  }
  if (fullText.includes("Spreche ich mit Frau") || 
      fullText.includes("mit Frau") ||
      fullText.includes("Frau Bauer") ||
      fullText.includes("Frau Weber") ||
      fullText.includes("Frau Meier") ||
      fullText.includes("Frau Wagner") ||
      fullText.includes("Frau Klein")) {
    return "female";
  }
  
  // For inbound calls, check customer self-introduction
  const customerMsgs = scenario.conversation.filter(c => c.role === "user").map(c => c.text).join(" ");
  if (customerMsgs.match(/(Thomas|Michael|Peter|Hans|Klaus|Stefan|Andreas|Martin|Frank)/)) {
    return "male";
  }
  if (customerMsgs.match(/(Lisa|Anna|Maria|Sandra|Petra|Claudia)/)) {
    return "female";
  }
  
  return "male";
};

// Industry use cases with marketing copy
const industryUseCases = [
  {
    id: "hausverwaltung",
    title: "Hausverwaltung",
    subtitle: "Property Management",
    icon: Building2,
    image: imgHausverwaltung,
    description: "Voicebots handhaben Mieteranfragen 24/7, automatisieren Wartungsanfragen, Mietzahlungserinnerungen und Besichtigungen. Das reduziert den Admin-Aufwand erheblich und verbessert die Mieterzufriedenheit.",
    examples: [
      {
        type: "inbound",
        title: "Wartungsanfrage",
        text: "Mieter ruft an: 'Ich habe einen Wasserschaden' - Bot erfasst Details, kategorisiert die Dringlichkeit und erstellt automatisch ein Ticket."
      },
      {
        type: "outbound",
        title: "Zahlungserinnerung",
        text: "Bot ruft an: 'Ihre Miete ist faellig in 3 Tagen' und bietet verschiedene Zahlungsoptionen an."
      }
    ],
    demoIdea: "Simulierter Anruf, bei dem der Bot eine Wartungsanfrage bearbeitet und einen Termin vereinbart.",
    stats: { value: "60%", label: "weniger Verwaltungsaufwand" },
    relatedScenarios: ["hausverwaltung", "mietzahlung"]
  },
  {
    id: "versicherung",
    title: "Versicherungen",
    subtitle: "Insurance Services",
    icon: Shield,
    image: imgVersicherung,
    description: "Bots qualifizieren Leads, bearbeiten Schadensmeldungen, geben Policen-Infos und erinnern an Verlaengerungen. Das minimiert Wartezeiten und steigert die Kundentreue.",
    examples: [
      {
        type: "inbound",
        title: "Policen-Anfrage",
        text: "Kunde fragt: 'Was deckt meine Haftpflicht ab?' - Bot erklaert die Leistungen und schlaegt passende Upgrades vor."
      },
      {
        type: "outbound",
        title: "Vertragsverlaengerung",
        text: "Erinnerung: 'Ihre Autoversicherung laeuft in 2 Wochen aus - moechten Sie verlaengern?' mit direkter Verlaengerungsoption."
      }
    ],
    demoIdea: "Interaktiver Call, der eine Schadensmeldung simuliert und einen Rueckruf-Termin plant.",
    stats: { value: "45%", label: "schnellere Schadensbearbeitung" },
    relatedScenarios: ["versicherung", "versicherung-verlaengerung"]
  },
  {
    id: "immobilien",
    title: "Immobilienbueros",
    subtitle: "Real Estate",
    icon: Home,
    image: imgImmobilien,
    description: "Automatisiert Lead-Qualifizierung, Besichtigungstermine fuer Wartelisten-Kunden und Follow-ups. Ideal fuer 24/7-Verfuegbarkeit und reduziert No-Shows durch intelligente Erinnerungen.",
    examples: [
      {
        type: "inbound",
        title: "Besichtigungstermin",
        text: "Kunde auf Warteliste: 'Ich moechte eine Besichtigung fuer die Wohnung in Berlin' - Bot prueft Verfuegbarkeit, bucht und sendet Kalender-Invite."
      },
      {
        type: "outbound",
        title: "Terminerinnerung",
        text: "Erinnerung: 'Ihre Besichtigung ist morgen um 14 Uhr - bestaetigen Sie?' mit direkter Rescheduling-Option."
      }
    ],
    demoIdea: "Voice-Simulation fuer Terminbuchung mit Integration in einen Kalender (z.B. Google Calendar).",
    stats: { value: "35%", label: "weniger No-Shows" },
    relatedScenarios: ["immobilien"]
  },
  {
    id: "ablesung",
    title: "Ablesedienste",
    subtitle: "Utility Services",
    icon: Zap,
    image: imgAblesung,
    description: "Bots planen Ablesetermine fuer Strom, Wasser, Gas und Heizung, erinnern an Zahlungen und bearbeiten Verbrauchsfragen. Das optimiert Feldarbeiten und reduziert Fehlablesungen.",
    examples: [
      {
        type: "inbound",
        title: "Terminbuchung",
        text: "Kunde meldet: 'Ich brauche einen Termin fuer Zaehlerablesung' - Bot schlaegt verfuegbare Slots vor und bucht direkt."
      },
      {
        type: "outbound",
        title: "Zahlungserinnerung",
        text: "'Ihre Stromrechnung ist faellig - zahlen Sie bequem per App oder Karte?' mit verschiedenen Optionen."
      }
    ],
    demoIdea: "Anruf-Skript fuer Ablesetermin-Vereinbarung mit automatischer SMS-Bestaetigung.",
    stats: { value: "40%", label: "weniger Terminausfaelle" },
    relatedScenarios: ["ablesung"]
  },
  {
    id: "arztpraxis",
    title: "Arztpraxen & Zahnaerzte",
    subtitle: "Medical Practices",
    icon: Stethoscope,
    image: imgArztpraxis,
    description: "Buchen von Vorsorgeuntersuchungen, Rezeptnachfuellungen und automatische Terminerinnerungen. DSGVO-konform und reduziert No-Shows um bis zu 30%.",
    examples: [
      {
        type: "inbound",
        title: "Vorsorgebuchung",
        text: "Patient: 'Ich moechte eine Zahnvorsorge buchen' - Bot checkt den Praxiskalender und bucht den passenden Termin."
      },
      {
        type: "outbound",
        title: "Terminerinnerung",
        text: "'Ihr Termin bei Dr. Mueller ist morgen - bestaetigen oder umbuchen?' mit direkter Antwortmoeglichkeit."
      }
    ],
    demoIdea: "Simulierter Call fuer Vorsorgebuchung mit Fokus auf Datenschutz und DSGVO-Konformitaet.",
    stats: { value: "30%", label: "weniger No-Shows" },
    relatedScenarios: ["arzt", "arzt-erinnerung"]
  },
  {
    id: "werkstatt",
    title: "Werkstaetten & Service",
    subtitle: "Automotive & Repair",
    icon: Wrench,
    image: imgWerkstatt,
    description: "Automatisierte Outbound-Calls reduzieren No-Shows, bestaetigen Werkstatttermine und bieten Rescheduling. Ideal fuer Auto-Werkstaetten, Elektronik-Reparatur und mehr.",
    examples: [
      {
        type: "inbound",
        title: "Werkstatttermin",
        text: "Kunde: 'Ich brauche einen Termin fuer die Hauptuntersuchung' - Bot erfasst Fahrzeugdaten und bucht."
      },
      {
        type: "outbound",
        title: "Reparatur-Erinnerung",
        text: "'Ihr Auto-Reparaturtermin ist uebermorgen - alles okay?' mit Option zur Umbuchung."
      }
    ],
    demoIdea: "Multi-Branchen-Simulation mit interaktiven Antwort-Optionen (z.B. 'Druecken Sie 1 zum Bestaetigen').",
    stats: { value: "40%", label: "weniger Terminausfaelle" },
    relatedScenarios: ["werkstatt", "werkstatt-erinnerung", "werkstatt-fertig"]
  },
  {
    id: "abholung",
    title: "Abholbenachrichtigungen",
    subtitle: "Pickup Notifications",
    icon: Package,
    image: imgAbholung,
    description: "Outbound-Calls informieren Kunden, wenn etwas abholbereit ist, und bieten Optionen wie Terminbuchung oder Lieferung. Reduziert Lagerkosten und verbessert den Kundenservice.",
    examples: [
      {
        type: "outbound",
        title: "Ware angekommen",
        text: "Einzelhandel: 'Ihre Bestellung ist da - abholen Sie sie ab oder lassen Sie liefern?' mit Entscheidungsoptionen."
      },
      {
        type: "outbound",
        title: "Reparatur erledigt",
        text: "Service: 'Ihr Geraet ist repariert - kommen Sie vorbei?' mit Oeffnungszeiten und Zahlungsoptionen."
      }
    ],
    demoIdea: "Voice-Bot, der eine Benachrichtigung sendet und auf Antworten reagiert (z.B. 'Ja, ich hole ab').",
    stats: { value: "25%", label: "weniger Lagerkosten" },
    relatedScenarios: ["einzelhandel-abholung", "werkstatt-fertig", "apotheke-abholung", "bibliothek-abholung", "logistik-abholung"]
  }
];

const keyBenefits = [
  { icon: Clock, title: "24/7 Erreichbarkeit", description: "Ihre Kunden erreichen Sie jederzeit - ohne Wartezeiten" },
  { icon: TrendingDown, title: "Bis zu 40% weniger No-Shows", description: "Automatische Erinnerungen reduzieren Terminausfaelle drastisch" },
  { icon: Users, title: "Entlastung Ihres Teams", description: "Mitarbeiter haben mehr Zeit fuer komplexe Aufgaben" },
  { icon: MessageSquare, title: "Natuerliche Gespraeche", description: "Modernste KI versteht und antwortet wie ein Mensch" }
];

const VoicebotDemos = () => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [activeScenario, setActiveScenario] = useState<VoicebotScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("alle");
  const abortRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakWithElevenLabs = useCallback(async (text: string, voiceId: string): Promise<void> => {
    if (abortRef.current) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ text, voiceId })
      });
      
      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (abortRef.current) return;

      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => {
          audioRef.current = null;
          resolve();
        };
        audio.onerror = e => {
          audioRef.current = null;
          reject(e);
        };
        if (abortRef.current) {
          resolve();
          return;
        }
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw error;
    }
  }, []);

  const speakWithBrowser = useCallback((text: string, isAgent: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (abortRef.current) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de')) || voices[0];
      if (germanVoice) utterance.voice = germanVoice;
      utterance.lang = 'de-DE';
      utterance.rate = 1.0;
      utterance.pitch = isAgent ? 0.9 : 1.2;
      utterance.onend = () => resolve();
      utterance.onerror = e => {
        if (e.error === 'interrupted' || e.error === 'canceled') {
          resolve();
        } else {
          reject(e);
        }
      };
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Main speak function that uses gender-appropriate voices based on scenario
  const speak = useCallback(async (text: string, role: "agent" | "user", scenario: VoicebotScenario): Promise<void> => {
    // Determine voice based on role and detected gender
    let voiceId: string;
    if (role === "agent") {
      voiceId = FEMALE_VOICE_ID; // Agent always uses female voice (service representative)
    } else {
      // Customer voice based on how they're addressed in the scenario
      const customerGender = detectCustomerGender(scenario);
      voiceId = customerGender === "male" ? MALE_VOICE_ID : FEMALE_VOICE_ID;
    }
    const isAgent = role === "agent";
    
    try {
      await speakWithElevenLabs(text, voiceId);
      return;
    } catch (error) {
      console.warn('ElevenLabs failed, falling back to browser TTS');
    }
    await speakWithBrowser(text, isAgent);
  }, [speakWithElevenLabs, speakWithBrowser]);

  const startDemo = async (scenario: VoicebotScenario) => {
    if (activeScenario && agentState !== "idle") {
      stopDemo();
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setActiveScenario(scenario);
    setAgentState("connecting");
    setTranscript([]);
    setIsLoading(true);
    abortRef.current = false;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 0; i < scenario.conversation.length; i++) {
        if (abortRef.current) break;
        const item = scenario.conversation[i];
        
        if (item.role === "agent") {
          setAgentState("speaking");
          setTranscript(prev => [...prev, `🤖 Agent: ${item.text}`]);
        } else {
          setAgentState("listening");
          setTranscript(prev => [...prev, `👤 Kunde: ${item.text}`]);
        }

        try {
          await speak(item.text, item.role, scenario);
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, item.text.length * 30));
        }

        if (i < scenario.conversation.length - 1 && !abortRef.current) {
          setAgentState("thinking");
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
      if (!abortRef.current) {
        setAgentState("idle");
      }
    } catch (error) {
      toast({
        title: "Demo-Fehler",
        description: "Es gab ein Problem. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
      setAgentState("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const stopDemo = () => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setAgentState("idle");
    setTranscript([]);
    setIsLoading(false);
    setActiveScenario(null);
  };

  const getScenariosByIds = (ids: string[]) => 
    voicebotScenarios.filter(s => ids.includes(s.id));

  const filteredScenarios = selectedCategory === "alle" 
    ? voicebotScenarios 
    : voicebotScenarios.filter(s => s.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Voicebot Demos & Anwendungsbeispiele | DeutLicht - KI-Sprachassistenten</title>
        <meta
          name="description"
          content="Erleben Sie unsere KI-Voicebots live: Terminvereinbarung, Kundenservice, Erinnerungen und Benachrichtigungen fuer Hausverwaltung, Versicherung, Arztpraxen, Werkstaetten und mehr."
        />
        <meta name="keywords" content="Voicebot, KI-Sprachassistent, Terminbuchung, Kundenservice Automatisierung, Telefonbot, Voice Agent" />
        <link rel="canonical" href="https://deutlicht.de/leistungen/voicebot-demos" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section - Landing Page Style */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6 border border-accent/30">
                <Bot className="w-4 h-4" />
                KI-Sprachassistenten der nächsten Generation
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Voicebots, die Ihre Kunden
                <span className="text-accent"> begeistern</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Erleben Sie live, wie unsere KI-Sprachassistenten Termine vereinbaren, 
                Kundenanfragen bearbeiten und Ihr Team entlasten - rund um die Uhr, 
                365 Tage im Jahr.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/projektanfrage">
                  <Button size="lg" className="group w-full sm:w-auto text-lg px-8">
                    <Phone className="w-5 h-5 mr-2" />
                    Jetzt Demo anfragen
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#demos">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    <Play className="w-5 h-5 mr-2" />
                    Demos anhoeren
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  DSGVO-konform
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Made in Germany
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Natuerliche Stimmen
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyBenefits.map((benefit, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-card rounded-xl p-6 border border-border text-center h-full">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Active Demo Player */}
        {activeScenario && (
          <section className="sticky top-20 z-40 bg-card border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-24 justify-center">
                  {agentState !== "idle" && Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        agentState === "speaking" ? "bg-accent" 
                        : agentState === "listening" ? "bg-primary" 
                        : "bg-muted-foreground"
                      }`}
                      style={{
                        height: agentState === "speaking" || agentState === "listening" 
                          ? `${Math.random() * 20 + 8}px` 
                          : "4px",
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  ))}
                  {agentState === "idle" && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{activeScenario.shortTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {agentState === "speaking" ? "Agent spricht..." 
                      : agentState === "listening" ? "Kunde spricht..." 
                      : agentState === "thinking" ? "Verarbeitet..." 
                      : agentState === "connecting" ? "Verbinde..."
                      : "Bereit"}
                  </p>
                </div>

                <Button onClick={stopDemo} variant="destructive" size="sm">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Beenden
                </Button>
              </div>

              {transcript.length > 0 && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg max-h-32 overflow-y-auto">
                  <div className="space-y-1">
                    {transcript.slice(-4).map((line, i) => (
                      <p key={i} className="text-sm text-foreground">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Industry Use Cases */}
        <section id="demos" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-16">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Branchenspezifische Loesungen
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Voicebots fuer jede Branche
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Von Hausverwaltung bis Arztpraxis - unsere KI-Sprachassistenten sind 
                massgeschneidert fuer Ihre Branche und Ihre spezifischen Anforderungen.
              </p>
            </ScrollReveal>

            <div className="space-y-24">
              {industryUseCases.map((industry, index) => {
                const relatedScenarios = getScenariosByIds(industry.relatedScenarios);
                
                return (
                  <ScrollReveal key={industry.id} direction={index % 2 === 0 ? "left" : "right"}>
                    <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}>
                      {/* Image & Stats */}
                      <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                          <img 
                            src={industry.image} 
                            alt={industry.title}
                            className="w-full h-80 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                              <p className="font-display text-3xl font-bold text-white">{industry.stats.value}</p>
                              <p className="text-white/80 text-sm">{industry.stats.label}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                            <industry.icon className="w-7 h-7 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                              {industry.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">{industry.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          {industry.description}
                        </p>

                        {/* Examples */}
                        <div className="space-y-4 mb-8">
                          {industry.examples.map((example, i) => (
                            <div key={i} className="bg-muted/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center gap-2 mb-2">
                                {example.type === "inbound" ? (
                                  <PhoneIncoming className="w-4 h-4 text-green-500" />
                                ) : (
                                  <PhoneOutgoing className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="font-semibold text-foreground text-sm">{example.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  example.type === "inbound" 
                                    ? "bg-green-500/20 text-green-600" 
                                    : "bg-blue-500/20 text-blue-600"
                                }`}>
                                  {example.type === "inbound" ? "Inbound" : "Outbound"}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm">{example.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Demo Buttons */}
                        {relatedScenarios.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                              <Volume2 className="w-4 h-4" />
                              Demo anhoeren:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {relatedScenarios.map(scenario => {
                                const isActive = activeScenario?.id === scenario.id;
                                return (
                                  <Button
                                    key={scenario.id}
                                    variant={isActive ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => isActive ? stopDemo() : startDemo(scenario)}
                                    disabled={isLoading && !isActive}
                                    className="text-xs"
                                  >
                                    {isActive ? (
                                      <>
                                        <PhoneOff className="w-3 h-3 mr-1" />
                                        Stop
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-3 h-3 mr-1" />
                                        {scenario.shortTitle}
                                      </>
                                    )}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Demos Grid */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Alle Demo-Szenarien
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Testen Sie alle verfuegbaren Voicebot-Demos und erleben Sie die Vielfalt unserer KI-Sprachassistenten.
              </p>
            </ScrollReveal>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setSelectedCategory("alle")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === "alle"
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                Alle ({voicebotScenarios.length})
              </button>
              {voicebotCategories.map(cat => {
                const count = voicebotScenarios.filter(s => s.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "bg-accent text-accent-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.title} ({count})
                  </button>
                );
              })}
            </div>

            {/* Demo Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredScenarios.map((scenario, index) => {
                const isActive = activeScenario?.id === scenario.id;
                
                return (
                  <ScrollReveal key={scenario.id} delay={index * 30}>
                    <div className={`rounded-xl border overflow-hidden h-full flex flex-col transition-all ${
                      isActive ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                    }`}>
                      {/* Background Image Header */}
                      <div 
                        className="relative h-28 bg-cover bg-center"
                        style={{ backgroundImage: `url(${scenarioImages[scenario.id] || demoArzttermin})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                          <div className="w-10 h-10 bg-accent/90 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                            <scenario.icon className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm ${
                            scenario.type === "inbound" 
                              ? "bg-green-500/80 text-white" 
                              : "bg-blue-500/80 text-white"
                          }`}>
                            {scenario.type === "inbound" ? (
                              <PhoneIncoming className="w-3 h-3" />
                            ) : (
                              <PhoneOutgoing className="w-3 h-3" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col flex-1 bg-card">
                        <h3 className="font-semibold text-foreground text-sm mb-2">
                          {scenario.shortTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2">
                          {scenario.description}
                        </p>

                        {isActive ? (
                          <Button 
                            onClick={stopDemo} 
                            variant="destructive" 
                            size="sm"
                            className="w-full"
                          >
                            <PhoneOff className="w-4 h-4 mr-2" />
                            Beenden
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => startDemo(scenario)} 
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isLoading && activeScenario !== null}
                          >
                            {isLoading && activeScenario?.id === scenario.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4 mr-2" />
                            )}
                            Anhören
                          </Button>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                So funktioniert es
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-4 mb-4">
                Inbound vs. Outbound Voicebots
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="bg-card rounded-xl p-8 border border-border h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <PhoneIncoming className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Inbound-Anrufe
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Der Voicebot nimmt eingehende Anrufe entgegen und bearbeitet Kundenanfragen selbststaendig.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Terminvereinbarung (Arzt, Werkstatt, Immobilien)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Schadensmeldungen (Versicherung)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Wartungsanfragen (Hausverwaltung)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Bestellstatus & FAQ</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="bg-card rounded-xl p-8 border border-border h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <PhoneOutgoing className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Outbound-Anrufe
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Der Voicebot ruft proaktiv Kunden an, um zu informieren, zu erinnern oder nachzufassen.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Terminerinnerungen (alle Branchen)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Abholbenachrichtigungen (Retail, Apotheke)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Zahlungserinnerungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">Vertragsverlaengerungen</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Sparkles className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Bereit fuer Ihren eigenen Voicebot?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Wir entwickeln massgeschneiderte KI-Sprachassistenten fuer Ihr Unternehmen. 
                Von der Konzeption ueber das Training bis zur Integration - alles aus einer Hand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projektanfrage">
                  <Button size="lg" className="group w-full sm:w-auto text-lg px-8 bg-accent hover:bg-accent/90 text-white">
                    Projektanfrage starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-white text-white hover:bg-white/10">
                    <Phone className="w-5 h-5 mr-2" />
                    Kostenlose Beratung
                  </Button>
                </Link>
              </div>
              
              <p className="text-primary-foreground/60 text-sm mt-8">
                Stellen Sie sicher, dass Ihr Lautsprecher eingeschaltet ist, um die Demos zu hoeren.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default VoicebotDemos;
