import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';

const DemoViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const rawUrl = searchParams.get('url') || '';
  const decodedUrl = decodeURIComponent(rawUrl);
  const label = searchParams.get('label') || 'Demo';

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-4 bg-gray-900 text-white shrink-0" style={{ zIndex: 9999 }}>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white gap-2"
          onClick={() => navigate('/admin?tab=demos')}
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Button>
        <span className="text-sm font-medium truncate max-w-[40%]">{label}</span>
        <Badge className="bg-amber-500 text-white hover:bg-amber-600 gap-1">
          <AlertTriangle className="w-3 h-3" />
          Demo-Modus
        </Badge>
      </div>

      {/* Demo warning banner */}
      <div className="px-4 py-1.5 bg-orange-50 border-b border-orange-200 text-orange-800 text-xs text-center shrink-0">
        ⚠️ Demo-Modus aktiv – Formulare & Buchungen sind in der Vorschau deaktiviert
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={decodedUrl}
        width="100%"
        style={{ border: 'none', display: loading ? 'none' : 'block', height: 'calc(100vh - 80px)' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        title={label}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default DemoViewer;
