import FormField from "../FormField";
import { KlarheitsCheckData } from "../types";

interface StepZusammenarbeitProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const StepZusammenarbeit = ({ data, onChange }: StepZusammenarbeitProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Zusammenarbeit</h2>
        <p className="text-muted-foreground">
          Wie können wir optimal zusammenarbeiten?
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          type="text"
          name="decision_maker"
          label="Wer trifft die Entscheidungen?"
          value={data.decision_maker}
          onChange={(v) => onChange('decision_maker', v)}
          placeholder="Name und Position"
        />

        <FormField
          type="text"
          name="stakeholders"
          label="Weitere Beteiligte / Stakeholder"
          value={data.stakeholders}
          onChange={(v) => onChange('stakeholders', v)}
          placeholder="z.B. IT-Abteilung, Marketing, Geschäftsleitung"
        />

        <FormField
          type="radio"
          name="communication_preference"
          label="Bevorzugte Kommunikation"
          value={data.communication_preference}
          onChange={(v) => onChange('communication_preference', v)}
          options={[
            { value: 'regelmaessig', label: 'Regelmäßige Updates (z.B. wöchentlich)' },
            { value: 'meilensteine', label: 'Bei Meilensteinen' },
            { value: 'bedarf', label: 'Bei Bedarf' },
          ]}
        />

        <FormField
          type="textarea"
          name="additional_notes"
          label="Zusätzliche Anmerkungen"
          value={data.additional_notes}
          onChange={(v) => onChange('additional_notes', v)}
          placeholder="Gibt es noch etwas, das wir wissen sollten?"
          rows={4}
        />
      </div>
    </div>
  );
};

export default StepZusammenarbeit;
