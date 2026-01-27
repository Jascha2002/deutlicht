import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  FileSignature,
  Banknote,
  AlertCircle,
  FolderOpen,
  Edit,
  RefreshCw,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PartnerContractEditor } from './PartnerContractEditor';
import { PartnerDocuments } from './PartnerDocuments';

interface PartnerDetail {
  id: string;
  partner_number: string | null;
  company_name: string;
  legal_form: string | null;
  tax_id: string | null;
  website: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_position: string | null;
  partner_type: string;
  employee_count: string | null;
  founded_year: number | null;
  current_clients: string | null;
  average_project_value: string | null;
  target_markets: string[] | null;
  specializations: string[] | null;
  experience: string | null;
  motivation: string | null;
  portfolio_url: string | null;
  references_text: string | null;
  expected_volume: string | null;
  status: string;
  commission_rate: number | null;
  created_at: string;
  approved_at: string | null;
  rejection_reason: string | null;
  // New fields
  iban: string | null;
  bic: string | null;
  bank_name: string | null;
  account_holder: string | null;
  contract_status: string | null;
  contract_sent_at: string | null;
  contract_signed_at: string | null;
  contract_draft_content: string | null;
  contract_pdf_url: string | null;
  notes: string | null;
  internal_notes: string | null;
  website_check_status: string | null;
  website_check_at: string | null;
  website_check_result: Record<string, unknown> | null;
}

interface PartnerDetailDialogProps {
  partner: PartnerDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const partnerTypeLabels: Record<string, string> = {
  steuerberater: 'Steuerberater / Kanzlei',
  marketing_agentur: 'Marketing-Agentur',
  webdesigner: 'Webdesigner / Developer',
  it_dienstleister: 'IT-Dienstleister / Systemhaus',
  unternehmensberater: 'Unternehmensberater',
  sonstige: 'Sonstige',
};

const legalFormLabels: Record<string, string> = {
  einzelunternehmen: 'Einzelunternehmen',
  gbr: 'GbR',
  gmbh: 'GmbH',
  ug: 'UG (haftungsbeschränkt)',
  ag: 'AG',
  ohg: 'OHG',
  kg: 'KG',
  freiberufler: 'Freiberufler',
  sonstige: 'Sonstige',
};

const contractStatusLabels: Record<string, string> = {
  none: 'Kein Vertrag',
  draft: 'Entwurf erstellt',
  sent: 'Vertrag versendet',
  signed: 'Vertrag unterschrieben',
  active: 'Aktiv',
};

export function PartnerDetailDialog({
  partner,
  open,
  onOpenChange,
  onUpdate,
}: PartnerDetailDialogProps) {
  const { toast } = useToast();
  const [internalNotes, setInternalNotes] = useState(partner?.internal_notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingWebsite, setIsCheckingWebsite] = useState(false);
  const [contractEditorOpen, setContractEditorOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [bankData, setBankData] = useState({
    iban: partner?.iban || '',
    bic: partner?.bic || '',
    bank_name: partner?.bank_name || '',
    account_holder: partner?.account_holder || '',
  });

  if (!partner) return null;

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('partners')
        .update({ internal_notes: internalNotes })
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Notizen gespeichert',
        description: 'Interne Notizen wurden aktualisiert.',
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Fehler',
        description: 'Notizen konnten nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBankData = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('partners')
        .update(bankData)
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Bankdaten gespeichert',
        description: 'Bankverbindung wurde aktualisiert.',
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving bank data:', error);
      toast({
        title: 'Fehler',
        description: 'Bankdaten konnten nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckWebsite = async () => {
    if (!partner.website) {
      toast({
        title: 'Keine Website',
        description: 'Der Partner hat keine Website angegeben.',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingWebsite(true);
    try {
      // Try to fetch the website (no-cors mode due to browser restrictions)
      await fetch(partner.website, {
        method: 'HEAD',
        mode: 'no-cors',
      });

      const checkResult = {
        reachable: true,
        checkedAt: new Date().toISOString(),
        url: partner.website,
      };

      await supabase
        .from('partners')
        .update({
          website_check_status: 'reachable',
          website_check_at: new Date().toISOString(),
          website_check_result: checkResult,
        })
        .eq('id', partner.id);

      toast({
        title: 'Website erreichbar',
        description: `Die Website ${partner.website} scheint erreichbar zu sein.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Website check failed:', error);

      const checkResult = {
        reachable: false,
        checkedAt: new Date().toISOString(),
        url: partner.website,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await supabase
        .from('partners')
        .update({
          website_check_status: 'unreachable',
          website_check_at: new Date().toISOString(),
          website_check_result: checkResult,
        })
        .eq('id', partner.id);

      toast({
        title: 'Website-Prüfung',
        description: 'Konnte Website nicht erreichen. Möglicherweise CORS-geschützt oder offline.',
        variant: 'destructive',
      });
      onUpdate();
    } finally {
      setIsCheckingWebsite(false);
    }
  };

  const handleUpdateContractStatus = async (status: string) => {
    try {
      const updateData: Record<string, unknown> = { contract_status: status };

      if (status === 'sent') {
        updateData.contract_sent_at = new Date().toISOString();
      } else if (status === 'signed') {
        updateData.contract_signed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('partners')
        .update(updateData)
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Vertragsstatus aktualisiert',
        description: `Status wurde auf "${contractStatusLabels[status]}" gesetzt.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    }
  };

  const handleApprovePartner = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('partners')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq('id', partner.id);

      if (error) throw error;

      // TODO: Trigger welcome email via edge function

      toast({
        title: 'Partner genehmigt',
        description: 'Der Partner wurde erfolgreich freigeschaltet.',
      });
      onUpdate();
    } catch (error) {
      console.error('Error approving partner:', error);
      toast({
        title: 'Fehler',
        description: 'Partner konnte nicht genehmigt werden.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Genehmigt
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Ausstehend
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-xl">{partner.company_name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {partner.partner_number && (
                    <span className="font-mono text-accent">{partner.partner_number}</span>
                  )}
                  <span>•</span>
                  {partnerTypeLabels[partner.partner_type] || partner.partner_type}
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(partner.status)}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="business">Geschäft</TabsTrigger>
              <TabsTrigger value="contract">Vertrag</TabsTrigger>
              <TabsTrigger value="bank">Bankdaten</TabsTrigger>
              <TabsTrigger value="notes">Notizen</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Unternehmensdaten
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rechtsform</span>
                      <span className="font-medium">
                        {legalFormLabels[partner.legal_form || ''] || partner.legal_form || '-'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">USt-ID / Steuernr.</span>
                      <span className="font-medium">{partner.tax_id || '-'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gründungsjahr</span>
                      <span className="font-medium">{partner.founded_year || '-'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mitarbeiter</span>
                      <span className="font-medium">{partner.employee_count || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Ansprechpartner
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {partner.contact_first_name} {partner.contact_last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {partner.contact_position || 'Position nicht angegeben'}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={`mailto:${partner.contact_email}`}
                        className="text-accent hover:underline"
                      >
                        {partner.contact_email}
                      </a>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {partner.contact_phone ? (
                        <a
                          href={`tel:${partner.contact_phone}`}
                          className="text-accent hover:underline"
                        >
                          {partner.contact_phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Nicht angegeben</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    {partner.street || partner.postal_code || partner.city ? (
                      <div className="space-y-1">
                        {partner.street && <p>{partner.street}</p>}
                        <p>
                          {partner.postal_code} {partner.city}
                        </p>
                        <p className="text-muted-foreground">{partner.country || 'Deutschland'}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Keine Adresse angegeben</p>
                    )}
                  </div>
                </div>

                {/* Website with Check */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Online-Präsenz
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        {partner.website ? (
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline truncate flex items-center gap-1"
                            >
                              {partner.website.replace(/^https?:\/\//, '')}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                            {partner.website_check_status === 'reachable' && (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                            {partner.website_check_status === 'unreachable' && (
                              <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Keine Website</span>
                        )}
                      </div>
                      {partner.website && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCheckWebsite}
                          disabled={isCheckingWebsite}
                          className="gap-1 text-xs"
                        >
                          {isCheckingWebsite ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3 h-3" />
                          )}
                          Prüfen
                        </Button>
                      )}
                    </div>
                    {partner.website_check_at && (
                      <p className="text-xs text-muted-foreground">
                        Zuletzt geprüft: {formatDate(partner.website_check_at)}
                      </p>
                    )}
                    {partner.portfolio_url && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={partner.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline truncate"
                          >
                            Portfolio ansehen
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Motivation */}
              {partner.motivation && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Motivation für Partnerschaft
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{partner.motivation}</p>
                  </div>
                </div>
              )}

              {/* References */}
              {partner.references_text && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Referenzen</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{partner.references_text}</p>
                  </div>
                </div>
              )}

              {/* Notes from Partner (public) */}
              {partner.notes && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Bemerkungen vom Partner
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{partner.notes}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Zeitverlauf
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Anmeldung</span>
                    <span>{formatDate(partner.created_at)}</span>
                  </div>
                  {partner.approved_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Genehmigt am</span>
                      <span>{formatDate(partner.approved_at)}</span>
                    </div>
                  )}
                  {partner.contract_sent_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vertrag versendet</span>
                      <span>{formatDate(partner.contract_sent_at)}</span>
                    </div>
                  )}
                  {partner.contract_signed_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vertrag unterschrieben</span>
                      <span>{formatDate(partner.contract_signed_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {partner.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleApprovePartner} className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Partner genehmigen
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Business Tab */}
            <TabsContent value="business" className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Geschäftsdetails</h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aktuelle Kunden</span>
                      <span className="font-medium">{partner.current_clients || '-'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ø Projektwert</span>
                      <span className="font-medium">{partner.average_project_value || '-'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Erwartetes Volumen</span>
                      <span className="font-medium">{partner.expected_volume || '-'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Erfahrung</span>
                      <span className="font-medium">{partner.experience || '-'} Jahre</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provisionsrate</span>
                      <span className="font-medium text-accent">
                        {partner.commission_rate || 15}% (auf Nettoumsatz)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Zielbranchen</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.target_markets && partner.target_markets.length > 0 ? (
                      partner.target_markets.map((market, i) => (
                        <Badge key={i} variant="secondary">
                          {market}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Keine angegeben</p>
                    )}
                  </div>

                  <h3 className="font-semibold mt-6">Spezialisierungen</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.specializations && partner.specializations.length > 0 ? (
                      partner.specializations.map((spec, i) => (
                        <Badge key={i} variant="outline">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Keine angegeben</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Hinweis:</strong> Die Provision wird ausschließlich auf Basis der{' '}
                  <strong>Nettoumsätze</strong> berechnet. Umsatzsteuer wird nicht provisioniert.
                  Dieses Partnerangebot richtet sich ausschließlich an Gewerbetreibende (B2B).
                </p>
              </div>
            </TabsContent>

            {/* Contract Tab */}
            <TabsContent value="contract" className="space-y-6 mt-4">
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileSignature className="w-5 h-5" />
                    Vertragsstatus
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      partner.contract_status === 'signed' || partner.contract_status === 'active'
                        ? 'border-green-500 text-green-600'
                        : partner.contract_status === 'sent'
                        ? 'border-blue-500 text-blue-600'
                        : partner.contract_status === 'draft'
                        ? 'border-muted-foreground text-muted-foreground'
                        : ''
                    )}
                  >
                    {contractStatusLabels[partner.contract_status || 'none']}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Der Partnervertrag wird nach positiver Prüfung generiert und an den Partner
                    versendet. Nach Unterzeichnung und Freigabe erhält der Partner Zugang zum
                    Partnerbereich.
                  </p>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setContractEditorOpen(true)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Vertrag bearbeiten
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDocumentsOpen(true)}
                      className="gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Dokumente verwalten
                    </Button>
                  </div>

                  <Separator />

                  {/* Status Workflow Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {(!partner.contract_status || partner.contract_status === 'none') && (
                      <Button
                        onClick={() => setContractEditorOpen(true)}
                        className="gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Vertrag erstellen
                      </Button>
                    )}
                    {partner.contract_status === 'draft' && (
                      <Button
                        onClick={() => handleUpdateContractStatus('sent')}
                        className="gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Vertrag versenden
                      </Button>
                    )}
                    {partner.contract_status === 'sent' && (
                      <Button
                        onClick={() => handleUpdateContractStatus('signed')}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Als unterschrieben markieren
                      </Button>
                    )}
                    {partner.contract_status === 'signed' && partner.status !== 'approved' && (
                      <Button onClick={handleApprovePartner} className="gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Partner freischalten & Willkommens-E-Mail senden
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                <h4 className="font-medium mb-3">Vertragsverlauf</h4>
                {partner.contract_draft_content && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entwurf erstellt</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
                {partner.contract_sent_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versendet am</span>
                    <span>{formatDate(partner.contract_sent_at)}</span>
                  </div>
                )}
                {partner.contract_signed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unterschrieben am</span>
                    <span>{formatDate(partner.contract_signed_at)}</span>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Bank Tab */}
            <TabsContent value="bank" className="space-y-6 mt-4">
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Banknote className="w-5 h-5" />
                  Bankverbindung für Provisionsauszahlungen
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kontoinhaber</label>
                    <Input
                      value={bankData.account_holder}
                      onChange={(e) =>
                        setBankData({ ...bankData, account_holder: e.target.value })
                      }
                      placeholder="Firmenname oder Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bank</label>
                    <Input
                      value={bankData.bank_name}
                      onChange={(e) => setBankData({ ...bankData, bank_name: e.target.value })}
                      placeholder="Name der Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">IBAN</label>
                    <Input
                      value={bankData.iban}
                      onChange={(e) => setBankData({ ...bankData, iban: e.target.value })}
                      placeholder="DE00 0000 0000 0000 0000 00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">BIC</label>
                    <Input
                      value={bankData.bic}
                      onChange={(e) => setBankData({ ...bankData, bic: e.target.value })}
                      placeholder="DEUTDEDB"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBankData} className="mt-4" disabled={isSaving}>
                  {isSaving ? 'Speichern...' : 'Bankdaten speichern'}
                </Button>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Abrechnungsprozess:</strong> Der Partner erstellt monatlich eine Rechnung
                  über seine Provisionsansprüche. Diese wird von uns geprüft und nach Freigabe
                  überwiesen.
                </p>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-6 mt-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Interne Notizen</h3>
                <p className="text-sm text-muted-foreground">
                  Diese Notizen sind nur für Admins und Mitarbeiter sichtbar.
                </p>
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Interne Notizen zum Partner..."
                  rows={6}
                />
                <Button onClick={handleSaveNotes} disabled={isSaving}>
                  {isSaving ? 'Speichern...' : 'Notizen speichern'}
                </Button>
              </div>

              {partner.rejection_reason && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">Ablehnungsgrund</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p>{partner.rejection_reason}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>

      {/* Contract Editor Dialog */}
      <PartnerContractEditor
        partner={partner}
        open={contractEditorOpen}
        onOpenChange={setContractEditorOpen}
        onUpdate={onUpdate}
      />

      {/* Documents Manager Dialog */}
      <PartnerDocuments
        partnerId={partner.id}
        partnerNumber={partner.partner_number}
        open={documentsOpen}
        onOpenChange={setDocumentsOpen}
      />
    </Dialog>
  );
}
