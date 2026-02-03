import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Euro } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface LineItem {
  id: string;
  position: number;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price_net: number;
  discount_percent: number;
}

interface Company {
  id: string;
  company_name: string;
}

interface Lead {
  id: string;
  lead_number: string;
  company_name: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
}

interface Project {
  id: string;
  project_number: string;
  title: string;
}

interface OfferCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OfferCreateDialog({ open, onOpenChange, onSuccess }: OfferCreateDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    lead_id: '',
    project_id: '',
    discount_percent: 0,
    valid_days: 14,
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), position: 1, title: '', description: '', quantity: 1, unit: 'Stück', unit_price_net: 0, discount_percent: 0 }
  ]);

  useEffect(() => {
    if (open) {
      loadReferenceData();
    }
  }, [open]);

  const loadReferenceData = async () => {
    try {
      const [companiesRes, leadsRes, projectsRes] = await Promise.all([
        supabase.from('crm_companies').select('id, company_name').order('company_name'),
        supabase.from('crm_leads').select('id, lead_number, company_name, contact_first_name, contact_last_name').eq('status', 'qualifiziert').order('created_at', { ascending: false }),
        supabase.from('crm_projects').select('id, project_number, title').in('status', ['planung', 'aktiv']).order('created_at', { ascending: false })
      ]);

      if (companiesRes.data) setCompanies(companiesRes.data);
      if (leadsRes.data) setLeads(leadsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { 
        id: crypto.randomUUID(), 
        position: lineItems.length + 1, 
        title: '', 
        description: '', 
        quantity: 1, 
        unit: 'Stück', 
        unit_price_net: 0, 
        discount_percent: 0 
      }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter(item => item.id !== id).map((item, idx) => ({ ...item, position: idx + 1 })));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const itemsTotal = lineItems.reduce((sum, item) => {
      const itemNet = item.quantity * item.unit_price_net * (1 - (item.discount_percent / 100));
      return sum + itemNet;
    }, 0);
    
    const discountedTotal = itemsTotal * (1 - (formData.discount_percent / 100));
    return {
      subtotal: itemsTotal,
      discount: itemsTotal - discountedTotal,
      total: discountedTotal
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Fehler', description: 'Bitte geben Sie einen Titel ein.', variant: 'destructive' });
      return;
    }

    if (!formData.company_id && !formData.lead_id) {
      toast({ title: 'Fehler', description: 'Bitte wählen Sie eine Firma oder einen Lead aus.', variant: 'destructive' });
      return;
    }

    const validLineItems = lineItems.filter(item => item.title.trim() && item.unit_price_net > 0);
    if (validLineItems.length === 0) {
      toast({ title: 'Fehler', description: 'Bitte fügen Sie mindestens eine Position hinzu.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const totals = calculateTotals();
      const validFrom = new Date();
      const validUntil = addDays(validFrom, formData.valid_days);

      // Calculate monthly if any items have monthly indicator
      const monthlyItems = validLineItems.filter(item => 
        item.unit.toLowerCase().includes('monat') || 
        item.title.toLowerCase().includes('monatlich') ||
        item.title.toLowerCase().includes('hosting') ||
        item.title.toLowerCase().includes('wartung')
      );
      const monthlyTotal = monthlyItems.reduce((sum, item) => sum + (item.quantity * item.unit_price_net), 0);
      const setupTotal = totals.total - monthlyTotal;

      const { data: offer, error: offerError } = await supabase
        .from('crm_offers')
        .insert({
          title: formData.title,
          description: formData.description || null,
          company_id: formData.company_id || null,
          lead_id: formData.lead_id || null,
          project_id: formData.project_id || null,
          status: 'entwurf',
          amount_setup: setupTotal,
          amount_monthly: monthlyTotal,
          amount_total: totals.total + (monthlyTotal * 12), // Jahreswert
          discount_percent: formData.discount_percent,
          valid_from: format(validFrom, 'yyyy-MM-dd'),
          valid_until: format(validUntil, 'yyyy-MM-dd'),
          line_items: validLineItems.map(item => ({
            position: item.position,
            title: item.title,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price_net: item.unit_price_net,
            discount_percent: item.discount_percent,
            total_net: item.quantity * item.unit_price_net * (1 - (item.discount_percent / 100))
          }))
        })
        .select()
        .single();

      if (offerError) throw offerError;

      toast({ title: 'Erfolg', description: `Angebot "${formData.title}" wurde erstellt.` });
      
      // Reset form
      setFormData({ title: '', description: '', company_id: '', lead_id: '', project_id: '', discount_percent: 0, valid_days: 14 });
      setLineItems([{ id: crypto.randomUUID(), position: 1, title: '', description: '', quantity: 1, unit: 'Stück', unit_price_net: 0, discount_percent: 0 }]);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({ title: 'Fehler', description: 'Angebot konnte nicht erstellt werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neues Angebot erstellen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Website-Relaunch inkl. SEO-Optimierung"
              />
            </div>

            <div>
              <Label htmlFor="company">Firma</Label>
              <Select value={formData.company_id || '_none'} onValueChange={(v) => setFormData({ ...formData, company_id: v === '_none' ? '' : v, lead_id: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Firma auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Keine Firma</SelectItem>
                  {companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lead">Oder Lead</Label>
              <Select value={formData.lead_id || '_none'} onValueChange={(v) => setFormData({ ...formData, lead_id: v === '_none' ? '' : v, company_id: '' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Lead auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Kein Lead</SelectItem>
                  {leads.map(l => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.lead_number} - {l.company_name || [l.contact_first_name, l.contact_last_name].filter(Boolean).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project">Projekt (optional)</Label>
              <Select value={formData.project_id || '_none'} onValueChange={(v) => setFormData({ ...formData, project_id: v === '_none' ? '' : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Projekt zuordnen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Kein Projekt</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.project_number} - {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valid_days">Gültigkeit (Tage)</Label>
              <Input
                id="valid_days"
                type="number"
                min={1}
                max={90}
                value={formData.valid_days}
                onChange={(e) => setFormData({ ...formData, valid_days: parseInt(e.target.value) || 14 })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optionale Beschreibung des Angebots..."
                rows={2}
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Positionen</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" />
                Position hinzufügen
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, idx) => (
                <Card key={item.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-1 text-center font-medium text-muted-foreground">
                        {item.position}.
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs">Bezeichnung *</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateLineItem(item.id, 'title', e.target.value)}
                          placeholder="z.B. Website-Entwicklung"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Menge</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Einheit</Label>
                        <Select value={item.unit} onValueChange={(v) => updateLineItem(item.id, 'unit', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Stück">Stück</SelectItem>
                            <SelectItem value="Stunden">Stunden</SelectItem>
                            <SelectItem value="Tage">Tage</SelectItem>
                            <SelectItem value="Monat">Monat</SelectItem>
                            <SelectItem value="Pauschal">Pauschal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Einzelpreis (netto)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unit_price_net}
                          onChange={(e) => updateLineItem(item.id, 'unit_price_net', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Rabatt %</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discount_percent}
                          onChange={(e) => updateLineItem(item.id, 'discount_percent', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length <= 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 ml-12">
                      <Input
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Optionale Beschreibung der Position..."
                        className="text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <Card className="w-80">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Zwischensumme:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span>Gesamtrabatt:</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({ ...formData, discount_percent: parseFloat(e.target.value) || 0 })}
                      className="w-16 h-7 text-right"
                    />
                    <span>%</span>
                  </div>
                  <span className="text-red-500">-{formatCurrency(totals.discount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Gesamt (netto):</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Wird erstellt...' : 'Angebot erstellen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
