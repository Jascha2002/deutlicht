import FormField from "../FormField";
import { Input } from "@/components/ui/input";
import { KlarheitsCheckData, WEBSITE_GOALS, WEBSITE_FEATURES, CMS_SYSTEMS } from "../types";

interface ConditionalWebsiteProps {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const ConditionalWebsite = ({ data, onChange }: ConditionalWebsiteProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary text-lg">🌐</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Website</h3>
          <p className="text-sm text-muted-foreground">Details zu Ihrem Website-Projekt</p>
        </div>
      </div>

      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <FormField
          type="radio"
          name="existing_website"
          label="Website vorhanden?"
          value={data.existing_website}
          onChange={(v) => onChange('existing_website', v)}
          options={[
            { value: 'ja', label: 'Ja, ich habe bereits eine Website' },
            { value: 'nein', label: 'Nein, ich benötige eine neue Website' },
          ]}
        />
      </div>

      {data.existing_website === 'ja' && (
        <div className="pl-4 border-l-2 border-primary/30 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Aktuelle Website-URL
            </label>
            <Input
              value={data.website_url}
              onChange={(e) => onChange('website_url', e.target.value)}
              placeholder="https://www.ihre-website.de"
              className="bg-background"
            />
          </div>

          <FormField
            type="radio"
            name="existing_cms"
            label="Welches CMS-System wird aktuell verwendet?"
            value={data.existing_cms}
            onChange={(v) => onChange('existing_cms', v)}
            options={CMS_SYSTEMS.map(cms => ({ value: cms.toLowerCase(), label: cms }))}
          />

          {data.existing_cms === 'andere' && (
            <div>
              <label className="text-sm font-medium block mb-2">
                Welches CMS-System?
              </label>
              <Input
                value={data.existing_cms_other}
                onChange={(e) => onChange('existing_cms_other', e.target.value)}
                placeholder="z.B. Contao, Joomla, ..."
                className="bg-background"
              />
            </div>
          )}

          <FormField
            type="radio"
            name="website_takeover_needed"
            label="Sollen wir die bestehende Website übernehmen und pflegen?"
            value={data.website_takeover_needed}
            onChange={(v) => onChange('website_takeover_needed', v)}
            options={[
              { value: 'ja', label: 'Ja, Übernahme & Pflege gewünscht' },
              { value: 'nein', label: 'Nein, nur neue Seiten/Inhalte' },
            ]}
          />

          <div>
            <label className="text-sm font-medium block mb-2">
              Anzahl gewünschter Zusatzseiten (falls neue Seiten benötigt)
            </label>
            <Input
              type="number"
              min="0"
              value={data.additional_pages_count || ''}
              onChange={(e) => onChange('additional_pages_count', e.target.value)}
              placeholder="z.B. 5"
              className="bg-background w-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leer lassen, falls keine neuen Seiten benötigt werden
            </p>
          </div>
        </div>
      )}

      <FormField
        type="checkbox-group"
        name="website_goals"
        label="Hauptziele der Website"
        value={data.website_goals}
        onChange={(v) => onChange('website_goals', v)}
        options={WEBSITE_GOALS}
      />

      <FormField
        type="radio"
        name="content_creation"
        label="Wer erstellt die Inhalte?"
        value={data.content_creation}
        onChange={(v) => onChange('content_creation', v)}
        options={[
          { value: 'kunde', label: 'Wir (Kunde)' },
          { value: 'deutlicht', label: 'DeutLicht' },
          { value: 'gemeinsam', label: 'Gemeinsam' },
        ]}
      />

      <FormField
        type="checkbox-group"
        name="required_features"
        label="Benötigte Funktionen"
        value={data.required_features}
        onChange={(v) => onChange('required_features', v)}
        options={WEBSITE_FEATURES}
      />
    </div>
  );
};

export default ConditionalWebsite;
