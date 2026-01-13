import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2, Package, Calendar, AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";
type DemoScenario = {
  id: string;
  title: string;
  icon: typeof Package;
  conversation: {
    role: "agent" | "user";
    text: string;
  }[];
};
const demoScenarios: DemoScenario[] = [{
  id: "bestellung",
  title: "Bestellstatus",
  icon: Package,
  conversation: [{
    role: "agent",
    text: "Guten Tag! Wie kann ich Ihnen heute helfen?"
  }, {
    role: "user",
    text: "Ich möchte den Status meiner Bestellung abfragen."
  }, {
    role: "agent",
    text: "Natürlich! Können Sie mir bitte Ihre Bestellnummer nennen?"
  }, {
    role: "user",
    text: "Meine Bestellnummer ist 12345."
  }, {
    role: "agent",
    text: "Vielen Dank. Ihre Bestellung wurde heute versendet und wird morgen bei Ihnen eintreffen."
  }]
}, {
  id: "termin",
  title: "Terminvereinbarung",
  icon: Calendar,
  conversation: [{
    role: "agent",
    text: "Willkommen bei der Terminvereinbarung. Wie kann ich Ihnen helfen?"
  }, {
    role: "user",
    text: "Ich möchte gerne einen Beratungstermin vereinbaren."
  }, {
    role: "agent",
    text: "Sehr gerne! Für welchen Service benötigen Sie die Beratung?"
  }, {
    role: "user",
    text: "Es geht um die Einführung eines CRM-Systems."
  }, {
    role: "agent",
    text: "Perfekt. Ich habe freie Termine am Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr."
  }, {
    role: "user",
    text: "Donnerstag um 14 Uhr wäre ideal."
  }, {
    role: "agent",
    text: "Hervorragend! Ich habe Ihren Termin eingetragen. Sie erhalten eine Bestätigung per E-Mail."
  }]
}, {
  id: "reklamation",
  title: "Reklamation",
  icon: AlertCircle,
  conversation: [{
    role: "agent",
    text: "Guten Tag! Wie kann ich Ihnen behilflich sein?"
  }, {
    role: "user",
    text: "Ich habe ein defektes Produkt erhalten und möchte reklamieren."
  }, {
    role: "agent",
    text: "Das tut mir sehr leid. Können Sie mir bitte Ihre Bestellnummer nennen?"
  }, {
    role: "user",
    text: "Die Bestellnummer ist 78901."
  }, {
    role: "agent",
    text: "Ich habe einen Rücksendeschein erstellt. Sobald wir das Gerät erhalten, senden wir Ersatz."
  }]
}, {
  id: "faq",
  title: "FAQ & Support",
  icon: HelpCircle,
  conversation: [{
    role: "agent",
    text: "Herzlich willkommen beim Support! Was kann ich für Sie tun?"
  }, {
    role: "user",
    text: "Wie kann ich mein Passwort zurücksetzen?"
  }, {
    role: "agent",
    text: "Klicken Sie auf Passwort vergessen. Sie erhalten dann eine E-Mail mit einem Link."
  }, {
    role: "user",
    text: "Ja, das wäre super."
  }, {
    role: "agent",
    text: "Ich habe eine E-Mail gesendet. Der Link ist 24 Stunden gültig."
  }]
}];

// Voice ID for "Grim Indian Leopard" - custom ElevenLabs voice
const ELEVENLABS_VOICE_ID = "MbbPUteESkJWr4IAaW35";
const VoiceAgentDemo = () => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(demoScenarios[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [useElevenLabs, setUseElevenLabs] = useState(true);
  const abortRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    toast
  } = useToast();

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

  // ElevenLabs TTS function
  const speakWithElevenLabs = useCallback(async (text: string): Promise<void> => {
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
          voiceId: ELEVENLABS_VOICE_ID
        })
      });
      if (!response.ok) {
        let serverMessage = `TTS request failed: ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error) serverMessage = errJson.error;
          if (errJson?.details) {
            // keep details for console only
            console.warn("TTS details:", errJson.details);
          }
        } catch {
          // ignore JSON parse errors
        }
        toast({
          title: "ElevenLabs TTS nicht verfügbar",
          description: "Der API-Key wird von ElevenLabs abgelehnt (z.B. keine Berechtigung, ungültig oder Free-Tier gesperrt).",
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
  }, []);

  // Browser TTS fallback
  const speakWithBrowser = useCallback((text: string): Promise<void> => {
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
      utterance.pitch = 1.0;
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

  // Main speak function that tries ElevenLabs first, falls back to browser
  const speak = useCallback(async (text: string): Promise<void> => {
    if (useElevenLabs) {
      try {
        await speakWithElevenLabs(text);
        return;
      } catch (error) {
        console.warn('ElevenLabs failed, falling back to browser TTS:', error);
        // Don't disable ElevenLabs permanently, just use fallback for this utterance
      }
    }

    // Fallback to browser TTS
    await speakWithBrowser(text);
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
            await speak(item.text);
          } catch (error) {
            console.error('Speech error:', error);
            // Fallback: just wait based on text length
            await new Promise(resolve => setTimeout(resolve, item.text.length * 30));
          }
        } else {
          setAgentState("listening");
          setTranscript(prev => [...prev, `👤 Kunde: ${item.text}`]);
          await new Promise(resolve => setTimeout(resolve, item.text.length * 25));
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

    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Stop browser TTS
    window.speechSynthesis.cancel();
    setAgentState("idle");
    setTranscript([]);
    setIsLoading(false);
  };
  return <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
      <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
        <Phone className="w-5 h-5 text-accent" />
        Live Demo: KI-Sprachassistent
        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full"> TTS</span>
      </h3>
      
      {/* Scenario Selection */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Wählen Sie ein Szenario:</p>
        <div className="grid grid-cols-2 gap-2">
          {demoScenarios.map(scenario => <button key={scenario.id} onClick={() => {
          if (agentState === "idle") {
            setSelectedScenario(scenario);
            setTranscript([]);
          }
        }} disabled={agentState !== "idle"} className={`flex items-center gap-2 p-3 rounded-lg text-left text-sm transition-all ${selectedScenario.id === scenario.id ? "bg-accent/20 border-accent border-2 text-foreground" : "bg-muted/50 border border-border hover:bg-muted text-muted-foreground"} ${agentState !== "idle" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
              <scenario.icon className={`w-4 h-4 ${selectedScenario.id === scenario.id ? "text-accent" : ""}`} />
              <span>{scenario.title}</span>
            </button>)}
        </div>
      </div>
      
      {/* Voice Visualizer */}
      <div className="relative h-28 bg-muted/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
        {agentState === "idle" ? <p className="text-muted-foreground text-sm text-center px-4">
            Klicken Sie auf "Demo starten" für: <strong>{selectedScenario.title}</strong>
          </p> : <div className="flex items-center gap-1">
            {Array.from({
          length: 20
        }).map((_, i) => <div key={i} className={`w-1 rounded-full transition-all duration-150 ${agentState === "speaking" ? "bg-accent animate-pulse" : agentState === "listening" ? "bg-primary animate-pulse" : agentState === "thinking" ? "bg-muted-foreground" : "bg-muted-foreground/50"}`} style={{
          height: agentState === "speaking" || agentState === "listening" ? `${Math.random() * 50 + 15}px` : agentState === "thinking" ? "8px" : "4px",
          animationDelay: `${i * 50}ms`,
          animationDuration: `${300 + Math.random() * 200}ms`
        }} />)}
          </div>}
        
        {/* Status indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${agentState === "idle" ? "bg-muted-foreground" : agentState === "connecting" ? "bg-yellow-500 animate-pulse" : agentState === "speaking" ? "bg-accent animate-pulse" : agentState === "listening" ? "bg-primary animate-pulse" : "bg-orange-500 animate-pulse"}`} />
          <span className="text-xs text-muted-foreground capitalize">
            {agentState === "idle" ? "Bereit" : agentState === "connecting" ? "Verbinde..." : agentState === "speaking" ? "Agent spricht" : agentState === "listening" ? "Hört zu" : "Verarbeitet..."}
          </span>
        </div>

        {/* Volume indicator when speaking */}
        {agentState === "speaking" && <div className="absolute top-3 right-3">
            <Volume2 className="w-5 h-5 text-accent animate-pulse" />
          </div>}
      </div>
      
      {/* Transcript */}
      {transcript.length > 0 && <div className="bg-muted/30 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Gesprächsverlauf</p>
          <div className="space-y-2">
            {transcript.map((line, i) => <p key={i} className="text-sm text-foreground">{line}</p>)}
          </div>
        </div>}
      
      {/* Controls */}
      <div className="flex gap-3">
        {agentState === "idle" ? <Button onClick={startDemo} className="flex-1 group" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Phone className="w-4 h-4 mr-2" />}
            Demo starten
          </Button> : <Button onClick={stopDemo} variant="destructive" className="flex-1">
            <PhoneOff className="w-4 h-4 mr-2" />
            Beenden
          </Button>}
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
      
      <p className="text-xs text-muted-foreground mt-4 text-center">
        🔊 Stellen Sie sicher, dass Ihr Lautsprecher eingeschaltet ist
      </p>
    </div>;
};
export default VoiceAgentDemo;