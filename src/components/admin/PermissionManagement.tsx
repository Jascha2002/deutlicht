import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Save, FileText, FolderOpen, Euro, Download } from 'lucide-react';

interface UserPermissions {
  user_id: string;
  can_view_angebote: boolean;
  can_view_auftraege: boolean;
  can_view_rechnungen: boolean;
  can_view_abnahmen: boolean;
  can_view_berichte: boolean;
  can_view_vertraege: boolean;
  can_view_all_projects: boolean;
  can_view_financials: boolean;
  can_view_commissions: boolean;
  can_export_data: boolean;
  can_download_pdfs: boolean;
  can_create_offers: boolean;
  can_create_invoices: boolean;
  can_edit_products: boolean;
}

const DEFAULT_PERMISSIONS: Omit<UserPermissions, 'user_id'> = {
  can_view_angebote: false,
  can_view_auftraege: false,
  can_view_rechnungen: false,
  can_view_abnahmen: false,
  can_view_berichte: false,
  can_view_vertraege: false,
  can_view_all_projects: false,
  can_view_financials: false,
  can_view_commissions: false,
  can_export_data: false,
  can_download_pdfs: false,
  can_create_offers: false,
  can_create_invoices: false,
  can_edit_products: false,
};

const PERMISSION_GROUPS = [
  {
    title: 'Dokumentenzugriff',
    icon: FileText,
    permissions: [
      { key: 'can_view_angebote', label: 'Angebote einsehen' },
      { key: 'can_view_auftraege', label: 'Aufträge einsehen' },
      { key: 'can_view_rechnungen', label: 'Rechnungen einsehen' },
      { key: 'can_view_abnahmen', label: 'Abnahmeprotokolle einsehen' },
      { key: 'can_view_berichte', label: 'Berichte & Strategiepläne einsehen' },
      { key: 'can_view_vertraege', label: 'Verträge einsehen' },
    ]
  },
  {
    title: 'Projektzugriff',
    icon: FolderOpen,
    permissions: [
      { key: 'can_view_all_projects', label: 'Alle Projekte sehen (sonst nur zugewiesene)' },
    ]
  },
  {
    title: 'Finanzdaten',
    icon: Euro,
    permissions: [
      { key: 'can_view_financials', label: 'Preise, Beträge & Kalkulationen einsehen' },
      { key: 'can_view_commissions', label: 'Provisionen einsehen' },
    ]
  },
  {
    title: 'Export & Download',
    icon: Download,
    permissions: [
      { key: 'can_export_data', label: 'Daten exportieren (CSV, Excel)' },
      { key: 'can_download_pdfs', label: 'PDF-Dokumente herunterladen' },
    ]
  },
  {
    title: 'Erstellen & Bearbeiten',
    icon: Shield,
    permissions: [
      { key: 'can_create_offers', label: 'Angebote erstellen' },
      { key: 'can_create_invoices', label: 'Rechnungen erstellen' },
      { key: 'can_edit_products', label: 'Artikelstamm bearbeiten' },
    ]
  }
];

interface PermissionManagementProps {
  userId: string;
  userName: string;
  userRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PermissionManagement({ userId, userName, userRole, open, onOpenChange }: PermissionManagementProps) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<UserPermissions>({ user_id: userId, ...DEFAULT_PERMISSIONS });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && userId) {
      loadPermissions();
    }
  }, [open, userId]);

  const loadPermissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPermissions({ user_id: userId, ...data });
      } else {
        // No permissions yet - use defaults based on role
        const defaults = getRoleDefaults(userRole);
        setPermissions({ user_id: userId, ...defaults });
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDefaults = (role: string): Omit<UserPermissions, 'user_id'> => {
    if (role === 'admin') {
      return Object.fromEntries(Object.keys(DEFAULT_PERMISSIONS).map(k => [k, true])) as any;
    }
    if (role === 'mitarbeiter') {
      return {
        ...DEFAULT_PERMISSIONS,
        can_view_angebote: true, can_view_auftraege: true, can_view_rechnungen: true,
        can_view_abnahmen: true, can_view_berichte: true, can_view_vertraege: true,
        can_view_all_projects: true, can_export_data: true, can_download_pdfs: true,
        can_create_offers: true, can_create_invoices: true,
      };
    }
    if (role === 'produktion') {
      return { ...DEFAULT_PERMISSIONS, can_download_pdfs: true };
    }
    if (role === 'kunde') {
      return { ...DEFAULT_PERMISSIONS, can_view_angebote: true, can_view_auftraege: true, can_view_rechnungen: true, can_view_abnahmen: true, can_download_pdfs: true };
    }
    if (role === 'partner') {
      return { ...DEFAULT_PERMISSIONS, can_view_commissions: true, can_download_pdfs: true };
    }
    return DEFAULT_PERMISSIONS;
  };

  const handleToggle = (key: string) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key as keyof UserPermissions] }));
  };

  const handleSelectAll = (group: typeof PERMISSION_GROUPS[0]) => {
    const allTrue = group.permissions.every(p => permissions[p.key as keyof UserPermissions]);
    const updates: any = {};
    group.permissions.forEach(p => { updates[p.key] = !allTrue; });
    setPermissions(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { user_id, ...permData } = permissions;

      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          ...permData,
          granted_by: user?.id,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({ title: 'Gespeichert', description: `Berechtigungen für ${userName} wurden aktualisiert.` });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({ title: 'Fehler', description: 'Berechtigungen konnten nicht gespeichert werden.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyRoleDefaults = () => {
    const defaults = getRoleDefaults(userRole);
    setPermissions({ user_id: userId, ...defaults });
    toast({ title: 'Hinweis', description: `Standard-Berechtigungen für "${userRole}" angewendet.` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Berechtigungen: {userName}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{userRole}</Badge>
            <Button variant="ghost" size="sm" onClick={handleApplyRoleDefaults} className="text-xs">
              Rollen-Standard anwenden
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {PERMISSION_GROUPS.map((group) => {
              const GroupIcon = group.icon;
              const allChecked = group.permissions.every(p => permissions[p.key as keyof UserPermissions]);
              
              return (
                <Card key={group.title}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <GroupIcon className="h-4 w-4 text-muted-foreground" />
                        {group.title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAll(group)}
                        className="text-xs h-7"
                      >
                        {allChecked ? 'Alle abwählen' : 'Alle auswählen'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.permissions.map((perm) => (
                        <div key={perm.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`perm-${perm.key}`}
                            checked={permissions[perm.key as keyof UserPermissions] as boolean}
                            onCheckedChange={() => handleToggle(perm.key)}
                          />
                          <Label
                            htmlFor={`perm-${perm.key}`}
                            className="text-sm cursor-pointer"
                          >
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Speichern...' : 'Berechtigungen speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
