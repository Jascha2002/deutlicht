// Daten & Sicherheit Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface DatenModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const DatenModule: React.FC<DatenModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Daten & Sicherheit</h3>
        <p className="text-muted-foreground">Backup, IT-Security, DSGVO & Datenhaltung</p>
      </div>

      {/* Datenablage */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Datenablage & Struktur</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AnalyseFormField
              type="multiselect"
              name="daten_ablage_ort"
              label="Wo werden Daten abgelegt?"
              value={data.daten_ablage_ort}
              onChange={(v) => onChange('daten_ablage_ort', v)}
              options={DROPDOWN_OPTIONS.daten_ablage_ort}
            />
          </div>
          <AnalyseFormField
            type="text"
            name="daten_cloud_anbieter"
            label="Cloud-Anbieter"
            value={data.daten_cloud_anbieter}
            onChange={(v) => onChange('daten_cloud_anbieter', v)}
            placeholder="z.B. Microsoft 365, Google Workspace..."
          />
          <AnalyseFormField
            type="text"
            name="daten_server_standort"
            label="Server-Standort"
            value={data.daten_server_standort}
            onChange={(v) => onChange('daten_server_standort', v)}
            placeholder="z.B. Deutschland, EU, USA..."
          />
          <AnalyseFormField
            type="select"
            name="daten_ordnerstruktur"
            label="Ordnerstruktur"
            value={data.daten_ordnerstruktur}
            onChange={(v) => onChange('daten_ordnerstruktur', v)}
            options={DROPDOWN_OPTIONS.qualitaet}
          />
          <AnalyseFormField
            type="select"
            name="daten_namenskonvention"
            label="Namenskonvention für Dateien"
            value={data.daten_namenskonvention}
            onChange={(v) => onChange('daten_namenskonvention', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="daten_dubletten"
            label="Dubletten-Problem?"
            value={data.daten_dubletten}
            onChange={(v) => onChange('daten_dubletten', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* Backup */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Backup & Datensicherung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="backup_vorhanden"
            label="Backup vorhanden?"
            value={data.backup_vorhanden}
            onChange={(v) => onChange('backup_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein_weiss_nicht}
          />
          <AnalyseFormField
            type="select"
            name="backup_frequenz"
            label="Backup-Frequenz"
            value={data.backup_frequenz}
            onChange={(v) => onChange('backup_frequenz', v)}
            options={DROPDOWN_OPTIONS.backup_frequenz}
          />
          <AnalyseFormField
            type="select"
            name="backup_speicherort"
            label="Backup-Speicherort"
            value={data.backup_speicherort}
            onChange={(v) => onChange('backup_speicherort', v)}
            options={DROPDOWN_OPTIONS.backup_speicherort}
          />
          <AnalyseFormField
            type="checkbox"
            name="backup_automatisiert"
            label="Backup automatisiert"
            value={data.backup_automatisiert}
            onChange={(v) => onChange('backup_automatisiert', v)}
          />
          <AnalyseFormField
            type="select"
            name="backup_getestet"
            label="Wiederherstellung getestet?"
            value={data.backup_getestet}
            onChange={(v) => onChange('backup_getestet', v)}
            options={DROPDOWN_OPTIONS.ja_nein_weiss_nicht}
          />
        </div>
      </div>

      {/* IT-Sicherheit */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">IT-Sicherheit</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="firewall_vorhanden"
            label="Firewall vorhanden"
            value={data.firewall_vorhanden}
            onChange={(v) => onChange('firewall_vorhanden', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="antivirus_vorhanden"
            label="Antivirus vorhanden"
            value={data.antivirus_vorhanden}
            onChange={(v) => onChange('antivirus_vorhanden', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="vpn_vorhanden"
            label="VPN vorhanden"
            value={data.vpn_vorhanden}
            onChange={(v) => onChange('vpn_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="zwei_faktor_auth"
            label="Zwei-Faktor-Authentifizierung"
            value={data.zwei_faktor_auth}
            onChange={(v) => onChange('zwei_faktor_auth', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="passwort_richtlinie"
            label="Passwort-Richtlinie"
            value={data.passwort_richtlinie}
            onChange={(v) => onChange('passwort_richtlinie', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="passwort_manager"
            label="Passwort-Manager im Einsatz"
            value={data.passwort_manager}
            onChange={(v) => onChange('passwort_manager', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="select"
            name="zugriffskontrolle"
            label="Zugriffskontrolle"
            value={data.zugriffskontrolle}
            onChange={(v) => onChange('zugriffskontrolle', v)}
            options={DROPDOWN_OPTIONS.zugriffskontrolle}
          />
          <AnalyseFormField
            type="text"
            name="externe_zugriffe"
            label="Externe Zugriffe (Partner, Dienstleister)"
            value={data.externe_zugriffe}
            onChange={(v) => onChange('externe_zugriffe', v)}
            placeholder="z.B. IT-Dienstleister, Steuerberater..."
          />
          <AnalyseFormField
            type="select"
            name="mitarbeiter_schulung_it_security"
            label="MA-Schulung IT-Sicherheit"
            value={data.mitarbeiter_schulung_it_security}
            onChange={(v) => onChange('mitarbeiter_schulung_it_security', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* DSGVO */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">DSGVO & Datenschutz</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="dsgvo_verzeichnis_vorhanden"
            label="Verarbeitungsverzeichnis vorhanden"
            value={data.dsgvo_verzeichnis_vorhanden}
            onChange={(v) => onChange('dsgvo_verzeichnis_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="dsgvo_datenschutzbeauftragter"
            label="Datenschutzbeauftragter"
            value={data.dsgvo_datenschutzbeauftragter}
            onChange={(v) => onChange('dsgvo_datenschutzbeauftragter', v)}
            options={['Intern', 'Extern', 'Keiner', 'Nicht erforderlich']}
          />
          <AnalyseFormField
            type="checkbox"
            name="dsgvo_auftragsverarbeiter_vertraege"
            label="Auftragsverarbeiter-Verträge vorhanden"
            value={data.dsgvo_auftragsverarbeiter_vertraege}
            onChange={(v) => onChange('dsgvo_auftragsverarbeiter_vertraege', v)}
          />
          <AnalyseFormField
            type="select"
            name="dsgvo_loeschkonzept"
            label="Löschkonzept vorhanden"
            value={data.dsgvo_loeschkonzept}
            onChange={(v) => onChange('dsgvo_loeschkonzept', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="daten_zusatz"
          label="Weitere Anmerkungen zu Daten & Sicherheit"
          value={data.daten_zusatz}
          onChange={(v) => onChange('daten_zusatz', v)}
          placeholder="Gibt es bekannte Sicherheitsbedenken oder geplante Maßnahmen?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default DatenModule;
