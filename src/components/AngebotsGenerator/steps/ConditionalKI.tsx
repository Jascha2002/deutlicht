import FormField from "../FormField";
import { KlarheitsCheckData, AI_USE_CASES, EXISTING_SYSTEMS, AI_GOALS } from "../types";

interface ConditionalKIProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const ConditionalKI = ({ data, onChange }: ConditionalKIProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">KI-Agenten & Automation</h3>
          <p className="text-sm text-muted-foreground">Details zu Ihrer Automatisierungsstrategie</p>
        </div>
      </div>

      <FormField
        type="checkbox-group"
        name="ai_use_cases"
        label="Einsatzbereiche für KI"
        value={data.ai_use_cases}
        onChange={(v) => onChange('ai_use_cases', v)}
        options={AI_USE_CASES}
      />

      <FormField
        type="checkbox-group"
        name="existing_systems"
        label="Vorhandene Systeme"
        value={data.existing_systems}
        onChange={(v) => onChange('existing_systems', v)}
        options={EXISTING_SYSTEMS}
      />

      <FormField
        type="checkbox-group"
        name="ai_goals"
        label="Ziele der KI-Integration"
        value={data.ai_goals}
        onChange={(v) => onChange('ai_goals', v)}
        options={AI_GOALS}
      />

      <FormField
        type="radio"
        name="gdpr_status"
        label="DSGVO-Status"
        value={data.gdpr_status}
        onChange={(v) => onChange('gdpr_status', v)}
        options={[
          { value: 'geklaert', label: 'Geklärt' },
          { value: 'ungeklaert', label: 'Ungeklärt' },
          { value: 'beratung', label: 'Beratung gewünscht' },
        ]}
      />
    </div>
  );
};

export default ConditionalKI;
