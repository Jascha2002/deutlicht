// Reporting-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface ReportingModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const ReportingModule: React.FC<ReportingModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Reporting & Kennzahlen</h3>
        <p className="text-muted-foreground">KPIs, Dashboards & Datenqualität</p>
      </div>

      {/* Kennzahlen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Kennzahlen (KPIs)</h4>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <AnalyseFormField
            type="checkbox"
            name="kennzahlen_erfasst"
            label="Kennzahlen werden systematisch erfasst"
            value={data.kennzahlen_erfasst}
            onChange={(v) => onChange('kennzahlen_erfasst', v)}
          />
        </div>
        <AnalyseFormField
          type="multiselect"
          name="kennzahlen_liste"
          label="Welche Kennzahlen werden verfolgt?"
          value={data.kennzahlen_liste}
          onChange={(v) => onChange('kennzahlen_liste', v)}
          options={DROPDOWN_OPTIONS.kennzahlen_liste}
        />
      </div>

      {/* Dashboard */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Dashboard & Visualisierung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="dashboard_vorhanden"
            label="Dashboard vorhanden"
            value={data.dashboard_vorhanden}
            onChange={(v) => onChange('dashboard_vorhanden', v)}
          />
          <AnalyseFormField
            type="text"
            name="dashboard_tool"
            label="Dashboard-Tool"
            value={data.dashboard_tool}
            onChange={(v) => onChange('dashboard_tool', v)}
            placeholder="z.B. Power BI, Excel, Tableau, ERP-integriert..."
          />
        </div>
      </div>

      {/* Reporting-Prozess */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Reporting-Prozess</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="reporting_frequenz"
            label="Wie oft wird berichtet?"
            value={data.reporting_frequenz}
            onChange={(v) => onChange('reporting_frequenz', v)}
            options={DROPDOWN_OPTIONS.reporting_frequenz}
          />
          <AnalyseFormField
            type="select"
            name="reporting_automatisiert"
            label="Automatisierungsgrad"
            value={data.reporting_automatisiert}
            onChange={(v) => onChange('reporting_automatisiert', v)}
            options={['Vollautomatisch', 'Teilautomatisiert', 'Manuell']}
          />
          <AnalyseFormField
            type="text"
            name="auswertungen_basis"
            label="Basis für Auswertungen"
            value={data.auswertungen_basis}
            onChange={(v) => onChange('auswertungen_basis', v)}
            placeholder="z.B. ERP-Exporte, Excel, Datenbank..."
          />
          <AnalyseFormField
            type="select"
            name="datenqualitaet"
            label="Datenqualität / Vertrauen in Zahlen"
            value={data.datenqualitaet}
            onChange={(v) => onChange('datenqualitaet', v)}
            options={DROPDOWN_OPTIONS.qualitaet}
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="reporting_zusatz"
          label="Weitere Anmerkungen zum Reporting"
          value={data.reporting_zusatz}
          onChange={(v) => onChange('reporting_zusatz', v)}
          placeholder="Gibt es spezielle Anforderungen an Auswertungen oder bekannte Probleme mit der Datenqualität?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ReportingModule;
