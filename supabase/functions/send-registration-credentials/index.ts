import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY nicht konfiguriert');
    }

    const { email, password, full_name } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'E-Mail und Passwort sind erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Neue Registrierung auf DeutLicht</h2>
        <p>Ein neuer Benutzer hat sich registriert:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${full_name || 'Nicht angegeben'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">E-Mail</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Passwort</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace;">${password}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px;">Diese E-Mail wurde automatisch bei der Registrierung generiert. Bitte behandeln Sie die Zugangsdaten vertraulich.</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DeutLicht System <kontakt@deutlicht.de>',
        to: ['info@deutlicht.de'],
        subject: `Neue Registrierung: ${email}`,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Resend error:', errorData);
      throw new Error(`E-Mail-Versand fehlgeschlagen: ${errorData}`);
    }

    const data = await res.json();
    console.log('Credentials email sent:', data.id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unerwarteter Fehler' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
