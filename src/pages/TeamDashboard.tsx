import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  FolderOpen, Image, FileText, Video, Download, Upload, 
  Search, ArrowLeft, Users, Calendar, Euro, Building2,
  File, Folder, ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProjectAssignment {
  id: string;
  project_id: string;
  role_in_project: string;
  access_level: string;
  assigned_at: string;
  crm_projects: {
    id: string;
    project_number: string;
    title: string;
    description: string | null;
    status: string;
    start_date: string | null;
    target_end_date: string | null;
    budget_setup: number;
    budget_monthly: number;
    crm_companies: { company_name: string; id: string } | null;
  };
}

interface ProjectAsset {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  description: string | null;
  category: string | null;
  uploaded_at: string;
  uploaded_by: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  planung: { label: 'Planung', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  aktiv: { label: 'Aktiv', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  pausiert: { label: 'Pausiert', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  abgeschlossen: { label: 'Abgeschlossen', className: 'bg-muted text-muted-foreground' },
  abgebrochen: { label: 'Abgebrochen', className: 'bg-destructive/10 text-destructive' }
};

const roleLabels: Record<string, string> = {
  mitarbeiter: 'Mitarbeiter',
  freiberufler: 'Freiberufler',
  dienstleister: 'Dienstleister',
  produktion: 'Produktion'
};

const categoryIcons: Record<string, React.ReactNode> = {
  bilder: <Image className="h-4 w-4" />,
  texte: <FileText className="h-4 w-4" />,
  videos: <Video className="h-4 w-4" />,
  logo: <Image className="h-4 w-4" />,
  dokumente: <File className="h-4 w-4" />,
  sonstiges: <Folder className="h-4 w-4" />
};

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectAssignment | null>(null);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    checkAccessAndLoad();
  }, []);

  const checkAccessAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const userRoles = roles?.map(r => r.role) || [];
      const isAdmin = userRoles.includes('admin');
      const isMitarbeiter = userRoles.includes('mitarbeiter');
      const isProduktion = userRoles.includes('produktion');
      
      if (isAdmin) {
        setUserRole('admin');
      } else if (isMitarbeiter) {
        setUserRole('mitarbeiter');
      } else if (isProduktion) {
        setUserRole('produktion');
      }

      // Load project assignments
      const { data: assignmentsData, error } = await supabase
        .from('project_team_assignments')
        .select(`
          id,
          project_id,
          role_in_project,
          access_level,
          assigned_at,
          crm_projects (
            id,
            project_number,
            title,
            description,
            status,
            start_date,
            target_end_date,
            budget_setup,
            budget_monthly,
            crm_companies (id, company_name)
          )
        `)
        .eq('user_id', user.id)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        // If user is admin/mitarbeiter, load all projects instead
        if (isAdmin || isMitarbeiter) {
          const { data: allProjects } = await supabase
            .from('crm_projects')
            .select(`
              id,
              project_number,
              title,
              description,
              status,
              start_date,
              target_end_date,
              budget_setup,
              budget_monthly,
              crm_companies (id, company_name)
            `)
            .in('status', ['planung', 'aktiv', 'pausiert'])
            .order('created_at', { ascending: false });

          if (allProjects) {
            // Transform to assignment format
            const transformed: ProjectAssignment[] = allProjects.map(p => ({
              id: p.id,
              project_id: p.id,
              role_in_project: isAdmin ? 'admin' : 'mitarbeiter',
              access_level: isAdmin ? 'admin' : 'write',
              assigned_at: new Date().toISOString(),
              crm_projects: p as ProjectAssignment['crm_projects']
            }));
            setAssignments(transformed);
          }
        }
      } else {
        setAssignments(assignmentsData as ProjectAssignment[] || []);
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

  const loadProjectAssets = async (projectId: string) => {
    setAssetsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_assets')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast({
        title: 'Fehler',
        description: 'Assets konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setAssetsLoading(false);
    }
  };

  const handleSelectProject = (assignment: ProjectAssignment) => {
    setSelectedProject(assignment);
    loadProjectAssets(assignment.project_id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssignments = assignments.filter(a => 
    a.crm_projects?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.crm_projects?.project_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.crm_projects?.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAssets = assets.reduce((acc, asset) => {
    const category = asset.category || 'sonstiges';
    if (!acc[category]) acc[category] = [];
    acc[category].push(asset);
    return acc;
  }, {} as Record<string, ProjectAsset[]>);

  // Stats
  const stats = {
    total: assignments.length,
    aktiv: assignments.filter(a => a.crm_projects?.status === 'aktiv').length,
    planung: assignments.filter(a => a.crm_projects?.status === 'planung').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Team Dashboard | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft size={18} />
                Zurück
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Meine Projekte</h1>
                  <p className="text-muted-foreground">
                    Projektstände und Kundenmaterialien
                    {userRole && <Badge variant="outline" className="ml-2">{roleLabels[userRole] || userRole}</Badge>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <FolderOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Projekte</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 font-bold text-sm">{stats.aktiv}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.aktiv}</p>
                  <p className="text-sm text-muted-foreground">Aktiv</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">{stats.planung}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.planung}</p>
                  <p className="text-sm text-muted-foreground">Planung</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Projekte suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Project List */}
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Keine Projekte zugewiesen</h3>
                <p className="text-muted-foreground">
                  Sie haben aktuell keine Projektzuweisungen. Wenden Sie sich an Ihren Administrator.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssignments.map((assignment) => (
                <Card 
                  key={assignment.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectProject(assignment)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{assignment.crm_projects?.title}</CardTitle>
                        <CardDescription>{assignment.crm_projects?.project_number}</CardDescription>
                      </div>
                      <Badge className={statusConfig[assignment.crm_projects?.status || 'planung']?.className}>
                        {statusConfig[assignment.crm_projects?.status || 'planung']?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{assignment.crm_projects?.crm_companies?.company_name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Rolle: {roleLabels[assignment.role_in_project] || assignment.role_in_project}</span>
                    </div>
                    {assignment.crm_projects?.target_end_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Ziel: {format(new Date(assignment.crm_projects.target_end_date), 'dd.MM.yyyy', { locale: de })}</span>
                      </div>
                    )}
                    {(assignment.access_level === 'admin' || assignment.access_level === 'write') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(assignment.crm_projects?.budget_setup || 0)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Project Detail Dialog */}
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedProject && (
                <>
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-xl">{selectedProject.crm_projects?.title}</DialogTitle>
                        <p className="text-muted-foreground">
                          {selectedProject.crm_projects?.project_number} • {selectedProject.crm_projects?.crm_companies?.company_name}
                        </p>
                      </div>
                      <Badge className={statusConfig[selectedProject.crm_projects?.status || 'planung']?.className}>
                        {statusConfig[selectedProject.crm_projects?.status || 'planung']?.label}
                      </Badge>
                    </div>
                  </DialogHeader>

                  <Tabs defaultValue="overview" className="mt-4">
                    <TabsList>
                      <TabsTrigger value="overview">Übersicht</TabsTrigger>
                      <TabsTrigger value="assets">Materialien ({assets.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4 mt-4">
                      {/* Project Info */}
                      <Card>
                        <CardContent className="p-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Ihre Rolle</p>
                            <p className="font-medium">{roleLabels[selectedProject.role_in_project] || selectedProject.role_in_project}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Zugriff</p>
                            <p className="font-medium capitalize">{selectedProject.access_level}</p>
                          </div>
                          {selectedProject.crm_projects?.start_date && (
                            <div>
                              <p className="text-sm text-muted-foreground">Startdatum</p>
                              <p className="font-medium">
                                {format(new Date(selectedProject.crm_projects.start_date), 'dd.MM.yyyy', { locale: de })}
                              </p>
                            </div>
                          )}
                          {selectedProject.crm_projects?.target_end_date && (
                            <div>
                              <p className="text-sm text-muted-foreground">Zieldatum</p>
                              <p className="font-medium">
                                {format(new Date(selectedProject.crm_projects.target_end_date), 'dd.MM.yyyy', { locale: de })}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {selectedProject.crm_projects?.description && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Projektbeschreibung</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {selectedProject.crm_projects.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {(selectedProject.access_level === 'admin' || selectedProject.access_level === 'write') && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Budget</CardTitle>
                          </CardHeader>
                          <CardContent className="flex gap-8">
                            <div>
                              <p className="text-2xl font-bold">{formatCurrency(selectedProject.crm_projects?.budget_setup || 0)}</p>
                              <p className="text-sm text-muted-foreground">Einmalig</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{formatCurrency(selectedProject.crm_projects?.budget_monthly || 0)}</p>
                              <p className="text-sm text-muted-foreground">Monatlich</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="assets" className="mt-4">
                      {assetsLoading ? (
                        <div className="py-8 text-center">
                          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                        </div>
                      ) : assets.length === 0 ? (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-medium mb-2">Noch keine Materialien</h3>
                            <p className="text-sm text-muted-foreground">
                              Es wurden noch keine Materialien zu diesem Projekt hochgeladen.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-6">
                          {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
                            <Card key={category}>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  {categoryIcons[category] || <Folder className="h-4 w-4" />}
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                  <Badge variant="secondary" className="ml-2">{categoryAssets.length}</Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Datei</TableHead>
                                      <TableHead>Beschreibung</TableHead>
                                      <TableHead>Größe</TableHead>
                                      <TableHead>Hochgeladen</TableHead>
                                      <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {categoryAssets.map(asset => (
                                      <TableRow key={asset.id}>
                                        <TableCell className="font-medium">{asset.file_name}</TableCell>
                                        <TableCell className="text-muted-foreground">{asset.description || '—'}</TableCell>
                                        <TableCell>{formatFileSize(asset.file_size)}</TableCell>
                                        <TableCell>
                                          {format(new Date(asset.uploaded_at), 'dd.MM.yyyy', { locale: de })}
                                        </TableCell>
                                        <TableCell>
                                          <Button variant="ghost" size="icon" asChild>
                                            <a href={asset.file_path} target="_blank" rel="noopener noreferrer">
                                              <ExternalLink className="h-4 w-4" />
                                            </a>
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default TeamDashboard;
