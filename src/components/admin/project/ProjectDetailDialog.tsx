import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  FileText, Receipt, FolderOpen, BarChart3, Euro, Calendar,
  CheckCircle, Clock, Edit, Save, ExternalLink, Users, Briefcase,
  Plus, Trash2, UserPlus
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type ProjectStatus = 'planung' | 'aktiv' | 'pausiert' | 'abgeschlossen' | 'abgebrochen';

interface CrmProject {
  id: string;
  project_number: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  target_end_date: string | null;
  budget_setup: number;
  budget_monthly: number;
  total_invoiced: number;
  total_paid: number;
  progress_percent?: number;
  services_included: string[] | null;
  created_at: string;
  company_id: string | null;
  lead_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_leads?: { lead_number: string; company_name: string | null } | null;
}

interface RelatedDocument {
  id: string;
  number: string;
  title: string;
  status: string;
  amount: number;
  date: string;
  type: 'offer' | 'order' | 'invoice' | 'report' | 'protocol';
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planung: { label: 'Planung', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  aktiv: { label: 'Aktiv', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  pausiert: { label: 'Pausiert', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  abgeschlossen: { label: 'Abgeschlossen', className: 'bg-muted text-muted-foreground' },
  abgebrochen: { label: 'Abgebrochen', className: 'bg-destructive/10 text-destructive' }
};

interface ProjectDetailDialogProps {
  project: CrmProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function ProjectDetailDialog({ project, open, onOpenChange, onUpdate }: ProjectDetailDialogProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<CrmProject>>({});
  const [activeTab, setActiveTab] = useState('overview');
  
  // Related documents
  const [offers, setOffers] = useState<RelatedDocument[]>([]);
  const [orders, setOrders] = useState<RelatedDocument[]>([]);
  const [invoices, setInvoices] = useState<RelatedDocument[]>([]);
  const [reports, setReports] = useState<RelatedDocument[]>([]);
  const [protocols, setProtocols] = useState<RelatedDocument[]>([]);

  // Team assignments
  const [teamMembers, setTeamMembers] = useState<{ id: string; user_id: string; role_in_project: string; full_name: string; email: string }[]>([]);
  const [availableUsers, setAvailableUsers] = useState<{ id: string; full_name: string; email: string; roles: string[] }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('produktion');

  useEffect(() => {
    if (project && open) {
      setEditedProject({
        title: project.title,
        description: project.description,
        status: project.status,
        budget_setup: project.budget_setup,
        budget_monthly: project.budget_monthly
      });
      loadRelatedDocuments();
      loadTeamMembers();
      loadAvailableUsers();
    }
  }, [project, open]);

  const loadRelatedDocuments = async () => {
    if (!project) return;
    
    try {
      // Load all related documents in parallel
      const [offersRes, ordersRes, invoicesRes, reportsRes, protocolsRes] = await Promise.all([
        supabase.from('crm_offers').select('id, offer_number, title, status, amount_total, created_at').eq('project_id', project.id),
        supabase.from('crm_orders').select('id, order_number, title, status, amount_net, created_at').eq('project_id', project.id),
        supabase.from('crm_invoices').select('id, invoice_number, title, status, amount_gross, invoice_date').eq('project_id', project.id),
        supabase.from('crm_reports').select('id, report_number, title, status, created_at').eq('project_id', project.id),
        supabase.from('crm_acceptance_protocols').select('id, protocol_number, title, status, acceptance_date').eq('project_id', project.id)
      ]);

      if (offersRes.data) {
        setOffers(offersRes.data.map(o => ({
          id: o.id,
          number: o.offer_number || '-',
          title: o.title,
          status: o.status,
          amount: o.amount_total || 0,
          date: o.created_at,
          type: 'offer' as const
        })));
      }

      if (ordersRes.data) {
        setOrders(ordersRes.data.map(o => ({
          id: o.id,
          number: o.order_number || '-',
          title: o.title,
          status: o.status,
          amount: o.amount_net || 0,
          date: o.created_at,
          type: 'order' as const
        })));
      }

      if (invoicesRes.data) {
        setInvoices(invoicesRes.data.map(i => ({
          id: i.id,
          number: i.invoice_number || '-',
          title: i.title,
          status: i.status,
          amount: i.amount_gross || 0,
          date: i.invoice_date,
          type: 'invoice' as const
        })));
      }

      if (reportsRes.data) {
        setReports(reportsRes.data.map(r => ({
          id: r.id,
          number: r.report_number || '-',
          title: r.title,
          status: r.status,
          amount: 0,
          date: r.created_at,
          type: 'report' as const
        })));
      }

      if (protocolsRes.data) {
        setProtocols(protocolsRes.data.map(p => ({
          id: p.id,
          number: p.protocol_number || '-',
          title: p.title,
          status: p.status,
          amount: 0,
          date: p.acceptance_date,
          type: 'protocol' as const
        })));
      }
    } catch (error) {
      console.error('Error loading related documents:', error);
    }
  };

  const loadTeamMembers = async () => {
    if (!project) return;
    try {
      const { data, error } = await supabase
        .from('project_team_assignments')
        .select('id, user_id, role_in_project')
        .eq('project_id', project.id);
      
      if (error) throw error;
      
      // Get profile info for each user
      const members = [];
      for (const assignment of (data || [])) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('user_id', assignment.user_id)
          .single();
        members.push({
          id: assignment.id,
          user_id: assignment.user_id,
          role_in_project: assignment.role_in_project || 'produktion',
          full_name: profile?.full_name || '',
          email: profile?.email || ''
        });
      }
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const { data: allRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role');
      if (error) throw error;

      // Get unique user IDs for produktion, mitarbeiter, freelancer roles
      const relevantRoles = ['produktion', 'mitarbeiter', 'freelancer_eu', 'freelancer_drittland', 'admin'];
      const userMap = new Map<string, string[]>();
      for (const r of (allRoles || [])) {
        if (relevantRoles.includes(r.role)) {
          const existing = userMap.get(r.user_id) || [];
          existing.push(r.role);
          userMap.set(r.user_id, existing);
        }
      }

      const users = [];
      for (const [userId, roles] of userMap.entries()) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('user_id', userId)
          .single();
        if (profile) {
          users.push({ id: userId, full_name: profile.full_name || profile.email, email: profile.email, roles });
        }
      }
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const handleAddTeamMember = async () => {
    if (!project || !selectedUserId) return;
    try {
      const { error } = await supabase.from('project_team_assignments').insert({
        project_id: project.id,
        user_id: selectedUserId,
        role_in_project: selectedRole,
        access_level: selectedRole === 'produktion' ? 'limited' : 'full'
      });
      if (error) throw error;
      toast({ title: 'Erfolg', description: 'Teammitglied zugewiesen.' });
      setSelectedUserId('');
      loadTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({ title: 'Fehler', description: 'Zuweisung fehlgeschlagen.', variant: 'destructive' });
    }
  };

  const handleRemoveTeamMember = async (assignmentId: string) => {
    try {
      const { error } = await supabase.from('project_team_assignments').delete().eq('id', assignmentId);
      if (error) throw error;
      toast({ title: 'Entfernt', description: 'Teammitglied wurde entfernt.' });
      loadTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({ title: 'Fehler', description: 'Entfernen fehlgeschlagen.', variant: 'destructive' });
    }
  };

  if (!project) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('crm_projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          status: editedProject.status,
          budget_setup: editedProject.budget_setup,
          budget_monthly: editedProject.budget_monthly
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({ title: 'Gespeichert', description: 'Projekt wurde aktualisiert.' });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({ title: 'Fehler', description: 'Projekt konnte nicht gespeichert werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDocumentTable = (documents: RelatedDocument[], emptyMessage: string) => {
    if (documents.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nummer</TableHead>
            <TableHead>Titel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Betrag</TableHead>
            <TableHead>Datum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{doc.number}</TableCell>
              <TableCell>{doc.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{doc.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {doc.amount > 0 ? formatCurrency(doc.amount) : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(doc.date), 'dd.MM.yyyy', { locale: de })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const progressPercent = project.progress_percent || 
    (project.status === 'abgeschlossen' ? 100 : 
     project.status === 'aktiv' ? 50 : 
     project.status === 'planung' ? 10 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <Input
                  value={editedProject.title || ''}
                  onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
                  className="text-xl font-semibold"
                />
              ) : (
                <DialogTitle className="text-xl">{project.title}</DialogTitle>
              )}
              <p className="text-muted-foreground">{project.project_number}</p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Select 
                  value={editedProject.status} 
                  onValueChange={(v) => setEditedProject({ ...editedProject, status: v as ProjectStatus })}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={statusConfig[project.status]?.className}>
                  {statusConfig[project.status]?.label}
                </Badge>
              )}
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Bearbeiten
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="gap-1">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Übersicht</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Angebote</span>
              {offers.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{offers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Aufträge</span>
              {orders.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{orders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Rechnungen</span>
              {invoices.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{invoices.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Berichte</span>
              {reports.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{reports.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="protocols" className="gap-1">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Abnahmen</span>
              {protocols.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{protocols.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
              {teamMembers.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{teamMembers.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Euro className="h-6 w-6 mx-auto text-primary mb-2" />
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedProject.budget_setup || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, budget_setup: parseFloat(e.target.value) || 0 })}
                      className="text-center"
                    />
                  ) : (
                    <p className="text-lg font-bold">{formatCurrency(project.budget_setup || 0)}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Budget Einmalig</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedProject.budget_monthly || 0}
                      onChange={(e) => setEditedProject({ ...editedProject, budget_monthly: parseFloat(e.target.value) || 0 })}
                      className="text-center"
                    />
                  ) : (
                    <p className="text-lg font-bold">{formatCurrency(project.budget_monthly || 0)}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Monatlich</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="h-6 w-6 mx-auto text-green-500 mb-2" />
                  <p className="text-lg font-bold">{formatCurrency(project.total_invoiced || 0)}</p>
                  <p className="text-xs text-muted-foreground">Abgerechnet</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-accent mb-2" />
                  <p className="text-lg font-bold">{formatCurrency(project.total_paid || 0)}</p>
                  <p className="text-xs text-muted-foreground">Bezahlt</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projektfortschritt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={progressPercent} className="flex-1" />
                  <span className="text-lg font-bold">{progressPercent}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Kunde</Label>
                <p className="font-medium">
                  {project.crm_companies?.company_name || project.crm_leads?.company_name || '-'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Erstellt am</Label>
                <p className="font-medium">
                  {format(new Date(project.created_at), 'dd.MM.yyyy', { locale: de })}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-muted-foreground">Beschreibung</Label>
              {isEditing ? (
                <Textarea
                  value={editedProject.description || ''}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground mt-1">
                  {project.description || 'Keine Beschreibung'}
                </p>
              )}
            </div>

            {/* Services */}
            {project.services_included && project.services_included.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Enthaltene Leistungen</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.services_included.map((service, idx) => (
                    <Badge key={idx} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="offers" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Angebote
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentTable(offers, 'Keine Angebote für dieses Projekt vorhanden.')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Aufträge
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentTable(orders, 'Keine Aufträge für dieses Projekt vorhanden.')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Rechnungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentTable(invoices, 'Keine Rechnungen für dieses Projekt vorhanden.')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Berichte
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentTable(reports, 'Keine Berichte für dieses Projekt vorhanden.')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Abnahmeprotokolle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderDocumentTable(protocols, 'Keine Abnahmeprotokolle für dieses Projekt vorhanden.')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teamzuordnung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add member form */}
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <Label className="text-xs text-muted-foreground">Mitarbeiter</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mitarbeiter auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers
                          .filter(u => !teamMembers.some(m => m.user_id === u.id))
                          .map(u => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.full_name} ({u.roles.join(', ')})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-[160px]">
                    <Label className="text-xs text-muted-foreground">Rolle im Projekt</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produktion">Produktion</SelectItem>
                        <SelectItem value="projektleitung">Projektleitung</SelectItem>
                        <SelectItem value="mitarbeiter">Mitarbeiter</SelectItem>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddTeamMember} disabled={!selectedUserId} className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    Zuweisen
                  </Button>
                </div>

                {/* Current team members */}
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Noch keine Teammitglieder zugewiesen.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>E-Mail</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.full_name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.role_in_project}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-2 mt-6">
            <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              Speichern
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
