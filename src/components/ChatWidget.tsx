import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Guten Tag! Wie kann ich Ihnen bei Ihren Digitalisierungsfragen helfen?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate a response (can be connected to AI later)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAutoResponse(userMessage.content)
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAutoResponse = (userInput: string): string => {
    const lowercased = userInput.toLowerCase();
    
    if (lowercased.includes("kontakt") || lowercased.includes("telefon") || lowercased.includes("mail")) {
      return "Sie erreichen uns unter info@DeutLicht.de oder telefonisch unter +49 178 5549216. Alternativ können Sie unser Kontaktformular auf der Kontaktseite nutzen.";
    }
    if (lowercased.includes("preis") || lowercased.includes("kosten") || lowercased.includes("angebot")) {
      return "Die Kosten hängen vom Umfang Ihres Projekts ab. Viele unserer Leistungen sind förderfähig (bis zu 80%). Kontaktieren Sie uns für ein unverbindliches Erstgespräch!";
    }
    if (lowercased.includes("förder") || lowercased.includes("zuschuss")) {
      return "Wir unterstützen Sie bei der Beantragung von Fördermitteln wie BAFA, INQA-Coaching oder ZIM. Bis zu 80% der Kosten können gefördert werden.";
    }
    if (lowercased.includes("digitalisierung") || lowercased.includes("digital")) {
      return "Wir begleiten Unternehmen ganzheitlich durch die digitale Transformation – von der Analyse über CRM/ERP-Systeme bis zur Automatisierung. Was ist Ihr konkretes Anliegen?";
    }
    if (lowercased.includes("crm") || lowercased.includes("erp")) {
      return "Wir implementieren und optimieren CRM- und ERP-Systeme passend zu Ihren Geschäftsprozessen. Welches System nutzen Sie aktuell?";
    }
    if (lowercased.includes("website") || lowercased.includes("webseite") || lowercased.includes("shop")) {
      return "Wir entwickeln strukturierte, professionelle Websites mit Conversion-Optimierung und CRM-Integration. Möchten Sie mehr erfahren?";
    }
    if (lowercased.includes("termin") || lowercased.includes("beratung") || lowercased.includes("gespräch")) {
      return "Gerne vereinbaren wir einen Termin für ein kostenloses Erstgespräch. Schreiben Sie uns an info@DeutLicht.de oder rufen Sie an: +49 178 5549216";
    }
    
    return "Vielen Dank für Ihre Nachricht! Für eine detaillierte Beratung kontaktieren Sie uns gerne direkt unter info@DeutLicht.de oder +49 178 5549216.";
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Chat öffnen"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">DeutLicht® Assistent</h3>
              <p className="text-xs opacity-80">Wir helfen Ihnen gerne</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
            aria-label="Chat schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-2.5 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ihre Nachricht..."
              className="flex-1 bg-background"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;
