import FormField from "../FormField";
import { KlarheitsCheckData } from "../types";

interface Step3Props {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const Step3ZeitRahmen = ({ data, onChange }: Step3Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Zeit & Rahmen</h2>
        <p className="text-muted-foreground">
          Wann soll es losgehen und welche Rahmenbedingungen gibt es?
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          type="radio"
          name="project_start"
          label="Gewünschter Projektstart"
          value={data.project_start}
          onChange={(v) => onChange('project_start', v)}
          options={[
            { value: 'sofort', label: 'Sofort / schnellstmöglich' },
            { value: '1-3-monate', label: 'In 1–3 Monaten' },
            { value: 'offen', label: 'Später / offen' },
          ]}
          required
        />

        <FormField
          type="date"
          name="project_end"
          label="Gewünschter Abschlusstermin (falls bekannt)"
          value={data.project_end}
          onChange={(v) => onChange('project_end', v)}
        />

        <FormField
          type="radio"
          name="fixed_deadline"
          label="Gibt es einen festen Termin?"
          value={data.fixed_deadline}
          onChange={(v) => onChange('fixed_deadline', v)}
          options={[
            { value: 'ja', label: 'Ja, fester Termin' },
            { value: 'nein', label: 'Nein, flexibel' },
          ]}
        />

        <FormField
          type="text"
          name="budget_range"
          label="Budgetrahmen (optional)"
          value={data.budget_range}
          onChange={(v) => onChange('budget_range', v)}
          placeholder="z.B. 5.000–10.000 € oder 'nach Abstimmung'"
        />
      </div>
    </div>
  );
};

export default Step3ZeitRahmen;
