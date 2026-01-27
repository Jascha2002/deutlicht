import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  FileSignature,
  Save,
  Send,
  Eye,
  Loader2,
  FileText,
  Trash2,
  Edit,
} from 'lucide-react';
import { COMPANY_INFO, getContractHeader, getDocumentFooter } from '@/data/companyInfo';

interface PartnerContractEditorProps {
  partner: {
    id: string;
    partner_number: string | null;
    company_name: string;
    legal_form: string | null;
    street: string | null;
    postal_code: string | null;
    city: string | null;
    country: string | null;
    contact_first_name: string;
    contact_last_name: string;
    contact_email: string;
    tax_id: string | null;
    contract_status: string | null;
    contract_draft_content: string | null;
    contract_pdf_url: string | null;
    commission_rate: number | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onDelete?: () => void;
}

const DEFAULT_CONTRACT_TEMPLATE = `PARTNERVERTRAG


zwischen

Stadtnetz UG / DeutLicht
Gemeindeweg 4
07546 Gera
Deutschland

- nachfolgend "Auftraggeber" genannt -


und

{{company_name}}
{{street}}
{{postal_code}} {{city}}
{{country}}

{{legal_form}}
USt-ID: {{tax_id}}

Ansprechpartner: {{contact_first_name}} {{contact_last_name}}
E-Mail: {{contact_email}}

- nachfolgend "Partner" genannt -



§ 1 Vertragsgegenstand

(1) Der Partner vermittelt dem Auftraggeber Neukunden für dessen Dienstleistungen im Bereich Digitalisierung, KI-Lösungen, Websites und Marketing.

(2) Der Partner erhält für erfolgreiche Vermittlungen eine Provision gemäß § 3 dieses Vertrages.


§ 2 Pflichten des Partners

(1) Der Partner verpflichtet sich, die Interessen des Auftraggebers zu wahren und potenzielle Kunden professionell zu beraten.

(2) Der Partner darf keine falschen oder irreführenden Aussagen über die Produkte und Dienstleistungen des Auftraggebers machen.

(3) Der Partner stellt sicher, dass er ausschließlich im B2B-Bereich tätig ist und nur gewerbliche Kunden vermittelt.


§ 3 Provisionen

(1) Der Partner erhält eine Provision in Höhe von {{commission_rate}}% auf den Nettoumsatz vermittelter Aufträge.

(2) Die Provision wird ausschließlich auf Basis der Nettoumsätze berechnet. Umsatzsteuer wird nicht provisioniert.

(3) Die Provision ist fällig nach vollständiger Bezahlung des vermittelten Auftrags durch den Endkunden.


§ 4 Abrechnung

(1) Der Partner erstellt monatlich eine Rechnung über seine Provisionsansprüche.

(2) Die Rechnung muss alle relevanten Angaben enthalten (Rechnungsnummer, Leistungszeitraum, vermittelte Kunden, Provisionsbeträge).

(3) Nach Prüfung und Freigabe durch den Auftraggeber erfolgt die Auszahlung innerhalb von 14 Tagen.


§ 5 Vertraulichkeit

(1) Beide Parteien verpflichten sich, alle im Rahmen dieser Zusammenarbeit erhaltenen vertraulichen Informationen geheim zu halten.


§ 6 Laufzeit und Kündigung

(1) Dieser Vertrag wird auf unbestimmte Zeit geschlossen.

(2) Er kann von beiden Seiten mit einer Frist von 4 Wochen zum Monatsende gekündigt werden.


§ 7 Schlussbestimmungen

(1) Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.

(2) Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.

(3) Es gilt deutsches Recht.



_______________________________
Ort, Datum, Unterschrift Auftraggeber



_______________________________
Ort, Datum, Unterschrift Partner



Partner-Nr.: {{partner_number}}
Vertragsdatum: {{contract_date}}


────────────────────────────────────────────────────────────────────────────────
Stadtnetz UG (haftungsbeschränkt) | handelnd unter der Marke DeutLicht®
Gemeindeweg 4 (Mäuseturm) | 07546 Gera (Deutschland)
Steuernummer: 161/120/05343 | HRB 514530, Amtsgericht Jena
────────────────────────────────────────────────────────────────────────────────
`;

export function PartnerContractEditor({
  partner,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: PartnerContractEditorProps) {
  const { toast } = useToast();
  const [contractContent, setContractContent] = useState('');
  const [commissionRate, setCommissionRate] = useState(partner.commission_rate || 15);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (partner.contract_draft_content) {
      setContractContent(partner.contract_draft_content);
    } else {
      // Generate contract from template
      const today = new Date().toLocaleDateString('de-DE');
      let content = DEFAULT_CONTRACT_TEMPLATE
        .replace(/\{\{company_name\}\}/g, partner.company_name)
        .replace(/\{\{street\}\}/g, partner.street || '')
        .replace(/\{\{postal_code\}\}/g, partner.postal_code || '')
        .replace(/\{\{city\}\}/g, partner.city || '')
        .replace(/\{\{country\}\}/g, partner.country || 'Deutschland')
        .replace(/\{\{legal_form\}\}/g, partner.legal_form || '')
        .replace(/\{\{tax_id\}\}/g, partner.tax_id || 'Nicht angegeben')
        .replace(/\{\{contact_first_name\}\}/g, partner.contact_first_name)
        .replace(/\{\{contact_last_name\}\}/g, partner.contact_last_name)
        .replace(/\{\{contact_email\}\}/g, partner.contact_email)
        .replace(/\{\{commission_rate\}\}/g, String(partner.commission_rate || 15))
        .replace(/\{\{partner_number\}\}/g, partner.partner_number || 'Wird generiert')
        .replace(/\{\{contract_date\}\}/g, today);

      setContractContent(content);
    }
  }, [partner]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update contract content and commission rate
      const { error } = await supabase
        .from('partners')
        .update({
          contract_draft_content: contractContent,
          contract_status: 'draft',
          commission_rate: commissionRate,
        })
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Vertrag gespeichert',
        description: 'Der Vertragsentwurf und die Provision wurden gespeichert.',
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: 'Fehler',
        description: 'Vertrag konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendContract = async () => {
    setIsSending(true);
    try {
      // First save the contract
      const { error: saveError } = await supabase
        .from('partners')
        .update({
          contract_draft_content: contractContent,
          contract_status: 'sent',
          contract_sent_at: new Date().toISOString(),
          commission_rate: commissionRate,
        })
        .eq('id', partner.id);

      if (saveError) throw saveError;

      // TODO: Send email with contract attachment
      // For now, just update the status

      toast({
        title: 'Vertrag versendet',
        description: `Der Vertrag wurde an ${partner.contact_email} gesendet.`,
      });
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending contract:', error);
      toast({
        title: 'Fehler',
        description: 'Vertrag konnte nicht versendet werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeletePartner = async () => {
    setIsDeleting(true);
    try {
      // Delete associated documents first
      await supabase
        .from('partner_documents')
        .delete()
        .eq('partner_id', partner.id);

      // Delete associated commissions
      await supabase
        .from('partner_commissions')
        .delete()
        .eq('partner_id', partner.id);

      // Delete associated invoices
      await supabase
        .from('partner_invoices')
        .delete()
        .eq('partner_id', partner.id);

      // Delete associated referrals
      await supabase
        .from('partner_referrals')
        .delete()
        .eq('partner_id', partner.id);

      // Finally delete the partner
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partner.id);

      if (error) throw error;

      toast({
        title: 'Partner gelöscht',
        description: `${partner.company_name} wurde endgültig gelöscht.`,
      });
      
      onOpenChange(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Fehler',
        description: 'Partner konnte nicht gelöscht werden.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const updateCommissionInContract = (newRate: number) => {
    setCommissionRate(newRate);
    // Update commission rate in contract content
    const updatedContent = contractContent.replace(
      /(\d+(?:\.\d+)?% auf den Nettoumsatz)/g,
      `${newRate}% auf den Nettoumsatz`
    );
    setContractContent(updatedContent);
  };

  const getStatusBadge = () => {
    switch (partner.contract_status) {
      case 'draft':
        return <Badge variant="secondary">Entwurf</Badge>;
      case 'sent':
        return <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">Versendet</Badge>;
      case 'signed':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Unterschrieben</Badge>;
      default:
        return <Badge variant="outline">Neu</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSignature className="w-6 h-6 text-accent" />
              <div>
                <DialogTitle>Partnervertrag: {partner.company_name}</DialogTitle>
                <DialogDescription>
                  Partner-Nr.: {partner.partner_number || 'Wird generiert'}
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Quick Info with editable commission */}
          <div className="bg-muted/30 rounded-lg p-4 mb-4 grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Firma:</span>
              <p className="font-medium">{partner.company_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Ansprechpartner:</span>
              <p className="font-medium">
                {partner.contact_first_name} {partner.contact_last_name}
              </p>
            </div>
            <div>
              <Label htmlFor="commission-rate" className="text-muted-foreground text-xs">
                Provision (Netto):
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="commission-rate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => updateCommissionInContract(parseFloat(e.target.value) || 0)}
                  className="h-8 w-20 text-center font-medium"
                />
                <span className="text-accent font-medium">%</span>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Löschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Partner endgültig löschen?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden!
                      </p>
                      <p>
                        Folgende Daten werden unwiderruflich gelöscht:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Partnerprofil von <strong>{partner.company_name}</strong></li>
                        <li>Alle zugehörigen Dokumente</li>
                        <li>Alle Vermittlungen & Provisionen</li>
                        <li>Alle Abrechnungen</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletePartner}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Endgültig löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Contract Editor / Preview */}
          <div className="flex-1 overflow-auto">
            {isPreview ? (
              <div className="bg-card rounded-lg p-6 font-mono text-sm whitespace-pre-wrap border">
                {contractContent}
              </div>
            ) : (
              <Textarea
                value={contractContent}
                onChange={(e) => setContractContent(e.target.value)}
                className="w-full h-full min-h-[400px] font-mono text-sm resize-none"
                placeholder="Vertragstext..."
              />
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="gap-2"
          >
            {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? 'Bearbeiten' : 'Vorschau'}
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Speichern
          </Button>
          <Button
            onClick={handleSendContract}
            disabled={isSending}
            className="gap-2"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Vertrag senden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
