import { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";

const VoiceAgentDemo = () => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  
  // Demo conversation simulation
  const demoConversation = [
    { role: "agent", text: "Guten Tag! Wie kann ich Ihnen heute helfen?" },
    { role: "user", text: "Ich möchte den Status meiner Bestellung abfragen." },
    { role: "agent", text: "Natürlich! Können Sie mir bitte Ihre Bestellnummer nennen?" },
    { role: "user", text: "Meine Bestellnummer ist 12345." },
    { role: "agent", text: "Vielen Dank. Ihre Bestellung wurde heute versendet und wird morgen bei Ihnen eintreffen. Kann ich Ihnen noch bei etwas anderem helfen?" },
  ];

  const startDemo = () => {
    setAgentState("connecting");
    setTranscript([]);
    
    setTimeout(() => {
      setAgentState("speaking");
      let index = 0;
      
      const playConversation = () => {
        if (index >= demoConversation.length) {
          setAgentState("idle");
          return;
        }
        
        const item = demoConversation[index];
        setAgentState(item.role === "agent" ? "speaking" : "listening");
        
        setTimeout(() => {
          setTranscript(prev => [...prev, `${item.role === "agent" ? "🤖 Agent" : "👤 Kunde"}: ${item.text}`]);
          index++;
          
          if (index < demoConversation.length) {
            setAgentState("thinking");
            setTimeout(playConversation, 1000);
          } else {
            setTimeout(() => setAgentState("idle"), 1500);
          }
        }, item.text.length * 40);
      };
      
      playConversation();
    }, 1500);
  };

  const stopDemo = () => {
    setAgentState("idle");
    setTranscript([]);
  };

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
        <Phone className="w-5 h-5 text-accent" />
        Live Demo: KI-Sprachassistent
      </h3>
      
      {/* Voice Visualizer */}
      <div className="relative h-32 bg-muted/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
        {agentState === "idle" ? (
          <p className="text-muted-foreground text-sm">Klicken Sie auf "Demo starten" für eine Vorführung</p>
        ) : (
          <div className="flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  agentState === "speaking" 
                    ? "bg-accent animate-pulse" 
                    : agentState === "listening"
                    ? "bg-primary animate-pulse"
                    : agentState === "thinking"
                    ? "bg-muted-foreground"
                    : "bg-muted-foreground/50"
                }`}
                style={{
                  height: agentState === "speaking" || agentState === "listening"
                    ? `${Math.random() * 60 + 20}px`
                    : agentState === "thinking"
                    ? "8px"
                    : "4px",
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
            agentState === "idle" ? "bg-muted-foreground" :
            agentState === "connecting" ? "bg-yellow-500 animate-pulse" :
            agentState === "speaking" ? "bg-accent animate-pulse" :
            agentState === "listening" ? "bg-primary animate-pulse" :
            "bg-orange-500 animate-pulse"
          }`} />
          <span className="text-xs text-muted-foreground capitalize">
            {agentState === "idle" ? "Bereit" :
             agentState === "connecting" ? "Verbinde..." :
             agentState === "speaking" ? "Agent spricht" :
             agentState === "listening" ? "Hört zu" :
             "Verarbeitet..."}
          </span>
        </div>
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
          <Button onClick={startDemo} className="flex-1 group">
            <Phone className="w-4 h-4 mr-2" />
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
          <span>Natürliche Stimme</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentDemo;
