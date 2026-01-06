import FormField from "../FormField";
import { KlarheitsCheckData, PROCESS_ISSUES, OPTIMIZATION_GOALS } from "../types";

interface ConditionalProzesseProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const ConditionalProzesse = ({ data, onChange }: ConditionalProzesseProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-lg">⚙️</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Prozessoptimierung / Digitalstrategie</h3>
          <p className="text-sm text-muted-foreground">Details zu Ihrer Prozessoptimierung</p>
        </div>
      </div>

      <FormField
        type="checkbox-group"
        name="current_issues"
        label="Aktuelle Probleme mit Prozessen"
        value={data.current_issues}
        onChange={(v) => onChange('current_issues', v)}
        options={PROCESS_ISSUES}
      />

      <FormField
        type="radio"
        name="documentation_available"
        label="Ist eine Prozessdokumentation vorhanden?"
        value={data.documentation_available}
        onChange={(v) => onChange('documentation_available', v)}
        options={[
          { value: 'ja', label: 'Ja' },
          { value: 'nein', label: 'Nein' },
          { value: 'teilweise', label: 'Teilweise' },
        ]}
      />

      <FormField
        type="checkbox-group"
        name="optimization_goals"
        label="Optimierungsziele"
        value={data.optimization_goals}
        onChange={(v) => onChange('optimization_goals', v)}
        options={OPTIMIZATION_GOALS}
      />
    </div>
  );
};

export default ConditionalProzesse;
