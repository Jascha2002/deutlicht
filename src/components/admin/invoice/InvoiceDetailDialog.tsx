import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ExternalLink, Send, AlertTriangle, CheckCircle, XCircle, 
  Euro, Clock, Receipt, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type InvoiceStatus = 'entwurf' | 'gesendet' | 'ueberfaellig' | 'bezahlt' | 'storniert' | 'mahnung';

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
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
}

const statusConfig: Record<InvoiceStatus, { label: string; className: string; icon: any }> = {
  entwurf: { label: 'Entwurf', className: 'bg-gray-100 text-gray-800', icon: Receipt },
  gesendet: { label: 'Gesendet', className: 'bg-blue-100 text-blue-800', icon: Send },
  ueberfaellig: { label: 'Überfällig', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
  bezahlt: { label: 'Bezahlt', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  storniert: { label: 'Storniert', className: 'bg-gray-100 text-gray-500', icon: XCircle },
  mahnung: { label: 'Mahnung', className: 'bg-orange-100 text-orange-800', icon: AlertTriangle }
};

interface InvoiceDetailDialogProps {
  invoice: CrmInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayment: () => void;
  onUpdate: () => void;
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onPayment, onUpdate }: InvoiceDetailDialogProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!invoice) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('crm_invoices')
        .update({ status: newStatus })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: 'Status aktualisiert',
        description: `Rechnung ist jetzt "${statusConfig[newStatus].label}".`
      });

      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendReminder = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('crm_invoices')
        .update({ 
          status: 'mahnung',
          reminder_count: (invoice.reminder_count || 0) + 1
        })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: 'Mahnung vermerkt',
        description: `Mahnung ${(invoice.reminder_count || 0) + 1} wurde erfasst.`
      });

      onUpdate();
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Fehler',
        description: 'Mahnung konnte nicht erfasst werden.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Rechnung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('crm_invoices')
        .update({ status: 'storniert' })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: 'Rechnung storniert',
        description: 'Die Rechnung wurde storniert.'
      });

      onUpdate();
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnung konnte nicht storniert werden.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const remainingAmount = (invoice.amount_gross || 0) - (invoice.amount_paid || 0);
  const StatusIcon = statusConfig[invoice.status]?.icon || Receipt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{invoice.title}</DialogTitle>
              <p className="text-muted-foreground">{invoice.invoice_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[invoice.status]?.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[invoice.status]?.label}
                {invoice.reminder_count > 0 && ` (${invoice.reminder_count})`}
              </Badge>
              {invoice.status !== 'bezahlt' && invoice.status !== 'storniert' && (
                <Select value={invoice.status} onValueChange={(v) => handleStatusChange(v as InvoiceStatus)}>
                  <SelectTrigger className="w-auto h-7 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
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
        
        {/* Amounts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{formatCurrency(invoice.amount_net || 0)}</p>
              <p className="text-xs text-muted-foreground">Netto</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-muted-foreground">{formatCurrency(invoice.tax_amount || 0)}</p>
              <p className="text-xs text-muted-foreground">MwSt. ({invoice.tax_rate}%)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(invoice.amount_gross || 0)}</p>
              <p className="text-xs text-muted-foreground">Brutto</p>
            </CardContent>
          </Card>
          <Card className={remainingAmount > 0 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {formatCurrency(remainingAmount)}
              </p>
              <p className="text-xs text-muted-foreground">Offen</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress */}
        {(invoice.amount_paid || 0) > 0 && invoice.status !== 'bezahlt' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Zahlungsfortschritt</span>
              <span>{Math.round(((invoice.amount_paid || 0) / (invoice.amount_gross || 1)) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${((invoice.amount_paid || 0) / (invoice.amount_gross || 1)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(invoice.amount_paid || 0)} von {formatCurrency(invoice.amount_gross || 0)} bezahlt
            </p>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Kunde</p>
            <p className="font-medium">{invoice.crm_companies?.company_name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projekt</p>
            <p className="font-medium">
              {invoice.crm_projects ? `${invoice.crm_projects.project_number} - ${invoice.crm_projects.title}` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rechnungsdatum</p>
            <p className="font-medium">
              {format(new Date(invoice.invoice_date), 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fälligkeitsdatum</p>
            <p className="font-medium">
              {format(new Date(invoice.due_date), 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rechnungsart</p>
            <p className="font-medium capitalize">{invoice.invoice_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mahnungen</p>
            <p className="font-medium">{invoice.reminder_count || 0}</p>
          </div>
        </div>

        {/* Description */}
        {invoice.description && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-1">Beschreibung / Positionen</p>
            <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-line">
              {invoice.description}
            </div>
          </div>
        )}

        {/* Paid Date */}
        {invoice.paid_date && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Bezahlt am {format(new Date(invoice.paid_date), 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          {invoice.pdf_url && (
            <Button variant="outline" className="gap-2" asChild>
              <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                PDF öffnen
              </a>
            </Button>
          )}

          {invoice.status === 'entwurf' && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleStatusChange('gesendet')}
              disabled={isUpdating}
            >
              <Send className="h-4 w-4" />
              Als gesendet markieren
            </Button>
          )}

          {['gesendet', 'ueberfaellig', 'mahnung'].includes(invoice.status) && (
            <>
              <Button className="gap-2" onClick={onPayment}>
                <Euro className="h-4 w-4" />
                Zahlung erfassen
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleSendReminder} disabled={isUpdating}>
                <AlertTriangle className="h-4 w-4" />
                Mahnung erfassen
              </Button>
            </>
          )}

          {invoice.status !== 'storniert' && invoice.status !== 'bezahlt' && (
            <Button 
              variant="ghost" 
              className="gap-2 text-destructive hover:text-destructive"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <XCircle className="h-4 w-4" />
              Stornieren
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
