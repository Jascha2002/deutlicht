import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Zap, Building2, UserPlus, FileText, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type TaxRegion = Database['public']['Enums']['tax_region'];

interface QuickEntryDialogProps {
  onCompanyCreated?: (companyId: string) => void;
  trigger?: React.ReactNode;
}

const CONTACT_TYPES = [
  { value: 'lead', label: 'Lead', description: 'Erstanfrage, noch kein direkter Kontakt', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-300' },
  { value: 'interessent', label: 'Interessent', description: 'Persönlicher Kontakt, Interesse bekundet', color: 'bg-blue-500/10 text-blue-700 border-blue-300' },
  { value: 'kunde', label: 'Kunde', description: 'Auftrag erteilt oder Bestandskunde', color: 'bg-green-500/10 text-green-700 border-green-300' },
];

const SOURCE_CHANNELS = [
  { value: 'vertrieb', label: 'Vertrieb vor Ort', icon: '🤝' },
  { value: 'telefon', label: 'Telefonischer Kontakt', icon: '📞' },
  { value: 'website', label: 'Website-Anfrage', icon: '🌐' },
  { value: 'partner', label: 'Partner-Empfehlung', icon: '🔗' },
  { value: 'messe', label: 'Messe/Event', icon: '🎪' },
  { value: 'empfehlung', label: 'Kundenempfehlung', icon: '⭐' },
];

export function QuickEntryDialog({ onCompanyCreated, trigger }: QuickEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);
  const [smartPasteText, setSmartPasteText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Klassifizierung
    contact_type: 'interessent',
    source_channel: 'vertrieb',
    // Firma
    company_name: '',
    trade_name: '',
    legal_form: '',
    industry: '',
    // Kontaktperson
    contact_person_name: '',
    contact_person_position: '',
    contact_person_email: '',
    contact_person_phone: '',
    // Adresse
    street: '',
    street_number: '',
    postal_code: '',
    city: '',
    country: 'Deutschland',
    country_code: 'DE',
    tax_region: 'deutschland' as TaxRegion,
    // Kontakt
    email: '',
    phone: '',
    website: '',
    // Notizen
    internal_notes: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setStep(1);
    setCreatedCompanyId(null);
    setSmartPasteText('');
    setFormData({
      contact_type: 'interessent',
      source_channel: 'vertrieb',
      company_name: '',
      trade_name: '',
      legal_form: '',
      industry: '',
      contact_person_name: '',
      contact_person_position: '',
      contact_person_email: '',
      contact_person_phone: '',
      street: '',
      street_number: '',
      postal_code: '',
      city: '',
      country: 'Deutschland',
      country_code: 'DE',
      tax_region: 'deutschland' as TaxRegion,
      email: '',
      phone: '',
      website: '',
      internal_notes: '',
    });
  };

  const handleSave = async () => {
    if (!formData.company_name.trim()) {
      toast({ title: 'Firmenname ist erforderlich', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('crm_companies')
        .insert({
          company_name: formData.company_name,
          trade_name: formData.trade_name || null,
          legal_form: formData.legal_form || null,
          industry: formData.industry || null,
          contact_type: formData.contact_type,
          source_channel: formData.source_channel,
          contact_person_name: formData.contact_person_name || null,
          contact_person_position: formData.contact_person_position || null,
          contact_person_email: formData.contact_person_email || null,
          contact_person_phone: formData.contact_person_phone || null,
          street: formData.street || null,
          street_number: formData.street_number || null,
          postal_code: formData.postal_code || null,
          city: formData.city || null,
          country: formData.country || null,
          country_code: formData.country_code || null,
          tax_region: formData.tax_region,
          email: formData.email || formData.contact_person_email || null,
          phone: formData.phone || formData.contact_person_phone || null,
          website: formData.website || null,
          internal_notes: formData.internal_notes || null,
        })
        .select('id')
        .single();

      if (error) throw error;

      setCreatedCompanyId(data.id);
      setStep(4); // success step
      toast({ title: `${formData.contact_type === 'kunde' ? 'Kunde' : formData.contact_type === 'lead' ? 'Lead' : 'Interessent'} erfolgreich angelegt!` });
      onCompanyCreated?.(data.id);
    } catch (error) {
      console.error('Error creating company:', error);
      toast({ title: 'Fehler', description: 'Firma konnte nicht angelegt werden.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-3 block">Kontakt-Typ</Label>
        <div className="grid grid-cols-3 gap-3">
          {CONTACT_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => updateField('contact_type', type.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                formData.contact_type === type.value
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <Badge className={type.color}>{type.label}</Badge>
              <p className="text-xs text-muted-foreground mt-2">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-3 block">Erfassungskanal</Label>
        <div className="grid grid-cols-3 gap-2">
          {SOURCE_CHANNELS.map(ch => (
            <button
              key={ch.value}
              onClick={() => updateField('source_channel', ch.value)}
              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                formData.source_channel === ch.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="mr-1">{ch.icon}</span> {ch.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim() || smartPasteText.trim().length < 5) {
      toast({ title: 'Bitte Text eingeben', variant: 'destructive' });
      return;
    }
    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-company-text', {
        body: { text: smartPasteText.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const d = data?.data;
      if (!d) throw new Error('Keine Daten erkannt');

      // Fill all fields that have values
      const fieldMap: Record<string, string> = {
        company_name: d.company_name || '',
        legal_form: d.legal_form || '',
        industry: d.industry || '',
        contact_person_name: d.contact_person_name || '',
        contact_person_position: d.contact_person_position || '',
        contact_person_email: d.contact_person_email || '',
        contact_person_phone: d.contact_person_phone || '',
        street: d.street || '',
        street_number: d.street_number || '',
        postal_code: d.postal_code || '',
        city: d.city || '',
        country: d.country || 'Deutschland',
        email: d.email || '',
        phone: d.phone || '',
        website: d.website || '',
        internal_notes: d.internal_notes || '',
      };

      setFormData(prev => {
        const updated = { ...prev };
        for (const [key, value] of Object.entries(fieldMap)) {
          if (value) (updated as any)[key] = value;
        }
        // Set country_code based on country
        if (updated.country && updated.country !== 'Deutschland') {
          updated.country_code = '';
          updated.tax_region = 'eu' as any;
        }
        return updated;
      });

      const filledCount = Object.values(fieldMap).filter(v => v).length;
      toast({ title: `${filledCount} Felder automatisch ausgefüllt` });
    } catch (err: any) {
      console.error('Smart paste error:', err);
      toast({ title: 'Fehler bei der Analyse', description: err?.message || 'Bitte manuell ausfüllen.', variant: 'destructive' });
    } finally {
      setIsParsing(false);
    }
  };

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Smart Paste */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          KI-Schnelleingabe
        </Label>
        <Textarea
          value={smartPasteText}
          onChange={e => setSmartPasteText(e.target.value)}
          placeholder={"Firmendaten hier einfügen, z.B.:\nMuster GmbH, Max Mustermann (GF)\nMusterstraße 12, 07545 Gera\nTel: 0365 123456, info@muster.de\nwww.muster.de, Branche: IT"}
          rows={4}
          className="text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSmartPaste}
          disabled={isParsing || !smartPasteText.trim()}
          className="w-full gap-2"
        >
          {isParsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isParsing ? 'Analysiere...' : 'Text analysieren & Felder ausfüllen'}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">oder manuell ausfüllen</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Firmenname *</Label>
          <Input value={formData.company_name} onChange={e => updateField('company_name', e.target.value)} placeholder="Muster GmbH" />
        </div>
        <div>
          <Label>Rechtsform</Label>
          <Select value={formData.legal_form || '_none'} onValueChange={v => updateField('legal_form', v === '_none' ? '' : v)}>
            <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">— Keine —</SelectItem>
              <SelectItem value="GmbH">GmbH</SelectItem>
              <SelectItem value="UG">UG (haftungsbeschränkt)</SelectItem>
              <SelectItem value="AG">AG</SelectItem>
              <SelectItem value="GbR">GbR</SelectItem>
              <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
              <SelectItem value="Freiberufler">Freiberufler</SelectItem>
              <SelectItem value="Sonstige">Sonstige</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Branche</Label>
          <Input value={formData.industry} onChange={e => updateField('industry', e.target.value)} placeholder="IT, Handel, Handwerk..." />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Ansprechpartner</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={formData.contact_person_name} onChange={e => updateField('contact_person_name', e.target.value)} placeholder="Max Mustermann" />
          </div>
          <div>
            <Label>Position</Label>
            <Input value={formData.contact_person_position} onChange={e => updateField('contact_person_position', e.target.value)} placeholder="Geschäftsführer" />
          </div>
          <div>
            <Label>E-Mail</Label>
            <Input type="email" value={formData.contact_person_email} onChange={e => updateField('contact_person_email', e.target.value)} placeholder="max@firma.de" />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input value={formData.contact_person_phone} onChange={e => updateField('contact_person_phone', e.target.value)} placeholder="+49 123 456789" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Straße</Label>
          <Input value={formData.street} onChange={e => updateField('street', e.target.value)} />
        </div>
        <div>
          <Label>Nr.</Label>
          <Input value={formData.street_number} onChange={e => updateField('street_number', e.target.value)} />
        </div>
        <div>
          <Label>PLZ</Label>
          <Input value={formData.postal_code} onChange={e => updateField('postal_code', e.target.value)} />
        </div>
        <div>
          <Label>Ort</Label>
          <Input value={formData.city} onChange={e => updateField('city', e.target.value)} />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Firmen-E-Mail</Label>
            <Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="info@firma.de" />
          </div>
          <div>
            <Label>Firmen-Telefon</Label>
            <Input value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+49 123 456789" />
          </div>
          <div>
            <Label>Website</Label>
            <Input value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="https://firma.de" />
          </div>
          <div>
            <Label>Steuerregion</Label>
            <Select value={formData.tax_region} onValueChange={v => updateField('tax_region', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="deutschland">Deutschland</SelectItem>
                <SelectItem value="eu">EU-Ausland</SelectItem>
                <SelectItem value="drittland">Drittland</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label>Interne Notizen</Label>
        <Textarea
          value={formData.internal_notes}
          onChange={e => updateField('internal_notes', e.target.value)}
          placeholder="Gesprächsnotizen, besondere Anforderungen..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6 py-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{formData.company_name} angelegt!</h3>
        <p className="text-muted-foreground mt-1">
          Als <Badge className={CONTACT_TYPES.find(t => t.value === formData.contact_type)?.color}>{CONTACT_TYPES.find(t => t.value === formData.contact_type)?.label}</Badge> über {SOURCE_CHANNELS.find(c => c.value === formData.source_channel)?.label}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            setOpen(false);
            // Navigate to offers tab - trigger via callback or use window event
            window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'offers', companyId: createdCompanyId } }));
          }}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          Jetzt Angebot erstellen
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" onClick={() => { resetForm(); }}>
          Weiteren Kontakt anlegen
        </Button>
        <Button variant="ghost" onClick={() => { setOpen(false); resetForm(); }}>
          Schließen
        </Button>
      </div>
    </div>
  );

  const stepTitles = ['Klassifizierung', 'Firmendaten', 'Adresse & Details', 'Fertig'];

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Zap className="w-4 h-4" />
            Schnellerfassung
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Schnellerfassung — {stepTitles[step - 1]}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        {step < 4 && (
          <div className="flex gap-1 mb-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        {step < 4 && (
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : setOpen(false)}>
              {step === 1 ? 'Abbrechen' : 'Zurück'}
            </Button>
            {step < 3 ? (
              <Button onClick={() => {
                if (step === 2 && !formData.company_name.trim()) {
                  toast({ title: 'Firmenname erforderlich', variant: 'destructive' });
                  return;
                }
                setStep(s => s + 1);
              }}>
                Weiter <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Speichern...' : 'Kontakt anlegen'}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
