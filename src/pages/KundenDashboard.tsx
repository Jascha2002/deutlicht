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
  User, FileText, FolderOpen, Upload, Receipt, Package, 
  Plus, LayoutGrid
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CustomerProject {
  id: string;
  project_number: string;
  title: string;
  status: string;
  start_date: string | null;
  target_end_date: string | null;
  progress_percent: number | null;
}

interface CustomerOrder {
  id: string;
  order_number: string;
  title: string;
  status: string;
  amount_gross: number;
  order_date: string;
}

interface CustomerInvoice {
  id: string;
  invoice_number: string;
  title: string | null;
  status: string;
  amount_gross: number;
  due_date: string;
  paid_date: string | null;
}

interface CustomerDocument {
  id: string;
  file_name: string;
  file_type: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

const KundenDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [projects, setProjects] = useState<CustomerProject[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('sonstiges');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkCustomerAccess();
  }, []);

  const checkCustomerAccess = async () => {
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

      const userIsCustomer = roles?.some(r => r.role === 'kunde');
      const userIsAdmin = roles?.some(r => r.role === 'admin');
      const userIsMitarbeiter = roles?.some(r => r.role === 'mitarbeiter');

      if (userIsAdmin || userIsMitarbeiter) {
        navigate('/admin');
        return;
      }

      if (!userIsCustomer) {
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keinen Kundenzugang.',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setIsCustomer(true);

      // Get company_id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      const cId = profile?.company_id ?? null;
      setCompanyId(cId);

      await loadCustomerData(user.id, cId);

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

  const loadCustomerData = async (userId: string, cId: string | null) => {
    // Load documents uploaded by this customer
    const { data: docs } = await supabase
      .from('customer_documents')
      .select('*')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });

    setDocuments(docs || []);

    if (!cId) return;

    // Load company name
    const { data: company } = await supabase
      .from('crm_companies')
      .select('company_name')
      .eq('id', cId)
      .single();

    if (company) setCompanyName(company.company_name);

    // Load projects for this company
    const { data: projectData } = await supabase
      .from('crm_projects')
      .select('id, project_number, title, status, start_date, target_end_date, progress_percent')
      .eq('company_id', cId)
      .order('created_at', { ascending: false });

    setProjects(projectData || []);

    // Load orders for this company
    const { data: orderData } = await supabase
      .from('crm_orders')
      .select('id, order_number, title, status, amount_gross, order_date')
      .eq('company_id', cId)
      .order('created_at', { ascending: false });

    setOrders(orderData || []);

    // Load invoices for this company
    const { data: invoiceData } = await supabase
      .from('crm_invoices')
      .select('id, invoice_number, title, status, amount_gross, due_date, paid_date')
      .eq('company_id', cId)
      .order('created_at', { ascending: false });

    setInvoices(invoiceData || []);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Nicht angemeldet');

      const filePath = `${user.id}/${Date.now()}-${uploadFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('customer-uploads')
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      const { error: docError } = await supabase
        .from('customer_documents')
        .insert({
          uploaded_by: user.id,
          file_name: uploadFile.name,
          file_path: filePath,
          file_type: uploadFile.type.startsWith('image/') ? 'image' : 
                     uploadFile.type.startsWith('video/') ? 'video' : 
                     uploadFile.type === 'application/pdf' ? 'document' : 'text',
          file_size: uploadFile.size,
          mime_type: uploadFile.type,
          category: uploadCategory,
          description: uploadDescription,
          status: 'neu'
        });

      if (docError) throw docError;

      toast({
        title: 'Erfolgreich hochgeladen',
        description: 'Ihre Datei wurde erfolgreich übermittelt.'
      });

      setShowUploadDialog(false);
      setUploadFile(null);
      setUploadDescription('');
      setUploadCategory('sonstiges');
      
      await loadCustomerData(user.id, companyId);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Fehler beim Upload',
        description: error.message || 'Die Datei konnte nicht hochgeladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'neu': { variant: 'default', label: 'Neu' },
      'planung': { variant: 'secondary', label: 'Planung' },
      'in_bearbeitung': { variant: 'secondary', label: 'In Bearbeitung' },
      'aktiv': { variant: 'default', label: 'Aktiv' },
      'abgeschlossen': { variant: 'outline', label: 'Abgeschlossen' },
      'offen': { variant: 'destructive', label: 'Offen' },
      'bezahlt': { variant: 'outline', label: 'Bezahlt' },
      'teilbezahlt': { variant: 'secondary', label: 'Teilbezahlt' },
      'ueberfaellig': { variant: 'destructive', label: 'Überfällig' },
      'gesehen': { variant: 'secondary', label: 'Gesehen' },
      'verarbeitet': { variant: 'outline', label: 'Verarbeitet' },
      'entwurf': { variant: 'secondary', label: 'Entwurf' },
      'gesendet': { variant: 'default', label: 'Gesendet' },
      'bestaetigt': { variant: 'outline', label: 'Bestätigt' },
      'storniert': { variant: 'destructive', label: 'Storniert' },
    };
    
    const config = statusConfig[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isCustomer) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Mein Bereich | DeutLicht</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navigation />
      
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mein Kundenbereich</h1>
                <p className="text-muted-foreground">
                  {companyName ? `${companyName} — ` : ''}Ihre Projekte, Aufträge und Dokumente
                </p>
              </div>
            </div>
            <Button onClick={() => setShowUploadDialog(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Dokument hochladen
            </Button>
          </div>

          {/* No company linked notice */}
          {!companyId && (
            <Card className="mb-8 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Firma noch nicht verknüpft</p>
                  <p className="text-sm text-muted-foreground">
                    Ihr Konto wird in Kürze mit Ihrer Firma verbunden. Danach sehen Sie hier Projekte, Aufträge und Rechnungen.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Projekte</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Aufträge</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                  <p className="text-sm text-muted-foreground">Rechnungen</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Dokumente</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vorlagen Card */}
          <Card 
            className="mb-8 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/dashboard/vorlagen')}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Ihre Vorlagen</p>
                  <p className="text-sm text-muted-foreground">Website-Designs die wir für Sie erstellt haben</p>
                </div>
              </div>
              <Badge className="rounded-full">Ansehen</Badge>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="projects" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Projekte
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                Aufträge
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-2">
                <Receipt className="w-4 h-4" />
                Rechnungen
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <FileText className="w-4 h-4" />
                Meine Dokumente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Ihre Projekte</CardTitle>
                  <CardDescription>Übersicht Ihrer laufenden und abgeschlossenen Projekte</CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{companyId ? 'Noch keine Projekte vorhanden' : 'Firma wird noch verknüpft'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map(project => (
                        <div key={project.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{project.title}</p>
                              <p className="text-sm text-muted-foreground">{project.project_number}</p>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                          {project.progress_percent != null && (
                            <div className="flex items-center gap-3">
                              <Progress value={project.progress_percent} className="flex-1 h-2" />
                              <span className="text-sm text-muted-foreground font-medium w-10 text-right">
                                {project.progress_percent}%
                              </span>
                            </div>
                          )}
                          {(project.start_date || project.target_end_date) && (
                            <p className="text-xs text-muted-foreground">
                              {project.start_date && `Start: ${new Date(project.start_date).toLocaleDateString('de-DE')}`}
                              {project.start_date && project.target_end_date && ' • '}
                              {project.target_end_date && `Ziel: ${new Date(project.target_end_date).toLocaleDateString('de-DE')}`}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Ihre Aufträge</CardTitle>
                  <CardDescription>Alle erteilten Aufträge im Überblick</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{companyId ? 'Noch keine Aufträge vorhanden' : 'Firma wird noch verknüpft'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.order_number} • {new Date(order.order_date).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <p className="font-medium">
                              {order.amount_gross?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Ihre Rechnungen</CardTitle>
                  <CardDescription>Übersicht aller Rechnungen und Zahlungsstatus</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoices.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{companyId ? 'Noch keine Rechnungen vorhanden' : 'Firma wird noch verknüpft'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invoices.map(invoice => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.invoice_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.title && `${invoice.title} • `}
                              Fällig: {new Date(invoice.due_date).toLocaleDateString('de-DE')}
                              {invoice.paid_date && ` • Bezahlt: ${new Date(invoice.paid_date).toLocaleDateString('de-DE')}`}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <p className="font-medium">
                              {invoice.amount_gross?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                            {getStatusBadge(invoice.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Meine hochgeladenen Dokumente</CardTitle>
                    <CardDescription>Briefings, Inhalte und Feedback für Ihre Projekte</CardDescription>
                  </div>
                  <Button onClick={() => setShowUploadDialog(true)} size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Hochladen
                  </Button>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-4">Noch keine Dokumente hochgeladen</p>
                      <Button onClick={() => setShowUploadDialog(true)} variant="outline">
                        Erstes Dokument hochladen
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.file_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.category && <span className="capitalize">{doc.category} • </span>}
                                {new Date(doc.created_at).toLocaleDateString('de-DE')}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Datei auswählen</Label>
              <Input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Erlaubt: Bilder, Videos, PDF, Word, Text (max. 50MB)
              </p>
            </div>
            <div>
              <Label>Kategorie</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="briefing">Briefing</SelectItem>
                  <SelectItem value="content">Inhalte (Texte, Bilder)</SelectItem>
                  <SelectItem value="feedback">Feedback / Korrektur</SelectItem>
                  <SelectItem value="sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Beschreibung (optional)</Label>
              <Textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Kurze Beschreibung zur Datei..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleFileUpload} disabled={!uploadFile || isUploading}>
              {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default KundenDashboard;
