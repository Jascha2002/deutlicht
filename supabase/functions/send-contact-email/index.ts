import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { name, email, phone, company, subject, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission:", { name, email, subject });

    // Send notification email to the business
    const notificationEmail = await resend.emails.send({
      from: "DeutLicht Kontaktformular <kontakt@deutlicht.de>",
      to: ["info@deutlicht.de"], // Replace with your actual email
      subject: `Neue Kontaktanfrage: ${subject}`,
      html: `
        <h1>Neue Kontaktanfrage über das Website-Formular</h1>
        <hr />
        <h2>Kontaktdaten:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>E-Mail:</strong> ${email}</li>
          <li><strong>Telefon:</strong> ${phone || "Nicht angegeben"}</li>
          <li><strong>Unternehmen:</strong> ${company || "Nicht angegeben"}</li>
        </ul>
        <h2>Betreff:</h2>
        <p>${subject}</p>
        <h2>Nachricht:</h2>
        <p>${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">Diese E-Mail wurde automatisch über das Kontaktformular auf deutlicht.de gesendet.</p>
      `,
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the customer
    const confirmationEmail = await resend.emails.send({
      from: "DeutLicht GmbH <kontakt@deutlicht.de>",
      to: [email],
      subject: "Vielen Dank für Ihre Anfrage - DeutLicht",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Vielen Dank für Ihre Nachricht, ${name}!</h1>
          <p>Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
          <h3>Ihre Nachricht:</h3>
          <p><strong>Betreff:</strong> ${subject}</p>
          <p>${message}</p>
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
