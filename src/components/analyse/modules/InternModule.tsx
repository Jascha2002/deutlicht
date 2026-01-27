// Interne Einschätzung Modul für die Analyse (nur für Berater)

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';

interface InternModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const InternModule: React.FC<InternModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Interne Einschätzung</h3>
        <p className="text-muted-foreground">Berater-Notizen & Bewertung (nicht für Kunden sichtbar)</p>
      </div>

      {/* Gesamteindruck */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">⚠️ Nur für interne Nutzung</h4>
        <p className="text-sm text-muted-foreground mb-6">
          Diese Informationen werden nicht im Kundenbericht angezeigt und dienen der internen Dokumentation.
        </p>

        <div className="space-y-6">
          <AnalyseFormField
            type="textarea"
            name="gesamteindruck"
            label="Gesamteindruck vom Unternehmen"
            value={data.gesamteindruck}
            onChange={(v) => onChange('gesamteindruck', v)}
            placeholder="Wie ist der allgemeine Eindruck? Unternehmenskultur, Offenheit für Veränderung..."
            rows={4}
          />
        </div>
      </div>

      {/* Bewertung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Bewertung</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <AnalyseFormField
            type="select"
            name="digitalisierungsgrad"
            label="Aktueller Digitalisierungsgrad (1-10)"
            value={data.digitalisierungsgrad?.toString()}
            onChange={(v) => onChange('digitalisierungsgrad', parseInt(v))}
            options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          />
          <AnalyseFormField
            type="select"
            name="bereitschaft_veraenderung"
            label="Veränderungsbereitschaft (1-10)"
            value={data.bereitschaft_veraenderung?.toString()}
            onChange={(v) => onChange('bereitschaft_veraenderung', parseInt(v))}
            options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          />
          <AnalyseFormField
            type="select"
            name="bereitschaft_investition"
            label="Investitionsbereitschaft (1-10)"
            value={data.bereitschaft_investition?.toString()}
            onChange={(v) => onChange('bereitschaft_investition', parseInt(v))}
            options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          />
        </div>
      </div>

      {/* Potenzial & Risiken */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Potenzial & Risiken</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="textarea"
            name="potenzial"
            label="Erkanntes Potenzial"
            value={data.potenzial}
            onChange={(v) => onChange('potenzial', v)}
            placeholder="Wo sehen Sie das größte Verbesserungspotenzial?"
            rows={3}
          />
          <AnalyseFormField
            type="textarea"
            name="risiken"
            label="Erkannte Risiken"
            value={data.risiken}
            onChange={(v) => onChange('risiken', v)}
            placeholder="Welche Risiken könnten die Umsetzung gefährden?"
            rows={3}
          />
        </div>
      </div>

      {/* Kritische Punkte */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Kritische Punkte</h4>
        <AnalyseFormField
          type="textarea"
          name="kritische_punkte"
          label="Besonders kritische Punkte / Red Flags"
          value={data.kritische_punkte}
          onChange={(v) => onChange('kritische_punkte', v)}
          placeholder="Gibt es Dinge, die besonders problematisch sind oder sofort adressiert werden müssen?"
          rows={3}
        />
      </div>

      {/* Handlungsempfehlung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Interne Handlungsempfehlung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="textarea"
            name="handlungsbedarf"
            label="Dringendster Handlungsbedarf"
            value={data.handlungsbedarf}
            onChange={(v) => onChange('handlungsbedarf', v)}
            placeholder="Was sollte als erstes angegangen werden?"
            rows={3}
          />
          <AnalyseFormField
            type="textarea"
            name="erfolgsfaktoren"
            label="Erfolgsfaktoren"
            value={data.erfolgsfaktoren}
            onChange={(v) => onChange('erfolgsfaktoren', v)}
            placeholder="Was muss gegeben sein, damit das Projekt erfolgreich wird?"
            rows={3}
          />
        </div>
      </div>

      {/* Nächste Schritte */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="naechste_schritte_intern"
          label="Geplante nächste Schritte (intern)"
          value={data.naechste_schritte_intern}
          onChange={(v) => onChange('naechste_schritte_intern', v)}
          placeholder="Was sind die nächsten konkreten Schritte im Verkaufs-/Beratungsprozess?"
          rows={4}
        />
      </div>
    </div>
  );
};

export default InternModule;
