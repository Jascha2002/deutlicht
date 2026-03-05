import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ThumbsUp, ThumbsDown, BarChart3, Search, Eye, Loader2, LayoutGrid, X, ChevronLeft, ChevronRight
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface FeedbackAgg {
  likes: number;
  dislikes: number;
  lastDate: string | null;
}

type SortOption = 'newest' | 'most_likes' | 'most_dislikes' | 'highest_approval' | 'lowest_approval';
type FilterOption = 'all' | 'popular' | 'controversial' | 'unpopular' | 'unrated';

export function AdminTemplateOverview() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [feedback, setFeedback] = useState<Record<string, FeedbackAgg>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    const [templatesRes, feedbackRes] = await Promise.all([
      supabase.from('templates').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('template_feedback').select('template_id, feedback, created_at'),
    ]);

    if (templatesRes.data) setTemplates(templatesRes.data as Template[]);

    if (feedbackRes.data) {
      const agg: Record<string, FeedbackAgg> = {};
      (feedbackRes.data as any[]).forEach((f: any) => {
        if (!agg[f.template_id]) agg[f.template_id] = { likes: 0, dislikes: 0, lastDate: null };
        if (f.feedback === 'like') agg[f.template_id].likes++;
        else if (f.feedback === 'dislike') agg[f.template_id].dislikes++;
        if (!agg[f.template_id].lastDate || f.created_at > agg[f.template_id].lastDate) {
          agg[f.template_id].lastDate = f.created_at;
        }
      });
      setFeedback(agg);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-template-feedback')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'template_feedback' }, () => {
        loadData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  const getApproval = (tid: string) => {
    const f = feedback[tid];
    if (!f) return null;
    const total = f.likes + f.dislikes;
    if (total === 0) return null;
    return Math.round((f.likes / total) * 100);
  };

  const filtered = useMemo(() => {
    let list = [...templates];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q));
    }

    // Filter
    if (filterBy !== 'all') {
      list = list.filter(t => {
        const approval = getApproval(t.id);
        const total = (feedback[t.id]?.likes || 0) + (feedback[t.id]?.dislikes || 0);
        switch (filterBy) {
          case 'popular': return approval !== null && approval > 80;
          case 'controversial': return approval !== null && approval >= 40 && approval <= 60;
          case 'unpopular': return approval !== null && approval < 40;
          case 'unrated': return total === 0;
          default: return true;
        }
      });
    }

    // Sort
    list.sort((a, b) => {
      const fa = feedback[a.id] || { likes: 0, dislikes: 0 };
      const fb = feedback[b.id] || { likes: 0, dislikes: 0 };
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'most_likes': return fb.likes - fa.likes;
        case 'most_dislikes': return fb.dislikes - fa.dislikes;
        case 'highest_approval': return (getApproval(b.id) ?? -1) - (getApproval(a.id) ?? -1);
        case 'lowest_approval': return (getApproval(a.id) ?? 101) - (getApproval(b.id) ?? 101);
        default: return 0;
      }
    });

    return list;
  }, [templates, feedback, searchQuery, sortBy, filterBy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Vorlage suchen..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={v => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Neueste zuerst</SelectItem>
            <SelectItem value="most_likes">Meiste 👍 zuerst</SelectItem>
            <SelectItem value="most_dislikes">Meiste 👎 zuerst</SelectItem>
            <SelectItem value="highest_approval">Höchste Approval Rate</SelectItem>
            <SelectItem value="lowest_approval">Niedrigste Approval Rate</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={v => setFilterBy(v as FilterOption)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Vorlagen</SelectItem>
            <SelectItem value="popular">Beliebt (&gt;80% positiv)</SelectItem>
            <SelectItem value="controversial">Umstritten (40-60%)</SelectItem>
            <SelectItem value="unpopular">Unbeliebt (&lt;40%)</SelectItem>
            <SelectItem value="unrated">Nicht bewertet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} Vorlage{filtered.length !== 1 ? 'n' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <LayoutGrid className="w-9 h-9 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground mb-1">Keine Vorlagen gefunden</p>
          <p className="text-sm text-muted-foreground">Passen Sie Ihre Filter an.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, idx) => {
            const f = feedback[t.id] || { likes: 0, dislikes: 0, lastDate: null };
            const total = f.likes + f.dislikes;
            const approval = total > 0 ? Math.round((f.likes / total) * 100) : null;

            return (
              <div key={t.id} className="bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col relative group">
                {/* Vote pills - top right */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/90 text-white">
                    <ThumbsUp className="w-3 h-3" />
                    {f.likes}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                    <ThumbsDown className="w-3 h-3" />
                    {f.dislikes}
                  </span>
                </div>

                {/* Thumbnail */}
                <div
                  className="h-[200px] bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => setPreviewIndex(idx)}
                >
                  <img
                    src={t.thumbnail_url || `https://image.thum.io/get/width/640/crop/400/${t.url}`}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground mb-1">{t.name}</h3>
                  {t.category && <Badge className="w-fit mb-2 text-xs">{t.category}</Badge>}
                  <p className="text-xs text-muted-foreground mt-auto">
                    Erstellt am {new Date(t.created_at).toLocaleDateString('de-DE')}
                  </p>
                </div>

                {/* Actions */}
                <div className="border-t p-4 pt-3 flex items-center gap-2">
                  <Button className="flex-1 gap-2" variant="outline" onClick={() => setPreviewIndex(idx)}>
                    <Eye className="w-4 h-4" />
                    Vorschau
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs">
                        <BarChart3 className="w-4 h-4" />
                        Statistik
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-4">
                      <p className="font-semibold text-sm mb-3 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4" />
                        Bewertungsübersicht
                      </p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600 flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> Positiv</span>
                          <span className="font-medium">{f.likes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600 flex items-center gap-1"><ThumbsDown className="w-3.5 h-3.5" /> Negativ</span>
                          <span className="font-medium">{f.dislikes}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1.5">
                          <span className="text-muted-foreground">📈 Gesamt</span>
                          <span className="font-medium">{total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">✅ Approval</span>
                          <span className="font-medium">{approval !== null ? `${approval}% positiv` : '—'}</span>
                        </div>
                        {f.lastDate && (
                          <div className="border-t pt-1.5 text-xs text-muted-foreground">
                            Letzte Bewertung: {new Date(f.lastDate).toLocaleDateString('de-DE')}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Preview */}
      {previewIndex !== null && filtered[previewIndex] && (
        <AdminTemplatePreview
          templates={filtered}
          feedback={feedback}
          currentIndex={previewIndex}
          onNavigate={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
          getApproval={getApproval}
        />
      )}
    </div>
  );
}

/* ── Admin fullscreen preview ── */

interface AdminTemplatePreviewProps {
  templates: Template[];
  feedback: Record<string, FeedbackAgg>;
  currentIndex: number;
  onNavigate: (i: number) => void;
  onClose: () => void;
  getApproval: (tid: string) => number | null;
}

function AdminTemplatePreview({ templates, feedback, currentIndex, onNavigate, onClose, getApproval }: AdminTemplatePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const current = templates[currentIndex];
  const hasNext = currentIndex < templates.length - 1;
  const hasPrev = currentIndex > 0;

  const f = feedback[current.id] || { likes: 0, dislikes: 0 };
  const total = f.likes + f.dislikes;
  const approval = getApproval(current.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsLoading(true);
    setHasError(false);
    return () => { document.body.style.overflow = ''; };
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, currentIndex, hasNext, hasPrev, onNavigate]);

  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => { if (isLoading) setHasError(true); }, 15000);
    return () => clearTimeout(timeout);
  }, [isLoading, currentIndex]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Admin top bar */}
      <div className="h-[56px] bg-[hsl(var(--card))] border-b flex items-center justify-between px-4 flex-shrink-0">
        {/* Left */}
        <Button size="sm" variant="ghost" onClick={onClose} className="gap-1.5 text-sm">
          <ChevronLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Button>

        {/* Center */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">{current.name}</span>
          <span className="text-xs text-muted-foreground">{currentIndex + 1} / {templates.length}</span>
        </div>

        {/* Right: Stats + navigation */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/90 text-white">
            <ThumbsUp className="w-3 h-3" /> {f.likes}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">
            <ThumbsDown className="w-3 h-3" /> {f.dislikes}
          </span>
          {approval !== null && (
            <span className="text-xs font-medium text-muted-foreground ml-1">
              {approval}% positiv
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {total} Bewertung{total !== 1 ? 'en' : ''}
          </span>

          <div className="w-px h-6 bg-border mx-1" />

          <Button size="sm" variant="ghost" onClick={() => onNavigate(currentIndex - 1)} disabled={!hasPrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onNavigate(currentIndex + 1)} disabled={!hasNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* iFrame */}
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
                <ChevronRight className="w-4 h-4" /> Nächste Vorlage
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
