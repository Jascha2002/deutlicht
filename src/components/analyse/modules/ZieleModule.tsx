// Ziele-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface ZieleModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const ZieleModule: React.FC<ZieleModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Ziele & Strategie</h3>
        <p className="text-muted-foreground">Digitalisierungsziele, Schmerzpunkte, Budget & Förderung</p>
      </div>

      {/* Schmerzpunkte */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Aktuelle Herausforderungen / Schmerzpunkte</h4>
        <AnalyseFormField
          type="multiselect"
          name="schmerzpunkte"
          label="Welche Probleme bestehen aktuell?"
          value={data.schmerzpunkte}
          onChange={(v) => onChange('schmerzpunkte', v)}
          options={DROPDOWN_OPTIONS.schmerzpunkte_optionen}
        />
        <div className="mt-6">
          <AnalyseFormField
            type="textarea"
            name="schmerzpunkte_details"
            label="Details zu den Schmerzpunkten"
            value={data.schmerzpunkte_details}
            onChange={(v) => onChange('schmerzpunkte_details', v)}
            placeholder="Beschreiben Sie konkret, was am meisten Zeit kostet oder Probleme bereitet..."
            rows={4}
          />
        </div>
      </div>

      {/* Ziele */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Digitalisierungsziele</h4>
        <AnalyseFormField
          type="multiselect"
          name="ziele_konkret"
          label="Was soll durch Digitalisierung erreicht werden?"
          value={data.ziele_konkret}
          onChange={(v) => onChange('ziele_konkret', v)}
          options={DROPDOWN_OPTIONS.ziele_optionen}
        />
        <div className="mt-6">
          <AnalyseFormField
            type="textarea"
            name="ziele_details"
            label="Details zu den Zielen"
            value={data.ziele_details}
            onChange={(v) => onChange('ziele_details', v)}
            placeholder="Beschreiben Sie konkret, was Sie erreichen möchten und wie der Erfolg aussieht..."
            rows={4}
          />
        </div>
      </div>

      {/* Priorität & Zeitrahmen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Priorität & Zeitrahmen</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="digitalisierung_prioritaet"
            label="Priorität der Digitalisierung (1-10)"
            value={data.digitalisierung_prioritaet?.toString()}
            onChange={(v) => onChange('digitalisierung_prioritaet', parseInt(v))}
            options={DROPDOWN_OPTIONS.skala_1_10}
          />
          <AnalyseFormField
            type="select"
            name="zeitrahmen"
            label="Gewünschter Zeitrahmen"
            value={data.zeitrahmen}
            onChange={(v) => onChange('zeitrahmen', v)}
            options={DROPDOWN_OPTIONS.zeitrahmen}
          />
          <AnalyseFormField
            type="text"
            name="wettbewerb_digitalisierung"
            label="Digitalisierungsstand der Wettbewerber"
            value={data.wettbewerb_digitalisierung}
            onChange={(v) => onChange('wettbewerb_digitalisierung', v)}
            placeholder="z.B. Wettbewerber sind weiter, gleich, hinter uns..."
          />
        </div>
      </div>

      {/* Budget */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Budget</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="budget_verfuegbar"
            label="Budget für Digitalisierung verfügbar?"
            value={data.budget_verfuegbar}
            onChange={(v) => onChange('budget_verfuegbar', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="text"
            name="budget_hoehe"
            label="Budgetrahmen"
            value={data.budget_hoehe}
            onChange={(v) => onChange('budget_hoehe', v)}
            placeholder="z.B. 10.000-20.000 €"
          />
        </div>
      </div>

      {/* Förderung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Förderung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="foerderung_interesse"
            label="Interesse an Fördermitteln"
            value={data.foerderung_interesse}
            onChange={(v) => onChange('foerderung_interesse', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="foerderung_bereits_beantragt"
            label="Förderung bereits beantragt"
            value={data.foerderung_bereits_beantragt}
            onChange={(v) => onChange('foerderung_bereits_beantragt', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="foerderung_beratung_benoetigt"
            label="Förderberatung gewünscht"
            value={data.foerderung_beratung_benoetigt}
            onChange={(v) => onChange('foerderung_beratung_benoetigt', v)}
          />
          <AnalyseFormField
            type="text"
            name="foerderung_programme"
            label="Bekannte Förderprogramme"
            value={data.foerderung_programme}
            onChange={(v) => onChange('foerderung_programme', v)}
            placeholder="z.B. go-digital, Digital Jetzt, Thüringer Digitalbonus..."
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="ziele_zusatz"
          label="Weitere Anmerkungen zu Zielen & Strategie"
          value={data.ziele_zusatz}
          onChange={(v) => onChange('ziele_zusatz', v)}
          placeholder="Gibt es weitere wichtige Informationen zu Ihren Digitalisierungsvorhaben?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ZieleModule;
