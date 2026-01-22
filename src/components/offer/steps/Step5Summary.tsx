import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OfferFormData } from '@/types/offer';
import { calcTotal } from '@/lib/pricing';
import { FileText, Edit2, CheckCircle } from 'lucide-react';

interface Step5Props {
  formData: OfferFormData;
  onGoToStep: (step: number) => void;
}

export const Step5Summary = ({ formData, onGoToStep }: Step5Props) => {
  const totals = calcTotal(formData);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE') + ' €';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Zusammenfassung</CardTitle>
        <CardDescription>Überprüfen Sie Ihre Angaben vor dem Absenden</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Info */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">Unternehmensdaten</h3>
            <Button variant="ghost" size="sm" onClick={() => onGoToStep(1)}>
              <Edit2 className="w-4 h-4 mr-1" />
              Bearbeiten
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Unternehmen:</div>
            <div className="font-medium">{formData.company_name || '-'}</div>
            <div className="text-muted-foreground">Ansprechpartner:</div>
            <div className="font-medium">{formData.contact_person || '-'}</div>
            <div className="text-muted-foreground">Branche:</div>
            <div className="font-medium">
              {formData.industry === 'Andere' ? formData.industry_other : formData.industry || '-'}
            </div>
            <div className="text-muted-foreground">Größe:</div>
            <div className="font-medium">{formData.company_size} Mitarbeiter</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">Kontakt & Zeitplan</h3>
            <Button variant="ghost" size="sm" onClick={() => onGoToStep(2)}>
              <Edit2 className="w-4 h-4 mr-1" />
              Bearbeiten
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">E-Mail:</div>
            <div className="font-medium">{formData.customer_email || '-'}</div>
            <div className="text-muted-foreground">Telefon:</div>
            <div className="font-medium">{formData.customer_phone || '-'}</div>
            <div className="text-muted-foreground">Projektstart:</div>
            <div className="font-medium">{formData.project_start_timing || '-'}</div>
            <div className="text-muted-foreground">Fertigstellung:</div>
            <div className="font-medium">{formData.project_deadline || '-'}</div>
          </div>
        </div>

        {/* Services */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">Gewählte Leistungen</h3>
            <Button variant="ghost" size="sm" onClick={() => onGoToStep(3)}>
              <Edit2 className="w-4 h-4 mr-1" />
              Bearbeiten
            </Button>
          </div>
          <div className="space-y-2">
            {formData.services_selected.length > 0 ? (
              formData.services_selected.map((service) => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {service}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">Keine Leistungen ausgewählt</div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="font-semibold text-lg mb-4">💰 Geschätzte Kosten</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Einrichtung</div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totals.setup)}</div>
              <div className="text-xs text-muted-foreground">netto, einmalig</div>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Monatlich</div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totals.monthly)}</div>
              <div className="text-xs text-muted-foreground">netto, laufend</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Alle Preise verstehen sich netto zzgl. MwSt. | Unverbindliche Kalkulation
        </p>
      </CardContent>
    </Card>
  );
};
