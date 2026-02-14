import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  ExternalLink, Send, CheckCircle, XCircle, Euro, FileText, 
  Edit, Trash2, Plus, Save, ArrowRight, Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type OfferStatus = 'entwurf' | 'gesendet' | 'angesehen' | 'angenommen' | 'abgelehnt' | 'abgelaufen';

interface LineItem {
  id: string;
  bezeichnung: string;
  beschreibung?: string;
  einmalig: number;
  monatlich: number;
  menge: number;
}

interface CrmOffer {
  id: string;
  offer_number: string | null;
  title: string;
  description: string | null;
  status: OfferStatus;
  amount_setup: number | null;
  amount_monthly: number | null;
  amount_total: number | null;
  discount_percent: number | null;
  valid_from: string | null;
  valid_until: string | null;
  accepted_at: string | null;
  accepted_by: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  pdf_url: string | null;
  created_at: string;
  company_id: string | null;
  lead_id: string | null;
  project_id: string | null;
  line_items: unknown;
  crm_companies?: { company_name: string } | null;
  crm_leads?: { lead_number: string; company_name: string | null } | null;
  crm_projects?: { project_number: string; title: string } | null;
}

const statusConfig: Record<OfferStatus, { label: string; className: string }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground' },
  gesendet: { label: 'Gesendet', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  angesehen: { label: 'Angesehen', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  angenommen: { label: 'Angenommen', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  abgelehnt: { label: 'Abgelehnt', className: 'bg-destructive/10 text-destructive' },
  abgelaufen: { label: 'Abgelaufen', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
};

interface OfferDetailDialogProps {
  offer: CrmOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onConvertToOrder?: (offerId: string) => void;
}

export function OfferDetailDialog({ 
  offer, 
  open, 
  onOpenChange, 
  onUpdate,
  onConvertToOrder 
}: OfferDetailDialogProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [editedOffer, setEditedOffer] = useState<Partial<CrmOffer>>({});

  useEffect(() => {
    if (offer) {
      setEditedOffer({
        title: offer.title,
        description: offer.description,
        discount_percent: offer.discount_percent
      });
      
      // Parse line items from JSON
      const items = parseLineItems(offer.line_items);
      setLineItems(items);
    }
  }, [offer]);

  const parseLineItems = (lineItemsData: unknown): LineItem[] => {
    if (!lineItemsData) return [];
    
    try {
      const data = typeof lineItemsData === 'string' ? JSON.parse(lineItemsData) : lineItemsData;
      
      // Handle different formats
      if (Array.isArray(data)) {
        return data.map((item, idx) => ({
          id: item.id || `item-${idx}`,
          bezeichnung: item.bezeichnung || item.name || item.title || 'Leistung',
          beschreibung: item.beschreibung || item.description || '',
          einmalig: item.einmalig || item.setup || item.amount_setup || 0,
          monatlich: item.monatlich || item.monthly || item.amount_monthly || 0,
          menge: item.menge || item.quantity || 1
        }));
      }
      
      if (data.items && Array.isArray(data.items)) {
        return data.items.map((item: any, idx: number) => ({
          id: item.id || `item-${idx}`,
          bezeichnung: item.bezeichnung || item.name || item.title || 'Leistung',
          beschreibung: item.beschreibung || item.description || '',
          einmalig: item.einmalig || item.setup || item.amount_setup || 0,
          monatlich: item.monatlich || item.monthly || item.amount_monthly || 0,
          menge: item.menge || item.quantity || 1
        }));
      }
      
      // Fallback: generate from formData if present
      if (data.formData?.services_selected) {
        return data.formData.services_selected.map((service: string, idx: number) => ({
          id: `service-${idx}`,
          bezeichnung: service,
          beschreibung: '',
          einmalig: 0,
          monatlich: 0,
          menge: 1
        }));
      }
      
      return [];
    } catch (e) {
      console.error('Error parsing line items:', e);
      return [];
    }
  };

  if (!offer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const canEdit = offer.status === 'entwurf';
  const canSend = offer.status === 'entwurf';
  const canConvertToOrder = offer.status === 'angenommen' && !offer.project_id;

  const handleSendOffer = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('crm_offers')
        .update({ 
          status: 'gesendet',
          sent_at: new Date().toISOString()
        })
        .eq('id', offer.id);

      if (error) throw error;

      toast({ title: 'Angebot gesendet', description: 'Das Angebot wurde als gesendet markiert.' });
      onUpdate();
    } catch (error) {
      console.error('Error sending offer:', error);
      toast({ title: 'Fehler', description: 'Angebot konnte nicht gesendet werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Calculate totals from line items
      const totalSetup = lineItems.reduce((sum, item) => sum + (item.einmalig * item.menge), 0);
      const totalMonthly = lineItems.reduce((sum, item) => sum + (item.monatlich * item.menge), 0);
      
      const { error } = await supabase
        .from('crm_offers')
        .update({
          title: editedOffer.title,
          description: editedOffer.description,
          discount_percent: editedOffer.discount_percent || 0,
          amount_setup: totalSetup,
          amount_monthly: totalMonthly,
          amount_total: totalSetup + (totalMonthly * 12),
          line_items: JSON.stringify({ items: lineItems })
        })
        .eq('id', offer.id);

      if (error) throw error;

      toast({ title: 'Gespeichert', description: 'Änderungen wurden übernommen.' });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({ title: 'Fehler', description: 'Änderungen konnten nicht gespeichert werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: `new-${Date.now()}`,
      bezeichnung: 'Neue Position',
      beschreibung: '',
      einmalig: 0,
      monatlich: 0,
      menge: 1
    }]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const lineItemsSetup = lineItems.reduce((sum, item) => sum + (item.einmalig * item.menge), 0);
  const lineItemsMonthly = lineItems.reduce((sum, item) => sum + (item.monatlich * item.menge), 0);
  // Use stored offer amounts as source of truth, fall back to line item calculation
  const totalSetup = lineItemsSetup > 0 ? lineItemsSetup : (offer?.amount_setup || 0);
  const totalMonthly = lineItemsMonthly > 0 ? lineItemsMonthly : (offer?.amount_monthly || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <Input
                  value={editedOffer.title || ''}
                  onChange={(e) => setEditedOffer({ ...editedOffer, title: e.target.value })}
                  className="text-xl font-semibold"
                />
              ) : (
                <DialogTitle className="text-xl">{offer.title}</DialogTitle>
              )}
              <p className="text-muted-foreground">{offer.offer_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[offer.status]?.className}>
                {statusConfig[offer.status]?.label}
              </Badge>
              {canEdit && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Bearbeiten
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Beträge Übersicht */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalSetup)}</p>
              <p className="text-xs text-muted-foreground">Einmalig (Netto)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-500">{formatCurrency(totalMonthly)}</p>
              <p className="text-xs text-muted-foreground">Monatlich (Netto)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">{formatCurrency(totalSetup + totalMonthly * 12)}</p>
              <p className="text-xs text-muted-foreground">Jahreswert (Netto)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{offer.discount_percent || 0}%</p>
              <p className="text-xs text-muted-foreground">Rabatt</p>
            </CardContent>
          </Card>
        </div>

        {/* Positionen / Line Items */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Leistungspositionen</h3>
            {isEditing && (
              <Button size="sm" variant="outline" onClick={addLineItem}>
                <Plus className="h-4 w-4 mr-1" />
                Position hinzufügen
              </Button>
            )}
          </div>
          
          {lineItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg">
              Keine Positionen vorhanden
              {isEditing && (
                <Button variant="link" onClick={addLineItem} className="block mx-auto mt-2">
                  Erste Position anlegen
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Bezeichnung</TableHead>
                  <TableHead className="w-[15%] text-right">Menge</TableHead>
                  <TableHead className="w-[15%] text-right">Einmalig</TableHead>
                  <TableHead className="w-[15%] text-right">Monatlich</TableHead>
                  {isEditing && <TableHead className="w-[10%]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            value={item.bezeichnung}
                            onChange={(e) => updateLineItem(item.id, 'bezeichnung', e.target.value)}
                            className="font-medium"
                          />
                          <Input
                            value={item.beschreibung || ''}
                            onChange={(e) => updateLineItem(item.id, 'beschreibung', e.target.value)}
                            placeholder="Beschreibung..."
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{item.bezeichnung}</p>
                          {item.beschreibung && (
                            <p className="text-sm text-muted-foreground">{item.beschreibung}</p>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.menge}
                          onChange={(e) => updateLineItem(item.id, 'menge', parseInt(e.target.value) || 1)}
                          className="w-20 text-right"
                        />
                      ) : (
                        item.menge
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.einmalig}
                          onChange={(e) => updateLineItem(item.id, 'einmalig', parseFloat(e.target.value) || 0)}
                          className="w-28 text-right"
                        />
                      ) : (
                        formatCurrency(item.einmalig * item.menge)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.monatlich}
                          onChange={(e) => updateLineItem(item.id, 'monatlich', parseFloat(e.target.value) || 0)}
                          className="w-28 text-right"
                        />
                      ) : (
                        formatCurrency(item.monatlich * item.menge)
                      )}
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeLineItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Separator className="my-4" />

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Kunde</p>
            <p className="font-medium">
              {offer.crm_companies?.company_name || offer.crm_leads?.company_name || '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gültig bis</p>
            <p className="font-medium">
              {offer.valid_until ? format(new Date(offer.valid_until), 'dd.MM.yyyy', { locale: de }) : '-'}
            </p>
          </div>
          {offer.accepted_at && (
            <div className="col-span-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Angenommen am {format(new Date(offer.accepted_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                {offer.accepted_by && ` von ${offer.accepted_by}`}
              </p>
            </div>
          )}
        </div>

        {/* Beschreibung */}
        {(offer.description || isEditing) && (
          <div className="mt-4">
            <Label className="text-sm text-muted-foreground">Notizen / Beschreibung</Label>
            {isEditing ? (
              <Textarea
                value={editedOffer.description || ''}
                onChange={(e) => setEditedOffer({ ...editedOffer, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            ) : (
              offer.description && (
                <div className="p-3 bg-muted rounded-lg text-sm mt-1 whitespace-pre-line">
                  {offer.description}
                </div>
              )
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          {isEditing ? (
            <>
              <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                Speichern
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Abbrechen
              </Button>
            </>
          ) : (
            <>
              {offer.pdf_url && (
                <Button variant="outline" className="gap-2" asChild>
                  <a href={offer.pdf_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    PDF öffnen
                  </a>
                </Button>
              )}
              
              {canSend && (
                <Button className="gap-2" onClick={handleSendOffer} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  Angebot senden
                </Button>
              )}
              
              {canConvertToOrder && onConvertToOrder && (
                <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => onConvertToOrder(offer.id)}>
                  <Briefcase className="h-4 w-4" />
                  <ArrowRight className="h-4 w-4" />
                  In Auftrag umwandeln
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
