import { useEffect } from 'react';

const ElevenLabsWidget = () => {
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

  return (
    <div 
      dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="agent_5201kdxhcrmweknt9emncpyrh46w"></elevenlabs-convai>'
      }} 
    />
  );
};

export default ElevenLabsWidget;
