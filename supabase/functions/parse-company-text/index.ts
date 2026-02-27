import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Text zu kurz" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `Du bist ein Datenextraktions-Assistent. Extrahiere aus dem gegebenen Text strukturierte Firmendaten.
Antworte NUR mit dem tool_call. Lasse Felder leer ("") wenn die Information nicht im Text enthalten ist.
Interpretiere Abkürzungen korrekt (z.B. "GF" = "Geschäftsführer", "Tel" = Telefon).
Bei Straße und Hausnummer: trenne sie korrekt (z.B. "Musterstr. 12" → street="Musterstr.", street_number="12").
Bei PLZ und Ort: trenne sie korrekt (z.B. "07545 Gera" → postal_code="07545", city="Gera").
Erkenne Rechtsformen wie GmbH, UG, AG, GbR, Einzelunternehmen, Freiberufler.
Erkenne E-Mail-Adressen, Telefonnummern, Websites zuverlässig.`;

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
              name: "extract_company_data",
              description: "Extrahierte strukturierte Firmendaten aus Freitext",
              parameters: {
                type: "object",
                properties: {
                  company_name: { type: "string", description: "Firmenname ohne Rechtsform" },
                  legal_form: { type: "string", enum: ["GmbH", "UG", "AG", "GbR", "Einzelunternehmen", "Freiberufler", "Sonstige", ""], description: "Rechtsform" },
                  industry: { type: "string", description: "Branche" },
                  contact_person_name: { type: "string", description: "Name des Ansprechpartners" },
                  contact_person_position: { type: "string", description: "Position (z.B. Geschäftsführer)" },
                  contact_person_email: { type: "string", description: "E-Mail des Ansprechpartners" },
                  contact_person_phone: { type: "string", description: "Telefon des Ansprechpartners" },
                  street: { type: "string", description: "Straßenname" },
                  street_number: { type: "string", description: "Hausnummer" },
                  postal_code: { type: "string", description: "PLZ" },
                  city: { type: "string", description: "Ort" },
                  country: { type: "string", description: "Land (Standard: Deutschland)" },
                  email: { type: "string", description: "Firmen-E-Mail (info@...)" },
                  phone: { type: "string", description: "Firmen-Telefon" },
                  website: { type: "string", description: "Website-URL" },
                  internal_notes: { type: "string", description: "Sonstige relevante Informationen die keinem Feld zugeordnet werden konnten" },
                },
                required: ["company_name"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_company_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Zu viele Anfragen, bitte kurz warten." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-Kontingent erschöpft." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    console.error("parse-company-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
