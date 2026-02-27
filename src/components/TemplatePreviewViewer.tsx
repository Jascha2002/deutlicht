import { useState, useEffect } from "react";
import { X, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplatePreviewViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  name: string;
}

export function TemplatePreviewViewer({ isOpen, onClose, url, name }: TemplatePreviewViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setHasError(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Timeout for iframe load — if it takes >10s, assume error
  useEffect(() => {
    if (!isOpen || !isLoading) return;
    const timeout = setTimeout(() => {
      if (isLoading) setHasError(true);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [isOpen, isLoading]);

  if (!isOpen) return null;

  const truncatedUrl = url.length > 60 ? url.slice(0, 57) + '...' : url;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-[52px] bg-[hsl(var(--card))] border-b flex items-center justify-between px-4 flex-shrink-0">
        <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">{name}</span>
        <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[300px]">{truncatedUrl}</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => window.open(url, '_blank')} className="gap-1.5 text-xs">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Im Browser öffnen</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5 text-xs">
            <X className="w-4 h-4" />
            Schließen
          </Button>
        </div>
      </div>

      {/* iFrame area */}
      <div className="flex-1 relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
            <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
            <p className="text-muted-foreground">Website wird geladen...</p>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Die Vorschau konnte nicht geladen werden.</p>
            <p className="text-sm text-muted-foreground mb-4">Die Website blockiert möglicherweise die Einbettung.</p>
            <Button onClick={() => window.open(url, '_blank')} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Website direkt öffnen
            </Button>
          </div>
        ) : (
          <iframe
            src={url}
            title={name}
            className="w-full h-full border-0"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
}
