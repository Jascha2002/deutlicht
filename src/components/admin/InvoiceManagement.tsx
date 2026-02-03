import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Search, Plus, Receipt, CheckCircle, XCircle, Clock, 
  AlertTriangle, Euro, Send, Eye, Trash2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { InvoiceCreateDialog, InvoicePaymentDialog, InvoiceDetailDialog } from './invoice';

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
  created_at: string;
  company_id: string | null;
  project_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
}

const statusConfig: Record<InvoiceStatus, { label: string; className: string; icon: typeof Receipt }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground', icon: Receipt },
  gesendet: { label: 'Gesendet', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Send },
  ueberfaellig: { label: 'Überfällig', className: 'bg-destructive/10 text-destructive', icon: AlertTriangle },
  bezahlt: { label: 'Bezahlt', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  storniert: { label: 'Storniert', className: 'bg-muted text-muted-foreground', icon: XCircle },
  mahnung: { label: 'Mahnung', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangle }
};

export function InvoiceManagement() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<CrmInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CrmInvoice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_invoices')
        .select(`
          *,
          crm_companies(company_name),
          crm_projects(project_number, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnungen konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleOpenDetail = (invoice: CrmInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailOpen(true);
  };

  const handleOpenPayment = () => {
    setIsDetailOpen(false);
    setIsPaymentOpen(true);
  };

  const handleRefresh = () => {
    loadInvoices();
    setSelectedInvoice(null);
    setIsDetailOpen(false);
    setIsPaymentOpen(false);
  };

  const handleDeleteInvoice = async () => {
    if (!deleteInvoiceId) return;
    try {
      const { error } = await supabase.from('crm_invoices').delete().eq('id', deleteInvoiceId);
      if (error) throw error;
      
      toast({
        title: 'Rechnung gelöscht',
        description: 'Die Rechnung wurde entfernt.'
      });
      setDeleteInvoiceId(null);
      loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Fehler',
        description: 'Rechnung konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  // Stats
  const stats = {
    total: invoices.length,
    offen: invoices.filter(i => i.status === 'gesendet' || i.status === 'ueberfaellig' || i.status === 'mahnung').length,
    ueberfaellig: invoices.filter(i => i.status === 'ueberfaellig' || i.status === 'mahnung').length,
    bezahlt: invoices.filter(i => i.status === 'bezahlt').length,
    offenerBetrag: invoices
      .filter(i => i.status === 'gesendet' || i.status === 'ueberfaellig' || i.status === 'mahnung')
      .reduce((sum, i) => sum + ((i.amount_gross || 0) - (i.amount_paid || 0)), 0),
    bezahltBetrag: invoices
      .filter(i => i.status === 'bezahlt')
      .reduce((sum, i) => sum + (i.amount_gross || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.offen}</p>
                <p className="text-sm text-muted-foreground">Offen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.ueberfaellig > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${stats.ueberfaellig > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">{stats.ueberfaellig}</p>
                <p className="text-sm text-muted-foreground">Überfällig</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.offenerBetrag)}</p>
                <p className="text-sm text-muted-foreground">Offen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.bezahltBetrag)}</p>
                <p className="text-sm text-muted-foreground">Bezahlt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechnungen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Neue Rechnung
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rechnung</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Netto</TableHead>
              <TableHead className="text-right">Brutto</TableHead>
              <TableHead>Fällig</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Keine Rechnungen gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status]?.icon || Receipt;
                const daysOverdue = invoice.status !== 'bezahlt' && invoice.status !== 'storniert' 
                  ? differenceInDays(new Date(), new Date(invoice.due_date))
                  : 0;
                const isOverdue = daysOverdue > 0;
                
                return (
                  <TableRow 
                    key={invoice.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${isOverdue ? 'bg-destructive/5' : ''}`}
                    onClick={() => handleOpenDetail(invoice)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.title}</p>
                        <p className="text-sm text-muted-foreground">{invoice.invoice_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.crm_companies?.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[invoice.status]?.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[invoice.status]?.label}
                        {invoice.reminder_count > 0 && ` (${invoice.reminder_count})`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(invoice.amount_net || 0)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.amount_gross || 0)}
                    </TableCell>
                    <TableCell>
                      <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                        {format(new Date(invoice.due_date), 'dd.MM.yyyy', { locale: de })}
                        {isOverdue && ` (+${daysOverdue} Tage)`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(invoice);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteInvoiceId(invoice.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialogs */}
      <InvoiceCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={handleRefresh}
      />

      <InvoiceDetailDialog
        invoice={selectedInvoice}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onPayment={handleOpenPayment}
        onUpdate={handleRefresh}
      />

      <InvoicePaymentDialog
        invoice={selectedInvoice}
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        onSuccess={handleRefresh}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteInvoiceId} onOpenChange={(open) => !open && setDeleteInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Rechnung löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Die Rechnung wird unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
