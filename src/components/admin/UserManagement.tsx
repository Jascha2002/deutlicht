import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Users, Plus, Trash2, AlertTriangle, Shield, Building2, KeyRound, Link2 } from 'lucide-react';
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
  assigned_companies?: { id: string; company_name: string }[];
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
  const [resetPasswordUser, setResetPasswordUser] = useState<UserWithRole | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
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

      // Load all user_company_assignments
      const { data: assignments } = await supabase
        .from('user_company_assignments')
        .select('user_id, company_id');

      // Get all relevant company IDs
      const allCompanyIds = new Set<string>();
      (profiles || []).forEach(p => { if (p.company_id) allCompanyIds.add(p.company_id); });
      (assignments || []).forEach(a => { if (a.company_id) allCompanyIds.add(a.company_id); });

      let companyMap: Record<string, string> = {};
      if (allCompanyIds.size > 0) {
        const { data: companyData } = await supabase
          .from('crm_companies')
          .select('id, company_name')
          .in('id', Array.from(allCompanyIds));
        companyData?.forEach(c => { companyMap[c.id] = c.company_name; });
      }

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const role = userRoles?.find(r => r.user_id === profile.user_id);
        const userAssignments = (assignments || [])
          .filter(a => a.user_id === profile.user_id)
          .map(a => ({ id: a.company_id, company_name: companyMap[a.company_id] || 'Unbekannt' }));

        return {
          ...profile,
          role: (role?.role as 'admin' | 'mitarbeiter' | 'kunde' | 'partner') || 'kunde',
          company_name: profile.company_id ? companyMap[profile.company_id] || null : null,
          assigned_companies: userAssignments,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({ title: 'Fehler', description: 'Benutzer konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_manage_user_role', {
        p_target_user_id: userId, p_role: role, p_action: 'replace'
      });
      if (error) throw error;
      const result = data as { success: boolean; error?: string } | null;
      if (result && !result.success) throw new Error(result.error || 'Unbekannter Fehler');
      toast({ title: 'Rolle aktualisiert', description: 'Die Benutzerrolle wurde erfolgreich geändert.' });
      await loadUsers();
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message || 'Rolle konnte nicht aktualisiert werden.', variant: 'destructive' });
    }
  };

  const handleAssignCompany = async () => {
    if (!companyAssignUser || !selectedCompanyId) return;
    try {
      if (selectedCompanyId === '__none__') {
        // Remove all assignments
        await supabase.from('user_company_assignments').delete().eq('user_id', companyAssignUser.user_id);
        await supabase.from('profiles').update({ company_id: null }).eq('user_id', companyAssignUser.user_id);
        if (companyAssignUser.company_id) {
          await supabase.from('crm_companies').update({ user_id: null }).eq('id', companyAssignUser.company_id).eq('user_id', companyAssignUser.user_id);
        }
        toast({ title: 'Zuordnungen entfernt' });
      } else {
        // Add company assignment (many-to-many)
        const { error } = await supabase.from('user_company_assignments').upsert(
          { user_id: companyAssignUser.user_id, company_id: selectedCompanyId },
          { onConflict: 'user_id,company_id' }
        );
        if (error) throw error;

        // Set primary company in profiles if none set
        if (!companyAssignUser.company_id) {
          await supabase.from('profiles').update({ company_id: selectedCompanyId }).eq('user_id', companyAssignUser.user_id);
        }

        toast({ title: 'Firma hinzugefügt', description: 'Die Firma wurde dem Benutzer zugeordnet.' });
      }

      setCompanyAssignUser(null);
      setSelectedCompanyId('');
      setCompanySearch('');
      await loadUsers();
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message || 'Zuordnung fehlgeschlagen.', variant: 'destructive' });
    }
  };

  const handleRemoveCompanyAssignment = async (userId: string, companyId: string) => {
    try {
      await supabase.from('user_company_assignments').delete().eq('user_id', userId).eq('company_id', companyId);
      // If this was the primary company, clear it
      const user = users.find(u => u.user_id === userId);
      if (user?.company_id === companyId) {
        await supabase.from('profiles').update({ company_id: null }).eq('user_id', userId);
      }
      toast({ title: 'Firma entfernt' });
      await loadUsers();
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
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
      toast({ title: 'Benutzerprofil gelöscht' });
      setDeleteUserId(null);
      await loadUsers();
    } catch (error: any) {
      toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
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
              <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Firmen</th>
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
                  <div className="flex flex-col gap-1">
                    {(user.assigned_companies || []).length > 0 ? (
                      <>
                        {user.assigned_companies!.map(c => (
                          <div key={c.id} className="flex items-center gap-1.5 group">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground">{c.company_name}</span>
                            {isAdmin && (
                              <button
                                onClick={() => handleRemoveCompanyAssignment(user.user_id, c.id)}
                                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 text-xs ml-1 transition-opacity"
                                title="Entfernen"
                              >✕</button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => { setCompanyAssignUser(user); setSelectedCompanyId(''); }}
                          className="text-xs text-accent hover:underline mt-0.5 text-left flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Weitere Firma
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setCompanyAssignUser(user); setSelectedCompanyId(''); }}
                        className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                      >
                        <Link2 className="w-3.5 h-3.5" /> Firma zuweisen
                      </button>
                    )}
                  </div>
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
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <Button variant="ghost" size="sm" title="Passwort zurücksetzen"
                        onClick={() => { setResetPasswordUser(user); setNewPassword(''); }}
                      >
                        <KeyRound className="w-4 h-4" />
                      </Button>
                    )}
                    {canDeleteUsers && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteUserId(user.user_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    {!isAdmin && !canDeleteUsers && (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
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

      {/* Company Assignment Dialog - now supports adding multiple */}
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
            
            {/* Show current assignments */}
            {companyAssignUser && (companyAssignUser.assigned_companies || []).length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Aktuelle Zuordnungen</Label>
                <div className="mt-1 space-y-1">
                  {companyAssignUser.assigned_companies!.map(c => (
                    <div key={c.id} className="flex items-center gap-2 bg-muted/30 rounded px-3 py-1.5 text-sm">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {c.company_name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Firma hinzufügen</Label>
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
                Alle Zuordnungen entfernen
              </button>
              {filteredCompanies
                .filter(c => !(companyAssignUser?.assigned_companies || []).some(ac => ac.id === c.id))
                .map(c => (
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-accent" />
              Passwort zurücksetzen
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Neues Passwort für <strong>{resetPasswordUser?.full_name || resetPasswordUser?.email}</strong> setzen.
            </p>
            <div>
              <Label>Neues Passwort</Label>
              <Input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Neues Passwort eingeben" />
              <p className="text-xs text-muted-foreground mt-1">Mindestens 6 Zeichen.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordUser(null)}>Abbrechen</Button>
            <Button
              disabled={isResetting || newPassword.length < 6}
              onClick={async () => {
                if (!resetPasswordUser) return;
                setIsResetting(true);
                try {
                  const { data, error } = await supabase.functions.invoke('admin-reset-password', {
                    body: { target_user_id: resetPasswordUser.user_id, new_password: newPassword }
                  });
                  if (error) throw error;
                  if (data?.error) throw new Error(data.error);
                  toast({ title: 'Passwort geändert' });
                  setResetPasswordUser(null);
                  setNewPassword('');
                } catch (error: any) {
                  toast({ title: 'Fehler', description: error.message, variant: 'destructive' });
                } finally {
                  setIsResetting(false);
                }
              }}
            >
              {isResetting ? 'Bitte warten...' : 'Passwort setzen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
