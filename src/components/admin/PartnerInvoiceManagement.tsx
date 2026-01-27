import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Receipt, Check, X, Eye, Search, Euro, Calendar, FileText, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnerInvoice {
  id: string;
  partner_id: string;
  invoice_number: string;
  invoice_date: string;
  period_start: string;
  period_end: string;
  net_amount: number;
  vat_amount: number;
  gross_amount: number;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
  payment_reference: string | null;
  rejection_reason: string | null;
  notes: string | null;
  pdf_url: string | null;
  partners?: {
    company_name: string;
    partner_number: string | null;
    contact_email: string;
  };
}

export function PartnerInvoiceManagement() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<PartnerInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<PartnerInvoice | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = async () => {
    try {
      let query = supabase
        .from('partner_invoices')
        .select(`
          *,
          partners:partner_id (
            company_name,
            partner_number,
            contact_email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInvoices((data || []) as PartnerInvoice[]);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: 'Fehler',
        description: 'Abrechnungen konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string, extras?: Record<string, unknown>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
        ...extras
      };

      if (status === 'reviewed') {
        updateData.reviewed_at = new Date().toISOString();
        updateData.reviewed_by = user?.id;
      } else if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = user?.id;
      } else if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejection_reason = extras?.rejection_reason || '';
      }

      const { error } = await supabase
        .from('partner_invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;

      const statusLabels: Record<string, string> = {
        reviewed: 'geprüft',
        approved: 'freigegeben',
        paid: 'bezahlt',
        rejected: 'abgelehnt'
      };

      toast({
        title: 'Status aktualisiert',
        description: `Abrechnung wurde als ${statusLabels[status] || status} markiert.`
      });

      await loadInvoices();
      setSelectedInvoice(null);
      setRejectionReason('');
      setPaymentReference('');
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      submitted: 'Eingereicht',
      reviewed: 'Geprüft',
      approved: 'Freigegeben',
      paid: 'Bezahlt',
      rejected: 'Abgelehnt'
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoice_number.toLowerCase().includes(query) ||
      invoice.partners?.company_name.toLowerCase().includes(query) ||
      invoice.partners?.partner_number?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const pendingCount = invoices.filter(i => i.status === 'submitted' || i.status === 'reviewed').length;
  const totalOpenAmount = invoices
    .filter(i => i.status === 'approved')
    .reduce((sum, i) => sum + i.gross_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Partner-Abrechnungen</h2>
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">
                {pendingCount} zu prüfen
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter nach Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="submitted">Eingereicht</SelectItem>
                <SelectItem value="reviewed">Geprüft</SelectItem>
                <SelectItem value="approved">Freigegeben</SelectItem>
                <SelectItem value="paid">Bezahlt</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Zur Prüfung</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Offene Auszahlungen</p>
            <p className="text-2xl font-bold text-accent">{formatCurrency(totalOpenAmount)}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Gesamt (alle)</p>
            <p className="text-2xl font-bold">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Rechnungs-Nr.</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Partner</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Zeitraum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Netto</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Brutto</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Eingereicht</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{invoice.invoice_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{invoice.partners?.company_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {invoice.partners?.partner_number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatCurrency(invoice.net_amount)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-accent">
                    {formatCurrency(invoice.gross_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn("text-xs", getStatusBadge(invoice.status))}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(invoice.submitted_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {invoice.pdf_url && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4" />
                          </a>
                        </Button>
                      )}

                      {invoice.status === 'submitted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1"
                          onClick={() => updateInvoiceStatus(invoice.id, 'reviewed')}
                        >
                          <Eye className="w-3 h-3" />
                          Prüfen
                        </Button>
                      )}

                      {invoice.status === 'reviewed' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                            onClick={() => updateInvoiceStatus(invoice.id, 'approved')}
                          >
                            <Check className="w-3 h-3" />
                            Freigeben
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Abrechnung ablehnen</DialogTitle>
                                <DialogDescription>
                                  Bitte geben Sie einen Grund für die Ablehnung an.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 pt-4">
                                <Textarea
                                  placeholder="Grund für die Ablehnung..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => updateInvoiceStatus(invoice.id, 'rejected', { rejection_reason: rejectionReason })}
                                >
                                  Ablehnen
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}

                      {invoice.status === 'approved' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1"
                            >
                              <Euro className="w-3 h-3" />
                              Als bezahlt
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Zahlung erfassen</DialogTitle>
                              <DialogDescription>
                                Betrag: {formatCurrency(invoice.gross_amount)}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <Input
                                placeholder="Zahlungsreferenz / Verwendungszweck"
                                value={paymentReference}
                                onChange={(e) => setPaymentReference(e.target.value)}
                              />
                              <Button
                                className="w-full"
                                onClick={() => updateInvoiceStatus(invoice.id, 'paid', { payment_reference: paymentReference })}
                              >
                                Als bezahlt markieren
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {invoice.status === 'paid' && invoice.payment_reference && (
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={invoice.payment_reference}>
                          Ref: {invoice.payment_reference}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Keine Abrechnungen gefunden.
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Abrechnungsprozess:</strong> Partner erstellen monatlich eine Rechnung über ihre Provisionsansprüche.
          Nach Eingang wird die Rechnung geprüft (Positionen, Nettoumsätze, korrekter Provisionssatz).
          Nach Freigabe erfolgt die Überweisung auf die hinterlegte Bankverbindung.
        </p>
      </div>
    </div>
  );
}
