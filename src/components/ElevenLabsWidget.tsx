import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Whitelist of safe greetings - prevents XSS via route manipulation
const SAFE_GREETINGS: Record<string, string> = {
  '/': 'Willkommen bei DeutLicht®. Wobei kann ich Ihnen heute Klarheit verschaffen?',
  '/index': 'Willkommen bei DeutLicht®. Wobei kann ich Ihnen heute Klarheit verschaffen?',
  '/leistungen': 'Haben Sie Fragen zu digitalen Prozessen oder Systemen? Ich unterstütze Sie gern bei der Einordnung.',
  '/leistungen/ki-agenten': 'Haben Sie Fragen zu KI-Agenten oder Automatisierung? Ich helfe Ihnen gern weiter.',
  '/leistungen/seo': 'Haben Sie Fragen zur Suchmaschinenoptimierung? Ich unterstütze Sie gern.',
  '/leistungen/schulung': 'Haben Sie Fragen zu Schulungen oder Beratung? Ich helfe Ihnen gern weiter.',
  '/leistungen/websites': 'Haben Sie Fragen zu Websites oder Shopsystemen? Ich unterstütze Sie gern.',
  '/leistungen/marketing': 'Haben Sie Fragen zu Marketing oder Social Media? Ich helfe Ihnen gern weiter.',
  '/leistungen/wissensmanagement': 'Haben Sie Fragen zum Wissensmanagement? Ich unterstütze Sie gern.',
  '/leistungen/crm-erp': 'Haben Sie Fragen zu CRM- oder ERP-Systemen? Ich helfe Ihnen gern weiter.',
  '/leistungen/bim': 'Haben Sie Fragen zu BIM-Systemen? Ich unterstütze Sie gern.',
  '/leistungen/pim': 'Haben Sie Fragen zu PIM-Systemen? Ich helfe Ihnen gern weiter.',
  '/leistungen/foerderberatung': 'Haben Sie Fragen zu Fördermitteln? Ich unterstütze Sie gern.',
  '/leistungen/chayns-loesungen': 'Haben Sie Fragen zu Self-Order oder 24/7-Lösungen? Ich helfe Ihnen gern weiter.',
  '/leistungen/chayns-hardware': 'Haben Sie Fragen zu Schlössern oder Robotern? Ich unterstütze Sie gern.',
  '/leistungen/voicebot-demos': 'Haben Sie Fragen zu Voice-Agenten? Ich helfe Ihnen gern weiter.',
  '/kontakt': 'Möchten Sie ein Anliegen vorab klären? Ich helfe Ihnen gern weiter.',
  '/projekte': 'Haben Sie Fragen zu unseren Projekten? Ich unterstütze Sie gern.',
  '/ueber-uns': 'Haben Sie Fragen zu DeutLicht®? Ich helfe Ihnen gern weiter.',
  '/ueber-uns/hintergrund': 'Haben Sie Fragen zu unserem Hintergrund? Ich unterstütze Sie gern.',
  '/branchen': 'Haben Sie Fragen zu Branchenlösungen? Ich helfe Ihnen gern weiter.',
  '/projektanfrage': 'Möchten Sie ein Projekt starten? Ich unterstütze Sie gern bei der Anfrage.',
  '/ki-check': 'Haben Sie Fragen zum KI-Readiness-Check? Ich helfe Ihnen gern weiter.'
};

const DEFAULT_GREETING = 'Willkommen bei DeutLicht®. Wie kann ich Ihnen helfen?';

const ElevenLabsWidget = () => {
  const location = useLocation();

  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Get safe greeting from whitelist only - prevents XSS via route manipulation
  const greeting = SAFE_GREETINGS[location.pathname] || DEFAULT_GREETING;

  // Escape HTML attributes as additional safety layer
  const escapeAttr = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const safeGreeting = escapeAttr(greeting);

  return (
    <div 
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="agent_5201kdxhcrmweknt9emncpyrh46w" agent-greeting="${safeGreeting}"></elevenlabs-convai>`
      }} 
    />
  );
};

export default ElevenLabsWidget;
