import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Building2, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Referral {
  id: string;
  partner_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_company: string | null;
  status: string;
  first_contact_date: string | null;
  conversion_date: string | null;
  lifetime_value: number | null;
  created_at: string;
  partner?: {
    company_name: string;
  };
}

export function ReferralManagement() {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadReferrals();
  }, [statusFilter]);

  const loadReferrals = async () => {
    try {
      let query = supabase
        .from('partner_referrals')
        .select(`
          id, partner_id, customer_name, customer_email, customer_company,
          status, first_contact_date, conversion_date, lifetime_value, created_at,
          partners:partner_id (company_name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const formattedData = (data || []).map(item => ({
        ...item,
        partner: item.partners as { company_name: string } | undefined
      }));
      
      setReferrals(formattedData);
    } catch (error) {
      console.error('Error loading referrals:', error);
      toast({
        title: 'Fehler',
        description: 'Referrals konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateReferralStatus = async (referralId: string, status: string) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'converted') {
        updateData.conversion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('partner_referrals')
        .update(updateData)
        .eq('id', referralId);

      if (error) throw error;

      toast({
        title: 'Status aktualisiert',
        description: 'Referral-Status wurde geändert.'
      });

      await loadReferrals();
    } catch (error) {
      console.error('Error updating referral:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ausstehend',
      contacted: 'Kontaktiert',
      converted: 'Konvertiert',
      lost: 'Verloren'
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Calculate stats
  const totalReferrals = referrals.length;
  const convertedCount = referrals.filter(r => r.status === 'converted').length;
  const totalValue = referrals.reduce((sum, r) => sum + (r.lifetime_value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalReferrals}</p>
              <p className="text-sm text-muted-foreground">Gesamt Referrals</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{convertedCount}</p>
              <p className="text-sm text-muted-foreground">Konvertiert ({totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0}%)</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{totalValue.toLocaleString('de-DE')}</p>
              <p className="text-sm text-muted-foreground">Lifetime Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Filter */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Referral-Übersicht</h2>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter nach Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Referrals</SelectItem>
              <SelectItem value="pending">Ausstehend</SelectItem>
              <SelectItem value="contacted">Kontaktiert</SelectItem>
              <SelectItem value="converted">Konvertiert</SelectItem>
              <SelectItem value="lost">Verloren</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Kunde</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Partner</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Lifetime Value</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Datum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status ändern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referrals.map((referral) => (
                <tr key={referral.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{referral.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{referral.customer_company || referral.customer_email || 'Keine Details'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {referral.partner?.company_name || 'Unbekannt'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusBadge(referral.status)
                    )}>
                      {getStatusLabel(referral.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {referral.lifetime_value ? `€${referral.lifetime_value.toLocaleString('de-DE')}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(referral.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Select
                      value={referral.status}
                      onValueChange={(value) => updateReferralStatus(referral.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                        <SelectItem value="contacted">Kontaktiert</SelectItem>
                        <SelectItem value="converted">Konvertiert</SelectItem>
                        <SelectItem value="lost">Verloren</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Keine Referrals gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
