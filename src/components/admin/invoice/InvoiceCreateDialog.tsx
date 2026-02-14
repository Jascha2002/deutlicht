import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Plus, Trash2, Calculator, Package, ClipboardList, FileText } from 'lucide-react';

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  product_id?: string;
  order_item_ref?: string; // reference to order line item id
  deferred?: boolean; // if true, this item is deferred to a later invoice
}

interface Company {
  id: string;
  company_name: string;
}

interface Order {
  id: string;
  order_number: string;
  title: string;
  company_id: string | null;
  project_id: string | null;
  line_items: unknown;
  status: string;
  amount_net: number;
  amount_gross: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price_setup: number | null;
  price_monthly: number | null;
  price_yearly: number | null;
  description: string | null;
}

interface ExistingInvoice {
  id: string;
  invoice_number: string;
  order_id: string | null;
  line_items: unknown;
}

interface InvoiceCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

export function InvoiceCreateDialog({ open, onOpenChange, onSuccess }: InvoiceCreateDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [existingInvoices, setExistingInvoices] = useState<ExistingInvoice[]>([]);
  const [sourceTab, setSourceTab] = useState<string>('manual');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    project_id: '',
    order_id: '',
    invoice_type: 'rechnung',
    tax_rate: 19,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);

  // For order-based: track which order items are selected for this invoice
  const [orderLineItems, setOrderLineItems] = useState<(InvoiceLineItem & { selected: boolean })[]>([]);

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    const [companiesRes, ordersRes, productsRes, invoicesRes] = await Promise.all([
      supabase.from('crm_companies').select('id, company_name').order('company_name'),
      supabase.from('crm_orders').select('id, order_number, title, company_id, project_id, line_items, status, amount_net, amount_gross')
        .in('status', ['bestaetigt', 'in_bearbeitung'])
        .order('created_at', { ascending: false }),
      supabase.from('crm_products').select('id, name, category, price_setup, price_monthly, price_yearly, description')
        .eq('is_active', true)
        .order('category, name'),
      supabase.from('crm_invoices').select('id, invoice_number, order_id, line_items')
        .not('order_id', 'is', null)
    ]);
    
    setCompanies(companiesRes.data || []);
    setOrders((ordersRes.data || []) as Order[]);
    setProducts(productsRes.data || []);
    setExistingInvoices((invoicesRes.data || []) as ExistingInvoice[]);
  };

  // When an order is selected, parse its line items and check which are already invoiced
  const handleOrderChange = (orderId: string) => {
    setFormData(prev => ({ ...prev, order_id: orderId }));
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Auto-fill company and project
    if (order.company_id) setFormData(prev => ({ ...prev, company_id: order.company_id! }));
    if (order.project_id) setFormData(prev => ({ ...prev, project_id: order.project_id! }));
    if (!formData.title) setFormData(prev => ({ ...prev, title: `Rechnung zu ${order.order_number}` }));

    // Parse order line items
    const items = parseOrderLineItems(order);
    
    // Check which items are already invoiced
    const alreadyInvoicedRefs = getAlreadyInvoicedRefs(orderId);
    
    const itemsWithSelection = items.map(item => ({
      ...item,
      selected: !alreadyInvoicedRefs.has(item.order_item_ref || item.id),
    }));

    setOrderLineItems(itemsWithSelection);
  };

  const parseOrderLineItems = (order: Order): InvoiceLineItem[] => {
    if (!order.line_items) {
      return [{
        id: crypto.randomUUID(),
        description: order.title,
        quantity: 1,
        unit_price: order.amount_net || 0,
        total: order.amount_net || 0,
        order_item_ref: 'main'
      }];
    }
    
    try {
      const data = typeof order.line_items === 'string' ? JSON.parse(order.line_items) : order.line_items;
      const arr = Array.isArray(data) ? data : data?.items || [];
      return arr.map((item: any, idx: number) => ({
        id: crypto.randomUUID(),
        description: item.bezeichnung || item.description || item.name || 'Position',
        quantity: item.menge || item.quantity || 1,
        unit_price: item.einzelpreis || item.unit_price || item.price || 0,
        total: (item.menge || item.quantity || 1) * (item.einzelpreis || item.unit_price || item.price || 0),
        order_item_ref: item.id || `item-${idx}`,
        product_id: item.product_id
      }));
    } catch {
      return [{
        id: crypto.randomUUID(),
        description: order.title,
        quantity: 1,
        unit_price: order.amount_net || 0,
        total: order.amount_net || 0,
        order_item_ref: 'main'
      }];
    }
  };

  const getAlreadyInvoicedRefs = (orderId: string): Set<string> => {
    const refs = new Set<string>();
    existingInvoices
      .filter(inv => inv.order_id === orderId)
      .forEach(inv => {
        try {
          const data = typeof inv.line_items === 'string' ? JSON.parse(inv.line_items as string) : inv.line_items;
          const items = Array.isArray(data) ? data : data?.items || [];
          items.forEach((item: any) => {
            if (item.order_item_ref) refs.add(item.order_item_ref);
          });
        } catch { /* ignore */ }
      });
    return refs;
  };

  const alreadyInvoicedRefs = useMemo(() => {
    if (!formData.order_id) return new Set<string>();
    return getAlreadyInvoicedRefs(formData.order_id);
  }, [formData.order_id, existingInvoices]);

  const addProductAsLineItem = (product: Product) => {
    const price = product.price_setup || product.price_monthly || product.price_yearly || 0;
    const newItem: InvoiceLineItem = {
      id: crypto.randomUUID(),
      description: product.name,
      quantity: 1,
      unit_price: price,
      total: price,
      product_id: product.id
    };
    setLineItems(prev => [...prev, newItem]);
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
    setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) setLineItems(items => items.filter(item => item.id !== id));
  };

  const toggleOrderItem = (idx: number) => {
    setOrderLineItems(prev => prev.map((item, i) => 
      i === idx ? { ...item, selected: !item.selected } : item
    ));
  };

  // Get the active line items based on source tab
  const activeItems = sourceTab === 'order' 
    ? orderLineItems.filter(i => i.selected) 
    : lineItems.filter(i => i.description);

  const netTotal = activeItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = netTotal * (formData.tax_rate / 100);
  const grossTotal = netTotal + taxAmount;

  const handleSubmit = async () => {
    if (!formData.title || !formData.company_id) {
      toast({ title: 'Fehler', description: 'Bitte Titel und Kunde ausfüllen.', variant: 'destructive' });
      return;
    }
    if (activeItems.length === 0) {
      toast({ title: 'Fehler', description: 'Bitte mindestens eine Position hinzufügen.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const itemsToSave = activeItems.map(item => ({
        id: item.id,
        bezeichnung: item.description,
        menge: item.quantity,
        einzelpreis: item.unit_price,
        gesamt: item.total,
        product_id: item.product_id || null,
        order_item_ref: item.order_item_ref || null
      }));

      // IMPORTANT: tax_amount and amount_gross are GENERATED columns in crm_invoices
      // They are automatically calculated from amount_net and tax_rate
      const { error } = await supabase.from('crm_invoices').insert({
        title: formData.title,
        description: formData.description || null,
        company_id: formData.company_id || null,
        project_id: formData.project_id || null,
        order_id: formData.order_id || null,
        invoice_type: formData.invoice_type,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        amount_net: netTotal,
        tax_rate: formData.tax_rate,
        amount_paid: 0,
        line_items: JSON.parse(JSON.stringify({ items: itemsToSave })),
        status: 'entwurf'
      });

      if (error) throw error;

      toast({ title: 'Rechnung erstellt', description: 'Die Rechnung wurde als Entwurf gespeichert.' });
      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({ title: 'Fehler', description: 'Rechnung konnte nicht erstellt werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', company_id: '', project_id: '', order_id: '',
      invoice_type: 'rechnung', tax_rate: 19,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setLineItems([{ id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, total: 0 }]);
    setOrderLineItems([]);
    setSourceTab('manual');
  };

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.forEach(p => {
      const cat = p.category || 'Sonstige';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    });
    return map;
  }, [products]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
              <Label>Kunde *</Label>
              <Select value={formData.company_id} onValueChange={(v) => setFormData(prev => ({ ...prev, company_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Kunde auswählen" /></SelectTrigger>
                <SelectContent>
                  {companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rechnungsart</Label>
              <Select value={formData.invoice_type} onValueChange={(v) => setFormData(prev => ({ ...prev, invoice_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Select value={formData.tax_rate.toString()} onValueChange={(v) => setFormData(prev => ({ ...prev, tax_rate: parseInt(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="19">19% (Standard)</SelectItem>
                  <SelectItem value="7">7% (ermäßigt)</SelectItem>
                  <SelectItem value="0">0% (steuerfrei)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rechnungsdatum</Label>
              <Input type="date" value={formData.invoice_date} onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))} />
            </div>

            <div>
              <Label>Fälligkeitsdatum</Label>
              <Input type="date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))} />
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

          {/* Position Source Tabs */}
          <Tabs value={sourceTab} onValueChange={setSourceTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="gap-2">
                <FileText className="h-4 w-4" />
                Manuell
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                Aus Produktkatalog
              </TabsTrigger>
              <TabsTrigger value="order" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Aus Auftrag
              </TabsTrigger>
            </TabsList>

            {/* Manual entry */}
            <TabsContent value="manual" className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Positionen</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-1" /> Position
                </Button>
              </div>
              {lineItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Beschreibung</Label>
                        <Input value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} placeholder="Leistungsbeschreibung" />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Menge</Label>
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Einzelpreis (€)</Label>
                        <Input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Gesamt</Label>
                        <div className="h-9 px-3 py-2 bg-muted rounded-md text-sm font-medium">{formatCurrency(item.total)}</div>
                      </div>
                      <div className="col-span-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} disabled={lineItems.length === 1}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* From product catalog */}
            <TabsContent value="products" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">Klicken Sie auf ein Produkt, um es als Rechnungsposition hinzuzufügen.</p>
              
              <div className="max-h-60 overflow-y-auto space-y-4 border rounded-lg p-3">
                {Array.from(productsByCategory.entries()).map(([category, prods]) => (
                  <div key={category}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{category}</p>
                    <div className="space-y-1">
                      {prods.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer" onClick={() => addProductAsLineItem(product)}>
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            {product.description && <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>}
                          </div>
                          <div className="text-right text-sm">
                            {product.price_setup ? <span>{formatCurrency(product.price_setup)}</span> : null}
                            {product.price_monthly ? <span className="text-muted-foreground ml-2">{formatCurrency(product.price_monthly)}/Mon.</span> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show current line items */}
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Positionen ({lineItems.length})</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-1" /> Manuell hinzufügen
                </Button>
              </div>
              {lineItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Input value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="col-span-2">
                        <Input type="number" min="0" step="0.01" value={item.unit_price} onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="col-span-2">
                        <div className="h-9 px-3 py-2 bg-muted rounded-md text-sm font-medium">{formatCurrency(item.total)}</div>
                      </div>
                      <div className="col-span-1">
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* From order */}
            <TabsContent value="order" className="space-y-4 mt-4">
              <div>
                <Label>Auftrag auswählen</Label>
                <Select value={formData.order_id} onValueChange={handleOrderChange}>
                  <SelectTrigger><SelectValue placeholder="Auftrag auswählen..." /></SelectTrigger>
                  <SelectContent>
                    {orders.map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.order_number} – {order.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {orderLineItems.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie die Positionen aus, die in dieser Rechnung berechnet werden sollen. Bereits berechnete Positionen sind markiert.
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Menge</TableHead>
                        <TableHead className="text-right">Einzelpreis</TableHead>
                        <TableHead className="text-right">Gesamt</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderLineItems.map((item, idx) => {
                        const isAlreadyInvoiced = alreadyInvoicedRefs.has(item.order_item_ref || item.id);
                        return (
                          <TableRow key={item.id} className={isAlreadyInvoiced ? 'opacity-50' : ''}>
                            <TableCell>
                              <Checkbox
                                checked={item.selected}
                                onCheckedChange={() => toggleOrderItem(idx)}
                                disabled={isAlreadyInvoiced}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                            <TableCell>
                              {isAlreadyInvoiced ? (
                                <Badge variant="secondary">Bereits berechnet</Badge>
                              ) : item.selected ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Wird berechnet</Badge>
                              ) : (
                                <Badge variant="outline">Zurückgestellt</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Totals */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold">Summe</span>
                {activeItems.length > 0 && (
                  <Badge variant="secondary">{activeItems.length} Position(en)</Badge>
                )}
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Speichern...' : 'Als Entwurf speichern'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
