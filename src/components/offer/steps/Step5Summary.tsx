import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OfferFormData } from '@/types/offer';
import { getApproximatePriceRange, formatCurrencyRange } from '@/lib/pricingRanges';
import { Edit2, CheckCircle, Info } from 'lucide-react';
import stepZusammenfassungImg from '@/assets/step-zusammenfassung.jpg';

interface Step5Props {
  formData: OfferFormData;
  onGoToStep: (step: number) => void;
}

export const Step5Summary = ({ formData, onGoToStep }: Step5Props) => {
  // Grober Preisrahmen basierend auf Preismatrix ±25%
  const priceRange = getApproximatePriceRange(formData);

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stepZusammenfassungImg} 
          alt="Zusammenfassung" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <CardTitle className="text-2xl text-foreground">Zusammenfassung</CardTitle>
          <CardDescription className="text-muted-foreground">Überprüfen Sie Ihre Angaben vor dem Absenden</CardDescription>
        </div>
      </div>
      <CardHeader className="pt-4 pb-2" />
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
            <div className="text-muted-foreground">Adresse:</div>
            <div className="font-medium">
              {formData.company_street ? `${formData.company_street}, ${formData.company_zip} ${formData.company_city}` : '-'}
            </div>
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

        {/* Grobe Orientierung statt exakter Preise */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Ihr individuelles Angebot</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nach Absenden Ihrer Anfrage erstellen wir Ihnen ein maßgeschneidertes Angebot,
                das Ihre spezifischen Anforderungen und Wünsche berücksichtigt.
              </p>
              
              {formData.services_selected.length > 0 && (
                <div className="bg-background rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Grober Orientierungsrahmen</div>
                  <div className="text-xl font-semibold text-primary">
                    {formatCurrencyRange(priceRange.minSetup, priceRange.maxSetup)}
                  </div>
                  {priceRange.fixedMonthly > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      zzgl. {priceRange.fixedMonthly.toLocaleString('de-DE')} €/Monat (Hosting & Service)
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    * Der tatsächliche Preis wird individuell nach persönlicher Beratung kalkuliert
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Mit dem Absenden stimmen Sie zu, dass wir Sie zur Angebotserstellung kontaktieren.
        </p>
      </CardContent>
    </Card>
  );
};
