import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calendar, CheckCircle, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Commission {
  id: string;
  partner_id: string;
  customer_id: string;
  project_id: string | null;
  commission_type: string;
  base_amount: number | null;
  percentage_applied: number | null;
  amount: number;
  status: string;
  period_start: string | null;
  period_end: string | null;
  paid_at: string | null;
  created_at: string;
  partner?: {
    company_name: string;
  };
}

export function CommissionManagement() {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadCommissions();
  }, [statusFilter]);

  const loadCommissions = async () => {
    try {
      let query = supabase
        .from('partner_commissions')
        .select(`
          id, partner_id, customer_id, project_id, commission_type,
          base_amount, percentage_applied, amount, status,
          period_start, period_end, paid_at, created_at,
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
      
      setCommissions(formattedData);
    } catch (error) {
      console.error('Error loading commissions:', error);
      toast({
        title: 'Fehler',
        description: 'Provisionen konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPaid = async (commissionId: string) => {
    try {
      const { error } = await supabase
        .from('partner_commissions')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commissionId);

      if (error) throw error;

      toast({
        title: 'Provision ausgezahlt',
        description: 'Die Provision wurde als bezahlt markiert.'
      });

      await loadCommissions();
    } catch (error) {
      console.error('Error updating commission:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ausstehend',
      approved: 'Genehmigt',
      paid: 'Ausgezahlt',
      cancelled: 'Storniert'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      initial: 'Erstprovision',
      recurring: 'Wiederkehrend',
      bonus: 'Bonus'
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

  // Calculate stats
  const totalPending = commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const pendingCount = commissions.filter(c => c.status === 'pending' || c.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{totalPending.toLocaleString('de-DE')}</p>
              <p className="text-sm text-muted-foreground">Offene Provisionen ({pendingCount})</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{totalPaid.toLocaleString('de-DE')}</p>
              <p className="text-sm text-muted-foreground">Ausgezahlt gesamt</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">€{(totalPending + totalPaid).toLocaleString('de-DE')}</p>
              <p className="text-sm text-muted-foreground">Provisionen gesamt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Filter */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Provisions-Übersicht</h2>
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">
                {pendingCount} offen
              </span>
            )}
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter nach Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Provisionen</SelectItem>
              <SelectItem value="pending">Ausstehend</SelectItem>
              <SelectItem value="approved">Genehmigt</SelectItem>
              <SelectItem value="paid">Ausgezahlt</SelectItem>
              <SelectItem value="cancelled">Storniert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Commissions List */}
      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Partner</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Typ</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Basis</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Rate</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Betrag</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Datum</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {commission.partner?.company_name || 'Unbekannt'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {getTypeLabel(commission.commission_type)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {commission.base_amount ? `€${commission.base_amount.toLocaleString('de-DE')}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {commission.percentage_applied ? `${commission.percentage_applied}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-accent">
                    €{commission.amount.toLocaleString('de-DE')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusBadge(commission.status)
                    )}>
                      {getStatusLabel(commission.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(commission.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(commission.status === 'pending' || commission.status === 'approved') && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => markAsPaid(commission.id)}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Auszahlen
                      </Button>
                    )}
                    {commission.status === 'paid' && commission.paid_at && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(commission.paid_at).toLocaleDateString('de-DE')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Keine Provisionen gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
