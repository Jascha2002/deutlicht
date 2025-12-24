import { useState } from "react";
import { Phone, PhoneOff, Mic, Volume2, Package, Calendar, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type AgentState = "idle" | "connecting" | "listening" | "speaking" | "thinking";

type DemoScenario = {
  id: string;
  title: string;
  icon: typeof Package;
  conversation: { role: "agent" | "user"; text: string }[];
};

const demoScenarios: DemoScenario[] = [
  {
    id: "bestellung",
    title: "Bestellstatus",
    icon: Package,
    conversation: [
      { role: "agent", text: "Guten Tag! Wie kann ich Ihnen heute helfen?" },
      { role: "user", text: "Ich möchte den Status meiner Bestellung abfragen." },
      { role: "agent", text: "Natürlich! Können Sie mir bitte Ihre Bestellnummer nennen?" },
      { role: "user", text: "Meine Bestellnummer ist 12345." },
      { role: "agent", text: "Vielen Dank. Ihre Bestellung wurde heute versendet und wird morgen bei Ihnen eintreffen. Kann ich Ihnen noch bei etwas anderem helfen?" },
    ]
  },
  {
    id: "termin",
    title: "Terminvereinbarung",
    icon: Calendar,
    conversation: [
      { role: "agent", text: "Willkommen bei der Terminvereinbarung. Wie kann ich Ihnen helfen?" },
      { role: "user", text: "Ich möchte gerne einen Beratungstermin vereinbaren." },
      { role: "agent", text: "Sehr gerne! Für welchen Service benötigen Sie die Beratung?" },
      { role: "user", text: "Es geht um die Einführung eines CRM-Systems." },
      { role: "agent", text: "Perfekt. Ich habe freie Termine am Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr. Welcher passt Ihnen besser?" },
      { role: "user", text: "Donnerstag um 14 Uhr wäre ideal." },
      { role: "agent", text: "Hervorragend! Ich habe Ihren Termin für Donnerstag, den 28. Dezember um 14 Uhr eingetragen. Sie erhalten in Kürze eine Bestätigung per E-Mail. Kann ich noch etwas für Sie tun?" },
    ]
  },
  {
    id: "reklamation",
    title: "Reklamation",
    icon: AlertCircle,
    conversation: [
      { role: "agent", text: "Guten Tag! Wie kann ich Ihnen behilflich sein?" },
      { role: "user", text: "Ich habe ein defektes Produkt erhalten und möchte reklamieren." },
      { role: "agent", text: "Das tut mir sehr leid zu hören. Können Sie mir bitte Ihre Bestellnummer und den Artikelnamen nennen?" },
      { role: "user", text: "Die Bestellnummer ist 78901, es handelt sich um einen Drucker." },
      { role: "agent", text: "Vielen Dank. Ich habe die Bestellung gefunden. Können Sie mir kurz beschreiben, was genau defekt ist?" },
      { role: "user", text: "Der Drucker macht seltsame Geräusche und druckt nicht mehr." },
      { role: "agent", text: "Ich verstehe. Ich habe einen Rücksendeschein für Sie erstellt, den Sie per E-Mail erhalten. Sobald wir das Gerät erhalten, senden wir Ihnen umgehend einen Ersatz. Die Rücksendung ist für Sie kostenlos." },
      { role: "user", text: "Super, vielen Dank!" },
      { role: "agent", text: "Gern geschehen! Haben Sie noch weitere Fragen?" },
    ]
  },
  {
    id: "faq",
    title: "FAQ & Support",
    icon: HelpCircle,
    conversation: [
      { role: "agent", text: "Herzlich willkommen beim Support! Was kann ich für Sie tun?" },
      { role: "user", text: "Wie kann ich mein Passwort zurücksetzen?" },
      { role: "agent", text: "Kein Problem! Gehen Sie auf unsere Website und klicken Sie auf 'Passwort vergessen'. Sie erhalten dann eine E-Mail mit einem Link zum Zurücksetzen. Soll ich Ihnen den Link direkt zusenden?" },
      { role: "user", text: "Ja, das wäre super." },
      { role: "agent", text: "Ich habe gerade eine E-Mail an Ihre hinterlegte Adresse gesendet. Der Link ist 24 Stunden gültig. Kann ich Ihnen noch bei etwas anderem helfen?" },
    ]
  }
];

const VoiceAgentDemo = () => {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>(demoScenarios[0]);

  const startDemo = () => {
    setAgentState("connecting");
    setTranscript([]);
    
    setTimeout(() => {
      setAgentState("speaking");
      let index = 0;
      
      const playConversation = () => {
        if (index >= selectedScenario.conversation.length) {
          setAgentState("idle");
          return;
        }
        
        const item = selectedScenario.conversation[index];
        setAgentState(item.role === "agent" ? "speaking" : "listening");
        
        setTimeout(() => {
          setTranscript(prev => [...prev, `${item.role === "agent" ? "🤖 Agent" : "👤 Kunde"}: ${item.text}`]);
          index++;
          
          if (index < selectedScenario.conversation.length) {
            setAgentState("thinking");
            setTimeout(playConversation, 1000);
          } else {
            setTimeout(() => setAgentState("idle"), 1500);
          }
        }, item.text.length * 35);
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
      <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
        <Phone className="w-5 h-5 text-accent" />
        Live Demo: KI-Sprachassistent
      </h3>
      
      {/* Scenario Selection */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Wählen Sie ein Szenario:</p>
        <div className="grid grid-cols-2 gap-2">
          {demoScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                if (agentState === "idle") {
                  setSelectedScenario(scenario);
                  setTranscript([]);
                }
              }}
              disabled={agentState !== "idle"}
              className={`flex items-center gap-2 p-3 rounded-lg text-left text-sm transition-all ${
                selectedScenario.id === scenario.id
                  ? "bg-accent/20 border-accent border-2 text-foreground"
                  : "bg-muted/50 border border-border hover:bg-muted text-muted-foreground"
              } ${agentState !== "idle" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <scenario.icon className={`w-4 h-4 ${selectedScenario.id === scenario.id ? "text-accent" : ""}`} />
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Voice Visualizer */}
      <div className="relative h-28 bg-muted/50 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
        {agentState === "idle" ? (
          <p className="text-muted-foreground text-sm text-center px-4">
            Klicken Sie auf "Demo starten" für: <strong>{selectedScenario.title}</strong>
          </p>
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
                    ? `${Math.random() * 50 + 15}px`
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
