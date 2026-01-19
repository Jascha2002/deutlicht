import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, ArrowLeft, Lightbulb, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface GedankenblitzModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GedankenblitzModal = ({ isOpen, onClose }: GedankenblitzModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setResult('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Bitte beschreibe dein Thema oder Problem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gedankenblitz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.');
        }
        if (response.status === 402) {
          throw new Error('Service vorübergehend nicht verfügbar. Bitte versuche es später erneut.');
        }
        throw new Error('Fehler beim Generieren der Ideen. Bitte versuche es erneut.');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setResult(assistantContent);
                  
                  // Auto-scroll to bottom of results
                  if (resultRef.current) {
                    resultRef.current.scrollTop = resultRef.current.scrollHeight;
                  }
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('Gedankenblitz error:', err);
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setResult('');
    setError(null);
    textareaRef.current?.focus();
  };

  // Format markdown-like content
  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">{line.slice(2)}</h1>;
        }
        
        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={i} className="ml-4 text-foreground/90 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
              <span>{formatInlineStyles(line.slice(2))}</span>
            </li>
          );
        }
        
        // Numbered lists
        const numberedMatch = line.match(/^(\d+)\.\s(.*)$/);
        if (numberedMatch) {
          return (
            <li key={i} className="ml-4 text-foreground/90 flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 text-sm font-medium flex items-center justify-center flex-shrink-0">
                {numberedMatch[1]}
              </span>
              <span>{formatInlineStyles(numberedMatch[2])}</span>
            </li>
          );
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={i} />;
        }
        
        // Regular paragraphs
        return <p key={i} className="text-foreground/90 my-2">{formatInlineStyles(line)}</p>;
      });
  };

  // Format inline styles (bold, italic)
  const formatInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col bg-background border-border p-0"
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="mr-2"
                  aria-label="Zurück zur Eingabe"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-navy-900" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Gedankenblitz
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    KI-Brainstorming in Sekunden
                  </DialogDescription>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!result ? (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-gold-500" />
                  <span>Beschreibe dein Thema, Problem oder Projekt</span>
                </div>
                
                <Textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="z.B. 'Neue Marketing-Ideen für ein Catering-Unternehmen' oder 'Wie kann ich meinen Kundenservice mit KI verbessern?'"
                  className="min-h-[200px] text-lg resize-none border-border focus:border-gold-500 focus:ring-gold-500/20"
                  disabled={isLoading}
                  aria-label="Beschreibe dein Thema oder Problem"
                />
                
                <p className="text-xs text-muted-foreground">
                  Die KI liefert in Sekunden Dutzende kreative Ideen, Perspektiven und Vorschläge.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <LoadingLightning />
                    Ideen werden generiert...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Gedankenblitz starten
                  </span>
                )}
              </Button>
            </form>
          ) : (
            /* Results */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Ergebnis für: <em className="text-foreground">"{prompt}"</em></span>
              </div>
              
              <div 
                ref={resultRef}
                className="prose prose-sm dark:prose-invert max-w-none p-6 rounded-xl bg-muted/50 border border-border overflow-y-auto max-h-[50vh]"
              >
                {formatContent(result)}
                
                {isLoading && (
                  <span className="inline-block w-2 h-5 bg-gold-500 animate-pulse ml-1" />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Neue Anfrage
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900"
                >
                  Schließen
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Pulsing lightning loading animation
const LoadingLightning = () => (
  <div className="relative w-6 h-6">
    <Zap className="w-6 h-6 absolute animate-ping opacity-50" />
    <Zap className="w-6 h-6 absolute animate-pulse" />
  </div>
);

export default GedankenblitzModal;
