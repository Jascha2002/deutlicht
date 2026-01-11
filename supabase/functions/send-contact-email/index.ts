import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: max 5 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// HTML escape function to prevent XSS/injection attacks
function escapeHtml(text: string | undefined | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateStringLength(str: string | undefined, maxLength: number): boolean {
  return !str || str.length <= maxLength;
}

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, company, subject, message }: ContactFormRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Fehlende Pflichtfelder" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Ungültige E-Mail-Adresse" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate field lengths
    if (!validateStringLength(name, 100) || 
        !validateStringLength(subject, 200) || 
        !validateStringLength(message, 5000) ||
        !validateStringLength(phone, 50) ||
        !validateStringLength(company, 200)) {
      return new Response(
        JSON.stringify({ error: "Eingabe zu lang" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape all user inputs for HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCompany = escapeHtml(company);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    console.log("Processing contact form submission");

    // Send notification email to the business
    const notificationEmail = await resend.emails.send({
      from: "DeutLicht Kontaktformular <kontakt@deutlicht.de>",
      to: ["info@deutlicht.de"],
      subject: `Neue Kontaktanfrage: ${safeSubject}`,
      html: `
        <h1>Neue Kontaktanfrage über das Website-Formular</h1>
        <hr />
        <h2>Kontaktdaten:</h2>
        <ul>
          <li><strong>Name:</strong> ${safeName}</li>
          <li><strong>E-Mail:</strong> ${safeEmail}</li>
          <li><strong>Telefon:</strong> ${safePhone || "Nicht angegeben"}</li>
          <li><strong>Unternehmen:</strong> ${safeCompany || "Nicht angegeben"}</li>
        </ul>
        <h2>Betreff:</h2>
        <p>${safeSubject}</p>
        <h2>Nachricht:</h2>
        <p>${safeMessage}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Diese E-Mail wurde automatisch über das Kontaktformular auf deutlicht.de gesendet.</p>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the customer
    const confirmationEmail = await resend.emails.send({
      from: "DeutLicht GmbH <kontakt@deutlicht.de>",
      to: [email], // Use original email for sending, not escaped
      subject: "Vielen Dank für Ihre Anfrage - DeutLicht",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Vielen Dank für Ihre Nachricht, ${safeName}!</h1>
          <p>Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3>Ihre Nachricht:</h3>
          <p><strong>Betreff:</strong> ${safeSubject}</p>
          <p>${safeMessage}</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>Mit freundlichen Grüßen,<br /><strong>Ihr DeutLicht Team</strong></p>
          <p style="color: #64748b; font-size: 12px;">
            DeutLicht GmbH<br />
            Musterstraße 123, 12345 Berlin<br />
            Tel: +49 (0) 30 123 456 78<br />
            Web: www.deutlicht.de
          </p>
        </div>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ success: true, message: "E-Mails erfolgreich gesendet" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
