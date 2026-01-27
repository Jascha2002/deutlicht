import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'mitarbeiter' | 'kunde' | 'partner';
  created_at: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
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
          role: (role?.role as 'admin' | 'mitarbeiter' | 'kunde' | 'partner') || 'kunde'
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Fehler',
        description: 'Benutzer konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role as any });

      if (error) throw error;

      toast({
        title: 'Rolle aktualisiert',
        description: 'Die Benutzerrolle wurde erfolgreich geändert.'
      });

      await loadUsers();
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
      case 'partner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
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
                      <SelectItem value="partner">Partner</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Role Descriptions */}
      <div className="p-6 border-t border-border grid md:grid-cols-4 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('admin'))}>
            Admin
          </div>
          <p className="text-xs text-muted-foreground">
            Vollzugriff auf alle Funktionen, Benutzer-, Partner- und Rollenverwaltung.
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('mitarbeiter'))}>
            Mitarbeiter
          </div>
          <p className="text-xs text-muted-foreground">
            Kann Analysen erstellen/bearbeiten, Partner-Daten einsehen (erweitert).
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('partner'))}>
            Partner
          </div>
          <p className="text-xs text-muted-foreground">
            Eigene Kunden und Provisionen einsehen, Marketing-Material Zugriff.
          </p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('kunde'))}>
            Kunde
          </div>
          <p className="text-xs text-muted-foreground">
            Lesezugriff auf eigene Berichte und Dokumente.
          </p>
        </div>
      </div>
    </div>
  );
}
