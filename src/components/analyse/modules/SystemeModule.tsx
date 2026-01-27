// Systeme-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface SystemeModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const SystemeModule: React.FC<SystemeModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Systeme & Software</h3>
        <p className="text-muted-foreground">CRM, ERP, DMS & interne Tools</p>
      </div>

      {/* CRM */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">CRM (Kundenbeziehungsmanagement)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="crm_vorhanden"
            label="CRM-System vorhanden?"
            value={data.crm_vorhanden}
            onChange={(v) => onChange('crm_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="select"
            name="crm_system"
            label="Welches CRM-System?"
            value={data.crm_system}
            onChange={(v) => onChange('crm_system', v)}
            options={DROPDOWN_OPTIONS.crm_system}
          />
          <AnalyseFormField
            type="number"
            name="crm_nutzer_anzahl"
            label="Anzahl Nutzer"
            value={data.crm_nutzer_anzahl}
            onChange={(v) => onChange('crm_nutzer_anzahl', v)}
            placeholder="z.B. 10"
          />
          <AnalyseFormField
            type="select"
            name="crm_datenpflege"
            label="Qualität der Datenpflege"
            value={data.crm_datenpflege}
            onChange={(v) => onChange('crm_datenpflege', v)}
            options={DROPDOWN_OPTIONS.qualitaet}
          />
          <AnalyseFormField
            type="select"
            name="crm_zufriedenheit"
            label="Zufriedenheit mit CRM"
            value={data.crm_zufriedenheit?.toString()}
            onChange={(v) => onChange('crm_zufriedenheit', parseInt(v))}
            options={DROPDOWN_OPTIONS.skala_1_5}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <AnalyseFormField
            type="checkbox"
            name="crm_integration_email"
            label="E-Mail-Integration"
            value={data.crm_integration_email}
            onChange={(v) => onChange('crm_integration_email', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="crm_integration_telefonie"
            label="Telefonie-Integration"
            value={data.crm_integration_telefonie}
            onChange={(v) => onChange('crm_integration_telefonie', v)}
          />
        </div>
      </div>

      {/* ERP */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">ERP (Warenwirtschaft / Auftragsabwicklung)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="erp_vorhanden"
            label="ERP-System vorhanden?"
            value={data.erp_vorhanden}
            onChange={(v) => onChange('erp_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="select"
            name="erp_system"
            label="Welches ERP-System?"
            value={data.erp_system}
            onChange={(v) => onChange('erp_system', v)}
            options={DROPDOWN_OPTIONS.erp_system}
          />
          <AnalyseFormField
            type="select"
            name="erp_zufriedenheit"
            label="Zufriedenheit mit ERP"
            value={data.erp_zufriedenheit?.toString()}
            onChange={(v) => onChange('erp_zufriedenheit', parseInt(v))}
            options={DROPDOWN_OPTIONS.skala_1_5}
          />
        </div>
        <div className="mt-6">
          <AnalyseFormField
            type="multiselect"
            name="erp_module"
            label="Genutzte ERP-Module"
            value={data.erp_module}
            onChange={(v) => onChange('erp_module', v)}
            options={DROPDOWN_OPTIONS.erp_module}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <AnalyseFormField
            type="checkbox"
            name="erp_integration_crm"
            label="CRM-Integration"
            value={data.erp_integration_crm}
            onChange={(v) => onChange('erp_integration_crm', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="erp_integration_shop"
            label="Online-Shop-Integration"
            value={data.erp_integration_shop}
            onChange={(v) => onChange('erp_integration_shop', v)}
          />
        </div>
      </div>

      {/* DMS */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">DMS (Dokumentenmanagement)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="dms_vorhanden"
            label="DMS vorhanden?"
            value={data.dms_vorhanden}
            onChange={(v) => onChange('dms_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="select"
            name="dms_system"
            label="Welches DMS?"
            value={data.dms_system}
            onChange={(v) => onChange('dms_system', v)}
            options={DROPDOWN_OPTIONS.dms_system}
          />
          <AnalyseFormField
            type="checkbox"
            name="dms_versionierung"
            label="Versionierung aktiv"
            value={data.dms_versionierung}
            onChange={(v) => onChange('dms_versionierung', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="dms_volltextsuche"
            label="Volltextsuche verfügbar"
            value={data.dms_volltextsuche}
            onChange={(v) => onChange('dms_volltextsuche', v)}
          />
          <AnalyseFormField
            type="select"
            name="dms_berechtigungskonzept"
            label="Berechtigungskonzept"
            value={data.dms_berechtigungskonzept}
            onChange={(v) => onChange('dms_berechtigungskonzept', v)}
            options={DROPDOWN_OPTIONS.zugriffskontrolle}
          />
        </div>
      </div>

      {/* Buchhaltung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Buchhaltung & Finanzen</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="buchhaltung_system"
            label="Buchhaltungssoftware"
            value={data.buchhaltung_system}
            onChange={(v) => onChange('buchhaltung_system', v)}
            options={DROPDOWN_OPTIONS.buchhaltung_system}
          />
          <AnalyseFormField
            type="select"
            name="buchhaltung_belege_digital"
            label="Digitale Belegerfassung"
            value={data.buchhaltung_belege_digital}
            onChange={(v) => onChange('buchhaltung_belege_digital', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="checkbox"
            name="buchhaltung_fibu_online"
            label="Online-Finanzbuchhaltung"
            value={data.buchhaltung_fibu_online}
            onChange={(v) => onChange('buchhaltung_fibu_online', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="buchhaltung_steuerberater_zugriff"
            label="Steuerberater hat Zugriff"
            value={data.buchhaltung_steuerberater_zugriff}
            onChange={(v) => onChange('buchhaltung_steuerberater_zugriff', v)}
          />
        </div>
      </div>

      {/* Kommunikation & Projektmanagement */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Kommunikation & Projektmanagement</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="email_system"
            label="E-Mail-System"
            value={data.email_system}
            onChange={(v) => onChange('email_system', v)}
            options={DROPDOWN_OPTIONS.email_system}
          />
          <AnalyseFormField
            type="select"
            name="chat_tool"
            label="Chat / Messenger"
            value={data.chat_tool}
            onChange={(v) => onChange('chat_tool', v)}
            options={DROPDOWN_OPTIONS.chat_tool}
          />
          <AnalyseFormField
            type="select"
            name="videokonferenz"
            label="Videokonferenz-Tool"
            value={data.videokonferenz}
            onChange={(v) => onChange('videokonferenz', v)}
            options={DROPDOWN_OPTIONS.videokonferenz}
          />
          <AnalyseFormField
            type="checkbox"
            name="pm_tool_vorhanden"
            label="Projektmanagement-Tool vorhanden"
            value={data.pm_tool_vorhanden}
            onChange={(v) => onChange('pm_tool_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="pm_tool"
            label="Welches PM-Tool?"
            value={data.pm_tool}
            onChange={(v) => onChange('pm_tool', v)}
            options={DROPDOWN_OPTIONS.pm_tool}
          />
          <AnalyseFormField
            type="checkbox"
            name="zeiterfassung_vorhanden"
            label="Zeiterfassung vorhanden"
            value={data.zeiterfassung_vorhanden}
            onChange={(v) => onChange('zeiterfassung_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="zeiterfassung_system"
            label="Zeiterfassungs-System"
            value={data.zeiterfassung_system}
            onChange={(v) => onChange('zeiterfassung_system', v)}
            options={DROPDOWN_OPTIONS.zeiterfassung_system}
          />
        </div>
      </div>

      {/* Branchensoftware */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Branchensoftware</h4>
        <AnalyseFormField
          type="textarea"
          name="branchensoftware_details"
          label="Weitere branchenspezifische Software"
          value={data.branchensoftware_details}
          onChange={(v) => onChange('branchensoftware_details', v)}
          placeholder="z.B. Handwerkersoftware, Praxisverwaltung, Hotelsoftware..."
          rows={3}
        />
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="systeme_zusatz"
          label="Weitere Anmerkungen zu Systemen"
          value={data.systeme_zusatz}
          onChange={(v) => onChange('systeme_zusatz', v)}
          placeholder="Gibt es bekannte Probleme, Wünsche oder geplante Änderungen?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default SystemeModule;
