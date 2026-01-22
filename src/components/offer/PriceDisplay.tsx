import { OfferFormData } from '@/types/offer';
import { calcTotal } from '@/lib/pricing';
import { TrendingUp } from 'lucide-react';

interface PriceDisplayProps {
  formData: OfferFormData;
}

export const PriceDisplay = ({ formData }: PriceDisplayProps) => {
  const totals = calcTotal(formData);

  if (formData.services_selected.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('de-DE') + ' €';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
          <TrendingUp className="w-4 h-4" />
          Live-Kalkulation
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground">Einrichtung</span>
            <span className="text-lg font-bold">{formatCurrency(totals.setup)}</span>
          </div>
          {totals.monthly > 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground">Monatlich</span>
              <span className="text-lg font-bold">{formatCurrency(totals.monthly)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
