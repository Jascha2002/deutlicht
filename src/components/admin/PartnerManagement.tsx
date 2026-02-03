import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Handshake, Check, X, Eye, Percent, ExternalLink, Building2, Mail, Phone, MapPin, Search, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PartnerDetailDialog } from './PartnerDetailDialog';

interface Partner {
  id: string;
  partner_number: string | null;
  company_name: string;
  legal_form: string | null;
  tax_id: string | null;
  website: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_position: string | null;
  partner_type: string;
  employee_count: string | null;
  founded_year: number | null;
  current_clients: string | null;
  average_project_value: string | null;
  target_markets: string[] | null;
  specializations: string[] | null;
  experience: string | null;
  motivation: string | null;
  portfolio_url: string | null;
  references_text: string | null;
  expected_volume: string | null;
  status: string;
  commission_rate: number | null;
  created_at: string;
  approved_at: string | null;
  rejection_reason: string | null;
  show_on_website: boolean | null;
  iban: string | null;
  bic: string | null;
  bank_name: string | null;
  account_holder: string | null;
  contract_status: string | null;
  contract_sent_at: string | null;
  contract_signed_at: string | null;
  contract_draft_content: string | null;
  contract_pdf_url: string | null;
  notes: string | null;
  internal_notes: string | null;
  website_check_status: string | null;
  website_check_at: string | null;
  website_check_result: Record<string, unknown> | null;
}

export function PartnerManagement() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newCommissionRate, setNewCommissionRate] = useState('');
  const [deletePartnerId, setDeletePartnerId] = useState<string | null>(null);

  useEffect(() => {
    loadPartners();
  }, [statusFilter]);

  const loadPartners = async () => {
    try {
      let query = supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPartners((data || []) as Partner[]);
    } catch (error) {
      console.error('Error loading partners:', error);
      toast({
        title: 'Fehler',
        description: 'Partner konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartnerStatus = async (partnerId: string, status: string, reason?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData: Record<string, unknown> = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = user?.id;
      } else if (status === 'rejected' && reason) {
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('partners')
        .update(updateData)
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: 'Status aktualisiert',
        description: `Partner wurde ${status === 'approved' ? 'genehmigt' : status === 'rejected' ? 'abgelehnt' : 'aktualisiert'}.`
      });

      await loadPartners();
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const updateCommissionRate = async (partnerId: string, rate: number) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ 
          commission_rate: rate,
          updated_at: new Date().toISOString()
        })
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: 'Provision aktualisiert',
        description: `Provisionsrate wurde auf ${rate}% gesetzt.`
      });

      await loadPartners();
      setNewCommissionRate('');
    } catch (error) {
      console.error('Error updating commission:', error);
      toast({
        title: 'Fehler',
        description: 'Provision konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const toggleWebsiteVisibility = async (partnerId: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ 
          show_on_website: visible,
          updated_at: new Date().toISOString()
        })
        .eq('id', partnerId);

      if (error) throw error;

      toast({
        title: visible ? 'Partner sichtbar' : 'Partner ausgeblendet',
        description: visible ? 'Partner wird auf der Website angezeigt.' : 'Partner wurde von der Website entfernt.'
      });

      await loadPartners();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const openPartnerDetail = (partner: Partner) => {
    setSelectedPartner(partner);
    setDetailDialogOpen(true);
  };

  const handleDeletePartner = async () => {
    if (!deletePartnerId) return;
    try {
      // Delete related data first
      await supabase.from('partner_referrals').delete().eq('partner_id', deletePartnerId);
      await supabase.from('partner_commissions').delete().eq('partner_id', deletePartnerId);
      
      const { error } = await supabase.from('partners').delete().eq('id', deletePartnerId);
      if (error) throw error;
      
      toast({
        title: 'Partner gelöscht',
        description: 'Der Partner und alle zugehörigen Daten wurden entfernt.'
      });
      setDeletePartnerId(null);
      await loadPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Fehler',
        description: 'Partner konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPartnerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      steuerberater: 'Steuerberater',
      marketing_agentur: 'Marketing-Agentur',
      webdesigner: 'Webdesigner',
      it_dienstleister: 'IT-Dienstleister',
      unternehmensberater: 'Unternehmensberater',
      sonstige: 'Sonstige'
    };
    return labels[type] || type;
  };

  const getContractStatusBadge = (status: string | null) => {
    switch (status) {
      case 'signed':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };

  const filteredPartners = partners.filter(partner => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      partner.company_name.toLowerCase().includes(query) ||
      partner.contact_email.toLowerCase().includes(query) ||
      partner.contact_first_name.toLowerCase().includes(query) ||
      partner.contact_last_name.toLowerCase().includes(query) ||
      (partner.city && partner.city.toLowerCase().includes(query)) ||
      (partner.partner_number && partner.partner_number.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const pendingCount = partners.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Handshake className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Partner-Verwaltung</h2>
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">
                {pendingCount} ausstehend
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
                <SelectItem value="all">Alle Partner</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="approved">Genehmigt</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Partners List */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Partner-Nr.</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Unternehmen</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Kontakt</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Adresse</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Vertrag</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Provision</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-accent">
                      {partner.partner_number || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{partner.company_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getPartnerTypeLabel(partner.partner_type)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {partner.contact_first_name} {partner.contact_last_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${partner.contact_email}`} className="hover:text-accent">
                          {partner.contact_email}
                        </a>
                      </div>
                      {partner.contact_phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <a href={`tel:${partner.contact_phone}`} className="hover:text-accent">
                            {partner.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <div>
                        {partner.street && <p>{partner.street}</p>}
                        <p>{partner.postal_code} {partner.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusBadge(partner.status)
                    )}>
                      {partner.status === 'approved' ? 'Genehmigt' : 
                       partner.status === 'pending' ? 'Ausstehend' : 
                       partner.status === 'rejected' ? 'Abgelehnt' : partner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {partner.contract_status && partner.contract_status !== 'none' ? (
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getContractStatusBadge(partner.contract_status)
                      )}>
                        {partner.contract_status === 'signed' ? '✓ Unterschrieben' :
                         partner.contract_status === 'sent' ? 'Versendet' :
                         partner.contract_status === 'draft' ? 'Entwurf' :
                         partner.contract_status}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{partner.commission_rate || 15}%</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Percent className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Provision anpassen</DialogTitle>
                            <DialogDescription>
                              Aktuelle Provision für {partner.company_name}: {partner.commission_rate || 15}%
                              <br />
                              <span className="text-xs">Berechnung auf Basis der Nettoumsätze (ohne USt.)</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              placeholder="Neue Provisionsrate (%)"
                              value={newCommissionRate}
                              onChange={(e) => setNewCommissionRate(e.target.value)}
                            />
                            <Button 
                              className="w-full"
                              onClick={() => {
                                const rate = parseFloat(newCommissionRate);
                                if (rate >= 0 && rate <= 50) {
                                  updateCommissionRate(partner.id, rate);
                                }
                              }}
                            >
                              Speichern
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1"
                        onClick={() => openPartnerDetail(partner)}
                      >
                        <FileText className="w-3 h-3" />
                        Details
                      </Button>
                      {partner.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                            onClick={() => updatePartnerStatus(partner.id, 'approved')}
                          >
                            <Check className="w-3 h-3" />
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
                                <DialogTitle>Partner ablehnen</DialogTitle>
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
                                  onClick={() => updatePartnerStatus(partner.id, 'rejected', rejectionReason)}
                                >
                                  Ablehnen
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                      {partner.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn("h-8", partner.show_on_website && "bg-accent/10")}
                          onClick={() => toggleWebsiteVisibility(partner.id, !partner.show_on_website)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      )}
                      {partner.website && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={partner.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeletePartnerId(partner.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPartners.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Keine Partner gefunden.
          </div>
        )}
      </div>

      {/* Partner Detail Dialog */}
      <PartnerDetailDialog
        partner={selectedPartner}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={loadPartners}
        onDelete={() => {
          setDetailDialogOpen(false);
          loadPartners();
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePartnerId} onOpenChange={(open) => !open && setDeletePartnerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Partner löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Der Partner und alle zugehörigen Daten (Vermittlungen, Provisionen) werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePartner} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
