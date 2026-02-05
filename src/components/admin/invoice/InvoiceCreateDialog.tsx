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
import { Plus, Trash2, Calculator } from 'lucide-react';

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Company {
  id: string;
  company_name: string;
}

interface Project {
  id: string;
  project_number: string;
  title: string;
  company_id: string | null;
}

interface InvoiceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InvoiceCreateDialog({ open, onOpenChange, onSuccess }: InvoiceCreateDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    project_id: '',
    invoice_type: 'rechnung',
    tax_rate: 19,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    const [companiesRes, projectsRes] = await Promise.all([
      supabase.from('crm_companies').select('id, company_name').order('company_name'),
      supabase.from('crm_projects').select('id, project_number, title, company_id').order('created_at', { ascending: false })
    ]);
    
    setCompanies(companiesRes.data || []);
    setProjects(projectsRes.data || []);
  };

  const calculateTotals = () => {
    const netTotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = netTotal * (formData.tax_rate / 100);
    const grossTotal = netTotal + taxAmount;
    return { netTotal, taxAmount, grossTotal };
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(items => items.map(item => {
      if (item.id !== id) return item;
      
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unit_price') {
        updated.total = updated.quantity * updated.unit_price;
      }
      return updated;
    }));
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: crypto.randomUUID(), 
      description: '', 
      quantity: 1, 
      unit_price: 0, 
      total: 0 
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(items => items.filter(item => item.id !== id));
    }
  };

  const handleProjectChange = (projectId: string) => {
    setFormData(prev => ({ ...prev, project_id: projectId }));
    const project = projects.find(p => p.id === projectId);
    if (project?.company_id) {
      setFormData(prev => ({ ...prev, company_id: project.company_id! }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.company_id) {
      toast({
        title: 'Fehler',
        description: 'Bitte Titel und Kunde ausfüllen.',
        variant: 'destructive'
      });
      return;
    }

    if (lineItems.every(item => !item.description || item.total === 0)) {
      toast({
        title: 'Fehler',
        description: 'Bitte mindestens eine Position hinzufügen.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { netTotal, taxAmount, grossTotal } = calculateTotals();

      // Build description with line items
      const itemsDescription = lineItems
        .filter(item => item.description)
        .map(item => `${item.quantity}x ${item.description}: ${item.total.toLocaleString('de-DE')} €`)
        .join('\n');

      const { error } = await supabase.from('crm_invoices').insert({
        title: formData.title,
        description: formData.description ? `${formData.description}\n\n${itemsDescription}` : itemsDescription,
        company_id: formData.company_id || null,
        project_id: formData.project_id || null,
        invoice_type: formData.invoice_type,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        amount_net: netTotal,
        tax_rate: formData.tax_rate,
        amount_gross: grossTotal,
        amount_paid: 0,
        status: 'entwurf'
      });

      if (error) throw error;

      toast({
        title: 'Rechnung erstellt',
        description: 'Die Rechnung wurde als Entwurf gespeichert.'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        company_id: '',
        project_id: '',
        invoice_type: 'rechnung',
        tax_rate: 19,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setLineItems([{ id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 }]);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnung konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { netTotal, taxAmount, grossTotal } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neue Rechnung erstellen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Titel / Betreff *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="z.B. Website-Entwicklung März 2026"
              />
            </div>

            <div>
              <Label>Projekt</Label>
              <Select value={formData.project_id} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Projekt auswählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_number} - {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Kunde *</Label>
              <Select 
                value={formData.company_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kunde auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rechnungsart</Label>
              <Select 
                value={formData.invoice_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, invoice_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rechnung">Rechnung</SelectItem>
                  <SelectItem value="anzahlung">Anzahlung</SelectItem>
                  <SelectItem value="abschlag">Abschlagsrechnung</SelectItem>
                  <SelectItem value="schlussrechnung">Schlussrechnung</SelectItem>
                  <SelectItem value="gutschrift">Gutschrift</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>MwSt.-Satz</Label>
              <Select 
                value={formData.tax_rate.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tax_rate: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="19">19% (Standard)</SelectItem>
                  <SelectItem value="7">7% (ermäßigt)</SelectItem>
                  <SelectItem value="0">0% (steuerfrei)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rechnungsdatum</Label>
              <Input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
              />
            </div>

            <div>
              <Label>Fälligkeitsdatum</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>

            <div className="col-span-2">
              <Label>Beschreibung / Notizen</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Zusätzliche Informationen..."
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
                Position
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Beschreibung</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Leistungsbeschreibung"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Menge</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Einzelpreis (€)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Gesamt</Label>
                        <div className="h-9 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Totals */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold">Summe</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(netTotal)}</p>
                  <p className="text-xs text-muted-foreground">Netto</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">{formatCurrency(taxAmount)}</p>
                  <p className="text-xs text-muted-foreground">MwSt. ({formData.tax_rate}%)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(grossTotal)}</p>
                  <p className="text-xs text-muted-foreground">Brutto</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Speichern...' : 'Als Entwurf speichern'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
