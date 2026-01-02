import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ElevenLabsWidget = () => {
  const location = useLocation();

  // Get page-specific greeting based on current route
  const getGreeting = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/index') {
      return 'Willkommen bei DeutLicht®. Wobei kann ich Ihnen heute Klarheit verschaffen?';
    } else if (path === '/leistungen') {
      return 'Haben Sie Fragen zu digitalen Prozessen oder Systemen? Ich unterstütze Sie gern bei der Einordnung.';
    } else if (path === '/kontakt') {
      return 'Möchten Sie ein Anliegen vorab klären? Ich helfe Ihnen gern weiter.';
    }
    
    // Default greeting for other pages
    return 'Willkommen bei DeutLicht®. Wie kann ich Ihnen helfen?';
  };

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

  const greeting = getGreeting();

  return (
    <div 
      dangerouslySetInnerHTML={{
        __html: `<elevenlabs-convai agent-id="agent_5201kdxhcrmweknt9emncpyrh46w" agent-greeting="${greeting}"></elevenlabs-convai>`
      }} 
    />
  );
};

export default ElevenLabsWidget;
