import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Loader2, Trash2, Pencil, UserPlus, X, CheckCircle, AlertCircle, RefreshCw
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
  created_by: string | null;
}

interface CustomerAssignment {
  id: string;
  customer_id: string;
  company_id: string | null;
  template_id: string;
  assigned_at: string;
  customer_name?: string;
  customer_email?: string;
}

interface Company {
  id: string;
  company_name: string;
  email: string | null;
  contact_person_name: string | null;
}

export function TemplateManagement() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [autoFilled, setAutoFilled] = useState<string[]>([]);

  // Form state
  const [formUrl, setFormUrl] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");

  // Edit state
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");

  // Assign state
  const [assigningTemplateId, setAssigningTemplateId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [assignments, setAssignments] = useState<Record<string, CustomerAssignment[]>>({});
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
    loadCompanies();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    // Admin can see all templates including inactive - use a direct query
    // RLS allows admin to see active ones; for inactive we need the admin policy
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading templates:', error);
    } else {
      setTemplates((data as Template[]) || []);
      // Load assignments for each template
      const { data: allAssignments } = await supabase
        .from('customer_templates')
        .select('*');
      
      const grouped: Record<string, CustomerAssignment[]> = {};
      (allAssignments || []).forEach((a: any) => {
        if (!grouped[a.template_id]) grouped[a.template_id] = [];
        grouped[a.template_id].push(a);
      });
      setAssignments(grouped);
    }
    setIsLoading(false);
  };

  const loadCompanies = async () => {
    const { data, error } = await supabase
      .from('crm_companies')
      .select('id, company_name, email, contact_person_name')
      .eq('is_active', true)
      .order('company_name');
    if (!error) {
      setCompanies((data as Company[]) || []);
    }
  };

  const fetchUrlMeta = useCallback(async (url: string) => {
    if (!url || !url.startsWith('http') || !url.includes('.')) return;
    setFetchStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('fetch-url-meta', {
        body: { url }
      });
      if (error) throw error;

      const filled: string[] = [];
      if (!formName && data.name) { setFormName(data.name); filled.push('name'); }
      if (!formDescription && data.description) { setFormDescription(data.description); filled.push('description'); }
      if (!formThumbnail && data.thumbnailUrl) { setFormThumbnail(data.thumbnailUrl); filled.push('thumbnail'); }
      if (!formCategory && data.category && data.category !== 'Allgemein') { setFormCategory(data.category); filled.push('category'); }
      setAutoFilled(filled);
      setFetchStatus('success');
    } catch (e) {
      console.error('Meta fetch failed:', e);
      setFetchStatus('error');
    }
  }, [formName, formDescription, formThumbnail, formCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formUrl && formUrl.startsWith('http') && formUrl.includes('.')) {
        fetchUrlMeta(formUrl);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [formUrl]);

  const handleSaveTemplate = async () => {
    if (!formUrl || !formName) {
      toast({ title: 'Fehler', description: 'URL und Name sind erforderlich.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const tags = formTags ? formTags.split(',').map(t => t.trim()).filter(Boolean) : null;

      const { error } = await supabase.from('templates').insert({
        url: formUrl,
        name: formName,
        description: formDescription || null,
        category: formCategory || null,
        tags,
        thumbnail_url: formThumbnail || null,
        created_by: user?.id || null,
      });

      if (error) throw error;

      toast({ title: 'Vorlage gespeichert', description: `"${formName}" wurde erfolgreich erstellt.` });
      setFormUrl(""); setFormName(""); setFormDescription(""); setFormCategory(""); setFormTags(""); setFormThumbnail("");
      setAutoFilled([]); setFetchStatus('idle');
      loadTemplates();
    } catch (e: any) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (template: Template) => {
    const { error } = await supabase
      .from('templates')
      .update({ is_active: !template.is_active })
      .eq('id', template.id);

    if (!error) {
      setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, is_active: !t.is_active } : t));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (!error) {
      toast({ title: 'Gelöscht', description: 'Vorlage wurde entfernt.' });
      setTemplates(prev => prev.filter(t => t.id !== id));
      setDeleteConfirmId(null);
    }
  };

  const handleEditSave = async () => {
    if (!editingTemplate) return;
    const tags = editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : null;
    const { error } = await supabase.from('templates').update({
      name: editName,
      description: editDescription || null,
      category: editCategory || null,
      tags,
      thumbnail_url: editThumbnail || null,
    }).eq('id', editingTemplate.id);

    if (!error) {
      toast({ title: 'Gespeichert' });
      setEditingTemplate(null);
      loadTemplates();
    }
  };

  const handleAssign = async (templateId: string) => {
    if (!selectedCompanyId) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('customer_templates').insert({
      customer_id: user?.id || '',
      company_id: selectedCompanyId,
      template_id: templateId,
      assigned_by: user?.id || null,
    } as any);

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Info', description: 'Bereits zugewiesen.' });
      } else {
        toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Zugewiesen', description: 'Vorlage wurde der Firma zugewiesen.' });
      setSelectedCompanyId("");
      loadTemplates();
    }
  };

  const handleUnassign = async (assignmentId: string) => {
    const { error } = await supabase.from('customer_templates').delete().eq('id', assignmentId);
    if (!error) {
      toast({ title: 'Entfernt' });
      loadTemplates();
    }
  };

  const getCompanyName = (assignment: CustomerAssignment) => {
    if (assignment.company_id) {
      const c = companies.find(c => c.id === assignment.company_id);
      return c ? `${c.company_name}${c.email ? ` (${c.email})` : ''}` : assignment.company_id;
    }
    return assignment.customer_id;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add new template form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Neue Vorlage hinzufügen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. URL Field with status */}
            <div className="space-y-2 md:col-span-2">
              <Label>Website URL *</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="https://mein-projekt.lovable.app"
                    value={formUrl}
                    onChange={e => setFormUrl(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {fetchStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                    {fetchStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {fetchStatus === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                  </div>
                </div>
                {fetchStatus !== 'idle' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => { setAutoFilled([]); fetchUrlMeta(formUrl); }}
                    className="gap-1 text-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Erneut
                  </Button>
                )}
              </div>
              {fetchStatus === 'loading' && (
                <p className="text-sm text-muted-foreground">Website wird analysiert...</p>
              )}
              {fetchStatus === 'success' && autoFilled.length > 0 && (
                <p className="text-sm text-green-600">✓ {autoFilled.length} Felder automatisch ausgefüllt — bitte prüfen</p>
              )}
              {fetchStatus === 'success' && autoFilled.length === 0 && (
                <p className="text-sm text-muted-foreground">Website geladen — keine zusätzlichen Metadaten gefunden</p>
              )}
              {fetchStatus === 'error' && (
                <p className="text-sm text-destructive">Website konnte nicht analysiert werden — bitte manuell ausfüllen</p>
              )}
            </div>

            {/* 2. Thumbnail Preview (full width, appears when available) */}
            {formThumbnail && (
              <div className="md:col-span-2">
                <div className="rounded-lg overflow-hidden border w-full max-h-48">
                  <img
                    src={formThumbnail}
                    alt="Vorschau"
                    className="w-full h-48 object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* 3. Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Name der Vorlage *
                {autoFilled.includes('name') && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full ml-1">Automatisch ermittelt</span>
                )}
              </Label>
              <Input
                placeholder="z.B. Metallbau Kutschbach – Design 1"
                value={formName}
                onChange={e => { setFormName(e.target.value); setAutoFilled(prev => prev.filter(f => f !== 'name')); }}
              />
            </div>

            {/* 4. Category with datalist */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Kategorie
                {autoFilled.includes('category') && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full ml-1">Automatisch ermittelt</span>
                )}
              </Label>
              <Input
                placeholder="z.B. Metallbau, Handwerk, Gastronomie"
                value={formCategory}
                onChange={e => { setFormCategory(e.target.value); setAutoFilled(prev => prev.filter(f => f !== 'category')); }}
                list="template-categories"
              />
              <datalist id="template-categories">
                <option value="Metallbau" />
                <option value="Handwerk" />
                <option value="Gastronomie" />
                <option value="Beauty" />
                <option value="Medizin" />
                <option value="E-Commerce" />
                <option value="Dienstleistung" />
                <option value="Allgemein" />
              </datalist>
            </div>

            {/* 5. Description */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1">
                Kurzbeschreibung
                {autoFilled.includes('description') && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full ml-1">Automatisch ermittelt</span>
                )}
              </Label>
              <Textarea
                rows={3}
                placeholder="Professionelle Website für Metallbauunternehmen..."
                value={formDescription}
                onChange={e => { setFormDescription(e.target.value); setAutoFilled(prev => prev.filter(f => f !== 'description')); }}
              />
            </div>

            {/* 6. Thumbnail URL */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Vorschaubild URL
                {autoFilled.includes('thumbnail') && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full ml-1">Automatisch ermittelt</span>
                )}
              </Label>
              <Input
                placeholder="https://... (wird automatisch ermittelt)"
                value={formThumbnail}
                onChange={e => { setFormThumbnail(e.target.value); setAutoFilled(prev => prev.filter(f => f !== 'thumbnail')); }}
              />
            </div>

            {/* 7. Tags */}
            <div className="space-y-2">
              <Label>Tags (kommagetrennt)</Label>
              <Input
                placeholder="modern, dunkel, B2B"
                value={formTags}
                onChange={e => setFormTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">z.B. modern, dunkel, B2B — mit Komma trennen</p>
            </div>
          </div>

          <Button onClick={handleSaveTemplate} disabled={isSaving || !formUrl || !formName} className="mt-4 gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isSaving ? 'Wird gespeichert...' : 'Vorlage speichern'}
          </Button>
        </CardContent>
      </Card>

      {/* Templates list */}
      <Card>
        <CardHeader>
          <CardTitle>Alle Vorlagen ({templates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Noch keine Vorlagen erstellt.</p>
          ) : (
            <div className="space-y-4">
              {templates.map(t => (
                <div key={t.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={t.thumbnail_url || `https://image.thum.io/get/width/320/crop/200/${t.url}`}
                        alt={t.name}
                        className="w-16 h-10 rounded object-cover flex-shrink-0 border"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{t.name}</p>
                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline truncate block">
                          {t.url}
                        </a>
                        {t.category && <Badge variant="secondary" className="mt-1 text-xs">{t.category}</Badge>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{t.is_active ? 'Aktiv' : 'Inaktiv'}</span>
                        <Switch checked={t.is_active} onCheckedChange={() => handleToggleActive(t)} />
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => {
                        setEditingTemplate(t);
                        setEditName(t.name);
                        setEditDescription(t.description || '');
                        setEditCategory(t.category || '');
                        setEditTags(t.tags?.join(', ') || '');
                        setEditThumbnail(t.thumbnail_url || '');
                      }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setAssigningTemplateId(t.id)}>
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteConfirmId(t.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Assigned customers */}
                  {assignments[t.id] && assignments[t.id].length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                      <span className="text-xs text-muted-foreground mr-1">Zugewiesen:</span>
                      {assignments[t.id].map(a => (
                        <Badge key={a.id} variant="outline" className="text-xs gap-1">
                          {getCompanyName(a)}
                          <button onClick={() => handleUnassign(a.id)} className="hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Inline assign */}
                  {assigningTemplateId === t.id && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Firma auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.company_name}{c.email ? ` — ${c.email}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleAssign(t.id)} disabled={!selectedCompanyId}>
                        Zuweisen
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setAssigningTemplateId(null)}>
                        Abbrechen
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={open => !open && setEditingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorlage bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {/* Live screenshot preview */}
            {editingTemplate?.url && (
              <div className="rounded-lg overflow-hidden border w-full">
                <img
                  src={editThumbnail || `https://image.thum.io/get/width/640/crop/400/${editingTemplate.url}`}
                  alt="Vorschau der Startseite"
                  className="w-full h-40 object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Beschreibung</Label>
              <Textarea rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Kategorie</Label>
              <Input value={editCategory} onChange={e => setEditCategory(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Tags (kommagetrennt)</Label>
              <Input value={editTags} onChange={e => setEditTags(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Vorschaubild URL (optional, sonst Screenshot der Startseite)</Label>
              <Input value={editThumbnail} onChange={e => setEditThumbnail(e.target.value)} placeholder="Leer lassen für automatischen Screenshot" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>Abbrechen</Button>
            <Button onClick={handleEditSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirmId} onOpenChange={open => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vorlage löschen?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Diese Aktion kann nicht rückgängig gemacht werden. Alle Kundenzuweisungen werden ebenfalls entfernt.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Abbrechen</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Endgültig löschen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
