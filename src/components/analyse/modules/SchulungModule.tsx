// Schulung & Wissen Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface SchulungModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const SchulungModule: React.FC<SchulungModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Wissen & Schulung</h3>
        <p className="text-muted-foreground">Onboarding, Dokumentation & Weiterbildung</p>
      </div>

      {/* Onboarding */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Onboarding neuer Mitarbeiter</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="text"
            name="onboarding_prozess"
            label="Wie läuft das Onboarding ab?"
            value={data.onboarding_prozess}
            onChange={(v) => onChange('onboarding_prozess', v)}
            placeholder="z.B. Einarbeitungsplan, Mentoring, Learning by Doing..."
          />
          <AnalyseFormField
            type="text"
            name="onboarding_dauer"
            label="Durchschnittliche Einarbeitungsdauer"
            value={data.onboarding_dauer}
            onChange={(v) => onChange('onboarding_dauer', v)}
            placeholder="z.B. 2 Wochen, 1 Monat..."
          />
          <AnalyseFormField
            type="checkbox"
            name="onboarding_dokumentiert"
            label="Onboarding-Prozess dokumentiert"
            value={data.onboarding_dokumentiert}
            onChange={(v) => onChange('onboarding_dokumentiert', v)}
          />
        </div>
      </div>

      {/* Arbeitsanweisungen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Arbeitsanweisungen & SOPs</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="arbeitsanweisungen_vorhanden"
            label="Arbeitsanweisungen vorhanden"
            value={data.arbeitsanweisungen_vorhanden}
            onChange={(v) => onChange('arbeitsanweisungen_vorhanden', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="arbeitsanweisungen_aktuell"
            label="Anweisungen sind aktuell"
            value={data.arbeitsanweisungen_aktuell}
            onChange={(v) => onChange('arbeitsanweisungen_aktuell', v)}
          />
          <AnalyseFormField
            type="text"
            name="arbeitsanweisungen_format"
            label="Format der Anweisungen"
            value={data.arbeitsanweisungen_format}
            onChange={(v) => onChange('arbeitsanweisungen_format', v)}
            placeholder="z.B. PDF, Wiki, Word, Videos..."
          />
        </div>
      </div>

      {/* Wissensdatenbank */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Wissensdatenbank</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="wissensdatenbank_vorhanden"
            label="Zentrale Wissensdatenbank vorhanden"
            value={data.wissensdatenbank_vorhanden}
            onChange={(v) => onChange('wissensdatenbank_vorhanden', v)}
          />
          <AnalyseFormField
            type="text"
            name="wissensdatenbank_tool"
            label="Welches Tool wird genutzt?"
            value={data.wissensdatenbank_tool}
            onChange={(v) => onChange('wissensdatenbank_tool', v)}
            placeholder="z.B. Confluence, Notion, SharePoint, Wiki..."
          />
        </div>
      </div>

      {/* Weiterbildung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Weiterbildung & Schulungen</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="schulungen_regelmaessig"
            label="Regelmäßige Schulungen"
            value={data.schulungen_regelmaessig}
            onChange={(v) => onChange('schulungen_regelmaessig', v)}
          />
          <AnalyseFormField
            type="text"
            name="schulungen_intern_extern"
            label="Intern oder extern?"
            value={data.schulungen_intern_extern}
            onChange={(v) => onChange('schulungen_intern_extern', v)}
            placeholder="z.B. hauptsächlich intern, externe Trainer..."
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="schulung_zusatz"
          label="Weitere Anmerkungen zu Wissen & Schulung"
          value={data.schulung_zusatz}
          onChange={(v) => onChange('schulung_zusatz', v)}
          placeholder="Gibt es Wissenslücken oder besondere Schulungsbedarfe?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default SchulungModule;
