import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { KlarheitsCheckData, PROJECT_GOALS } from "../types";

interface Step2Props {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const Step2Projektanlass = ({ data, onChange }: Step2Props) => {
  const showOtherField = data.project_goals.includes('Sonstiges');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Projektanlass</h2>
        <p className="text-muted-foreground">
          Was möchten Sie mit diesem Projekt erreichen?
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          type="checkbox-group"
          name="project_goals"
          label="Projektziele"
          value={data.project_goals}
          onChange={(v) => onChange('project_goals', v)}
          options={[...PROJECT_GOALS, 'Sonstiges']}
          required
        />

        {showOtherField && (
          <div className="pl-4 border-l-2 border-primary/30">
            <label className="text-sm font-medium block mb-2">
              Sonstiges Ziel beschreiben
            </label>
            <Input
              value={data.project_goal_other}
              onChange={(e) => onChange('project_goal_other', e.target.value)}
              placeholder="Ihr spezielles Ziel..."
              className="bg-background"
            />
          </div>
        )}

        <FormField
          type="textarea"
          name="main_challenge"
          label="Hauptherausforderung"
          value={data.main_challenge}
          onChange={(v) => onChange('main_challenge', v)}
          placeholder="Beschreiben Sie kurz Ihre größte Herausforderung oder das Problem, das Sie lösen möchten..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default Step2Projektanlass;
