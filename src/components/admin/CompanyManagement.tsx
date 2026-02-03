import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Building2, Eye, Edit, Globe, Phone, Mail, MapPin, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Database } from '@/integrations/supabase/types';

type TaxRegion = Database['public']['Enums']['tax_region'];
type CompanyRow = Database['public']['Tables']['crm_companies']['Row'];
type CompanyInsert = Database['public']['Tables']['crm_companies']['Insert'];

interface Company {
  id: string;
  company_name: string;
  trade_name: string | null;
  legal_form: string | null;
  industry: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  street: string | null;
  street_number: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  tax_region: TaxRegion | null;
  vat_id: string | null;
  tax_number: string | null;
  is_active: boolean;
  tags: string[] | null;
  created_at: string;
}

interface CompanyRole {
  id: string;
  role_type: string;
  is_active: boolean;
  commission_rate: number | null;
}

const roleLabels: Record<string, string> = {
  kunde: 'Kunde',
  partner: 'Partner',
  freelancer_eu: 'Freelancer (EU)',
  freelancer_drittland: 'Freelancer (Drittland)',
  lieferant: 'Lieferant',
};

const taxRegionLabels: Record<TaxRegion, string> = {
  deutschland: 'Deutschland',
  eu: 'EU-Ausland',
  drittland: 'Drittland',
};

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyRoles, setCompanyRoles] = useState<CompanyRole[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_companies')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Fehler',
        description: 'Firmen konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyRoles = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_company_roles')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      setCompanyRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const openCompanyDetail = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setIsEditing(false);
    fetchCompanyRoles(company.id);
  };

  const handleSave = async () => {
    if (!formData.company_name?.trim()) {
      toast({ title: 'Firmenname ist erforderlich', variant: 'destructive' });
      return;
    }

    try {
      if (selectedCompany) {
        // Update
        const { error } = await supabase
          .from('crm_companies')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedCompany.id);

        if (error) throw error;
        toast({ title: 'Firma aktualisiert' });
      } else {
        // Create - ensure required field
        if (!formData.company_name) {
          toast({ title: 'Firmenname erforderlich', variant: 'destructive' });
          return;
        }
        const insertData: CompanyInsert = {
          company_name: formData.company_name,
          trade_name: formData.trade_name,
          legal_form: formData.legal_form,
          industry: formData.industry,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          street: formData.street,
          street_number: formData.street_number,
          postal_code: formData.postal_code,
          city: formData.city,
          country: formData.country,
          country_code: formData.country_code,
          tax_region: formData.tax_region,
          vat_id: formData.vat_id,
          tax_number: formData.tax_number,
        };
        const { error } = await supabase.from('crm_companies').insert(insertData);

        if (error) throw error;
        toast({ title: 'Firma erstellt' });
        setShowCreateDialog(false);
      }

      fetchCompanies();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: 'Fehler',
        description: 'Firma konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (!deleteCompanyId) return;
    try {
      const { error } = await supabase
        .from('crm_companies')
        .delete()
        .eq('id', deleteCompanyId);

      if (error) throw error;

      toast({ title: 'Firma gelöscht' });
      setDeleteCompanyId(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: 'Fehler',
        description: 'Firma konnte nicht gelöscht werden. Möglicherweise gibt es verknüpfte Daten.',
        variant: 'destructive',
      });
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      company.company_name?.toLowerCase().includes(searchLower) ||
      company.city?.toLowerCase().includes(searchLower) ||
      company.email?.toLowerCase().includes(searchLower)
    );
  });

  const renderForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Label>Firmenname *</Label>
        <Input
          value={formData.company_name || ''}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          placeholder="Muster GmbH"
        />
      </div>
      <div>
        <Label>Handelsname</Label>
        <Input
          value={formData.trade_name || ''}
          onChange={(e) => setFormData({ ...formData, trade_name: e.target.value })}
          placeholder="Markenname"
        />
      </div>
      <div>
        <Label>Rechtsform</Label>
        <Select value={formData.legal_form || '_none'} onValueChange={(v) => setFormData({ ...formData, legal_form: v === '_none' ? '' : v })}>
          <SelectTrigger>
            <SelectValue placeholder="Auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">— Keine —</SelectItem>
            <SelectItem value="GmbH">GmbH</SelectItem>
            <SelectItem value="UG">UG (haftungsbeschränkt)</SelectItem>
            <SelectItem value="AG">AG</SelectItem>
            <SelectItem value="GbR">GbR</SelectItem>
            <SelectItem value="OHG">OHG</SelectItem>
            <SelectItem value="KG">KG</SelectItem>
            <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
            <SelectItem value="Freiberufler">Freiberufler</SelectItem>
            <SelectItem value="e.V.">e.V.</SelectItem>
            <SelectItem value="Sonstige">Sonstige</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Branche</Label>
        <Input
          value={formData.industry || ''}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          placeholder="IT, Handel, Handwerk..."
        />
      </div>
      <div>
        <Label>E-Mail</Label>
        <Input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="info@firma.de"
        />
      </div>
      <div>
        <Label>Telefon</Label>
        <Input
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+49 123 456789"
        />
      </div>
      <div>
        <Label>Website</Label>
        <Input
          value={formData.website || ''}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://firma.de"
        />
      </div>

      <div className="col-span-2 border-t pt-4 mt-2">
        <h4 className="font-medium mb-3">Adresse</h4>
      </div>
      <div>
        <Label>Straße</Label>
        <Input
          value={formData.street || ''}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
        />
      </div>
      <div>
        <Label>Hausnummer</Label>
        <Input
          value={formData.street_number || ''}
          onChange={(e) => setFormData({ ...formData, street_number: e.target.value })}
        />
      </div>
      <div>
        <Label>PLZ</Label>
        <Input
          value={formData.postal_code || ''}
          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
        />
      </div>
      <div>
        <Label>Ort</Label>
        <Input
          value={formData.city || ''}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>
      <div>
        <Label>Land</Label>
        <Input
          value={formData.country || ''}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Deutschland"
        />
      </div>
      <div>
        <Label>Ländercode</Label>
        <Input
          value={formData.country_code || ''}
          onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
          placeholder="DE"
          maxLength={2}
        />
      </div>

      <div className="col-span-2 border-t pt-4 mt-2">
        <h4 className="font-medium mb-3">Steuerliche Informationen</h4>
      </div>
      <div>
        <Label>Steuerregion</Label>
        <Select value={formData.tax_region || '_none'} onValueChange={(v) => setFormData({ ...formData, tax_region: v === '_none' ? null : v as TaxRegion })}>
          <SelectTrigger>
            <SelectValue placeholder="Auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">— Keine —</SelectItem>
            <SelectItem value="deutschland">Deutschland</SelectItem>
            <SelectItem value="eu">EU-Ausland</SelectItem>
            <SelectItem value="drittland">Drittland</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>USt-IdNr.</Label>
        <Input
          value={formData.vat_id || ''}
          onChange={(e) => setFormData({ ...formData, vat_id: e.target.value })}
          placeholder="DE123456789"
        />
      </div>
      <div>
        <Label>Steuernummer</Label>
        <Input
          value={formData.tax_number || ''}
          onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Firmen ({companies.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchCompanies}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setFormData({})}>
                    <Plus className="w-4 h-4 mr-2" />
                    Neue Firma
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Neue Firma anlegen</DialogTitle>
                  </DialogHeader>
                  {renderForm()}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleSave}>Speichern</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Suche nach Firma, Ort, E-Mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Keine Firmen gefunden</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Firma</TableHead>
                    <TableHead>Ort</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.company_name}</div>
                          {company.trade_name && (
                            <div className="text-sm text-muted-foreground">{company.trade_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.city && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {company.postal_code} {company.city}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {company.email}
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {company.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.tax_region && (
                          <Badge variant="outline">{taxRegionLabels[company.tax_region] || company.tax_region}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.is_active ? 'default' : 'secondary'}>
                          {company.is_active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => openCompanyDetail(company)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {selectedCompany?.company_name}
                                {!isEditing && (
                                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedCompany && (
                              <Tabs defaultValue="details">
                                <TabsList>
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="roles">Rollen ({companyRoles.length})</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="mt-4">
                                  {isEditing ? (
                                    <>
                                      {renderForm()}
                                      <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                          Abbrechen
                                        </Button>
                                        <Button onClick={handleSave}>Speichern</Button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-muted-foreground">Branche</Label>
                                          <p>{selectedCompany.industry || '-'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Rechtsform</Label>
                                          <p>{selectedCompany.legal_form || '-'}</p>
                                        </div>
                                        {selectedCompany.website && (
                                          <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-muted-foreground" />
                                            <a
                                              href={selectedCompany.website}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-accent hover:underline"
                                            >
                                              {selectedCompany.website}
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                      <div className="border-t pt-4">
                                        <Label className="text-muted-foreground">Adresse</Label>
                                        <p>
                                          {selectedCompany.street} {selectedCompany.street_number}
                                          <br />
                                          {selectedCompany.postal_code} {selectedCompany.city}
                                          <br />
                                          {selectedCompany.country}
                                        </p>
                                      </div>
                                      <div className="border-t pt-4">
                                        <Label className="text-muted-foreground">Steuerliche Daten</Label>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                          <div>Region: {taxRegionLabels[selectedCompany.tax_region || ''] || '-'}</div>
                                          <div>USt-ID: {selectedCompany.vat_id || '-'}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </TabsContent>
                                <TabsContent value="roles" className="mt-4">
                                  {companyRoles.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">Keine Rollen zugewiesen</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {companyRoles.map((role) => (
                                        <div key={role.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                          <div>
                                            <Badge>{roleLabels[role.role_type] || role.role_type}</Badge>
                                            {role.commission_rate && (
                                              <span className="ml-2 text-sm text-muted-foreground">
                                                {role.commission_rate}% Provision
                                              </span>
                                            )}
                                          </div>
                                          <Badge variant={role.is_active ? 'default' : 'secondary'}>
                                            {role.is_active ? 'Aktiv' : 'Inaktiv'}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog open={deleteCompanyId === company.id} onOpenChange={(open) => !open && setDeleteCompanyId(null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteCompanyId(company.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Firma löschen?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Möchten Sie die Firma "{company.company_name}" wirklich löschen? 
                                Diese Aktion kann nicht rückgängig gemacht werden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteCompany} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
    </div>
  );
}
