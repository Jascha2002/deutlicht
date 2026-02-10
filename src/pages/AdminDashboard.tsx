import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';
import { AdminTabs } from '@/components/admin';
import { NotificationBell } from '@/components/NotificationBell';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const userIsAdmin = roles?.some(r => r.role === 'admin');
      setIsAdmin(userIsAdmin || false);

      if (!userIsAdmin) {
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keine Administratorrechte.',
          variant: 'destructive'
        });
        navigate('/analyse');
        return;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | DeutLicht</title>
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
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Benutzer, Partner & Provisionen verwalten</p>
                </div>
              </div>
            </div>
            <NotificationBell />
          </div>

          {/* Admin Tabs */}
          <AdminTabs />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
