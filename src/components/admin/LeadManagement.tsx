import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, Phone, Mail, Building2, Calendar, MessageSquare, RefreshCw, FolderOpen, ArrowRight, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];
type LeadRow = Database['public']['Tables']['crm_leads']['Row'];

interface Lead {
  id: string;
  lead_number: string;
  source: string;
  status: LeadStatus;
  company_name: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  estimated_value: number | null;
  services_interested: string[] | null;
  notes: string | null;
  created_at: string;
  odoo_synced_at: string | null;
}

interface LeadActivity {
  id: string;
  activity_type: string;
  description: string | null;
  created_at: string;
}

const statusColors: Record<LeadStatus, string> = {
  neu: 'bg-primary text-primary-foreground animate-pulse',
  kontaktiert: 'bg-yellow-500 text-white',
  qualifiziert: 'bg-purple-500 text-white',
  angebot_erstellt: 'bg-orange-500 text-white',
  verhandlung: 'bg-cyan-500 text-white',
  gewonnen: 'bg-green-500 text-white',
  verloren: 'bg-destructive text-destructive-foreground',
  inaktiv: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<LeadStatus, string> = {
  neu: 'Neu',
  kontaktiert: 'Kontaktiert',
  qualifiziert: 'Qualifiziert',
  angebot_erstellt: 'Angebot erstellt',
  verhandlung: 'Verhandlung',
  gewonnen: 'Gewonnen',
  verloren: 'Verloren',
  inaktiv: 'Inaktiv',
};

const sourceLabels: Record<string, string> = {
  projektanfrage: 'Projektanfrage',
  kontaktformular: 'Kontaktformular',
  partner_referral: 'Partner-Empfehlung',
  website: 'Website',
  telefon: 'Telefon',
  messe: 'Messe',
  sonstige: 'Sonstige',
};

const mapLeadRow = (row: LeadRow): Lead => ({
  id: row.id,
  lead_number: row.lead_number || '',
  source: row.source || 'sonstige',
  status: row.status,
  company_name: row.company_name,
  contact_first_name: row.contact_first_name,
  contact_last_name: row.contact_last_name,
  contact_email: row.contact_email,
  contact_phone: row.contact_phone,
  estimated_value: row.estimated_value,
  services_interested: row.services_interested as string[] | null,
  notes: row.internal_notes,
  created_at: row.created_at,
  odoo_synced_at: row.odoo_synced_at,
});

const getContactName = (lead: Lead): string => {
  const parts = [lead.contact_first_name, lead.contact_last_name].filter(Boolean);
  return parts.join(' ') || '-';
};

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crm_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as LeadStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads((data || []).map(mapLeadRow));
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Fehler',
        description: 'Leads konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (leadId: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      await supabase.from('crm_lead_activities').insert({
        lead_id: leadId,
        activity_type: 'status_change',
        description: `Status geändert zu: ${statusLabels[newStatus]}`,
      });

      toast({ title: 'Status aktualisiert' });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        fetchActivities(leadId);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    }
  };

  const convertToProject = async (lead: Lead) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create project from lead
      const { data: newProject, error } = await supabase
        .from('crm_projects')
        .insert({
          title: `Projekt: ${lead.company_name || 'Neuer Kunde'}`,
          lead_id: lead.id,
          services_included: lead.services_interested,
          status: 'planung',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update lead status
      await supabase
        .from('crm_leads')
        .update({ status: 'gewonnen' })
        .eq('id', lead.id);

      // Add activity
      await supabase.from('crm_lead_activities').insert({
        lead_id: lead.id,
        activity_type: 'note',
        description: `In Projekt ${newProject.project_number} konvertiert`,
      });

      toast({ 
        title: 'Projekt erstellt', 
        description: `Projekt ${newProject.project_number} wurde aus Lead erstellt.` 
      });
      fetchLeads();
    } catch (error) {
      console.error('Error converting to project:', error);
      toast({
        title: 'Fehler',
        description: 'Lead konnte nicht in Projekt konvertiert werden.',
        variant: 'destructive',
      });
    }
  };

  const addActivity = async () => {
    if (!selectedLead || !newActivity.trim()) return;

    try {
      const { error } = await supabase.from('crm_lead_activities').insert({
        lead_id: selectedLead.id,
        activity_type: 'note',
        description: newActivity.trim(),
      });

      if (error) throw error;

      setNewActivity('');
      fetchActivities(selectedLead.id);
      toast({ title: 'Notiz hinzugefügt' });
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: 'Fehler',
        description: 'Notiz konnte nicht hinzugefügt werden.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteLeadId) return;
    try {
      // Delete activities first
      await supabase.from('crm_lead_activities').delete().eq('lead_id', deleteLeadId);
      // Delete lead
      const { error } = await supabase.from('crm_leads').delete().eq('id', deleteLeadId);
      if (error) throw error;

      toast({ title: 'Lead gelöscht' });
      setDeleteLeadId(null);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Fehler',
        description: 'Lead konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    fetchActivities(lead.id);
  };

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const contactName = getContactName(lead).toLowerCase();
    return (
      lead.lead_number?.toLowerCase().includes(searchLower) ||
      lead.company_name?.toLowerCase().includes(searchLower) ||
      contactName.includes(searchLower) ||
      lead.contact_email?.toLowerCase().includes(searchLower)
    );
  });

  const newLeadsCount = leads.filter((l) => l.status === 'neu').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-sm text-muted-foreground">Gesamt Leads</p>
          </CardContent>
        </Card>
        <Card className={newLeadsCount > 0 ? 'border-accent bg-accent/5' : ''}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-accent">{newLeadsCount}</div>
            <p className="text-sm text-muted-foreground">Neue Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {leads.filter((l) => l.status === 'gewonnen').length}
            </div>
            <p className="text-sm text-muted-foreground">Gewonnen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {leads.filter((l) => ['qualifiziert', 'angebot_erstellt', 'verhandlung'].includes(l.status)).length}
            </div>
            <p className="text-sm text-muted-foreground">In Bearbeitung</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Lead-Übersicht
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchLeads}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Suche nach Firma, Name, E-Mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Keine Leads gefunden
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead-Nr.</TableHead>
                    <TableHead>Firma / Kontakt</TableHead>
                    <TableHead>Quelle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className={lead.status === 'neu' ? 'bg-accent/5' : ''}>
                      <TableCell className="font-mono text-sm">{lead.lead_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.company_name || '-'}</div>
                          <div className="text-sm text-muted-foreground">{getContactName(lead)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sourceLabels[lead.source] || lead.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => updateLeadStatus(lead.id, value as LeadStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={statusColors[lead.status]}>{statusLabels[lead.status]}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(lead.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => openLeadDetail(lead)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                Lead {selectedLead?.lead_number}
                                {selectedLead && (
                                  <Badge className={statusColors[selectedLead.status]}>
                                    {statusLabels[selectedLead.status]}
                                  </Badge>
                                )}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedLead && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Firma</label>
                                    <p className="font-medium">{selectedLead.company_name || '-'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Kontakt</label>
                                    <p className="font-medium">{getContactName(selectedLead)}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <a href={`mailto:${selectedLead.contact_email}`} className="text-accent hover:underline">
                                      {selectedLead.contact_email || '-'}
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <a href={`tel:${selectedLead.contact_phone}`} className="text-accent hover:underline">
                                      {selectedLead.contact_phone || '-'}
                                    </a>
                                  </div>
                                </div>

                                {selectedLead.services_interested && selectedLead.services_interested.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Interessierte Leistungen</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {selectedLead.services_interested.map((service) => (
                                        <Badge key={service} variant="secondary">
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {selectedLead.notes && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Notizen</label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{selectedLead.notes}</p>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  Erstellt: {format(new Date(selectedLead.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                                  {selectedLead.odoo_synced_at && (
                                    <span className="ml-4">
                                      | Odoo-Sync: {format(new Date(selectedLead.odoo_synced_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Aktivitäten
                                  </label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex gap-2">
                                      <Textarea
                                        placeholder="Neue Notiz hinzufügen..."
                                        value={newActivity}
                                        onChange={(e) => setNewActivity(e.target.value)}
                                        rows={2}
                                      />
                                      <Button onClick={addActivity} disabled={!newActivity.trim()}>
                                        Speichern
                                      </Button>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                      {activities.map((activity) => (
                                        <div key={activity.id} className="p-3 bg-muted rounded-lg">
                                          <div className="flex justify-between text-sm">
                                            <span className="font-medium capitalize">
                                              {activity.activity_type === 'status_change' ? 'Statusänderung' : 'Notiz'}
                                            </span>
                                            <span className="text-muted-foreground">
                                              {format(new Date(activity.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                                            </span>
                                          </div>
                                          <p className="text-sm mt-1">{activity.description}</p>
                                        </div>
                                      ))}
                                      {activities.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                          Noch keine Aktivitäten
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Convert to Project Button */}
                                {selectedLead.status !== 'gewonnen' && selectedLead.status !== 'verloren' && (
                                  <div className="border-t pt-4">
                                    <Button 
                                      onClick={() => {
                                        convertToProject(selectedLead);
                                      }}
                                      className="w-full gap-2"
                                    >
                                      <FolderOpen className="w-4 h-4" />
                                      In Projekt konvertieren
                                      <ArrowRight className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteLeadId(lead.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteLeadId} onOpenChange={(open) => !open && setDeleteLeadId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Lead löschen?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Lead wirklich löschen? Alle zugehörigen Aktivitäten werden ebenfalls gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLead} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
