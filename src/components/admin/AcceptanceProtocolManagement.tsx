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
  Search, Plus, ClipboardCheck, CheckCircle, XCircle, Clock, 
  AlertTriangle, Eye, Send, FileCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type ProtocolStatus = 'entwurf' | 'zur_abnahme' | 'abgenommen' | 'abgelehnt' | 'nachbesserung';

interface CrmAcceptanceProtocol {
  id: string;
  protocol_number: string;
  title: string;
  description: string | null;
  acceptance_date: string;
  status: ProtocolStatus;
  overall_result: string | null;
  defects_noted: string | null;
  follow_up_required: boolean | null;
  follow_up_deadline: string | null;
  customer_signed_at: string | null;
  customer_signed_name: string | null;
  customer_comments: string | null;
  internal_notes: string | null;
  created_at: string;
  company_id: string | null;
  project_id: string | null;
  order_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
  crm_orders?: { order_number: string; title: string } | null;
}

const statusConfig: Record<ProtocolStatus, { label: string; className: string; icon: typeof ClipboardCheck }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground', icon: ClipboardCheck },
  zur_abnahme: { label: 'Zur Abnahme', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Send },
  abgenommen: { label: 'Abgenommen', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  abgelehnt: { label: 'Abgelehnt', className: 'bg-destructive/10 text-destructive', icon: XCircle },
  nachbesserung: { label: 'Nachbesserung', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangle }
};

export function AcceptanceProtocolManagement() {
  const { toast } = useToast();
  const [protocols, setProtocols] = useState<CrmAcceptanceProtocol[]>([]);
  const [companies, setCompanies] = useState<{ id: string; company_name: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; order_number: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<CrmAcceptanceProtocol | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_id: '',
    order_id: '',
    acceptance_date: new Date().toISOString().split('T')[0],
    internal_notes: ''
  });

  useEffect(() => {
    loadProtocols();
    loadCompanies();
    loadOrders();
  }, []);

  const loadProtocols = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_acceptance_protocols')
        .select(`
          *,
          crm_companies(company_name),
          crm_projects(project_number, title),
          crm_orders(order_number, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProtocols((data || []) as CrmAcceptanceProtocol[]);
    } catch (error) {
      console.error('Error loading protocols:', error);
      toast({
        title: 'Fehler',
        description: 'Abnahmeprotokolle konnten nicht geladen werden.',
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

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_orders')
        .select('id, order_number, title')
        .in('status', ['bestaetigt', 'in_bearbeitung'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleCreateProtocol = async () => {
    try {
      const { error } = await supabase
        .from('crm_acceptance_protocols')
        .insert({
          title: formData.title,
          description: formData.description || null,
          company_id: formData.company_id || null,
          order_id: formData.order_id || null,
          acceptance_date: formData.acceptance_date,
          internal_notes: formData.internal_notes || null,
          status: 'entwurf'
        });

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Abnahmeprotokoll wurde erfolgreich erstellt.'
      });

      setIsCreateOpen(false);
      resetForm();
      loadProtocols();
    } catch (error) {
      console.error('Error creating protocol:', error);
      toast({
        title: 'Fehler',
        description: 'Abnahmeprotokoll konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (protocolId: string, newStatus: ProtocolStatus, result?: string) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (result) {
        updateData.overall_result = result;
      }

      const { error } = await supabase
        .from('crm_acceptance_protocols')
        .update(updateData)
        .eq('id', protocolId);

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Status wurde aktualisiert.'
      });

      loadProtocols();
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
      order_id: '',
      acceptance_date: new Date().toISOString().split('T')[0],
      internal_notes: ''
    });
  };

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = 
      protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.protocol_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || protocol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: protocols.length,
    zurAbnahme: protocols.filter(p => p.status === 'zur_abnahme').length,
    abgenommen: protocols.filter(p => p.status === 'abgenommen').length,
    nachbesserung: protocols.filter(p => p.status === 'nachbesserung').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-8 w-8 text-primary" />
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
                <p className="text-2xl font-bold">{stats.zurAbnahme}</p>
                <p className="text-sm text-muted-foreground">Zur Abnahme</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.abgenommen}</p>
                <p className="text-sm text-muted-foreground">Abgenommen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.nachbesserung > 0 ? 'border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${stats.nachbesserung > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">{stats.nachbesserung}</p>
                <p className="text-sm text-muted-foreground">Nachbesserung</p>
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
              placeholder="Protokolle suchen..."
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
          Neues Protokoll
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Protokoll</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Auftrag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Abnahmedatum</TableHead>
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
            ) : filteredProtocols.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Abnahmeprotokolle gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredProtocols.map((protocol) => {
                const StatusIcon = statusConfig[protocol.status]?.icon || ClipboardCheck;
                
                return (
                  <TableRow 
                    key={protocol.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedProtocol(protocol);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{protocol.title}</p>
                        <p className="text-sm text-muted-foreground">{protocol.protocol_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {protocol.crm_companies?.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      {protocol.crm_orders?.order_number || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[protocol.status]?.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[protocol.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(protocol.acceptance_date), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
            <DialogTitle>Neues Abnahmeprotokoll erstellen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Titel *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Protokolltitel"
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
                <Label>Auftrag</Label>
                <Select 
                  value={formData.order_id} 
                  onValueChange={(v) => setFormData({ ...formData, order_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auftrag auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.order_number} - {order.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Abnahmedatum *</Label>
                <Input
                  type="date"
                  value={formData.acceptance_date}
                  onChange={(e) => setFormData({ ...formData, acceptance_date: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibung der abzunehmenden Leistungen"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label>Interne Notizen</Label>
                <Textarea
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  placeholder="Interne Notizen zum Protokoll"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateProtocol} disabled={!formData.title}>
              Protokoll erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              {selectedProtocol?.protocol_number} - {selectedProtocol?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedProtocol && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Kunde</Label>
                  <p className="font-medium">{selectedProtocol.crm_companies?.company_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedProtocol.status]?.className}>
                      {statusConfig[selectedProtocol.status]?.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Auftrag</Label>
                  <p className="font-medium">{selectedProtocol.crm_orders?.order_number || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Abnahmedatum</Label>
                  <p className="font-medium">{format(new Date(selectedProtocol.acceptance_date), 'dd.MM.yyyy', { locale: de })}</p>
                </div>
                {selectedProtocol.customer_signed_at && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Unterschrieben von</Label>
                      <p className="font-medium">{selectedProtocol.customer_signed_name || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Unterschrieben am</Label>
                      <p className="font-medium">
                        {format(new Date(selectedProtocol.customer_signed_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {selectedProtocol.description && (
                <div>
                  <Label className="text-muted-foreground">Beschreibung</Label>
                  <p className="mt-1">{selectedProtocol.description}</p>
                </div>
              )}
              
              {selectedProtocol.defects_noted && (
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <Label className="text-orange-700 dark:text-orange-300">Festgestellte Mängel</Label>
                  <p className="mt-1 text-orange-800 dark:text-orange-200">{selectedProtocol.defects_noted}</p>
                </div>
              )}
              
              {selectedProtocol.customer_comments && (
                <div>
                  <Label className="text-muted-foreground">Kundenkommentar</Label>
                  <p className="mt-1">{selectedProtocol.customer_comments}</p>
                </div>
              )}
              
              {selectedProtocol.internal_notes && (
                <div>
                  <Label className="text-muted-foreground">Interne Notizen</Label>
                  <p className="mt-1 text-sm">{selectedProtocol.internal_notes}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {selectedProtocol.status === 'entwurf' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedProtocol.id, 'zur_abnahme')}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Zur Abnahme senden
                  </Button>
                )}
                {selectedProtocol.status === 'zur_abnahme' && (
                  <>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedProtocol.id, 'abgenommen', 'vollstaendig_abgenommen')}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Vollständig abgenommen
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedProtocol.id, 'abgenommen', 'mit_maengeln_abgenommen')}
                      className="gap-2"
                    >
                      <FileCheck className="h-4 w-4" />
                      Mit Mängeln abgenommen
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedProtocol.id, 'nachbesserung')}
                      className="gap-2 text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Nachbesserung erforderlich
                    </Button>
                  </>
                )}
                {selectedProtocol.status === 'nachbesserung' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedProtocol.id, 'zur_abnahme')}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Erneut zur Abnahme
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
