import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Du bist der "Gedankenblitz" – ein kreativer KI-Brainstorming-Assistent von DeutLicht®, einer führenden Digitalisierungs- und KI-Agentur.

Deine Aufgabe:
- Liefere kreative, unkonventionelle und umsetzbare Ideen zu jedem Thema
- Denke quer, verbinde unerwartete Konzepte, biete verschiedene Perspektiven
- Sei inspirierend, motivierend und praxisorientiert
- Strukturiere deine Antworten übersichtlich mit Überschriften und Listen

Antwortformat:
- Beginne mit einer kurzen, begeisternden Einleitung (1-2 Sätze)
- Liefere dann 5-8 konkrete Ideen/Vorschläge
- Nutze Markdown-Formatierung: **fett** für wichtige Begriffe, Listen mit - oder Nummerierung
- Halte jede Idee prägnant (2-3 Sätze max)
- Ende mit einem motivierenden Ausblick oder nächsten Schritt

Tonalität:
- Professionell aber nahbar
- Inspirierend und lösungsorientiert
- Kreativ aber realistisch umsetzbar
- Auf Deutsch antworten

Du repräsentierst DeutLicht® – zeige, was mit KI möglich ist!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Bitte gib ein Thema oder eine Frage ein." }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service nicht konfiguriert" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt.trim() }
        ],
        stream: true,
        max_tokens: 2000,
        temperature: 0.8, // Higher for more creativity
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Zu viele Anfragen. Bitte warte einen Moment." }),
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service vorübergehend nicht verfügbar." }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Fehler beim Generieren der Ideen" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Gedankenblitz error:", error);
    return new Response(
      JSON.stringify({ error: "Ein unerwarteter Fehler ist aufgetreten" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
