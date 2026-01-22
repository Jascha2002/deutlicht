import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OfferFormData, SERVICES } from '@/types/offer';
import { cn } from '@/lib/utils';
import { Check, Layers } from 'lucide-react';

interface Step3Props {
  formData: OfferFormData;
  onToggleService: (service: string) => void;
}

export const Step3Services = ({ formData, onToggleService }: Step3Props) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Gewünschte Leistungen</CardTitle>
        <CardDescription>
          Wählen Sie alle Services aus, die Sie interessieren{' '}
          <span className="text-primary">*</span>
        </CardDescription>
      </CardHeader>
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
                  'relative p-6 rounded-xl border-2 text-left transition-all duration-200',
                  'hover:border-primary/50 hover:shadow-md',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card'
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
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
