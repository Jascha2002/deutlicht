import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, FileText, Building2, CheckCircle, XCircle, Clock, 
  Eye, Send, Euro, ExternalLink, Bell, Plus, Trash2, Edit, AlertTriangle
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { OfferCreateDialog } from './offer/OfferCreateDialog';

type OfferStatus = 'entwurf' | 'gesendet' | 'angesehen' | 'angenommen' | 'abgelehnt' | 'abgelaufen';

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

const statusConfig: Record<OfferStatus, { label: string; className: string; icon: any }> = {
  entwurf: { label: 'Entwurf', className: 'bg-gray-100 text-gray-800', icon: FileText },
  gesendet: { label: 'Gesendet', className: 'bg-blue-100 text-blue-800', icon: Send },
  angesehen: { label: 'Angesehen', className: 'bg-purple-100 text-purple-800', icon: Eye },
  angenommen: { label: 'Angenommen', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  abgelehnt: { label: 'Abgelehnt', className: 'bg-red-100 text-red-800', icon: XCircle },
  abgelaufen: { label: 'Abgelaufen', className: 'bg-yellow-100 text-yellow-800', icon: Clock }
};

export function OfferManagement() {
  const { toast } = useToast();
  const [offers, setOffers] = useState<CrmOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOffer, setSelectedOffer] = useState<CrmOffer | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteOfferId, setDeleteOfferId] = useState<string | null>(null);
  const [editOffer, setEditOffer] = useState<CrmOffer | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_offers')
        .select(`
          id, offer_number, title, description, status, amount_setup, amount_monthly, amount_total, discount_percent, valid_from, valid_until, accepted_at, accepted_by, sent_at, viewed_at, pdf_url, created_at, company_id, lead_id, project_id, line_items,
          crm_companies(company_name),
          crm_leads(lead_number, company_name),
          crm_projects(project_number, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers((data as unknown as CrmOffer[]) || []);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast({
        title: 'Fehler',
        description: 'Angebote konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send offer and create followup
  const handleSendOffer = async (offer: CrmOffer) => {
    try {
      // Update offer status
      const { error: offerError } = await supabase
        .from('crm_offers')
        .update({ 
          status: 'gesendet',
          sent_at: new Date().toISOString()
        })
        .eq('id', offer.id);

      if (offerError) throw offerError;

      // Create 7-day followup
      const followupDate = addDays(new Date(), 7);
      const { error: followupError } = await supabase
        .from('crm_followups')
        .insert({
          title: `Angebot nachfassen: ${offer.title}`,
          description: `Wiedervorlage für Angebot ${offer.offer_number}. Bitte beim Kunden nachfragen, ob noch Fragen bestehen.`,
          followup_type: 'anruf',
          priority: 'normal',
          due_date: format(followupDate, 'yyyy-MM-dd'),
          offer_id: offer.id,
          company_id: offer.company_id,
          status: 'offen'
        });

      if (followupError) {
        console.error('Followup creation error:', followupError);
        // Don't throw - followup is optional
      }

      toast({ 
        title: 'Angebot gesendet',
        description: 'Wiedervorlage in 7 Tagen wurde erstellt.'
      });
      
      loadOffers();
      setSelectedOffer(null);
    } catch (error) {
      console.error('Error sending offer:', error);
      toast({
        title: 'Fehler',
        description: 'Angebot konnte nicht gesendet werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteOffer = async () => {
    if (!deleteOfferId) return;
    try {
      const { error } = await supabase
        .from('crm_offers')
        .delete()
        .eq('id', deleteOfferId);

      if (error) throw error;

      toast({ title: 'Angebot gelöscht' });
      setDeleteOfferId(null);
      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: 'Fehler',
        description: 'Angebot konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.offer_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Stats
  const stats = {
    total: offers.length,
    entwurf: offers.filter(o => o.status === 'entwurf').length,
    gesendet: offers.filter(o => o.status === 'gesendet').length,
    angenommen: offers.filter(o => o.status === 'angenommen').length,
    totalValue: offers.filter(o => o.status === 'angenommen').reduce((sum, o) => sum + (o.amount_total || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
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
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">{stats.entwurf}</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.entwurf}</p>
                <p className="text-sm text-muted-foreground">Entwürfe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Send className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.gesendet}</p>
                <p className="text-sm text-muted-foreground">Gesendet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.angenommen}</p>
                <p className="text-sm text-muted-foreground">Angenommen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                <p className="text-sm text-muted-foreground">Auftragsvolumen</p>
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
              placeholder="Angebote suchen..."
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
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Neues Angebot
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Angebot</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Einmalig</TableHead>
              <TableHead className="text-right">Monatlich</TableHead>
              <TableHead>Gültig bis</TableHead>
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
            ) : filteredOffers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Keine Angebote gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredOffers.map((offer) => {
                const StatusIcon = statusConfig[offer.status]?.icon || FileText;
                const isExpired = new Date(offer.valid_until) < new Date() && offer.status !== 'angenommen' && offer.status !== 'abgelehnt';
                
                return (
                  <TableRow key={offer.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        <p className="text-sm text-muted-foreground">{offer.offer_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {offer.crm_companies?.company_name || offer.crm_leads?.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={isExpired ? 'bg-yellow-100 text-yellow-800' : statusConfig[offer.status]?.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {isExpired ? 'Abgelaufen' : statusConfig[offer.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(offer.amount_setup || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {offer.amount_monthly > 0 ? formatCurrency(offer.amount_monthly) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={isExpired ? 'text-red-500' : ''}>
                        {format(new Date(offer.valid_until), 'dd.MM.yyyy', { locale: de })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOffer(offer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {offer.status === 'entwurf' && (
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteOfferId(offer.id); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOffer && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedOffer.title}</DialogTitle>
                    <p className="text-muted-foreground">{selectedOffer.offer_number}</p>
                  </div>
                  <Badge className={statusConfig[selectedOffer.status]?.className}>
                    {statusConfig[selectedOffer.status]?.label}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedOffer.amount_setup || 0)}</p>
                    <p className="text-xs text-muted-foreground">Einmalig</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">{formatCurrency(selectedOffer.amount_monthly || 0)}</p>
                    <p className="text-xs text-muted-foreground">Monatlich</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{formatCurrency(selectedOffer.amount_total || 0)}</p>
                    <p className="text-xs text-muted-foreground">Jahreswert (netto)</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kunde</p>
                  <p className="font-medium">
                    {selectedOffer.crm_companies?.company_name || selectedOffer.crm_leads?.company_name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projekt</p>
                  <p className="font-medium">
                    {selectedOffer.crm_projects?.title || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gültig von - bis</p>
                  <p className="font-medium">
                    {format(new Date(selectedOffer.valid_from), 'dd.MM.yyyy', { locale: de })} - {format(new Date(selectedOffer.valid_until), 'dd.MM.yyyy', { locale: de })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rabatt</p>
                  <p className="font-medium">
                    {selectedOffer.discount_percent > 0 ? `${selectedOffer.discount_percent}%` : 'Kein Rabatt'}
                  </p>
                </div>
              </div>

              {selectedOffer.accepted_at && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✓ Angenommen am {format(new Date(selectedOffer.accepted_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    {selectedOffer.accepted_by && ` von ${selectedOffer.accepted_by}`}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                {selectedOffer.pdf_url && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={selectedOffer.pdf_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      PDF öffnen
                    </a>
                  </Button>
                )}
                {selectedOffer.status === 'entwurf' && (
                  <Button 
                    className="gap-2"
                    onClick={() => handleSendOffer(selectedOffer)}
                  >
                    <Send className="h-4 w-4" />
                    Angebot senden
                  </Button>
                )}
                {selectedOffer.status === 'gesendet' && (
                  <Badge variant="outline" className="gap-1 py-2">
                    <Bell className="h-3 w-3" />
                    Wiedervorlage in 7 Tagen
                  </Badge>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteOfferId} onOpenChange={(open) => !open && setDeleteOfferId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Angebot löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie dieses Angebot wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOffer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Dialog */}
      <OfferCreateDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onSuccess={loadOffers} 
      />
    </div>
  );
}
