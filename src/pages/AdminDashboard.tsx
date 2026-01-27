import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, Users, UserPlus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'mitarbeiter' | 'kunde';
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('kunde');

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const checkAdminAndLoadUsers = async () => {
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

      // Load all users with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, created_at');

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const role = userRoles?.find(r => r.user_id === profile.user_id);
        return {
          ...profile,
          role: (role?.role as 'admin' | 'mitarbeiter' | 'kunde') || 'kunde'
        };
      });

      setUsers(usersWithRoles);
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

  const updateUserRole = async (userId: string, role: string) => {
    try {
      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role as any });

      if (error) throw error;

      toast({
        title: 'Rolle aktualisiert',
        description: 'Die Benutzerrolle wurde erfolgreich geändert.'
      });

      // Refresh users
      await checkAdminAndLoadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Fehler',
        description: 'Die Rolle konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'mitarbeiter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
        <div className="max-w-6xl mx-auto px-6 py-12">
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
                  <p className="text-muted-foreground">Benutzer- und Rollenverwaltung</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold">Benutzerübersicht</h2>
              </div>
              <span className="text-sm text-muted-foreground">{users.length} Benutzer</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">E-Mail</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktuelle Rolle</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Rolle ändern</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Registriert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">
                          {user.full_name || 'Kein Name'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          getRoleBadgeColor(user.role)
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value) => updateUserRole(user.user_id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="mitarbeiter">Mitarbeiter</SelectItem>
                              <SelectItem value="kunde">Kunde</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                Keine Benutzer gefunden.
              </div>
            )}
          </div>

          {/* Role Descriptions */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3", getRoleBadgeColor('admin'))}>
                Admin
              </div>
              <h3 className="font-semibold text-foreground mb-2">Administrator</h3>
              <p className="text-sm text-muted-foreground">
                Vollzugriff auf alle Funktionen, Benutzer- und Rollenverwaltung, Bearbeitung aller Analysen.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3", getRoleBadgeColor('mitarbeiter'))}>
                Mitarbeiter
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mitarbeiter</h3>
              <p className="text-sm text-muted-foreground">
                Kann eigene Analysen erstellen und bearbeiten, Zugriff auf Dashboard und Reports.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3", getRoleBadgeColor('kunde'))}>
                Kunde
              </div>
              <h3 className="font-semibold text-foreground mb-2">Kunde</h3>
              <p className="text-sm text-muted-foreground">
                Lesezugriff auf eigene Berichte und Dokumente, eingeschränkte Bearbeitungsmöglichkeiten.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
