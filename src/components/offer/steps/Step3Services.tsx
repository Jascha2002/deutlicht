import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OfferFormData, SERVICES } from '@/types/offer';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import stepLeistungenImg from '@/assets/step-leistungen.jpg';

interface Step3Props {
  formData: OfferFormData;
  onToggleService: (service: string) => void;
}

export const Step3Services = ({ formData, onToggleService }: Step3Props) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stepLeistungenImg} 
          alt="Gewünschte Leistungen" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <CardTitle className="text-2xl text-foreground">Gewünschte Leistungen</CardTitle>
          <CardDescription className="text-muted-foreground">
            Wählen Sie alle Services aus, die Sie interessieren{' '}
            <span className="text-primary">*</span>
          </CardDescription>
        </div>
      </div>
      <CardHeader className="pt-4 pb-2" />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service) => {
            const isSelected = formData.services_selected.includes(service.label);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onToggleService(service.label)}
                className={cn(
                  'relative p-6 rounded-xl border-2 text-left transition-all duration-150',
                  isSelected
                    ? 'border-primary bg-primary/[0.12] shadow-md'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/[0.05]'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="text-3xl mb-3">{service.icon}</div>
                <div className="font-medium">{service.label}</div>
              </button>
            );
          })}
        </div>

        {formData.services_selected.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-primary font-medium">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">
                {formData.services_selected.length}
              </span>{' '}
              {formData.services_selected.length === 1
                ? 'Leistung ausgewählt'
                : 'Leistungen ausgewählt'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
