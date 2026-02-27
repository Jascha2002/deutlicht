import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TemplatePreviewViewer } from '@/components/TemplatePreviewViewer';
import { ArrowLeft, Eye, Loader2, LayoutGrid } from 'lucide-react';

interface AssignedTemplate {
  id: string;
  template_id: string;
  assigned_at: string;
  template: {
    id: string;
    name: string;
    url: string;
    description: string | null;
    category: string | null;
    tags: string[] | null;
    thumbnail_url: string | null;
  };
}

const KundenVorlagen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<AssignedTemplate[]>([]);
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [previewTemplate, setPreviewTemplate] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }

      // Find company linked to this user
      const { data: company } = await supabase
        .from('crm_companies')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!company) {
        // No company linked - try legacy customer_id lookup
        const { data, error } = await supabase
          .from('customer_templates')
          .select(`
            id, template_id, assigned_at,
            template:templates(id, name, url, description, category, tags, thumbnail_url)
          `)
          .eq('customer_id', user.id);

        if (error) throw error;
        const validTemplates = (data || []).filter((d: any) => d.template) as unknown as AssignedTemplate[];
        setTemplates(validTemplates);
        setIsLoading(false);
        return;
      }

      // Company-based lookup
      const { data, error } = await supabase
        .from('customer_templates')
        .select(`
          id, template_id, assigned_at,
          template:templates(id, name, url, description, category, tags, thumbnail_url)
        `)
        .eq('company_id', company.id);

      if (error) throw error;
      const validTemplates = (data || []).filter((d: any) => d.template) as unknown as AssignedTemplate[];
      setTemplates(validTemplates);
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Fehler', description: 'Vorlagen konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach(t => {
      if (t.template.category) cats.add(t.template.category);
    });
    return ['Alle', ...Array.from(cats)];
  }, [templates]);

  const filtered = activeCategory === 'Alle'
    ? templates
    : templates.filter(t => t.template.category === activeCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ihre Vorlagen | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">Ihre Vorlagen</h1>
            <Button variant="ghost" onClick={() => navigate('/mein-bereich')} className="gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Zurück zum Dashboard
            </Button>
          </div>
          <p className="text-muted-foreground mb-1">Website-Designs, die wir für Sie vorbereitet haben</p>
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} Vorlage{filtered.length !== 1 ? 'n' : ''} verfügbar
          </p>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-accent text-accent-foreground'
                      : 'border border-muted-foreground/30 text-muted-foreground hover:border-accent hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Templates grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                <LayoutGrid className="w-9 h-9 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">Noch keine Vorlagen verfügbar</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Ihr Berater fügt hier bald Website-Designs für Sie hinzu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item => (
                <div key={item.id} className="bg-card rounded-xl shadow-sm border overflow-hidden flex flex-col">
                  {/* Thumbnail */}
                  <div className="h-[200px] bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={item.template.thumbnail_url || `https://image.thum.io/get/width/640/crop/400/${item.template.url}`}
                      alt={item.template.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground mb-1">{item.template.name}</h3>
                    {item.template.category && (
                      <Badge className="w-fit mb-2 text-xs">{item.template.category}</Badge>
                    )}
                    {item.template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.template.description}</p>
                    )}
                    {item.template.tags && item.template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.template.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-auto">
                      Hinzugefügt am {new Date(item.assigned_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="border-t p-4 pt-3">
                    <Button
                      className="w-full gap-2"
                      onClick={() => setPreviewTemplate({ url: item.template.url, name: item.template.name })}
                    >
                      <Eye className="w-4 h-4" />
                      Vorschau ansehen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Preview viewer */}
      <TemplatePreviewViewer
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        url={previewTemplate?.url || ''}
        name={previewTemplate?.name || ''}
      />
    </>
  );
};

export default KundenVorlagen;
