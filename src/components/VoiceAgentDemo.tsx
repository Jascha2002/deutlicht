import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  Volume2, 
  Loader2, 
  ChevronDown,
  PhoneIncoming,
  PhoneOutgoing
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { voicebotScenarios, voicebotCategories, type VoicebotScenario } from "@/data/voicebotScenarios";

type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";

// Voice IDs for ElevenLabs - Male and Female options
const MALE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - male voice
const FEMALE_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah - female voice

// Determine gender based on scenario conversation
// Checks if agent is addressed as "Herr" (male) or "Frau" (female)
const detectAgentGender = (scenario: VoicebotScenario): "male" | "female" => {
  const fullText = scenario.conversation.map(c => c.text).join(" ");
  
  // Check for outbound scenarios where agent introduces themselves
  // "Spreche ich mit Herrn X" means the CUSTOMER is male, agent could be either
  // We need to check if the agent says something like "Ich bin Herr/Frau X"
  
  // Check first agent message for self-introduction patterns
  const firstAgentMsg = scenario.conversation.find(c => c.role === "agent")?.text || "";
  
  // Common patterns: "Praxis Dr. Müller" (male doctor), "Therapeutin Sandra Koch" (female)
  if (firstAgentMsg.includes("Therapeutin") || firstAgentMsg.includes("Ärztin")) {
    return "female";
  }
  if (firstAgentMsg.includes("Dr. Müller") || firstAgentMsg.includes("Autohaus Schmidt")) {
    return "male";
  }
  
  // Default: use female voice for most service scenarios (more neutral/friendly)
  return "female";
};

// Determine customer gender based on how they are addressed in outbound calls
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
  
  // For inbound calls, check how customer introduces themselves
  const customerMsgs = scenario.conversation.filter(c => c.role === "user").map(c => c.text).join(" ");
  if (customerMsgs.includes("Thomas Schmidt") || 
      customerMsgs.includes("Michael Bergmann") ||
      customerMsgs.includes("mein Name ist") && customerMsgs.match(/Name ist [A-Z][a-z]+ [A-Z]/)) {
    // Check for male first names
    if (customerMsgs.match(/(Thomas|Michael|Peter|Hans|Klaus|Stefan|Andreas|Martin|Frank)/)) {
      return "male";
    }
  }
  if (customerMsgs.includes("Lisa Bauer") || customerMsgs.match(/(Lisa|Anna|Maria|Sandra|Petra|Claudia)/)) {
    return "female";
  }
  
  // Default to male for generic customer
  return "male";
};

const VoiceAgentDemo = () => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<VoicebotScenario>(voicebotScenarios[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const abortRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // ElevenLabs TTS function with voice selection
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
        body: JSON.stringify({
          text,
          voiceId
        })
      });
      if (!response.ok) {
        let serverMessage = `TTS request failed: ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error) serverMessage = errJson.error;
          if (errJson?.details) {
            console.warn("TTS details:", errJson.details);
          }
        } catch {
          // ignore JSON parse errors
        }
        toast({
          title: "ElevenLabs TTS nicht verfügbar",
          description: "Der API-Key wird von ElevenLabs abgelehnt.",
          variant: "destructive"
        });
        throw new Error(serverMessage);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (abortRef.current) return;

      // Play audio using data URI
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
  }, [toast]);

  // Browser TTS fallback with pitch variation for different speakers
  const speakWithBrowser = useCallback((text: string, isAgent: boolean): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (abortRef.current) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find(v => v.lang.startsWith('de')) || voices.find(v => v.name.toLowerCase().includes('german')) || voices[0];
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      utterance.lang = 'de-DE';
      utterance.rate = 1.0;
      // Different pitch for agent vs user to distinguish speakers
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
    
    if (useElevenLabs) {
      try {
        await speakWithElevenLabs(text, voiceId);
        return;
      } catch (error) {
        console.warn('ElevenLabs failed, falling back to browser TTS:', error);
      }
    }

    // Fallback to browser TTS
    await speakWithBrowser(text, isAgent);
  }, [useElevenLabs, speakWithElevenLabs, speakWithBrowser]);

  const startDemo = async () => {
    setAgentState("connecting");
    setTranscript([]);
    setIsLoading(true);
    abortRef.current = false;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 0; i < selectedScenario.conversation.length; i++) {
        if (abortRef.current) break;
        const item = selectedScenario.conversation[i];
        if (item.role === "agent") {
          setAgentState("speaking");
          setTranscript(prev => [...prev, `🤖 Agent: ${item.text}`]);
          try {
            await speak(item.text, "agent", selectedScenario);
          } catch (error) {
            console.error('Speech error:', error);
            await new Promise(resolve => setTimeout(resolve, item.text.length * 30));
          }
        } else {
          setAgentState("listening");
          setTranscript(prev => [...prev, `👤 Kunde: ${item.text}`]);
          try {
            await speak(item.text, "user", selectedScenario);
          } catch (error) {
            console.error('Speech error:', error);
            await new Promise(resolve => setTimeout(resolve, item.text.length * 30));
          }
        }
        if (i < selectedScenario.conversation.length - 1 && !abortRef.current) {
          setAgentState("thinking");
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
      if (!abortRef.current) {
        setAgentState("idle");
      }
    } catch (error) {
      console.error('Demo error:', error);
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
  };

  const handleCategoryHover = (categoryId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  };

  const handleScenarioSelect = (scenario: VoicebotScenario) => {
    if (agentState === "idle") {
      setSelectedScenario(scenario);
      setTranscript([]);
      setOpenCategory(null);
    }
  };

  const getScenariosByCategory = (categoryId: string) => 
    voicebotScenarios.filter(s => s.category === categoryId);

  return (
    <div className="rounded-2xl p-6 md:p-8 shadow-lg border border-border bg-inherit">
      <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
        <Phone className="w-5 h-5 text-accent" />
        Live Demo: KI-Sprachassistent
        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">TTS</span>
      </h3>
      
      {/* Category Dropdown Menu */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Wählen Sie eine Kategorie:</p>
        <div className="grid grid-cols-2 gap-3">
          {voicebotCategories.map(category => {
            const categoryScenarios = getScenariosByCategory(category.id);
            const isOpen = openCategory === category.id;
            const hasSelectedInCategory = categoryScenarios.some(s => s.id === selectedScenario.id);
            
            return (
              <div 
                key={category.id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category.id)}
                onMouseLeave={handleCategoryLeave}
              >
                <button
                  disabled={agentState !== "idle"}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg text-left text-sm transition-all min-h-[52px] ${
                    hasSelectedInCategory 
                      ? "bg-accent/20 border-accent border-2 text-foreground" 
                      : "bg-muted/50 border border-border hover:bg-muted text-muted-foreground"
                  } ${agentState !== "idle" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-2">
                    <category.icon className={`w-4 h-4 ${hasSelectedInCategory ? "text-accent" : ""}`} />
                    <span className="truncate">{category.title}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                
                {/* Dropdown */}
                {isOpen && agentState === "idle" && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 py-1 min-w-[200px]"
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    {categoryScenarios.map(scenario => (
                      <button
                        key={scenario.id}
                        onClick={() => handleScenarioSelect(scenario)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                          selectedScenario.id === scenario.id 
                            ? "bg-accent/20 text-accent" 
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {scenario.type === "inbound" ? (
                          <PhoneIncoming className="w-3 h-3 text-green-500" />
                        ) : (
                          <PhoneOutgoing className="w-3 h-3 text-blue-500" />
                        )}
                        <span>{scenario.shortTitle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Scenario Info */}
      <div className="mb-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <selectedScenario.icon className="w-5 h-5 text-accent" />
          <h4 className="font-semibold text-foreground">{selectedScenario.title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            selectedScenario.type === "inbound" 
              ? "bg-green-500/20 text-green-600" 
              : "bg-blue-500/20 text-blue-600"
          }`}>
            {selectedScenario.type === "inbound" ? "Eingehend" : "Ausgehend"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{selectedScenario.description}</p>
      </div>
      
      {/* Voice Visualizer */}
      <div className="relative h-28 bg-muted/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
        {agentState === "idle" ? (
          <p className="text-muted-foreground text-sm text-center px-4">
            Klicken Sie auf "Demo starten" für: <strong>{selectedScenario.shortTitle}</strong>
          </p>
        ) : (
          <div className="flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  agentState === "speaking" ? "bg-accent animate-pulse" 
                  : agentState === "listening" ? "bg-primary animate-pulse" 
                  : agentState === "thinking" ? "bg-muted-foreground" 
                  : "bg-muted-foreground/50"
                }`}
                style={{
                  height: agentState === "speaking" || agentState === "listening" 
                    ? `${Math.random() * 50 + 15}px` 
                    : agentState === "thinking" ? "8px" : "4px",
                  animationDelay: `${i * 50}ms`,
                  animationDuration: `${300 + Math.random() * 200}ms`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Status indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            agentState === "idle" ? "bg-muted-foreground" 
            : agentState === "connecting" ? "bg-yellow-500 animate-pulse" 
            : agentState === "speaking" ? "bg-accent animate-pulse" 
            : agentState === "listening" ? "bg-primary animate-pulse" 
            : "bg-orange-500 animate-pulse"
          }`} />
          <span className="text-xs text-muted-foreground capitalize">
            {agentState === "idle" ? "Bereit" 
              : agentState === "connecting" ? "Verbinde..." 
              : agentState === "speaking" ? "Agent spricht" 
              : agentState === "listening" ? "Kunde spricht" 
              : "Verarbeitet..."}
          </span>
        </div>

        {/* Volume indicator when speaking */}
        {(agentState === "speaking" || agentState === "listening") && (
          <div className="absolute top-3 right-3">
            <Volume2 className={`w-5 h-5 animate-pulse ${
              agentState === "speaking" ? "text-accent" : "text-primary"
            }`} />
          </div>
        )}
      </div>
      
      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Gesprächsverlauf</p>
          <div className="space-y-2">
            {transcript.map((line, i) => (
              <p key={i} className="text-sm text-foreground">{line}</p>
            ))}
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="flex gap-3">
        {agentState === "idle" ? (
          <Button onClick={startDemo} className="flex-1 group" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
            Demo starten
          </Button>
        ) : (
          <Button onClick={stopDemo} variant="destructive" className="flex-1">
            <PhoneOff className="w-4 h-4 mr-2" />
            Beenden
          </Button>
        )}
      </div>
      
      {/* Features */}
      <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mic className="w-4 h-4 text-accent" />
          <span>Spracherkennung</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="w-4 h-4 text-accent" />
          <span>DeutLicht Stimme</span>
        </div>
      </div>

      {/* Link to all demos */}
      <div className="mt-4 pt-4 border-t border-border text-center">
        <Link 
          to="/leistungen/voicebot-demos" 
          className="text-sm text-accent hover:underline inline-flex items-center gap-1"
        >
          Alle Voicebot-Demos & Anwendungsbeispiele →
        </Link>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        🔊 Stellen Sie sicher, dass Ihr Lautsprecher eingeschaltet ist
      </p>
    </div>
  );
};

export default VoiceAgentDemo;
