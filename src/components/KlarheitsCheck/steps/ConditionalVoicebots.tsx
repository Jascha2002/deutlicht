import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { KlarheitsCheckData, VOICEBOT_USE_CASES } from "../types";

interface ConditionalVoicebotsProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const ConditionalVoicebots = ({ data, onChange }: ConditionalVoicebotsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-lg">🎙️</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Voicebots / Sprachassistenz</h3>
          <p className="text-sm text-muted-foreground">Details zu Ihrer Sprachassistenz-Lösung</p>
        </div>
      </div>

      <FormField
        type="checkbox-group"
        name="voicebot_use_cases"
        label="Einsatzbereiche für Voicebots"
        value={data.voicebot_use_cases}
        onChange={(v) => onChange('voicebot_use_cases', v)}
        options={VOICEBOT_USE_CASES}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium block">
          Unterstützte Sprachen
        </label>
        <Input
          value={data.voicebot_languages}
          onChange={(e) => onChange('voicebot_languages', e.target.value)}
          placeholder="z.B. Deutsch, Englisch, Französisch"
          className="bg-background"
        />
      </div>

      <FormField
        type="radio"
        name="automation_level"
        label="Gewünschter Automatisierungsgrad"
        value={data.automation_level}
        onChange={(v) => onChange('automation_level', v)}
        options={[
          { value: 'weiterleitung', label: 'Weiterleitung an Mitarbeiter' },
          { value: 'vorqualifizierung', label: 'Vorqualifizierung + Weiterleitung' },
          { value: 'vollautomatisiert', label: 'Vollautomatisierte Bearbeitung' },
        ]}
      />
    </div>
  );
};

export default ConditionalVoicebots;
