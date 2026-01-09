import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { KlarheitsCheckData, SOCIAL_PLATFORMS, SOCIAL_GOALS } from "../types";

interface ConditionalSocialMediaProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const ConditionalSocialMedia = ({ data, onChange }: ConditionalSocialMediaProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-lg">📱</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Social Media Marketing</h3>
          <p className="text-sm text-muted-foreground">Details zu Ihrer Social-Media-Strategie</p>
        </div>
      </div>

      <FormField
        type="checkbox-group"
        name="platforms"
        label="Welche Plattformen?"
        value={data.platforms}
        onChange={(v) => onChange('platforms', v)}
        options={SOCIAL_PLATFORMS}
      />

      <FormField
        type="checkbox-group"
        name="social_goals"
        label="Ziele im Social Media"
        value={data.social_goals}
        onChange={(v) => onChange('social_goals', v)}
        options={SOCIAL_GOALS}
      />

      <FormField
        type="radio"
        name="posting_frequency"
        label="Gewünschte Posting-Frequenz"
        value={data.posting_frequency}
        onChange={(v) => onChange('posting_frequency', v)}
        options={[
          { value: 'woechentlich', label: 'Einmal pro Woche' },
          { value: 'mehrmals-woche', label: 'Mehrmals pro Woche' },
          { value: '14-taegig', label: '14-tägig' },
          { value: 'anderes', label: 'Anderes' },
        ]}
      />

      {data.posting_frequency === 'anderes' && (
        <div className="pl-4 border-l-2 border-primary/30">
          <label className="text-sm font-medium block mb-2">
            Andere Frequenz
          </label>
          <Input
            value={data.posting_frequency_other}
            onChange={(e) => onChange('posting_frequency_other', e.target.value)}
            placeholder="z.B. monatlich, nur bei Events..."
            className="bg-background"
          />
        </div>
      )}

      <FormField
        type="radio"
        name="content_provider"
        label="Wer erstellt die Inhalte?"
        value={data.content_provider}
        onChange={(v) => onChange('content_provider', v)}
        options={[
          { value: 'kunde', label: 'Wir (Kunde)' },
          { value: 'deutlicht', label: 'DeutLicht' },
          { value: 'gemeinsam', label: 'Gemeinsam' },
        ]}
      />
    </div>
  );
};

export default ConditionalSocialMedia;
