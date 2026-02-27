import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Users, Plus, Trash2, AlertTriangle, Shield, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PermissionManagement } from './PermissionManagement';

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'mitarbeiter' | 'kunde' | 'partner';
  created_at: string;
  company_id: string | null;
  company_name: string | null;
}

interface CrmCompany {
  id: string;
  company_name: string;
}

interface UserManagementProps {
  currentUserRole?: 'admin' | 'mitarbeiter' | 'kunde' | 'partner' | 'produktion';
}

export function UserManagement({ currentUserRole = 'admin' }: UserManagementProps) {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [companies, setCompanies] = useState<CrmCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'kunde' });
  const [isCreating, setIsCreating] = useState(false);
  const [permissionUser, setPermissionUser] = useState<{ userId: string; name: string; role: string } | null>(null);
  const [companyAssignUser, setCompanyAssignUser] = useState<UserWithRole | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companySearch, setCompanySearch] = useState('');
  
  const isAdmin = currentUserRole === 'admin';
  const canCreateUsers = isAdmin || currentUserRole === 'mitarbeiter';
  const canDeleteUsers = isAdmin;
  const canChangeRoles = isAdmin;

  useEffect(() => {
    loadUsers();
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const { data } = await supabase
      .from('crm_companies')
      .select('id, company_name')
      .order('company_name');
    setCompanies(data || []);
  };

  const loadUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, created_at, company_id');

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get company names for profiles that have company_id
      const companyIds = (profiles || []).map(p => p.company_id).filter(Boolean);
      let companyMap: Record<string, string> = {};
      if (companyIds.length > 0) {
        const { data: companyData } = await supabase
          .from('crm_companies')
          .select('id, company_name')
          .in('id', companyIds);
        companyData?.forEach(c => { companyMap[c.id] = c.company_name; });
      }

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const role = userRoles?.find(r => r.user_id === profile.user_id);
        return {
          ...profile,
          role: (role?.role as 'admin' | 'mitarbeiter' | 'kunde' | 'partner') || 'kunde',
          company_name: profile.company_id ? companyMap[profile.company_id] || null : null
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
      const { data, error } = await supabase.rpc('admin_manage_user_role', {
        p_target_user_id: userId,
        p_role: role,
        p_action: 'replace'
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string } | null;
      if (result && !result.success) throw new Error(result.error || 'Unbekannter Fehler');

      toast({ title: 'Rolle aktualisiert', description: 'Die Benutzerrolle wurde erfolgreich geändert.' });
      await loadUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({ title: 'Fehler', description: error.message || 'Die Rolle konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleAssignCompany = async () => {
    if (!companyAssignUser) return;
    try {
      const companyId = selectedCompanyId === '__none__' ? null : selectedCompanyId || null;
      const { error } = await supabase
        .from('profiles')
        .update({ company_id: companyId })
        .eq('user_id', companyAssignUser.user_id);

      if (error) throw error;

      toast({ title: 'Firma zugewiesen', description: companyId ? 'Der Benutzer wurde der Firma zugeordnet.' : 'Firma-Zuordnung entfernt.' });
      setCompanyAssignUser(null);
      setSelectedCompanyId('');
      setCompanySearch('');
      await loadUsers();
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message || 'Zuordnung fehlgeschlagen.', variant: 'destructive' });
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({ title: 'Fehler', description: 'E-Mail und Passwort sind erforderlich.', variant: 'destructive' });
      return;
    }
    if (newUser.password.length < 6) {
      toast({ title: 'Fehler', description: 'Passwort muss mindestens 6 Zeichen haben.', variant: 'destructive' });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Nicht angemeldet');

      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { email: newUser.email, password: newUser.password, full_name: newUser.full_name, role: newUser.role }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Benutzer erstellt', description: `${newUser.email} wurde erfolgreich angelegt.` });
      setShowCreateDialog(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'kunde' });
      await loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({ title: 'Fehler', description: error.message || 'Benutzer konnte nicht erstellt werden.', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const { data, error } = await supabase.rpc('admin_delete_user', { p_target_user_id: deleteUserId });
      if (error) throw error;
      const result = data as { success: boolean; error?: string } | null;
      if (result && !result.success) throw new Error(result.error || 'Unbekannter Fehler');
      toast({ title: 'Benutzerprofil gelöscht', description: 'Das Profil und die Rolle wurden entfernt.' });
      setDeleteUserId(null);
      await loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({ title: 'Fehler', description: error.message || 'Benutzer konnte nicht gelöscht werden.', variant: 'destructive' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'mitarbeiter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'partner': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredCompanies = companySearch
    ? companies.filter(c => c.company_name.toLowerCase().includes(companySearch.toLowerCase()))
    : companies;

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
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{users.length} Benutzer</span>
          {canCreateUsers && (
            <Button size="sm" onClick={() => setShowCreateDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Benutzer anlegen
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">E-Mail</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Firma</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktuelle Rolle</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Rolle ändern</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Registriert</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Berechtigungen</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-foreground">{user.full_name || 'Kein Name'}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  {user.company_name ? (
                    <button
                      onClick={() => { setCompanyAssignUser(user); setSelectedCompanyId(user.company_id || ''); }}
                      className="flex items-center gap-1.5 text-sm text-foreground hover:text-accent transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      {user.company_name}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setCompanyAssignUser(user); setSelectedCompanyId(''); }}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      + Firma zuweisen
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getRoleBadgeColor(user.role))}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {canChangeRoles ? (
                    <Select defaultValue={user.role} onValueChange={(value) => updateUserRole(user.user_id, value)}>
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="mitarbeiter">Mitarbeiter</SelectItem>
                        <SelectItem value="produktion">Produktion</SelectItem>
                        <SelectItem value="kunde">Kunde</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-sm">
                  {new Date(user.created_at).toLocaleDateString('de-DE')}
                </td>
                <td className="px-6 py-4">
                  {isAdmin && (
                    <Button variant="ghost" size="sm"
                      onClick={() => setPermissionUser({ userId: user.user_id, name: user.full_name || user.email, role: user.role })}
                      className="gap-1"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="hidden lg:inline">Rechte</span>
                    </Button>
                  )}
                </td>
                <td className="px-6 py-4">
                  {canDeleteUsers ? (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteUserId(user.user_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">Keine Benutzer gefunden.</div>
      )}

      {/* Role Descriptions */}
      <div className="p-6 border-t border-border grid md:grid-cols-4 gap-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('admin'))}>Admin</div>
          <p className="text-xs text-muted-foreground">Vollzugriff auf alle Funktionen, Benutzer-, Partner- und Rollenverwaltung.</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('mitarbeiter'))}>Mitarbeiter</div>
          <p className="text-xs text-muted-foreground">Kann Analysen erstellen/bearbeiten, Partner-Daten einsehen (erweitert).</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('partner'))}>Partner</div>
          <p className="text-xs text-muted-foreground">Eigene Kunden und Provisionen einsehen, Marketing-Material Zugriff.</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className={cn("inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2", getRoleBadgeColor('kunde'))}>Kunde</div>
          <p className="text-xs text-muted-foreground">Lesezugriff auf eigene Berichte und Dokumente.</p>
        </div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Neuen Benutzer anlegen</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} placeholder="Vollständiger Name" />
            </div>
            <div>
              <Label>E-Mail *</Label>
              <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@beispiel.de" />
            </div>
            <div>
              <Label>Passwort *</Label>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Mindestens 6 Zeichen" />
            </div>
            <div>
              <Label>Rolle</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {isAdmin ? (
                    <>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="mitarbeiter">Mitarbeiter</SelectItem>
                      <SelectItem value="produktion">Produktion</SelectItem>
                      <SelectItem value="kunde">Kunde</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="kunde">Kunde</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Abbrechen</Button>
            <Button onClick={handleCreateUser} disabled={isCreating}>{isCreating ? 'Erstelle...' : 'Benutzer erstellen'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Assignment Dialog */}
      <Dialog open={!!companyAssignUser} onOpenChange={(open) => { if (!open) { setCompanyAssignUser(null); setCompanySearch(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Firma zuweisen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Benutzer: <strong>{companyAssignUser?.full_name || companyAssignUser?.email}</strong>
            </p>
            <div>
              <Label>Firma suchen</Label>
              <Input
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Firmenname eingeben..."
                className="mt-1"
              />
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              <button
                onClick={() => setSelectedCompanyId('__none__')}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors border-b",
                  selectedCompanyId === '__none__' && "bg-accent/10 text-accent font-medium"
                )}
              >
                Keine Firma (Zuordnung entfernen)
              </button>
              {filteredCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors border-b last:border-0",
                    selectedCompanyId === c.id && "bg-accent/10 text-accent font-medium"
                  )}
                >
                  {c.company_name}
                </button>
              ))}
              {filteredCompanies.length === 0 && companySearch && (
                <p className="px-4 py-3 text-sm text-muted-foreground">Keine Firma gefunden</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCompanyAssignUser(null); setCompanySearch(''); }}>Abbrechen</Button>
            <Button onClick={handleAssignCompany} disabled={!selectedCompanyId}>Zuweisen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission Management */}
      {permissionUser && (
        <PermissionManagement
          userId={permissionUser.userId}
          userName={permissionUser.name}
          userRole={permissionUser.role}
          open={!!permissionUser}
          onOpenChange={(open) => !open && setPermissionUser(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Benutzer löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Das Profil und die Rolle dieses Benutzers werden gelöscht.
              Der Auth-Account muss ggf. separat im Backend entfernt werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
