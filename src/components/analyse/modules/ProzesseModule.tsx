// Prozesse-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface ProzesseModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const ProzesseModule: React.FC<ProzesseModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Prozesse & Workflows</h3>
        <p className="text-muted-foreground">Vertrieb, Auftragsabwicklung, Service & Dokumentation</p>
      </div>

      {/* Vertrieb */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Vertrieb & Leadgewinnung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AnalyseFormField
              type="multiselect"
              name="vertrieb_leadgewinnung"
              label="Wie gewinnen Sie Leads/Anfragen?"
              value={data.vertrieb_leadgewinnung}
              onChange={(v) => onChange('vertrieb_leadgewinnung', v)}
              options={DROPDOWN_OPTIONS.vertrieb_leadgewinnung}
            />
          </div>
          <AnalyseFormField
            type="select"
            name="vertrieb_angebotserstellung"
            label="Angebotserstellung"
            value={data.vertrieb_angebotserstellung}
            onChange={(v) => onChange('vertrieb_angebotserstellung', v)}
            options={DROPDOWN_OPTIONS.vertrieb_angebotserstellung}
          />
          <AnalyseFormField
            type="text"
            name="vertrieb_angebotserstellung_dauer"
            label="Durchschn. Dauer für Angebot"
            value={data.vertrieb_angebotserstellung_dauer}
            onChange={(v) => onChange('vertrieb_angebotserstellung_dauer', v)}
            placeholder="z.B. 2-3 Tage"
          />
          <AnalyseFormField
            type="text"
            name="vertrieb_angebotserstellung_tool"
            label="Tool für Angebotserstellung"
            value={data.vertrieb_angebotserstellung_tool}
            onChange={(v) => onChange('vertrieb_angebotserstellung_tool', v)}
            placeholder="z.B. Word, ERP, spezielles Tool..."
          />
          <AnalyseFormField
            type="text"
            name="vertrieb_nachverfolgung"
            label="Wie wird nachverfolgt?"
            value={data.vertrieb_nachverfolgung}
            onChange={(v) => onChange('vertrieb_nachverfolgung', v)}
            placeholder="z.B. CRM-Erinnerung, Kalender, manuell..."
          />
          <AnalyseFormField
            type="text"
            name="vertrieb_erfolgsquote"
            label="Angebotserfolgquote"
            value={data.vertrieb_erfolgsquote}
            onChange={(v) => onChange('vertrieb_erfolgsquote', v)}
            placeholder="z.B. ca. 40%"
          />
          <AnalyseFormField
            type="select"
            name="vertrieb_crm_nutzung"
            label="CRM-Nutzung im Vertrieb"
            value={data.vertrieb_crm_nutzung}
            onChange={(v) => onChange('vertrieb_crm_nutzung', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* Auftragsabwicklung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Auftragsabwicklung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AnalyseFormField
              type="multiselect"
              name="auftragseingang_kanal"
              label="Auftragseingang über welche Kanäle?"
              value={data.auftragseingang_kanal}
              onChange={(v) => onChange('auftragseingang_kanal', v)}
              options={DROPDOWN_OPTIONS.auftragseingang_kanal}
            />
          </div>
          <AnalyseFormField
            type="select"
            name="auftragserfassung"
            label="Wie wird der Auftrag erfasst?"
            value={data.auftragserfassung}
            onChange={(v) => onChange('auftragserfassung', v)}
            options={DROPDOWN_OPTIONS.vertrieb_angebotserstellung}
          />
          <AnalyseFormField
            type="text"
            name="auftragsbearbeitung_system"
            label="System für Auftragsbearbeitung"
            value={data.auftragsbearbeitung_system}
            onChange={(v) => onChange('auftragsbearbeitung_system', v)}
            placeholder="z.B. ERP, Excel, Papier..."
          />
          <AnalyseFormField
            type="checkbox"
            name="auftragsbearbeitung_medienbruch"
            label="Medienbrüche vorhanden (z.B. Papier → Digital)"
            value={data.auftragsbearbeitung_medienbruch}
            onChange={(v) => onChange('auftragsbearbeitung_medienbruch', v)}
          />
          <AnalyseFormField
            type="select"
            name="auftragsstatus_tracking"
            label="Auftrags-Statusverfolgung"
            value={data.auftragsstatus_tracking}
            onChange={(v) => onChange('auftragsstatus_tracking', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* Rechnungsstellung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Rechnungsstellung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="rechnungsstellung"
            label="Automatisierungsgrad"
            value={data.rechnungsstellung}
            onChange={(v) => onChange('rechnungsstellung', v)}
            options={DROPDOWN_OPTIONS.rechnungsstellung}
          />
          <AnalyseFormField
            type="text"
            name="rechnungsstellung_dauer"
            label="Dauer bis Rechnung erstellt"
            value={data.rechnungsstellung_dauer}
            onChange={(v) => onChange('rechnungsstellung_dauer', v)}
            placeholder="z.B. direkt / 1 Woche nach Lieferung"
          />
          <AnalyseFormField
            type="text"
            name="rechnungsstellung_tool"
            label="Tool für Rechnungen"
            value={data.rechnungsstellung_tool}
            onChange={(v) => onChange('rechnungsstellung_tool', v)}
            placeholder="z.B. Lexoffice, ERP, Word..."
          />
          <AnalyseFormField
            type="text"
            name="rechnungsversand"
            label="Versandweg"
            value={data.rechnungsversand}
            onChange={(v) => onChange('rechnungsversand', v)}
            placeholder="z.B. E-Mail, Post, Portal..."
          />
        </div>
      </div>

      {/* Service & Support */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Service & Support</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <AnalyseFormField
              type="multiselect"
              name="service_kanal"
              label="Über welche Kanäle erreichen Kunden den Service?"
              value={data.service_kanal}
              onChange={(v) => onChange('service_kanal', v)}
              options={DROPDOWN_OPTIONS.service_kanal}
            />
          </div>
          <AnalyseFormField
            type="text"
            name="service_reaktionszeit"
            label="Durchschn. Reaktionszeit"
            value={data.service_reaktionszeit}
            onChange={(v) => onChange('service_reaktionszeit', v)}
            placeholder="z.B. < 24 Stunden"
          />
          <AnalyseFormField
            type="checkbox"
            name="service_ticket_system"
            label="Ticket-System vorhanden"
            value={data.service_ticket_system}
            onChange={(v) => onChange('service_ticket_system', v)}
          />
          <AnalyseFormField
            type="text"
            name="service_ticket_tool"
            label="Welches Ticket-System?"
            value={data.service_ticket_tool}
            onChange={(v) => onChange('service_ticket_tool', v)}
            placeholder="z.B. Freshdesk, Zendesk, E-Mail..."
          />
          <AnalyseFormField
            type="checkbox"
            name="service_wissensdatenbank"
            label="Interne Wissensdatenbank für Support"
            value={data.service_wissensdatenbank}
            onChange={(v) => onChange('service_wissensdatenbank', v)}
          />
        </div>
      </div>

      {/* Dokumentation & Vorlagen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Dokumentation & Vorlagen</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="dokumente_vorlagen"
            label="Standardvorlagen vorhanden?"
            value={data.dokumente_vorlagen}
            onChange={(v) => onChange('dokumente_vorlagen', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="text"
            name="dokumente_ablage"
            label="Wo werden Dokumente abgelegt?"
            value={data.dokumente_ablage}
            onChange={(v) => onChange('dokumente_ablage', v)}
            placeholder="z.B. SharePoint, Fileserver, lokal..."
          />
          <AnalyseFormField
            type="select"
            name="dokumente_freigabe"
            label="Freigabeprozesse definiert?"
            value={data.dokumente_freigabe}
            onChange={(v) => onChange('dokumente_freigabe', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="dokumente_suche"
            label="Wie gut findet man Dokumente?"
            value={data.dokumente_suche}
            onChange={(v) => onChange('dokumente_suche', v)}
            options={DROPDOWN_OPTIONS.qualitaet}
          />
        </div>
      </div>

      {/* Interne Kommunikation */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Interne Organisation</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="text"
            name="kundenkommunikation"
            label="Hauptkanal für Kundenkommunikation"
            value={data.kundenkommunikation}
            onChange={(v) => onChange('kundenkommunikation', v)}
            placeholder="z.B. E-Mail, Telefon, Portal..."
          />
          <AnalyseFormField
            type="select"
            name="meetings_frequenz"
            label="Regelmäßige Team-Meetings"
            value={data.meetings_frequenz}
            onChange={(v) => onChange('meetings_frequenz', v)}
            options={DROPDOWN_OPTIONS.frequenz_optionen}
          />
          <AnalyseFormField
            type="select"
            name="meetings_protokolle"
            label="Werden Protokolle geführt?"
            value={data.meetings_protokolle}
            onChange={(v) => onChange('meetings_protokolle', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="text"
            name="entscheidungsprozesse"
            label="Wie werden Entscheidungen dokumentiert?"
            value={data.entscheidungsprozesse}
            onChange={(v) => onChange('entscheidungsprozesse', v)}
            placeholder="z.B. Protokoll, E-Mail, gar nicht..."
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="prozesse_zusatz"
          label="Weitere Anmerkungen zu Prozessen"
          value={data.prozesse_zusatz}
          onChange={(v) => onChange('prozesse_zusatz', v)}
          placeholder="Welche Prozesse sind besonders zeitaufwändig oder fehleranfällig?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProzesseModule;
