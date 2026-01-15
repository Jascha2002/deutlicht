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
  Pause
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

type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";

// Voice IDs for ElevenLabs
const AGENT_VOICE_ID = "MbbPUteESkJWr4IAaW35";
const USER_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

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

  const speak = useCallback(async (text: string, role: "agent" | "user"): Promise<void> => {
    const voiceId = role === "agent" ? AGENT_VOICE_ID : USER_VOICE_ID;
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
          await speak(item.text, item.role);
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

  const filteredScenarios = selectedCategory === "alle" 
    ? voicebotScenarios 
    : voicebotScenarios.filter(s => s.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Voicebot Demos | DeutLicht® - KI-Sprachassistenten für jede Branche</title>
        <meta
          name="description"
          content="Interaktive Demos unserer KI-Voicebots für Terminvereinbarung, Kundenservice, Erinnerungen und Benachrichtigungen. Erleben Sie unsere Sprachassistenten live."
        />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <AnimatedLogo size="sm" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Interaktive Voicebot-Demos
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                KI-Sprachassistenten
                <span className="text-accent"> live erleben</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Testen Sie unsere Voicebots für verschiedene Branchen und Anwendungsfälle. 
                Von Terminvereinbarung bis Kundenservice – hören Sie, wie natürlich KI kommunizieren kann.
              </p>
            </div>
          </div>
        </section>

        {/* Active Demo Player */}
        {activeScenario && (
          <section className="sticky top-20 z-40 bg-card border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                {/* Visualizer */}
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

                {/* Info */}
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

                {/* Stop Button */}
                <Button onClick={stopDemo} variant="destructive" size="sm">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Beenden
                </Button>
              </div>

              {/* Transcript */}
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

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory("alle")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === "alle"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Alle Demos
              </button>
              {voicebotCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map((scenario, index) => {
                const isActive = activeScenario?.id === scenario.id;
                
                return (
                  <ScrollReveal key={scenario.id} delay={index * 50}>
                    <div className={`bg-card rounded-xl border shadow-lg overflow-hidden h-full flex flex-col transition-all ${
                      isActive ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                    }`}>
                      {/* Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <scenario.icon className="w-6 h-6 text-accent" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            scenario.type === "inbound" 
                              ? "bg-green-500/20 text-green-600" 
                              : "bg-blue-500/20 text-blue-600"
                          }`}>
                            {scenario.type === "inbound" ? (
                              <>
                                <PhoneIncoming className="w-3 h-3" />
                                Eingehend
                              </>
                            ) : (
                              <>
                                <PhoneOutgoing className="w-3 h-3" />
                                Ausgehend
                              </>
                            )}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {scenario.description}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="px-6 pb-4 flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Vorteile</p>
                        <ul className="space-y-1">
                          {scenario.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action */}
                      <div className="p-6 pt-4 border-t border-border bg-muted/30">
                        {isActive ? (
                          <Button 
                            onClick={stopDemo} 
                            variant="destructive" 
                            className="w-full"
                          >
                            <PhoneOff className="w-4 h-4 mr-2" />
                            Demo beenden
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => startDemo(scenario)} 
                            className="w-full group"
                            disabled={isLoading && activeScenario !== null}
                          >
                            {isLoading && activeScenario?.id === scenario.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Phone className="w-4 h-4 mr-2" />
                            )}
                            Demo anhören
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

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
                Bereit für Ihren eigenen Voicebot?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Wir entwickeln maßgeschneiderte KI-Sprachassistenten für Ihr Unternehmen. 
                Von der Konzeption bis zur Integration – alles aus einer Hand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/projektanfrage">
                  <Button size="lg" variant="secondary" className="group w-full sm:w-auto">
                    Projektanfrage starten
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Kostenlose Beratung
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="text-center mb-12">
              <span className="text-accent font-medium uppercase tracking-widest text-sm">
                Anwendungsbeispiele
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-4 mb-6">
                Voicebots in der Praxis
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <PhoneIncoming className="w-6 h-6 text-green-500" />
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Inbound-Anwendungen
                    </h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Terminvereinbarung (Arzt, Werkstatt, Immobilien)</li>
                    <li>• Schadensmeldung (Versicherung)</li>
                    <li>• Wartungsanfragen (Hausverwaltung)</li>
                    <li>• Bestellstatus & Support</li>
                    <li>• FAQ & Produktinformationen</li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <PhoneOutgoing className="w-6 h-6 text-blue-500" />
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      Outbound-Anwendungen
                    </h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Terminerinnerungen (Werkstatt, Arzt, Therapie)</li>
                    <li>• Abholbenachrichtigungen (Retail, Apotheke)</li>
                    <li>• Zahlungserinnerungen</li>
                    <li>• Vertragsverlängerungen</li>
                    <li>• Umfragen & Feedback</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default VoicebotDemos;
