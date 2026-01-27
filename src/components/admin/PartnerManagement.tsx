import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Handshake, Check, X, Eye, Percent, ExternalLink, Building2, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  company_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string | null;
  partner_type: string;
  status: string;
  commission_rate: number | null;
  created_at: string;
  city: string | null;
  website: string | null;
  show_on_website: boolean | null;
}

export function PartnerManagement() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newCommissionRate, setNewCommissionRate] = useState('');

  useEffect(() => {
    loadPartners();
  }, [statusFilter]);

  const loadPartners = async () => {
    try {
      let query = supabase
        .from('partners')
        .select('id, company_name, contact_first_name, contact_last_name, contact_email, contact_phone, partner_type, status, commission_rate, created_at, city, website, show_on_website')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPartners(data || []);
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
      
      const updateData: any = { 
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
      setSelectedPartner(null);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

      {/* Partners List */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Unternehmen</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Typ</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Kontakt</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Provision</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{partner.company_name}</p>
                        <p className="text-xs text-muted-foreground">{partner.city || 'Kein Ort'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {getPartnerTypeLabel(partner.partner_type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {partner.contact_first_name} {partner.contact_last_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {partner.contact_email}
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
                      {partner.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updatePartnerStatus(partner.id, 'approved')}
                          >
                            <Check className="w-3 h-3" />
                            Genehmigen
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <X className="w-3 h-3" />
                                Ablehnen
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
                          <Eye className="w-3 h-3 mr-1" />
                          {partner.show_on_website ? 'Sichtbar' : 'Ausblenden'}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {partners.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Keine Partner gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
