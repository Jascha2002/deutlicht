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
  Plus, Loader2, Check, Trash2, Pencil, UserPlus, X, Globe
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
  template_id: string;
  assigned_at: string;
  customer_name?: string;
  customer_email?: string;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

export function TemplateManagement() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [metaFetched, setMetaFetched] = useState(false);

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
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [assignments, setAssignments] = useState<Record<string, CustomerAssignment[]>>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
    loadCustomers();
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

  const loadCustomers = async () => {
    // Load all profiles that have 'kunde' role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'kunde');

    if (roles && roles.length > 0) {
      const userIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);
      setCustomers((profiles as Profile[]) || []);
    }
  };

  // Debounced URL meta fetch
  const fetchUrlMeta = useCallback(async (url: string) => {
    if (!url || !url.startsWith('http')) return;
    setIsFetchingMeta(true);
    setMetaFetched(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('fetch-url-meta', {
        body: { url }
      });

      if (!error && data) {
        if (data.title && !formName) setFormName(data.title);
        if (data.description && !formDescription) setFormDescription(data.description);
        if (data.thumbnailUrl && !formThumbnail) setFormThumbnail(data.thumbnailUrl);
        setMetaFetched(true);
      }
    } catch (e) {
      console.error('Meta fetch failed:', e);
    } finally {
      setIsFetchingMeta(false);
    }
  }, [formName, formDescription, formThumbnail]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formUrl && formUrl.startsWith('http')) {
        fetchUrlMeta(formUrl);
      }
    }, 800);
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
      setMetaFetched(false);
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
    if (!selectedCustomerId) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('customer_templates').insert({
      customer_id: selectedCustomerId,
      template_id: templateId,
      assigned_by: user?.id || null,
    });

    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Info', description: 'Bereits zugewiesen.' });
      } else {
        toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Zugewiesen', description: 'Vorlage wurde dem Kunden zugewiesen.' });
      setSelectedCustomerId("");
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

  const getCustomerName = (customerId: string) => {
    const c = customers.find(c => c.user_id === customerId);
    return c ? (c.full_name || c.email || customerId) : customerId;
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
            <div className="space-y-2 md:col-span-2">
              <Label>Website URL *</Label>
              <Input
                placeholder="https://mein-projekt.lovable.app"
                value={formUrl}
                onChange={e => setFormUrl(e.target.value)}
              />
              {isFetchingMeta && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Metadaten werden geladen...
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Name der Vorlage *
                {metaFetched && formName && <Check className="w-3 h-3 text-green-500" />}
              </Label>
              <Input
                placeholder="z.B. Metallbau Kutschbach – Design 1"
                value={formName}
                onChange={e => setFormName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Input
                placeholder="z.B. Metallbau, Handwerk, Gastronomie"
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1">
                Kurzbeschreibung
                {metaFetched && formDescription && <Check className="w-3 h-3 text-green-500" />}
              </Label>
              <Textarea
                rows={3}
                placeholder="Professionelle Website für Metallbauunternehmen..."
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (kommagetrennt)</Label>
              <Input
                placeholder="modern, dunkel, B2B"
                value={formTags}
                onChange={e => setFormTags(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Vorschaubild URL
                {metaFetched && formThumbnail && <Check className="w-3 h-3 text-green-500" />}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="https://... (wird automatisch ermittelt)"
                  value={formThumbnail}
                  onChange={e => setFormThumbnail(e.target.value)}
                  className="flex-1"
                />
                {formThumbnail && (
                  <img src={formThumbnail} alt="Preview" className="h-[38px] w-auto rounded border object-cover" />
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleSaveTemplate} disabled={isSaving || !formUrl || !formName} className="mt-4 gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Vorlage speichern
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
                      {t.thumbnail_url ? (
                        <img src={t.thumbnail_url} alt="" className="w-16 h-10 rounded object-cover flex-shrink-0 border" />
                      ) : (
                        <div className="w-16 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
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
                          {getCustomerName(a.customer_id)}
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
                      <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Kunde auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(c => (
                            <SelectItem key={c.user_id} value={c.user_id}>
                              {c.full_name || 'Unbenannt'} – {c.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={() => handleAssign(t.id)} disabled={!selectedCustomerId}>
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
              <Label>Vorschaubild URL</Label>
              <Input value={editThumbnail} onChange={e => setEditThumbnail(e.target.value)} />
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
