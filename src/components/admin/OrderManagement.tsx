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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Search, Plus, ClipboardList, CheckCircle, XCircle, Clock, 
  PlayCircle, Euro, Eye, FileText, Send, Trash2, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type OrderStatus = 'entwurf' | 'bestaetigt' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';

interface CrmOrder {
  id: string;
  order_number: string;
  title: string;
  description: string | null;
  status: OrderStatus;
  amount_net: number;
  tax_rate: number;
  tax_amount: number;
  amount_gross: number;
  order_date: string;
  start_date: string | null;
  target_completion_date: string | null;
  actual_completion_date: string | null;
  customer_signed_at: string | null;
  customer_signed_name: string | null;
  confirmation_sent_at: string | null;
  internal_notes: string | null;
  created_at: string;
  company_id: string | null;
  project_id: string | null;
  offer_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
  crm_offers?: { offer_number: string } | null;
}

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: typeof ClipboardList }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground', icon: FileText },
  bestaetigt: { label: 'Bestätigt', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
  in_bearbeitung: { label: 'In Bearbeitung', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: PlayCircle },
  abgeschlossen: { label: 'Abgeschlossen', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  storniert: { label: 'Storniert', className: 'bg-destructive/10 text-destructive', icon: XCircle }
};

export function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<CrmOrder[]>([]);
  const [companies, setCompanies] = useState<{ id: string; company_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CrmOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    amount_net: 0,
    tax_rate: 19,
    start_date: '',
    target_completion_date: '',
    internal_notes: ''
  });

  useEffect(() => {
    loadOrders();
    loadCompanies();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_orders')
        .select(`
          *,
          crm_companies(company_name),
          crm_projects(project_number, title),
          crm_offers(offer_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data || []) as CrmOrder[]);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Fehler',
        description: 'Aufträge konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_companies')
        .select('id, company_name')
        .order('company_name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const taxAmount = formData.amount_net * (formData.tax_rate / 100);
      const grossAmount = formData.amount_net + taxAmount;

      const { error } = await supabase
        .from('crm_orders')
        .insert({
          title: formData.title,
          description: formData.description || null,
          company_id: formData.company_id || null,
          amount_net: formData.amount_net,
          tax_rate: formData.tax_rate,
          tax_amount: taxAmount,
          amount_gross: grossAmount,
          start_date: formData.start_date || null,
          target_completion_date: formData.target_completion_date || null,
          internal_notes: formData.internal_notes || null,
          status: 'entwurf'
        });

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Auftrag wurde erfolgreich erstellt.'
      });

      setIsCreateOpen(false);
      resetForm();
      loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Fehler',
        description: 'Auftrag konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'abgeschlossen') {
        updateData.actual_completion_date = new Date().toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('crm_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Status wurde aktualisiert.'
      });

      loadOrders();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      company_id: '',
      amount_net: 0,
      tax_rate: 19,
      start_date: '',
      target_completion_date: '',
      internal_notes: ''
    });
  };

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    try {
      // Delete related data first
      await supabase.from('crm_acceptance_protocols').delete().eq('order_id', deleteOrderId);
      await supabase.from('crm_invoices').delete().eq('order_id', deleteOrderId);
      
      const { error } = await supabase.from('crm_orders').delete().eq('id', deleteOrderId);
      if (error) throw error;
      
      toast({
        title: 'Auftrag gelöscht',
        description: 'Der Auftrag und zugehörige Daten wurden entfernt.'
      });
      setDeleteOrderId(null);
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Fehler',
        description: 'Auftrag konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Stats
  const stats = {
    total: orders.length,
    offen: orders.filter(o => o.status === 'bestaetigt' || o.status === 'in_bearbeitung').length,
    inBearbeitung: orders.filter(o => o.status === 'in_bearbeitung').length,
    abgeschlossen: orders.filter(o => o.status === 'abgeschlossen').length,
    gesamtwert: orders
      .filter(o => o.status !== 'storniert')
      .reduce((sum, o) => sum + (o.amount_gross || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inBearbeitung}</p>
                <p className="text-sm text-muted-foreground">In Bearbeitung</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.abgeschlossen}</p>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.gesamtwert)}</p>
                <p className="text-sm text-muted-foreground">Gesamtwert</p>
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
              placeholder="Aufträge suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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
          Neuer Auftrag
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auftrag</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Betrag</TableHead>
              <TableHead>Auftragsdatum</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Aufträge gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon || ClipboardList;
                
                return (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.order_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.crm_companies?.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[order.status]?.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[order.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.amount_gross || 0)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.order_date), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteOrderId(order.id); }}
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neuen Auftrag erstellen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Titel *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Auftragstitel"
                />
              </div>
              <div className="col-span-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibung des Auftrags"
                  rows={3}
                />
              </div>
              <div>
                <Label>Kunde</Label>
                <Select 
                  value={formData.company_id} 
                  onValueChange={(v) => setFormData({ ...formData, company_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kunde auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>MwSt.-Satz</Label>
                <Select 
                  value={formData.tax_rate.toString()} 
                  onValueChange={(v) => setFormData({ ...formData, tax_rate: parseFloat(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="19">19%</SelectItem>
                    <SelectItem value="7">7%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nettobetrag (€)</Label>
                <Input
                  type="number"
                  value={formData.amount_net}
                  onChange={(e) => setFormData({ ...formData, amount_net: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div>
                <Label>Bruttobetrag</Label>
                <Input
                  value={formatCurrency(formData.amount_net * (1 + formData.tax_rate / 100))}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>Startdatum</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Zieltermin</Label>
                <Input
                  type="date"
                  value={formData.target_completion_date}
                  onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Interne Notizen</Label>
                <Textarea
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  placeholder="Interne Notizen zum Auftrag"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateOrder} disabled={!formData.title}>
              Auftrag erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              {selectedOrder?.order_number} - {selectedOrder?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Kunde</Label>
                  <p className="font-medium">{selectedOrder.crm_companies?.company_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedOrder.status]?.className}>
                      {statusConfig[selectedOrder.status]?.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nettobetrag</Label>
                  <p className="font-medium">{formatCurrency(selectedOrder.amount_net || 0)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Bruttobetrag</Label>
                  <p className="font-medium text-lg">{formatCurrency(selectedOrder.amount_gross || 0)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Auftragsdatum</Label>
                  <p className="font-medium">{format(new Date(selectedOrder.order_date), 'dd.MM.yyyy', { locale: de })}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Zieltermin</Label>
                  <p className="font-medium">
                    {selectedOrder.target_completion_date 
                      ? format(new Date(selectedOrder.target_completion_date), 'dd.MM.yyyy', { locale: de })
                      : '-'}
                  </p>
                </div>
                {selectedOrder.customer_signed_at && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Unterschrieben von</Label>
                      <p className="font-medium">{selectedOrder.customer_signed_name || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Unterschrieben am</Label>
                      <p className="font-medium">
                        {format(new Date(selectedOrder.customer_signed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {selectedOrder.description && (
                <div>
                  <Label className="text-muted-foreground">Beschreibung</Label>
                  <p className="mt-1">{selectedOrder.description}</p>
                </div>
              )}
              
              {selectedOrder.internal_notes && (
                <div>
                  <Label className="text-muted-foreground">Interne Notizen</Label>
                  <p className="mt-1 text-sm">{selectedOrder.internal_notes}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {selectedOrder.status === 'entwurf' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'bestaetigt')}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Bestätigen
                  </Button>
                )}
                {selectedOrder.status === 'bestaetigt' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'in_bearbeitung')}
                    className="gap-2"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Bearbeitung starten
                  </Button>
                )}
                {selectedOrder.status === 'in_bearbeitung' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'abgeschlossen')}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Abschließen
                  </Button>
                )}
                {selectedOrder.status !== 'storniert' && selectedOrder.status !== 'abgeschlossen' && (
                  <Button 
                    variant="destructive"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'storniert')}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Stornieren
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={(open) => !open && setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Auftrag löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Der Auftrag und alle zugehörigen Abnahmeprotokolle und Rechnungen werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
