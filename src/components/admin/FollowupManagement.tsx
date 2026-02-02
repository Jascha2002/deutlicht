import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Search, Plus, Calendar, CheckCircle, Clock, AlertTriangle, 
  Phone, Mail, Users, FileText
} from 'lucide-react';
import { format, differenceInDays, addDays, isToday, isPast } from 'date-fns';
import { de } from 'date-fns/locale';

interface CrmFollowup {
  id: string;
  title: string;
  description: string | null;
  followup_type: string;
  priority: string;
  due_date: string;
  due_time: string | null;
  status: string;
  result: string | null;
  lead_id: string | null;
  offer_id: string | null;
  project_id: string | null;
  company_id: string | null;
  created_at: string;
  crm_leads?: { company_name: string } | null;
  crm_offers?: { offer_number: string; title: string } | null;
  crm_projects?: { project_number: string; title: string } | null;
  crm_companies?: { company_name: string } | null;
}

const typeConfig: Record<string, { label: string; icon: typeof Phone }> = {
  anruf: { label: 'Anruf', icon: Phone },
  email: { label: 'E-Mail', icon: Mail },
  termin: { label: 'Termin', icon: Users },
  sonstiges: { label: 'Sonstiges', icon: FileText }
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  niedrig: { label: 'Niedrig', className: 'bg-muted text-muted-foreground' },
  normal: { label: 'Normal', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  hoch: { label: 'Hoch', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  dringend: { label: 'Dringend', className: 'bg-destructive/10 text-destructive' }
};

export function FollowupManagement() {
  const { toast } = useToast();
  const [followups, setFollowups] = useState<CrmFollowup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('offen');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create form state
  const [newFollowup, setNewFollowup] = useState({
    title: '',
    description: '',
    followup_type: 'anruf',
    priority: 'normal',
    due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadFollowups();
  }, []);

  const loadFollowups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_followups')
        .select(`
          *,
          crm_leads(company_name),
          crm_offers(offer_number, title),
          crm_projects(project_number, title),
          crm_companies(company_name)
        `)
        .order('due_date');

      if (error) throw error;
      setFollowups(data || []);
    } catch (error) {
      console.error('Error loading followups:', error);
      toast({
        title: 'Fehler',
        description: 'Wiedervorlagen konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newFollowup.title || !newFollowup.due_date) {
      toast({
        title: 'Fehler',
        description: 'Bitte Titel und Fälligkeitsdatum angeben.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('crm_followups').insert({
        ...newFollowup,
        status: 'offen'
      });

      if (error) throw error;

      toast({ title: 'Wiedervorlage erstellt' });
      setNewFollowup({
        title: '',
        description: '',
        followup_type: 'anruf',
        priority: 'normal',
        due_date: format(addDays(new Date(), 7), 'yyyy-MM-dd')
      });
      setIsCreateOpen(false);
      loadFollowups();
    } catch (error) {
      console.error('Error creating followup:', error);
      toast({
        title: 'Fehler',
        description: 'Wiedervorlage konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleComplete = async (id: string, result?: string) => {
    try {
      const { error } = await supabase
        .from('crm_followups')
        .update({ 
          status: 'erledigt',
          completed_at: new Date().toISOString(),
          result
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Wiedervorlage erledigt' });
      loadFollowups();
    } catch (error) {
      console.error('Error completing followup:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const filteredFollowups = followups.filter(f => {
    const matchesSearch = 
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crm_companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.crm_leads?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const today = followups.filter(f => f.status === 'offen' && isToday(new Date(f.due_date))).length;
  const overdue = followups.filter(f => f.status === 'offen' && isPast(new Date(f.due_date)) && !isToday(new Date(f.due_date))).length;
  const open = followups.filter(f => f.status === 'offen').length;
  const done = followups.filter(f => f.status === 'erledigt').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={today > 0 ? 'border-primary bg-primary/5' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className={`h-8 w-8 ${today > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">{today}</p>
                <p className="text-sm text-muted-foreground">Heute fällig</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={overdue > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${overdue > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-2xl font-bold">{overdue}</p>
                <p className="text-sm text-muted-foreground">Überfällig</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{open}</p>
                <p className="text-sm text-muted-foreground">Offen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{done}</p>
                <p className="text-sm text-muted-foreground">Erledigt</p>
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
              placeholder="Wiedervorlagen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="offen">Offen</SelectItem>
              <SelectItem value="erledigt">Erledigt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neue Wiedervorlage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Wiedervorlage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Titel *</Label>
                <Input
                  value={newFollowup.title}
                  onChange={(e) => setNewFollowup(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="z.B. Angebot nachfassen"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Typ</Label>
                  <Select 
                    value={newFollowup.followup_type} 
                    onValueChange={(v) => setNewFollowup(prev => ({ ...prev, followup_type: v }))}
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
                  <Label>Priorität</Label>
                  <Select 
                    value={newFollowup.priority} 
                    onValueChange={(v) => setNewFollowup(prev => ({ ...prev, priority: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Fällig am *</Label>
                <Input
                  type="date"
                  value={newFollowup.due_date}
                  onChange={(e) => setNewFollowup(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={newFollowup.description}
                  onChange={(e) => setNewFollowup(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Weitere Details..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleCreate}>
                  Erstellen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wiedervorlage</TableHead>
              <TableHead>Bezug</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Priorität</TableHead>
              <TableHead>Fällig</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredFollowups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Keine Wiedervorlagen gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredFollowups.map((followup) => {
                const typeInfo = typeConfig[followup.followup_type] || typeConfig.sonstiges;
                const TypeIcon = typeInfo.icon;
                const priorityInfo = priorityConfig[followup.priority] || priorityConfig.normal;
                const dueDate = new Date(followup.due_date);
                const isOverdue = followup.status === 'offen' && isPast(dueDate) && !isToday(dueDate);
                const isTodayDue = isToday(dueDate);
                const daysUntil = differenceInDays(dueDate, new Date());

                const reference = followup.crm_offers?.title || 
                  followup.crm_projects?.title ||
                  followup.crm_leads?.company_name ||
                  followup.crm_companies?.company_name || '-';

                return (
                  <TableRow 
                    key={followup.id} 
                    className={`${isOverdue ? 'bg-destructive/5' : ''} ${isTodayDue && followup.status === 'offen' ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell>
                      <div>
                        <p className={`font-medium ${followup.status === 'erledigt' ? 'line-through text-muted-foreground' : ''}`}>
                          {followup.title}
                        </p>
                        {followup.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{followup.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {reference}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <TypeIcon className="h-3 w-3" />
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityInfo.className}>
                        {priorityInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`${isOverdue ? 'text-destructive font-medium' : ''} ${isTodayDue ? 'text-primary font-medium' : ''}`}>
                        {format(dueDate, 'dd.MM.yyyy', { locale: de })}
                        {followup.status === 'offen' && (
                          <span className="text-xs ml-1">
                            {isTodayDue ? '(heute)' : isOverdue ? `(+${Math.abs(daysUntil)}d)` : daysUntil > 0 ? `(${daysUntil}d)` : ''}
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {followup.status === 'offen' ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="gap-1"
                          onClick={() => handleComplete(followup.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Erledigt
                        </Button>
                      ) : (
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Erledigt
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
