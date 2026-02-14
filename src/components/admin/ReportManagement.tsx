import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, FileText, BarChart3, CheckCircle, Clock, 
  Eye, Send, ExternalLink, FileCheck, Building2
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type ReportStatus = string; // 'entwurf' | 'review' | 'freigegeben' | 'versendet'

interface CrmReport {
  id: string;
  report_number: string;
  report_type: string;
  title: string;
  summary: string | null;
  content_markdown: string | null;
  analysis_score: number | null;
  status: ReportStatus;
  pdf_url: string | null;
  sent_to_client_at: string | null;
  sent_to_email: string | null;
  approved_at: string | null;
  created_at: string;
  company_id: string | null;
  project_id: string | null;
  analysis_client_id: string | null;
  crm_companies?: { company_name: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
  analysis_clients?: { unternehmensname: string } | null;
}

const statusConfig: Record<ReportStatus, { label: string; className: string; icon: any }> = {
  entwurf: { label: 'Entwurf', className: 'bg-gray-100 text-gray-800', icon: FileText },
  review: { label: 'In Review', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
  freigegeben: { label: 'Freigegeben', className: 'bg-green-100 text-green-800', icon: CheckCircle },
  versendet: { label: 'Versendet', className: 'bg-blue-100 text-blue-800', icon: Send }
};

const reportTypeLabels: Record<string, string> = {
  digitalisierungsanalyse: 'Digitalisierungsanalyse',
  beratungsbericht: 'Beratungsbericht',
  statusbericht: 'Statusbericht',
  abschlussbericht: 'Abschlussbericht'
};

export function ReportManagement() {
  const { toast } = useToast();
  const [reports, setReports] = useState<CrmReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<CrmReport | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_reports')
        .select(`
          *,
          crm_companies(company_name),
          crm_projects(project_number, title),
          analysis_clients(unternehmensname)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data as unknown as CrmReport[]) || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Fehler',
        description: 'Berichte konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.analysis_clients?.unternehmensname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Stats
  const stats = {
    total: reports.length,
    analysen: reports.filter(r => r.report_type === 'digitalisierungsanalyse').length,
    beratung: reports.filter(r => r.report_type === 'beratungsbericht').length,
    entwurf: reports.filter(r => r.status === 'entwurf').length,
    versendet: reports.filter(r => r.status === 'versendet').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Berichte gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.analysen}</p>
                <p className="text-sm text-muted-foreground">Analysen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.beratung}</p>
                <p className="text-sm text-muted-foreground">Beratungsberichte</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.entwurf}</p>
                <p className="text-sm text-muted-foreground">Entwürfe</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Send className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.versendet}</p>
                <p className="text-sm text-muted-foreground">Versendet</p>
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
              placeholder="Berichte suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Berichtstyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              {Object.entries(reportTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bericht</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Kunde/Analyse</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
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
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Keine Berichte gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => {
                const StatusIcon = statusConfig[report.status as ReportStatus]?.icon || FileText;
                
                return (
                  <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">{report.report_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {reportTypeLabels[report.report_type] || report.report_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.crm_companies?.company_name || 
                       report.analysis_clients?.unternehmensname || 
                       '-'}
                    </TableCell>
                    <TableCell>
                      {report.analysis_score !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${report.analysis_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{report.analysis_score}%</span>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[report.status as ReportStatus]?.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[report.status as ReportStatus]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(report.created_at), 'dd.MM.yyyy', { locale: de })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedReport.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">
                        {reportTypeLabels[selectedReport.report_type] || selectedReport.report_type}
                      </Badge>
                      <span className="text-muted-foreground">{selectedReport.report_number}</span>
                    </div>
                  </div>
                  <Badge className={statusConfig[selectedReport.status as ReportStatus]?.className}>
                    {statusConfig[selectedReport.status as ReportStatus]?.label}
                  </Badge>
                </div>
              </DialogHeader>

              {selectedReport.analysis_score !== null && (
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Digitalisierungsscore</p>
                        <p className="text-4xl font-bold text-primary">{selectedReport.analysis_score}/100</p>
                      </div>
                      <div className="w-24 h-24 rounded-full border-8 border-primary flex items-center justify-center">
                        <BarChart3 className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kunde / Analyse</p>
                  <p className="font-medium">
                    {selectedReport.crm_companies?.company_name || 
                     selectedReport.analysis_clients?.unternehmensname || 
                     '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projekt</p>
                  <p className="font-medium">
                    {selectedReport.crm_projects?.title || '-'}
                  </p>
                </div>
                {selectedReport.sent_to_client_at && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Versendet an</p>
                    <p className="font-medium">
                      {selectedReport.sent_to_email} am {format(new Date(selectedReport.sent_to_client_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </p>
                  </div>
                )}
              </div>

              {selectedReport.summary && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Zusammenfassung</p>
                  <p className="text-foreground">{selectedReport.summary}</p>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                {selectedReport.pdf_url && (
                  <Button variant="outline" className="gap-2" asChild>
                    <a href={selectedReport.pdf_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      PDF öffnen
                    </a>
                  </Button>
                )}
                {selectedReport.status === 'entwurf' && (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    disabled={isUpdating}
                    onClick={async () => {
                      setIsUpdating(true);
                      try {
                        const { error } = await supabase
                          .from('crm_reports')
                          .update({ status: 'review' })
                          .eq('id', selectedReport.id);
                        if (error) throw error;
                        setSelectedReport({ ...selectedReport, status: 'review' });
                        toast({ title: 'Erfolg', description: 'Bericht zur Review weitergeleitet.' });
                        loadReports();
                      } catch (error) {
                        console.error('Error updating report status:', error);
                        toast({ title: 'Fehler', description: 'Status konnte nicht geändert werden.', variant: 'destructive' });
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Zur Review
                  </Button>
                )}
                {selectedReport.status === 'review' && (
                  <Button 
                    className="gap-2"
                    disabled={isUpdating}
                    onClick={async () => {
                      setIsUpdating(true);
                      try {
                        const { error } = await supabase
                          .from('crm_reports')
                          .update({ status: 'freigegeben', approved_at: new Date().toISOString() })
                          .eq('id', selectedReport.id);
                        if (error) throw error;
                        setSelectedReport({ ...selectedReport, status: 'freigegeben', approved_at: new Date().toISOString() });
                        toast({ title: 'Erfolg', description: 'Bericht freigegeben.' });
                        loadReports();
                      } catch (error) {
                        console.error('Error approving report:', error);
                        toast({ title: 'Fehler', description: 'Freigabe fehlgeschlagen.', variant: 'destructive' });
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Freigeben
                  </Button>
                )}
                {selectedReport.status === 'freigegeben' && (
                  <Button 
                    className="gap-2"
                    disabled={isUpdating}
                    onClick={async () => {
                      setIsUpdating(true);
                      try {
                        const { error } = await supabase
                          .from('crm_reports')
                          .update({ status: 'versendet', sent_to_client_at: new Date().toISOString() })
                          .eq('id', selectedReport.id);
                        if (error) throw error;
                        setSelectedReport({ ...selectedReport, status: 'versendet', sent_to_client_at: new Date().toISOString() });
                        toast({ title: 'Erfolg', description: 'Bericht als versendet markiert.' });
                        loadReports();
                      } catch (error) {
                        console.error('Error sending report:', error);
                        toast({ title: 'Fehler', description: 'Status konnte nicht geändert werden.', variant: 'destructive' });
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    <Send className="h-4 w-4" />
                    An Kunden senden
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
