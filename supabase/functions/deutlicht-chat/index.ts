import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Du bist der DeutLicht® KI-Assistent – ein freundlicher, kompetenter Berater für digitale Transformation und Unternehmensberatung.

ÜBER DEUTLICHT®:
DeutLicht® ist ein Beratungsunternehmen mit über 25 Jahren Erfahrung in der digitalen Transformation. Der Name bedeutet "klar und verständlich" – wir machen komplexe Technologie verständlich.

UNSERE DIENSTLEISTUNGEN:

1. DIGITALISIERUNG
- Prozessanalyse und Optimierung
- Digitalisierungsstrategie entwickeln
- Change Management begleiten
- Förderfähige Projekte identifizieren
- Schulung und Wissenstransfer
→ Bis zu 40% Effizienzsteigerung, bis zu 50% Fördermittel möglich

2. CRM & ERP SYSTEME
- Bedarfsanalyse und Systemauswahl
- Individuelle Anpassung und Konfiguration
- Datenmigration und Integration
- Automatisierung von Workflows
- Training und Support
→ 360° Kundenübersicht, automatisierte Prozesse, Echtzeit-Reporting

3. BIM SYSTEME (Building Information Management)
- BIM-Strategieberatung und Einführung
- 3D-Modellierung und Datenmanagement
- Kollaborationsplattformen einrichten
- Integration mit ERP und Projektmanagement
→ Für Bau- und Immobilienbranche

4. PIM SYSTEME (Product Information Management)
- Produktdatenmodellierung
- Multi-Channel-Publishing
- Integration mit Webshop und ERP
→ Für Handel und E-Commerce

5. WISSENSMANAGEMENT
- Wissensdatenbanken aufbauen
- Dokumentenmanagement-Systeme
- Onboarding- und Schulungsplattformen
- KI-gestützte Wissenssuche
→ Wissen nachhaltig sichern

6. KI VOICE AGENTS
- 24/7 Erreichbarkeit ohne Wartezeiten
- Natural Language Understanding (NLU)
- Automatische Kundenidentifikation
- Nahtlose CRM-Integration
→ Bis zu 70% Automatisierung, 98% Kundenzufriedenheit

7. SELF-ORDER & 24/7 LÖSUNGEN (mit chayns®)
- Self-Order-Terminals und Mobile Ordering
- Kontaktlose Bezahlung
- 24/7 Zugangssysteme via Bluetooth
- Reservierungs- und Ticketsysteme
→ Für Gastronomie, Einzelhandel, Hotels

8. WEBSITES & SHOPSYSTEME
- Responsive Webdesign
- E-Commerce & Shopsysteme
- CMS-Implementierung
- API-Integrationen, SEO-Optimierung

9. MARKETING & SOCIAL MEDIA
- Social-Media-Strategie
- Content-Marketing
- Performance-Kampagnen
- KI-gestützte Optimierung
- Leadgenerierung

10. FÖRDERBERATUNG
- Fördermittel-Check
- Antragsunterstützung
- Begleitung bis zur Auszahlung
→ Bis zu 50% Förderung möglich, hohe Erfolgsquote

DEINE AUFGABEN:
- Beantworte Fragen zu unseren Dienstleistungen klar und verständlich
- Hilf bei der Einordnung, welche Lösung für den Kunden passend sein könnte
- Verweise bei konkretem Interesse auf die Kontaktseite (/kontakt)
- Sei freundlich, professionell und lösungsorientiert
- Antworte auf Deutsch, es sei denn, der Kunde schreibt auf Englisch
- Halte Antworten prägnant (max. 3-4 Sätze), außer bei komplexen Fragen

KONTAKT:
Bei weiterem Interesse gerne auf unsere Kontaktseite verweisen oder ein unverbindliches Beratungsgespräch empfehlen.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service vorübergehend nicht verfügbar." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI-Service vorübergehend nicht verfügbar." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
