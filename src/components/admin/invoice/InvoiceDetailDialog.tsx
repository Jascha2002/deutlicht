import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  ExternalLink, Send, AlertTriangle, CheckCircle, XCircle, 
  Euro, Clock, Receipt, Edit, Save, Plus, Trash2, Lock,
  ClipboardList, FileText, Link2
} from 'lucide-react';
import { format } from 'date-fns';
import { InvoicePdfButton } from '@/components/admin/DocumentPdfButtons';
import { de } from 'date-fns/locale';

type InvoiceStatus = 'entwurf' | 'gesendet' | 'ueberfaellig' | 'bezahlt' | 'storniert' | 'mahnung';

interface LineItem {
  id: string;
  bezeichnung: string;
  beschreibung?: string;
  menge: number;
  einzelpreis: number;
  gesamt: number;
  order_item_ref?: string;
  product_id?: string;
}

interface CrmInvoice {
  id: string;
  invoice_number: string;
  title: string;
  description: string | null;
  status: InvoiceStatus;
  invoice_type: string;
  amount_net: number;
  tax_rate: number;
  tax_amount: number;
  amount_gross: number;
  amount_paid: number;
  invoice_date: string;
  due_date: string;
  paid_date: string | null;
  reminder_count: number;
  pdf_url: string | null;
  line_items?: unknown;
  order_id?: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
}

interface RelatedInvoice {
  id: string;
  invoice_number: string;
  title: string;
  status: string;
  amount_gross: number;
  invoice_type: string;
}

interface LinkedOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  amount_gross: number;
}

const statusConfig: Record<InvoiceStatus, { label: string; className: string; icon: any }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground', icon: Receipt },
  gesendet: { label: 'Gesendet', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Send },
  ueberfaellig: { label: 'Überfällig', className: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  bezahlt: { label: 'Bezahlt', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  storniert: { label: 'Storniert', className: 'bg-muted text-muted-foreground', icon: XCircle },
  mahnung: { label: 'Mahnung', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangle }
};

interface InvoiceDetailDialogProps {
  invoice: CrmInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: () => void;
  onUpdate: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onPayment, onUpdate }: InvoiceDetailDialogProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [editedInvoice, setEditedInvoice] = useState<Partial<CrmInvoice>>({});
  const [linkedOrder, setLinkedOrder] = useState<LinkedOrder | null>(null);
  const [relatedInvoices, setRelatedInvoices] = useState<RelatedInvoice[]>([]);

  useEffect(() => {
    if (invoice) {
      setEditedInvoice({ title: invoice.title, description: invoice.description, tax_rate: invoice.tax_rate });
      setLineItems(parseLineItems(invoice.line_items, invoice));
      loadRelatedData(invoice);
    }
  }, [invoice]);

  const loadRelatedData = async (inv: CrmInvoice) => {
    // Load linked order
    if (inv.order_id) {
      const { data: order } = await supabase.from('crm_orders')
        .select('id, order_number, title, status, amount_gross')
        .eq('id', inv.order_id)
        .single();
      setLinkedOrder(order as LinkedOrder | null);

      // Load sibling invoices (same order)
      const { data: siblings } = await supabase.from('crm_invoices')
        .select('id, invoice_number, title, status, amount_gross, invoice_type')
        .eq('order_id', inv.order_id)
        .neq('id', inv.id)
        .order('created_at');
      setRelatedInvoices((siblings || []) as RelatedInvoice[]);
    } else {
      setLinkedOrder(null);
      setRelatedInvoices([]);
    }
  };

  const parseLineItems = (lineItemsData: unknown, inv: CrmInvoice): LineItem[] => {
    if (!lineItemsData) {
      return [{ id: 'main-1', bezeichnung: inv.title, menge: 1, einzelpreis: inv.amount_net || 0, gesamt: inv.amount_net || 0 }];
    }
    try {
      const data = typeof lineItemsData === 'string' ? JSON.parse(lineItemsData) : lineItemsData;
      const arr = Array.isArray(data) ? data : data?.items || [];
      if (arr.length === 0) {
        return [{ id: 'main-1', bezeichnung: inv.title, menge: 1, einzelpreis: inv.amount_net || 0, gesamt: inv.amount_net || 0 }];
      }
      return arr.map((item: any, idx: number) => ({
        id: item.id || `item-${idx}`,
        bezeichnung: item.bezeichnung || item.name || item.description || 'Position',
        beschreibung: item.beschreibung || '',
        menge: item.menge || item.quantity || 1,
        einzelpreis: item.einzelpreis || item.unit_price || item.price || 0,
        gesamt: (item.menge || item.quantity || 1) * (item.einzelpreis || item.unit_price || item.price || 0),
        order_item_ref: item.order_item_ref,
        product_id: item.product_id
      }));
    } catch {
      return [{ id: 'main-1', bezeichnung: inv.title, menge: 1, einzelpreis: inv.amount_net || 0, gesamt: inv.amount_net || 0 }];
    }
  };

  if (!invoice) return null;

  const isLocked = invoice.status !== 'entwurf';
  const canEdit = !isLocked;
  const StatusIcon = statusConfig[invoice.status]?.icon || Receipt;
  const totalNet = lineItems.reduce((sum, item) => sum + item.gesamt, 0);
  const taxAmount = totalNet * (invoice.tax_rate / 100);
  const totalGross = totalNet + taxAmount;
  const remainingAmount = (invoice.amount_gross || 0) - (invoice.amount_paid || 0);

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('crm_invoices').update({ status: newStatus }).eq('id', invoice.id);
      if (error) throw error;
      toast({ title: 'Status aktualisiert', description: `Rechnung ist jetzt "${statusConfig[newStatus].label}".` });
      onUpdate();
    } catch {
      toast({ title: 'Fehler', description: 'Status konnte nicht aktualisiert werden.', variant: 'destructive' });
    } finally { setIsUpdating(false); }
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const newNet = lineItems.reduce((sum, item) => sum + (item.menge * item.einzelpreis), 0);
      const taxRate = editedInvoice.tax_rate || invoice.tax_rate || 19;
      const { error } = await supabase.from('crm_invoices').update({
        title: editedInvoice.title as string,
        description: editedInvoice.description as string,
        amount_net: newNet,
        tax_rate: taxRate,
        amount_gross: newNet * (1 + taxRate / 100),
        line_items: JSON.parse(JSON.stringify({ items: lineItems }))
      }).eq('id', invoice.id);
      if (error) throw error;
      toast({ title: 'Gespeichert', description: 'Änderungen wurden übernommen.' });
      setIsEditing(false);
      onUpdate();
    } catch {
      toast({ title: 'Fehler', description: 'Änderungen konnten nicht gespeichert werden.', variant: 'destructive' });
    } finally { setIsUpdating(false); }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: `new-${Date.now()}`, bezeichnung: 'Neue Position', menge: 1, einzelpreis: 0, gesamt: 0 }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.gesamt = updated.menge * updated.einzelpreis;
        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => setLineItems(lineItems.filter(item => item.id !== id));

  const handleSendReminder = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('crm_invoices').update({ 
        status: 'mahnung', reminder_count: (invoice.reminder_count || 0) + 1 
      }).eq('id', invoice.id);
      if (error) throw error;
      toast({ title: 'Mahnung vermerkt', description: `Mahnung ${(invoice.reminder_count || 0) + 1} wurde erfasst.` });
      onUpdate();
    } catch {
      toast({ title: 'Fehler', description: 'Mahnung konnte nicht erfasst werden.', variant: 'destructive' });
    } finally { setIsUpdating(false); }
  };

  const handleCancel = async () => {
    if (!confirm('Rechnung wirklich stornieren? Es muss eine Gutschrift erstellt werden.')) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('crm_invoices').update({ status: 'storniert' }).eq('id', invoice.id);
      if (error) throw error;
      toast({ title: 'Rechnung storniert', description: 'Bitte erstellen Sie eine Gutschrift.' });
      onUpdate();
    } catch {
      toast({ title: 'Fehler', description: 'Rechnung konnte nicht storniert werden.', variant: 'destructive' });
    } finally { setIsUpdating(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <Input value={editedInvoice.title || ''} onChange={(e) => setEditedInvoice({ ...editedInvoice, title: e.target.value })} className="text-xl font-semibold" />
              ) : (
                <DialogTitle className="text-xl">{invoice.title}</DialogTitle>
              )}
              <p className="text-muted-foreground">{invoice.invoice_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[invoice.status]?.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[invoice.status]?.label}
                {invoice.reminder_count > 0 && ` (${invoice.reminder_count})`}
              </Badge>
              {isLocked && (
                <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" />Unveränderbar</Badge>
              )}
              {canEdit && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />Bearbeiten
                </Button>
              )}
              {invoice.status !== 'bezahlt' && invoice.status !== 'storniert' && (
                <Select value={invoice.status} onValueChange={(v) => handleStatusChange(v as InvoiceStatus)}>
                  <SelectTrigger className="w-auto h-7 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entwurf">Entwurf</SelectItem>
                    <SelectItem value="gesendet">Gesendet</SelectItem>
                    <SelectItem value="ueberfaellig">Überfällig</SelectItem>
                    <SelectItem value="mahnung">Mahnung</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </DialogHeader>
        
        {/* Linked Order & Related Invoices */}
        {(linkedOrder || relatedInvoices.length > 0) && (
          <div className="mt-4 space-y-3">
            {linkedOrder && (
              <Card className="border-primary/20">
                <CardContent className="p-3 flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Zugehöriger Auftrag: {linkedOrder.order_number}</p>
                    <p className="text-xs text-muted-foreground">{linkedOrder.title} – {formatCurrency(linkedOrder.amount_gross)}</p>
                  </div>
                  <Badge variant="outline">{linkedOrder.status}</Badge>
                </CardContent>
              </Card>
            )}
            {relatedInvoices.length > 0 && (
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Link2 className="h-4 w-4" />
                    Weitere Rechnungen zu diesem Auftrag
                  </p>
                  <div className="space-y-1">
                    {relatedInvoices.map(ri => (
                      <div key={ri.id} className="flex items-center justify-between text-sm p-1 rounded hover:bg-muted/50">
                        <span>{ri.invoice_number} – {ri.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{ri.invoice_type}</Badge>
                          <span className="font-medium">{formatCurrency(ri.amount_gross)}</span>
                          <Badge variant="outline" className="text-xs">{ri.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Amounts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{formatCurrency(totalNet)}</p>
            <p className="text-xs text-muted-foreground">Netto</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{formatCurrency(taxAmount)}</p>
            <p className="text-xs text-muted-foreground">MwSt. ({invoice.tax_rate}%)</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalGross)}</p>
            <p className="text-xs text-muted-foreground">Brutto</p>
          </CardContent></Card>
          <Card className={remainingAmount > 0 ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' : 'border-green-200 bg-green-50 dark:bg-green-900/20'}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{formatCurrency(remainingAmount)}</p>
              <p className="text-xs text-muted-foreground">Offen</p>
            </CardContent>
          </Card>
        </div>

        {/* Line Items */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Rechnungspositionen</h3>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" />Position hinzufügen
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Bezeichnung</TableHead>
                <TableHead className="w-[15%] text-right">Menge</TableHead>
                <TableHead className="w-[20%] text-right">Einzelpreis</TableHead>
                <TableHead className="w-[15%] text-right">Gesamt</TableHead>
                {isEditing && <TableHead className="w-[10%]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input value={item.bezeichnung} onChange={(e) => updateLineItem(item.id, 'bezeichnung', e.target.value)} />
                        <Input value={item.beschreibung || ''} onChange={(e) => updateLineItem(item.id, 'beschreibung', e.target.value)} placeholder="Beschreibung..." className="text-sm" />
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{item.bezeichnung}</p>
                        {item.beschreibung && <p className="text-sm text-muted-foreground">{item.beschreibung}</p>}
                        {item.order_item_ref && <Badge variant="outline" className="text-xs mt-1">Aus Auftrag</Badge>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{isEditing ? <Input type="number" value={item.menge} onChange={(e) => updateLineItem(item.id, 'menge', parseFloat(e.target.value) || 1)} className="w-20 text-right" /> : item.menge}</TableCell>
                  <TableCell className="text-right">{isEditing ? <Input type="number" value={item.einzelpreis} onChange={(e) => updateLineItem(item.id, 'einzelpreis', parseFloat(e.target.value) || 0)} className="w-28 text-right" /> : formatCurrency(item.einzelpreis)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.gesamt)}</TableCell>
                  {isEditing && (
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeLineItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Kunde</p>
            <p className="font-medium">{invoice.crm_companies?.company_name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projekt</p>
            <p className="font-medium">{invoice.crm_projects ? `${invoice.crm_projects.project_number} - ${invoice.crm_projects.title}` : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rechnungsdatum</p>
            <p className="font-medium">{format(new Date(invoice.invoice_date), 'dd.MM.yyyy', { locale: de })}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fälligkeitsdatum</p>
            <p className="font-medium">{format(new Date(invoice.due_date), 'dd.MM.yyyy', { locale: de })}</p>
          </div>
        </div>

        {invoice.paid_date && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Bezahlt am {format(new Date(invoice.paid_date), 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
        )}

        {isLocked && invoice.status !== 'entwurf' && (
          <div className="mt-4 p-4 bg-muted rounded-lg border">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Diese Rechnung wurde bereits versendet und ist unveränderbar. Bei Korrekturen erstellen Sie bitte eine Gutschrift.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          {isEditing ? (
            <>
              <Button onClick={handleSaveChanges} disabled={isUpdating} className="gap-2"><Save className="h-4 w-4" />Speichern</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Abbrechen</Button>
            </>
          ) : (
            <>
              <InvoicePdfButton invoiceId={invoice.id} />
              {invoice.pdf_url && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />PDF öffnen</a>
                </Button>
              )}
              {invoice.status === 'entwurf' && (
                <Button variant="outline" className="gap-2" onClick={() => handleStatusChange('gesendet')} disabled={isUpdating}>
                  <Send className="h-4 w-4" />Als gesendet markieren
                </Button>
              )}
              {['gesendet', 'ueberfaellig', 'mahnung'].includes(invoice.status) && (
                <>
                  <Button className="gap-2" onClick={onPayment}><Euro className="h-4 w-4" />Zahlung erfassen</Button>
                  <Button variant="outline" className="gap-2" onClick={handleSendReminder} disabled={isUpdating}><AlertTriangle className="h-4 w-4" />Mahnung erfassen</Button>
                </>
              )}
              {invoice.status !== 'storniert' && invoice.status !== 'bezahlt' && (
                <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={handleCancel} disabled={isUpdating}>
                  <XCircle className="h-4 w-4" />Stornieren
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
