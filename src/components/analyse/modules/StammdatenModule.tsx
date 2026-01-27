// Stammdaten-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface StammdatenModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const StammdatenModule: React.FC<StammdatenModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Stammdaten & Unternehmensprofil</h3>
        <p className="text-muted-foreground">Grundlegende Informationen zum Unternehmen</p>
      </div>

      {/* Basisinformationen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Basisinformationen</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="text"
            name="unternehmensname"
            label="Unternehmensname"
            value={data.unternehmensname}
            onChange={(v) => onChange('unternehmensname', v)}
            placeholder="z.B. Müller GmbH"
            required
          />
          <AnalyseFormField
            type="select"
            name="branche"
            label="Branche"
            value={data.branche}
            onChange={(v) => onChange('branche', v)}
            options={DROPDOWN_OPTIONS.branche}
            required
          />
          <AnalyseFormField
            type="select"
            name="rechtsform"
            label="Rechtsform"
            value={data.rechtsform}
            onChange={(v) => onChange('rechtsform', v)}
            options={DROPDOWN_OPTIONS.rechtsform}
          />
          <AnalyseFormField
            type="number"
            name="gruendungsjahr"
            label="Gründungsjahr"
            value={data.gruendungsjahr}
            onChange={(v) => onChange('gruendungsjahr', v)}
            placeholder="z.B. 2005"
          />
        </div>
      </div>

      {/* Größe & Standort */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Größe & Standort</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="mitarbeiterzahl_kategorie"
            label="Mitarbeiteranzahl"
            value={data.mitarbeiterzahl_kategorie}
            onChange={(v) => onChange('mitarbeiterzahl_kategorie', v)}
            options={DROPDOWN_OPTIONS.mitarbeiterzahl_kategorie}
            required
          />
          <AnalyseFormField
            type="number"
            name="mitarbeiterzahl"
            label="Genaue Mitarbeiterzahl"
            value={data.mitarbeiterzahl}
            onChange={(v) => onChange('mitarbeiterzahl', v)}
            placeholder="z.B. 25"
            hint="Optional: Präzise Angabe für genauere Analyse"
          />
          <AnalyseFormField
            type="select"
            name="jahresumsatz_kategorie"
            label="Jahresumsatz"
            value={data.jahresumsatz_kategorie}
            onChange={(v) => onChange('jahresumsatz_kategorie', v)}
            options={DROPDOWN_OPTIONS.jahresumsatz_kategorie}
          />
          <AnalyseFormField
            type="text"
            name="standorte"
            label="Anzahl Standorte"
            value={data.standorte}
            onChange={(v) => onChange('standorte', v)}
            placeholder="z.B. 1 Hauptsitz + 2 Filialen"
          />
          <AnalyseFormField
            type="text"
            name="hauptsitz_plz"
            label="PLZ Hauptsitz"
            value={data.hauptsitz_plz}
            onChange={(v) => onChange('hauptsitz_plz', v)}
            placeholder="z.B. 07545"
          />
          <AnalyseFormField
            type="text"
            name="hauptsitz_ort"
            label="Ort Hauptsitz"
            value={data.hauptsitz_ort}
            onChange={(v) => onChange('hauptsitz_ort', v)}
            placeholder="z.B. Gera"
          />
        </div>
      </div>

      {/* Ansprechpartner */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Ansprechpartner</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="text"
            name="ansprechpartner_name"
            label="Name"
            value={data.ansprechpartner_name}
            onChange={(v) => onChange('ansprechpartner_name', v)}
            placeholder="Max Mustermann"
          />
          <AnalyseFormField
            type="text"
            name="ansprechpartner_position"
            label="Position"
            value={data.ansprechpartner_position}
            onChange={(v) => onChange('ansprechpartner_position', v)}
            placeholder="z.B. Geschäftsführer"
          />
          <AnalyseFormField
            type="email"
            name="ansprechpartner_email"
            label="E-Mail"
            value={data.ansprechpartner_email}
            onChange={(v) => onChange('ansprechpartner_email', v)}
            placeholder="max@musterfirma.de"
          />
          <AnalyseFormField
            type="text"
            name="ansprechpartner_telefon"
            label="Telefon"
            value={data.ansprechpartner_telefon}
            onChange={(v) => onChange('ansprechpartner_telefon', v)}
            placeholder="+49 365 123456"
          />
        </div>
      </div>

      {/* Geschäftsmodell & Zielgruppen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Geschäftsmodell & Zielgruppen</h4>
        <div className="space-y-6">
          <AnalyseFormField
            type="textarea"
            name="geschaeftsmodell"
            label="Geschäftsmodell & Hauptprodukte/-dienstleistungen"
            value={data.geschaeftsmodell}
            onChange={(v) => onChange('geschaeftsmodell', v)}
            placeholder="Beschreiben Sie kurz Ihr Geschäftsmodell, Ihre Hauptprodukte oder Dienstleistungen..."
            rows={4}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <AnalyseFormField
              type="checkbox"
              name="zielgruppen_b2b"
              label="B2B (Geschäftskunden)"
              value={data.zielgruppen_b2b}
              onChange={(v) => onChange('zielgruppen_b2b', v)}
            />
            <AnalyseFormField
              type="checkbox"
              name="zielgruppen_b2c"
              label="B2C (Privatkunden)"
              value={data.zielgruppen_b2c}
              onChange={(v) => onChange('zielgruppen_b2c', v)}
            />
          </div>
          <AnalyseFormField
            type="textarea"
            name="zielgruppen_beschreibung"
            label="Zielgruppen-Details"
            value={data.zielgruppen_beschreibung}
            onChange={(v) => onChange('zielgruppen_beschreibung', v)}
            placeholder="Beschreiben Sie Ihre wichtigsten Zielgruppen genauer..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default StammdatenModule;
