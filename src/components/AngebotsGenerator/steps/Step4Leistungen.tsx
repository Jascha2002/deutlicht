import FormField from "../FormField";
import { KlarheitsCheckData, SERVICES } from "../types";

interface Step4Props {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const Step4Leistungen = ({ data, onChange }: Step4Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Leistungsbereiche</h2>
        <p className="text-muted-foreground">
          Welche Leistungen benötigen Sie? (Mehrfachauswahl möglich)
        </p>
      </div>

      <FormField
        type="checkbox-group"
        name="services_needed"
        label="Gewünschte Leistungen"
        value={data.services_needed}
        onChange={(v) => onChange('services_needed', v)}
        options={SERVICES}
        required
      />

      {data.services_needed.length > 0 && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Ausgewählt:</strong> {data.services_needed.join(', ')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Im nächsten Schritt werden wir detaillierte Fragen zu Ihren ausgewählten Leistungen stellen.
          </p>
        </div>
      )}
    </div>
  );
};

export default Step4Leistungen;
