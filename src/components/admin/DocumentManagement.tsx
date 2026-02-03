import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, Plus, FileText, FileCheck, FileX, Archive, 
  Download, Eye, Send, Folder, File, Trash2, AlertTriangle
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type DocumentType = 'angebot' | 'auftragsbestaetigung' | 'auftrag' | 'vertrag' | 
  'rechnung' | 'gutschrift' | 'mahnung' | 'abnahmeprotokoll' | 'bericht' | 'protokoll' | 'korrespondenz' | 'sonstiges';
type DocumentStatus = 'entwurf' | 'aktiv' | 'archiviert' | 'geloescht';

interface CrmDocument {
  id: string;
  document_number: string;
  document_type: DocumentType;
  title: string;
  description: string | null;
  version: number;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  status: DocumentStatus;
  sent_at: string | null;
  sent_to: string | null;
  tags: string[] | null;
  internal_notes: string | null;
  created_at: string;
  company_id: string | null;
  project_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
}

const typeConfig: Record<DocumentType, { label: string; icon: typeof FileText }> = {
  angebot: { label: 'Angebot', icon: FileText },
  auftragsbestaetigung: { label: 'Auftragsbestätigung', icon: FileCheck },
  auftrag: { label: 'Auftrag', icon: Folder },
  vertrag: { label: 'Vertrag', icon: FileText },
  rechnung: { label: 'Rechnung', icon: FileText },
  gutschrift: { label: 'Gutschrift', icon: FileText },
  mahnung: { label: 'Mahnung', icon: FileX },
  abnahmeprotokoll: { label: 'Abnahmeprotokoll', icon: FileCheck },
  bericht: { label: 'Bericht', icon: FileText },
  protokoll: { label: 'Protokoll', icon: FileText },
  korrespondenz: { label: 'Korrespondenz', icon: FileText },
  sonstiges: { label: 'Sonstiges', icon: File }
};

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  entwurf: { label: 'Entwurf', className: 'bg-muted text-muted-foreground' },
  aktiv: { label: 'Aktiv', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  archiviert: { label: 'Archiviert', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  geloescht: { label: 'Gelöscht', className: 'bg-destructive/10 text-destructive' }
};

export function DocumentManagement() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<CrmDocument[]>([]);
  const [companies, setCompanies] = useState<{ id: string; company_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<CrmDocument | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'sonstiges' as DocumentType,
    company_id: '',
    internal_notes: ''
  });

  useEffect(() => {
    loadDocuments();
    loadCompanies();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_documents')
        .select(`
          *,
          crm_companies(company_name),
          crm_projects(project_number, title)
        `)
        .neq('status', 'geloescht')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data || []) as CrmDocument[]);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Fehler',
        description: 'Dokumente konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_companies')
        .select('id, company_name')
        .order('company_name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const { error } = await supabase
        .from('crm_documents')
        .insert({
          title: formData.title,
          description: formData.description || null,
          document_type: formData.document_type,
          company_id: formData.company_id || null,
          internal_notes: formData.internal_notes || null,
          status: 'entwurf'
        });

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Dokument wurde erfolgreich erstellt.'
      });

      setIsCreateOpen(false);
      resetForm();
      loadDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatus = async (docId: string, newStatus: DocumentStatus) => {
    try {
      const { error } = await supabase
        .from('crm_documents')
        .update({ status: newStatus })
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Status wurde aktualisiert.'
      });

      loadDocuments();
      setIsDetailOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return;
    try {
      const { error } = await supabase
        .from('crm_documents')
        .delete()
        .eq('id', deleteDocId);

      if (error) throw error;

      toast({ title: 'Dokument gelöscht' });
      setDeleteDocId(null);
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      document_type: 'sonstiges',
      company_id: '',
      internal_notes: ''
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Stats by type
  const typeCounts = documents.reduce((acc, doc) => {
    acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{typeCounts['angebot'] || 0}</p>
                <p className="text-sm text-muted-foreground">Angebote</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{typeCounts['vertrag'] || 0}</p>
                <p className="text-sm text-muted-foreground">Verträge</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{typeCounts['rechnung'] || 0}</p>
                <p className="text-sm text-muted-foreground">Rechnungen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{typeCounts['abnahmeprotokoll'] || 0}</p>
                <p className="text-sm text-muted-foreground">Abnahmen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{documents.filter(d => d.status === 'archiviert').length}</p>
                <p className="text-sm text-muted-foreground">Archiviert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 flex-1 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Dokumente suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              {Object.entries(typeConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
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

        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Neues Dokument
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokument</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Dokumente gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((doc) => {
                const TypeIcon = typeConfig[doc.document_type]?.icon || FileText;
                
                return (
                  <TableRow 
                    key={doc.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">{doc.document_number}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeConfig[doc.document_type]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.crm_companies?.company_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[doc.status]?.className}>
                        {statusConfig[doc.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(doc.created_at), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); setDeleteDocId(doc.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neues Dokument erstellen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Titel *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Dokumenttitel"
                />
              </div>
              <div>
                <Label>Dokumenttyp *</Label>
                <Select 
                  value={formData.document_type} 
                  onValueChange={(v) => setFormData({ ...formData, document_type: v as DocumentType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Kunde</Label>
                <Select 
                  value={formData.company_id} 
                  onValueChange={(v) => setFormData({ ...formData, company_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kunde auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Beschreibung des Dokuments"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label>Interne Notizen</Label>
                <Textarea
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  placeholder="Interne Notizen zum Dokument"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateDocument} disabled={!formData.title}>
              Dokument erstellen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedDocument?.document_number} - {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Dokumenttyp</Label>
                  <p className="font-medium">{typeConfig[selectedDocument.document_type]?.label}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge className={statusConfig[selectedDocument.status]?.className}>
                      {statusConfig[selectedDocument.status]?.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kunde</Label>
                  <p className="font-medium">{selectedDocument.crm_companies?.company_name || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Version</Label>
                  <p className="font-medium">v{selectedDocument.version}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Erstellt am</Label>
                  <p className="font-medium">{format(new Date(selectedDocument.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
                </div>
                {selectedDocument.sent_at && (
                  <div>
                    <Label className="text-muted-foreground">Versendet am</Label>
                    <p className="font-medium">{format(new Date(selectedDocument.sent_at), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
                  </div>
                )}
                {selectedDocument.file_name && (
                  <>
                    <div>
                      <Label className="text-muted-foreground">Datei</Label>
                      <p className="font-medium">{selectedDocument.file_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Dateigröße</Label>
                      <p className="font-medium">{formatFileSize(selectedDocument.file_size)}</p>
                    </div>
                  </>
                )}
              </div>
              
              {selectedDocument.description && (
                <div>
                  <Label className="text-muted-foreground">Beschreibung</Label>
                  <p className="mt-1">{selectedDocument.description}</p>
                </div>
              )}
              
              {selectedDocument.internal_notes && (
                <div>
                  <Label className="text-muted-foreground">Interne Notizen</Label>
                  <p className="mt-1 text-sm">{selectedDocument.internal_notes}</p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {selectedDocument.file_url && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={selectedDocument.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Herunterladen
                    </a>
                  </Button>
                )}
                {selectedDocument.status === 'entwurf' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedDocument.id, 'aktiv')}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Aktivieren
                  </Button>
                )}
                {selectedDocument.status === 'aktiv' && (
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedDocument.id, 'archiviert')}
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Archivieren
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDocId} onOpenChange={(open) => !open && setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Dokument löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie dieses Dokument wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
