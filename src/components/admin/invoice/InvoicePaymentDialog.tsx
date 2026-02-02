import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Euro, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  amount_gross: number;
  amount_paid: number;
  status: string;
}

interface InvoicePaymentDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InvoicePaymentDialog({ invoice, open, onOpenChange, onSuccess }: InvoicePaymentDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('ueberweisung');
  const [notes, setNotes] = useState('');

  if (!invoice) return null;

  const remainingAmount = (invoice.amount_gross || 0) - (invoice.amount_paid || 0);
  const defaultPaymentAmount = paymentType === 'full' ? remainingAmount : paymentAmount;

  const handleSubmit = async () => {
    const amount = paymentType === 'full' ? remainingAmount : paymentAmount;

    if (amount <= 0) {
      toast({
        title: 'Fehler',
        description: 'Bitte gültigen Zahlungsbetrag eingeben.',
        variant: 'destructive'
      });
      return;
    }

    if (amount > remainingAmount) {
      toast({
        title: 'Fehler',
        description: `Betrag übersteigt offenen Betrag (${formatCurrency(remainingAmount)}).`,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const newAmountPaid = (invoice.amount_paid || 0) + amount;
      const isFullyPaid = newAmountPaid >= (invoice.amount_gross || 0);

      const updateData: Record<string, unknown> = {
        amount_paid: newAmountPaid,
        status: isFullyPaid ? 'bezahlt' : invoice.status,
      };

      if (isFullyPaid) {
        updateData.paid_date = paymentDate;
      }

      const { error } = await supabase
        .from('crm_invoices')
        .update(updateData)
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: isFullyPaid ? 'Rechnung bezahlt' : 'Zahlung erfasst',
        description: isFullyPaid 
          ? `Rechnung ${invoice.invoice_number} wurde als vollständig bezahlt markiert.`
          : `Teilzahlung von ${formatCurrency(amount)} wurde erfasst.`
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Fehler',
        description: 'Zahlung konnte nicht erfasst werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Zahlung erfassen</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Invoice Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="font-medium">{invoice.title}</p>
              <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
              <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                <div>
                  <p className="text-lg font-bold">{formatCurrency(invoice.amount_gross || 0)}</p>
                  <p className="text-xs text-muted-foreground">Gesamt</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(invoice.amount_paid || 0)}</p>
                  <p className="text-xs text-muted-foreground">Bezahlt</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(remainingAmount)}</p>
                  <p className="text-xs text-muted-foreground">Offen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Type */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={paymentType === 'full' ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => setPaymentType('full')}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Vollständig</span>
              <span className="text-xs opacity-70">{formatCurrency(remainingAmount)}</span>
            </Button>
            <Button
              type="button"
              variant={paymentType === 'partial' ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => setPaymentType('partial')}
            >
              <Euro className="h-5 w-5" />
              <span>Teilzahlung</span>
              <span className="text-xs opacity-70">Betrag eingeben</span>
            </Button>
          </div>

          {paymentType === 'partial' && (
            <div>
              <Label>Zahlungsbetrag *</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0.01"
                  max={remainingAmount}
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  placeholder="0,00"
                />
              </div>
              {paymentAmount > remainingAmount && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Betrag übersteigt offenen Betrag
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Zahlungsdatum</Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Zahlungsart</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ueberweisung">Überweisung</SelectItem>
                  <SelectItem value="lastschrift">Lastschrift</SelectItem>
                  <SelectItem value="bar">Barzahlung</SelectItem>
                  <SelectItem value="kreditkarte">Kreditkarte</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="sonstige">Sonstige</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Notizen (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="z.B. Referenznummer, Kontoauszug-Position..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              {isLoading ? 'Speichern...' : 'Zahlung buchen'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
