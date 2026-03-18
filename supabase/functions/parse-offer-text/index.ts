import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, catalogProductNames } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Text zu kurz" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const productList = Array.isArray(catalogProductNames) ? catalogProductNames.join(", ") : "";

    const systemPrompt = `Du bist ein Datenextraktions-Assistent für ein Angebots-Tool. Extrahiere aus dem gegebenen Text:
1. Firmendaten (Name, Ansprechpartner, E-Mail, Telefon, Branche, Größe)
2. Gewünschte Dienstleistungen und Produkte

Antworte NUR mit dem tool_call. Lasse Felder leer ("") wenn die Information nicht im Text enthalten ist.

REGELN:
- "industry" muss EXAKT einer dieser Werte sein: Handel, Handwerk, Gastronomie, Gesundheit, Immobilien, IT & Software, Industrie, Dienstleistungen, Bildung, Tourismus, Landwirtschaft, Sonstige
- "company_size" muss EXAKT einer dieser Werte sein: 1-10, 11-50, 51-250, >250
- "services" ist ein Array mit Werten aus: Website & Digitale Plattformen, Social Media Marketing, SEO & Sichtbarkeit, KI-Agenten & Automation, Voicebots / Sprachassistenz, Prozessoptimierung & Digitalstrategie, Beratung & Schulung
- "website_type" muss einer sein: onepager, landingpage, landingpage_starter, 5-10, 10-20, 20-30, >30
- "seo_package" muss einer sein: lokal, standard, premium, enterprise
- "ki_type" muss einer sein: einfach, workflow, multi
- "voice_type" muss einer sein: weiterleitung, vorqualifizierung, vollautomatisch
- "catalog_products" soll Produktnamen aus dieser Liste enthalten, wenn sie im Text erkennbar sind: ${productList}
- Interpretiere Hinweise wie "Website mit 15 Seiten" → website_type: "10-20", "kleine Website" → "5-10", "große Website" → "20-30" oder ">30"
- Erkenne auch indirekte Hinweise: "SEO machen" → SEO, "telefonischer Kundenservice automatisieren" → Voicebots, "Online-Shop" → Website + shop_needed: "ja"`;

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
          { role: "user", content: text },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_offer_data",
              description: "Extrahierte strukturierte Angebotsdaten aus Freitext",
              parameters: {
                type: "object",
                properties: {
                  company_name: { type: "string", description: "Firmenname" },
                  contact_person: { type: "string", description: "Name des Ansprechpartners" },
                  email: { type: "string", description: "E-Mail-Adresse" },
                  phone: { type: "string", description: "Telefonnummer" },
                  industry: { type: "string", description: "Branche (exakter Wert aus Liste)" },
                  company_size: { type: "string", description: "Unternehmensgröße (1-10, 11-50, 51-250, >250)" },
                  services: {
                    type: "array",
                    items: { type: "string" },
                    description: "Gewünschte Dienstleistungskategorien",
                  },
                  website_type: { type: "string", description: "Website-Typ wenn erkennbar" },
                  website_pages_count: { type: "string", description: "Anzahl Seiten wenn genannt" },
                  website_features: {
                    type: "array",
                    items: { type: "string" },
                    description: "Gewünschte Website-Features: Blog/News-Bereich, Mehrsprachigkeit, Online-Terminbuchung, Lead-/Vertriebsfokus, Konfigurator, ERP-Anbindung, Mitgliederbereich",
                  },
                  shop_needed: { type: "string", enum: ["ja", "nein", ""], description: "Ob ein Online-Shop benötigt wird" },
                  shop_system: { type: "string", description: "Gewünschtes Shop-System wenn genannt" },
                  seo_package: { type: "string", description: "SEO-Paket wenn erkennbar" },
                  ki_type: { type: "string", description: "KI-Agent-Typ wenn erkennbar" },
                  voice_type: { type: "string", description: "Voicebot-Typ wenn erkennbar" },
                  catalog_products: {
                    type: "array",
                    items: { type: "string" },
                    description: "Erkannte Produktnamen aus dem Artikelstamm",
                  },
                  additional_notes: { type: "string", description: "Sonstige relevante Informationen" },
                },
                required: ["company_name"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_offer_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Zu viele Anfragen, bitte kurz warten." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = typeof toolCall.function.arguments === "string"
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;

    return new Response(JSON.stringify({ data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-offer-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
