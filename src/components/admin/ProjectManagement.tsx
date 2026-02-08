import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Search, Plus, FolderOpen, Building2, FileText, Receipt, 
  BarChart3, Calendar, Euro, ArrowRight, Eye, Trash2, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ProjectDetailDialog } from './project';

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
  services_included: string[] | null;
  created_at: string;
  company_id: string | null;
  lead_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_leads?: { lead_number: string; company_name: string | null } | null;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planung: { label: 'Planung', className: 'bg-blue-100 text-blue-800' },
  aktiv: { label: 'Aktiv', className: 'bg-green-100 text-green-800' },
  pausiert: { label: 'Pausiert', className: 'bg-yellow-100 text-yellow-800' },
  abgeschlossen: { label: 'Abgeschlossen', className: 'bg-gray-100 text-gray-800' },
  abgebrochen: { label: 'Abgebrochen', className: 'bg-red-100 text-red-800' }
};

export function ProjectManagement() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<CrmProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<CrmProject | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planung' as ProjectStatus,
    budget_setup: 0,
    budget_monthly: 0
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_projects')
        .select(`
          *,
          crm_companies(company_name),
          crm_leads(lead_number, company_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Fehler',
        description: 'Projekte konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      toast({ title: 'Fehler', description: 'Bitte Projekttitel eingeben.', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('crm_projects').insert({
        title: newProject.title,
        description: newProject.description || null,
        status: newProject.status,
        budget_setup: newProject.budget_setup,
        budget_monthly: newProject.budget_monthly,
        created_by: user?.id
      });

      if (error) throw error;

      toast({ title: 'Erfolg', description: 'Projekt wurde erstellt.' });
      setIsCreateOpen(false);
      setNewProject({ title: '', description: '', status: 'planung', budget_setup: 0, budget_monthly: 0 });
      loadProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({ title: 'Fehler', description: 'Projekt konnte nicht erstellt werden.', variant: 'destructive' });
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    try {
      // Delete related data first
      await supabase.from('crm_orders').delete().eq('project_id', deleteProjectId);
      await supabase.from('crm_offers').delete().eq('project_id', deleteProjectId);
      await supabase.from('crm_invoices').delete().eq('project_id', deleteProjectId);
      await supabase.from('crm_acceptance_protocols').delete().eq('project_id', deleteProjectId);
      await supabase.from('crm_calendar_events').delete().eq('project_id', deleteProjectId);
      
      const { error } = await supabase.from('crm_projects').delete().eq('id', deleteProjectId);
      if (error) throw error;
      
      toast({
        title: 'Projekt gelöscht',
        description: 'Das Projekt und alle zugehörigen Daten wurden entfernt.'
      });
      setDeleteProjectId(null);
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Fehler',
        description: 'Projekt konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Stats
  const stats = {
    total: projects.length,
    aktiv: projects.filter(p => p.status === 'aktiv').length,
    planung: projects.filter(p => p.status === 'planung').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget_setup || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Projekte gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">{stats.aktiv}</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.aktiv}</p>
                <p className="text-sm text-muted-foreground">Aktiv</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">{stats.planung}</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.planung}</p>
                <p className="text-sm text-muted-foreground">In Planung</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Euro className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</p>
                <p className="text-sm text-muted-foreground">Gesamtbudget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Projekte suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neues Projekt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Projekt erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Projekttitel *</Label>
                <Input
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="z.B. Website Redesign für Musterfirma"
                />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Projektbeschreibung..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Budget Einmalig (€)</Label>
                  <Input
                    type="number"
                    value={newProject.budget_setup}
                    onChange={(e) => setNewProject(prev => ({ ...prev, budget_setup: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Budget Monatlich (€)</Label>
                  <Input
                    type="number"
                    value={newProject.budget_monthly}
                    onChange={(e) => setNewProject(prev => ({ ...prev, budget_monthly: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateProject} className="w-full">
                Projekt erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projekt</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Abgerechnet</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Keine Projekte gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{project.project_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.crm_companies?.company_name || project.crm_leads?.company_name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[project.status]?.className}>
                      {statusConfig[project.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(project.budget_setup || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(project.total_invoiced || 0)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.created_at), 'dd.MM.yyyy', { locale: de })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedProject(project)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); setDeleteProjectId(project.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <ProjectDetailDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onUpdate={() => {
          loadProjects();
          setSelectedProject(null);
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Projekt löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Das Projekt und alle zugehörigen Aufträge, Angebote, Rechnungen und Protokolle werden unwiderruflich gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Endgültig löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
