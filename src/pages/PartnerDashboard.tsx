import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Handshake, ArrowLeft, Users, DollarSign, TrendingUp, 
  FileText, Download, ExternalLink, Calendar, Building2,
  CheckCircle, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  company_name: string;
  commission_rate: number | null;
  status: string;
}

interface Referral {
  id: string;
  customer_name: string;
  customer_company: string | null;
  status: string;
  created_at: string;
  lifetime_value: number | null;
}

interface Commission {
  id: string;
  commission_type: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPartner, setIsPartner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    checkPartnerAndLoadData();
  }, []);

  const checkPartnerAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is partner
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const userIsPartner = roles?.some(r => r.role === 'partner');
      const userIsAdmin = roles?.some(r => r.role === 'admin');
      
      // Admins can also view partner dashboard
      if (!userIsPartner && !userIsAdmin) {
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keine Partner-Berechtigung.',
          variant: 'destructive'
        });
        navigate('/analyse');
        return;
      }

      setIsPartner(true);

      // Load partner data
      const { data: partnerData } = await supabase
        .from('partners')
        .select('id, company_name, commission_rate, status')
        .eq('user_id', user.id)
        .single();

      if (partnerData) {
        setPartner(partnerData);

        // Load referrals
        const { data: referralData } = await supabase
          .from('partner_referrals')
          .select('id, customer_name, customer_company, status, created_at, lifetime_value')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setReferrals(referralData || []);

        // Load commissions
        const { data: commissionData } = await supabase
          .from('partner_commissions')
          .select('id, commission_type, amount, status, created_at, paid_at')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setCommissions(commissionData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Fehler',
        description: 'Daten konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
      case 'paid':
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string, type: 'referral' | 'commission') => {
    if (type === 'referral') {
      const labels: Record<string, string> = {
        pending: 'Ausstehend',
        contacted: 'Kontaktiert',
        converted: 'Konvertiert',
        lost: 'Verloren'
      };
      return labels[status] || status;
    } else {
      const labels: Record<string, string> = {
        pending: 'Ausstehend',
        approved: 'Genehmigt',
        paid: 'Ausgezahlt',
        cancelled: 'Storniert'
      };
      return labels[status] || status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isPartner) {
    return null;
  }

  // Calculate stats
  const totalReferrals = referrals.length;
  const convertedReferrals = referrals.filter(r => r.status === 'converted').length;
  const totalEarned = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((sum, c) => sum + c.amount, 0);

  return (
    <>
      <Helmet>
        <title>Partner Dashboard | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/analyse')} className="gap-2">
                <ArrowLeft size={18} />
                Zurück
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Partner Dashboard</h1>
                  <p className="text-muted-foreground">
                    {partner?.company_name || 'Willkommen'} • {partner?.commission_rate || 15}% Provision
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReferrals}</p>
                  <p className="text-sm text-muted-foreground">Empfehlungen</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{convertedReferrals}</p>
                  <p className="text-sm text-muted-foreground">Konvertiert</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">€{pendingCommissions.toLocaleString('de-DE')}</p>
                  <p className="text-sm text-muted-foreground">Offen</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">€{totalEarned.toLocaleString('de-DE')}</p>
                  <p className="text-sm text-muted-foreground">Verdient</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Referrals */}
            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Meine Empfehlungen</h2>
                </div>
              </div>
              <div className="divide-y divide-border">
                {referrals.length > 0 ? referrals.map((referral) => (
                  <div key={referral.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{referral.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {referral.customer_company || 'Kein Unternehmen'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadge(referral.status)
                        )}>
                          {getStatusLabel(referral.status, 'referral')}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(referral.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Noch keine Empfehlungen</p>
                    <p className="text-sm mt-1">Empfehlen Sie DeutLicht weiter!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Commissions */}
            <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Meine Provisionen</h2>
                </div>
              </div>
              <div className="divide-y divide-border">
                {commissions.length > 0 ? commissions.map((commission) => (
                  <div key={commission.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          commission.status === 'paid' ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
                        )}>
                          {commission.status === 'paid' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">€{commission.amount.toLocaleString('de-DE')}</p>
                          <p className="text-xs text-muted-foreground">
                            {commission.commission_type === 'initial' ? 'Erstprovision' : 
                             commission.commission_type === 'recurring' ? 'Wiederkehrend' : 'Bonus'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadge(commission.status)
                        )}>
                          {getStatusLabel(commission.status, 'commission')}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(commission.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Noch keine Provisionen</p>
                    <p className="text-sm mt-1">Provisionen werden nach Konvertierung gutgeschrieben.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Marketing Materials Section */}
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold">Marketing-Materialien</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Nutzen Sie unsere Materialien, um DeutLicht zu empfehlen.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Button variant="outline" className="gap-2" disabled>
                <Download className="w-4 h-4" />
                Präsentation (bald verfügbar)
              </Button>
              <Button variant="outline" className="gap-2" disabled>
                <Download className="w-4 h-4" />
                Logo-Paket (bald verfügbar)
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a href="/partner" target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  Partner-Programm Seite
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PartnerDashboard;
