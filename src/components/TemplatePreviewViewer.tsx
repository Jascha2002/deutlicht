import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TemplateItem {
  url: string;
  name: string;
  templateId: string;
}

interface TemplatePreviewViewerProps {
  isOpen: boolean;
  onClose: () => void;
  templates: TemplateItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function TemplatePreviewViewer({ isOpen, onClose, templates, currentIndex, onNavigate }: TemplatePreviewViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [savingFeedback, setSavingFeedback] = useState(false);
  const { toast } = useToast();

  const current = templates[currentIndex] || null;
  const hasNext = currentIndex < templates.length - 1;
  const hasPrev = currentIndex > 0;

  // Load existing feedback
  useEffect(() => {
    if (!isOpen || templates.length === 0) return;
    const loadFeedback = async () => {
      const { data } = await (supabase as any)
        .from('template_feedback')
        .select('template_id, feedback');
      if (data) {
        const map: Record<string, 'like' | 'dislike'> = {};
        data.forEach((f: any) => { map[f.template_id] = f.feedback; });
        setFeedback(map);
      }
    };
    loadFeedback();
  }, [isOpen, templates]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      setHasError(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, currentIndex, hasNext, hasPrev, onNavigate]);

  useEffect(() => {
    if (!isOpen || !isLoading) return;
    const timeout = setTimeout(() => {
      if (isLoading) setHasError(true);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [isOpen, isLoading, currentIndex]);

  const handleFeedback = useCallback(async (type: 'like' | 'dislike') => {
    if (!current || savingFeedback) return;
    setSavingFeedback(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existing = feedback[current.templateId];
      const newValue = existing === type ? null : type;

      if (newValue === null) {
        await (supabase as any).from('template_feedback').delete().eq('template_id', current.templateId).eq('customer_id', user.id);
      } else {
        await (supabase as any).from('template_feedback').upsert({
          customer_id: user.id,
          template_id: current.templateId,
          feedback: newValue,
        }, { onConflict: 'customer_id,template_id' });
      }

      setFeedback(prev => ({ ...prev, [current.templateId]: newValue }));
      toast({
        title: newValue === 'like' ? '👍 Gefällt Ihnen!' : newValue === 'dislike' ? '👎 Nicht Ihr Favorit' : 'Bewertung entfernt',
        description: newValue ? 'Ihr Feedback wurde gespeichert.' : '',
      });
    } catch {
      toast({ title: 'Fehler', description: 'Feedback konnte nicht gespeichert werden.', variant: 'destructive' });
    } finally {
      setSavingFeedback(false);
    }
  }, [current, feedback, savingFeedback, toast]);

  if (!isOpen || !current) return null;

  const currentFeedback = feedback[current.templateId] || null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-[56px] bg-[hsl(var(--card))] border-b flex items-center justify-between px-4 flex-shrink-0">
        {/* Left: close */}
        <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5 text-sm">
          <X className="w-4 h-4" />
          Schließen
        </Button>

        {/* Center: template name + counter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
            {current.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {templates.length}
          </span>
        </div>

        {/* Right: feedback + navigation */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={currentFeedback === 'like' ? 'default' : 'outline'}
            onClick={() => handleFeedback('like')}
            disabled={savingFeedback}
            className="gap-1.5 text-xs"
            title="Gefällt mir"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gefällt mir</span>
          </Button>
          <Button
            size="sm"
            variant={currentFeedback === 'dislike' ? 'destructive' : 'outline'}
            onClick={() => handleFeedback('dislike')}
            disabled={savingFeedback}
            className="gap-1.5 text-xs"
            title="Gefällt mir nicht"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gefällt nicht</span>
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={!hasPrev}
            title="Vorherige Vorlage"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={!hasNext}
            title="Nächste Vorlage"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* iFrame area */}
      <div className="flex-1 relative">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
            <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
            <p className="text-muted-foreground">Design wird geladen...</p>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <X className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Die Vorschau konnte nicht geladen werden.</p>
            <p className="text-sm text-muted-foreground mb-4">Bitte versuchen Sie es später erneut.</p>
            {hasNext && (
              <Button onClick={() => onNavigate(currentIndex + 1)} className="gap-2">
                <ChevronRight className="w-4 h-4" />
                Nächste Vorlage ansehen
              </Button>
            )}
          </div>
        ) : (
          <iframe
            key={current.url}
            src={current.url}
            title={current.name}
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
