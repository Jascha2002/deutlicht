import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Wrench, FolderOpen, Upload, FileText, Clock, 
  CheckCircle, PlayCircle, ArrowLeft, Calendar, Download
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProjectAssignment {
  id: string;
  project_id: string;
  role_in_project: string | null;
  access_level: string;
  project: {
    id: string;
    project_number: string;
    title: string;
    description: string | null;
    status: string;
    start_date: string | null;
    target_end_date: string | null;
    services_included: string[] | null;
  } | null;
  company: {
    company_name: string;
  } | null;
}

interface ProjectAsset {
  id: string;
  file_name: string;
  file_type: string;
  category: string | null;
  uploaded_at: string;
  file_path: string;
}

const ProduktionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectAssets, setProjectAssets] = useState<ProjectAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  useEffect(() => {
    checkProductionAccess();
  }, []);

  const checkProductionAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const userIsProduction = roles?.some(r => r.role === 'produktion');
      const userIsAdmin = roles?.some(r => r.role === 'admin');
      const userIsMitarbeiter = roles?.some(r => r.role === 'mitarbeiter');

      // Admins and employees should use admin dashboard
      if (userIsAdmin || userIsMitarbeiter) {
        navigate('/admin');
        return;
      }

      if (!userIsProduction) {
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keinen Produktionszugang.',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setIsProduction(true);
      await loadAssignments(user.id);

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

  const loadAssignments = async (userId: string) => {
    // Load projects assigned to this production user
    const { data, error } = await supabase
      .from('project_team_assignments')
      .select(`
        id,
        project_id,
        role_in_project,
        access_level,
        project:crm_projects(
          id,
          project_number,
          title,
          description,
          status,
          start_date,
          target_end_date,
          services_included,
          company_id
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading assignments:', error);
      return;
    }

    // Load company names separately
    const projectsWithCompanies = await Promise.all(
      (data || []).map(async (assignment: any) => {
        if (assignment.project?.company_id) {
          const { data: companyData } = await supabase
            .from('crm_companies')
            .select('company_name')
            .eq('id', assignment.project.company_id)
            .single();
          return { ...assignment, company: companyData };
        }
        return { ...assignment, company: null };
      })
    );

    setAssignments(projectsWithCompanies);
    
    // Auto-select first project
    if (projectsWithCompanies.length > 0 && projectsWithCompanies[0].project_id) {
      setSelectedProject(projectsWithCompanies[0].project_id);
      loadProjectAssets(projectsWithCompanies[0].project_id);
    }
  };

  const loadProjectAssets = async (projectId: string) => {
    setIsLoadingAssets(true);
    try {
      const { data, error } = await supabase
        .from('project_assets')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjectAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    loadProjectAssets(projectId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, icon: any }> = {
      'planung': { variant: 'secondary', label: 'Planung', icon: Clock },
      'aktiv': { variant: 'default', label: 'Aktiv', icon: PlayCircle },
      'pausiert': { variant: 'outline', label: 'Pausiert', icon: Clock },
      'abgeschlossen': { variant: 'outline', label: 'Abgeschlossen', icon: CheckCircle },
    };
    
    const config = statusConfig[status] || { variant: 'secondary' as const, label: status, icon: Clock };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType === 'image') return '🖼️';
    if (fileType === 'video') return '🎬';
    if (fileType === 'document') return '📄';
    return '📁';
  };

  const selectedProjectData = assignments.find(a => a.project_id === selectedProject);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isProduction) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Produktions-Dashboard | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Produktions-Dashboard</h1>
              <p className="text-muted-foreground">Ihre zugewiesenen Projekte und Aufgaben</p>
            </div>
          </div>

          {/* Info Banner - No Prices Visible */}
          <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Wrench className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <p className="text-sm text-orange-800 dark:text-orange-300">
                Hier sehen Sie nur die Ihnen zugewiesenen Projekte und deren Leistungsinhalte. 
                Preise, Kalkulationen und interne Dokumente sind nicht sichtbar.
              </p>
            </CardContent>
          </Card>

          {assignments.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Keine Projekte zugewiesen</h3>
                <p className="text-muted-foreground">
                  Ihnen wurden noch keine Projekte zur Bearbeitung zugewiesen.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Project List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Meine Projekte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {assignments.map((assignment) => (
                        <button
                          key={assignment.id}
                          onClick={() => handleProjectSelect(assignment.project_id)}
                          className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                            selectedProject === assignment.project_id ? 'bg-accent/10 border-l-2 border-accent' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{assignment.project?.title}</p>
                              <p className="text-xs text-muted-foreground">{assignment.project?.project_number}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {assignment.company?.company_name || 'Kein Kunde'}
                              </p>
                            </div>
                            {assignment.project?.status && getStatusBadge(assignment.project.status)}
                          </div>
                          {assignment.role_in_project && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {assignment.role_in_project}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Project Details */}
              <div className="lg:col-span-2">
                {selectedProjectData ? (
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="assets" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Dateien
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{selectedProjectData.project?.title}</CardTitle>
                              <CardDescription>
                                {selectedProjectData.project?.project_number} • {selectedProjectData.company?.company_name}
                              </CardDescription>
                            </div>
                            {selectedProjectData.project?.status && getStatusBadge(selectedProjectData.project.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Timeline */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Calendar className="w-4 h-4" />
                                Startdatum
                              </div>
                              <p className="font-medium">
                                {selectedProjectData.project?.start_date 
                                  ? format(new Date(selectedProjectData.project.start_date), 'dd.MM.yyyy', { locale: de })
                                  : 'Nicht festgelegt'}
                              </p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Calendar className="w-4 h-4" />
                                Zieldatum
                              </div>
                              <p className="font-medium">
                                {selectedProjectData.project?.target_end_date 
                                  ? format(new Date(selectedProjectData.project.target_end_date), 'dd.MM.yyyy', { locale: de })
                                  : 'Nicht festgelegt'}
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          {selectedProjectData.project?.description && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Projektbeschreibung</h4>
                              <p className="text-muted-foreground">{selectedProjectData.project.description}</p>
                            </div>
                          )}

                          {/* Services (without prices!) */}
                          {selectedProjectData.project?.services_included && selectedProjectData.project.services_included.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Beauftragte Leistungen</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedProjectData.project.services_included.map((service, idx) => (
                                  <Badge key={idx} variant="secondary">{service}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Role Info */}
                          <div className="p-4 border rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Ihre Rolle</h4>
                            <p className="text-muted-foreground">
                              {selectedProjectData.role_in_project || 'Produktion'} 
                              <span className="mx-2">•</span>
                              Zugriff: {selectedProjectData.access_level === 'admin' ? 'Vollzugriff' : 
                                        selectedProjectData.access_level === 'write' ? 'Bearbeiten' : 'Lesen'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="assets">
                      <Card>
                        <CardHeader>
                          <CardTitle>Projektdateien</CardTitle>
                          <CardDescription>
                            Briefings, Vorlagen und Materialien für dieses Projekt
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingAssets ? (
                            <div className="py-8 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                            </div>
                          ) : projectAssets.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>Noch keine Dateien für dieses Projekt</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {projectAssets.map((asset) => (
                                <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getFileTypeIcon(asset.file_type)}</span>
                                    <div>
                                      <p className="font-medium">{asset.file_name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {format(new Date(asset.uploaded_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                                        {asset.category && ` • ${asset.category}`}
                                      </p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Wählen Sie ein Projekt aus der Liste</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ProduktionDashboard;
