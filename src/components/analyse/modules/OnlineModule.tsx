// Online-Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface OnlineModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const OnlineModule: React.FC<OnlineModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Online-Auftritt</h3>
        <p className="text-muted-foreground">Website, SEO, E-Commerce & Online-Buchung</p>
      </div>

      {/* Website */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Website</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="website_vorhanden"
            label="Website vorhanden?"
            value={data.website_vorhanden}
            onChange={(v) => onChange('website_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein}
          />
          <AnalyseFormField
            type="url"
            name="website_url"
            label="Website-URL"
            value={data.website_url}
            onChange={(v) => onChange('website_url', v)}
            placeholder="https://www.musterfirma.de"
          />
          <AnalyseFormField
            type="select"
            name="website_cms"
            label="CMS / Technologie"
            value={data.website_cms}
            onChange={(v) => onChange('website_cms', v)}
            options={DROPDOWN_OPTIONS.website_cms}
          />
          <AnalyseFormField
            type="select"
            name="website_hosting"
            label="Hosting-Art"
            value={data.website_hosting}
            onChange={(v) => onChange('website_hosting', v)}
            options={DROPDOWN_OPTIONS.website_hosting}
          />
          <AnalyseFormField
            type="text"
            name="website_hosting_anbieter"
            label="Hosting-Anbieter"
            value={data.website_hosting_anbieter}
            onChange={(v) => onChange('website_hosting_anbieter', v)}
            placeholder="z.B. IONOS, Strato, Hetzner..."
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <AnalyseFormField
            type="select"
            name="website_responsive"
            label="Mobil-optimiert?"
            value={data.website_responsive}
            onChange={(v) => onChange('website_responsive', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="website_https"
            label="HTTPS / SSL?"
            value={data.website_https}
            onChange={(v) => onChange('website_https', v)}
            options={DROPDOWN_OPTIONS.ja_nein_weiss_nicht}
          />
          <AnalyseFormField
            type="select"
            name="website_ladezeit"
            label="Ladegeschwindigkeit"
            value={data.website_ladezeit}
            onChange={(v) => onChange('website_ladezeit', v)}
            options={DROPDOWN_OPTIONS.qualitaet}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <AnalyseFormField
            type="select"
            name="website_aktualisierung"
            label="Update-Frequenz"
            value={data.website_aktualisierung}
            onChange={(v) => onChange('website_aktualisierung', v)}
            options={DROPDOWN_OPTIONS.website_aktualisierung}
          />
          <AnalyseFormField
            type="select"
            name="website_aktualisierung_wer"
            label="Wer aktualisiert?"
            value={data.website_aktualisierung_wer}
            onChange={(v) => onChange('website_aktualisierung_wer', v)}
            options={DROPDOWN_OPTIONS.website_aktualisierung_wer}
          />
          <AnalyseFormField
            type="checkbox"
            name="website_mehrsprachig"
            label="Mehrsprachig"
            value={data.website_mehrsprachig}
            onChange={(v) => onChange('website_mehrsprachig', v)}
          />
          <AnalyseFormField
            type="select"
            name="website_barrierefreiheit"
            label="Barrierefreiheit"
            value={data.website_barrierefreiheit}
            onChange={(v) => onChange('website_barrierefreiheit', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Suchmaschinenoptimierung (SEO)</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="seo_aktiv_betrieben"
            label="SEO aktiv betrieben?"
            value={data.seo_aktiv_betrieben}
            onChange={(v) => onChange('seo_aktiv_betrieben', v)}
            options={DROPDOWN_OPTIONS.ja_teilweise_nein}
          />
          <AnalyseFormField
            type="select"
            name="seo_ranking_zufriedenheit"
            label="Zufriedenheit mit Ranking"
            value={data.seo_ranking_zufriedenheit?.toString()}
            onChange={(v) => onChange('seo_ranking_zufriedenheit', parseInt(v))}
            options={DROPDOWN_OPTIONS.skala_1_5}
          />
          <AnalyseFormField
            type="checkbox"
            name="seo_keywords_definiert"
            label="Keywords definiert"
            value={data.seo_keywords_definiert}
            onChange={(v) => onChange('seo_keywords_definiert', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="seo_google_my_business"
            label="Google My Business aktiv"
            value={data.seo_google_my_business}
            onChange={(v) => onChange('seo_google_my_business', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="seo_backlinks_strategie"
            label="Backlink-Strategie vorhanden"
            value={data.seo_backlinks_strategie}
            onChange={(v) => onChange('seo_backlinks_strategie', v)}
          />
        </div>
      </div>

      {/* E-Commerce / Shop */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">E-Commerce / Online-Shop</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="shop_vorhanden"
            label="Online-Shop vorhanden?"
            value={data.shop_vorhanden}
            onChange={(v) => onChange('shop_vorhanden', v)}
            options={DROPDOWN_OPTIONS.ja_nein_geplant}
          />
          <AnalyseFormField
            type="select"
            name="shop_system"
            label="Shop-System"
            value={data.shop_system}
            onChange={(v) => onChange('shop_system', v)}
            options={DROPDOWN_OPTIONS.shop_system}
          />
          <AnalyseFormField
            type="number"
            name="shop_produkte_anzahl"
            label="Anzahl Produkte"
            value={data.shop_produkte_anzahl}
            onChange={(v) => onChange('shop_produkte_anzahl', v)}
            placeholder="z.B. 500"
          />
          <AnalyseFormField
            type="text"
            name="shop_umsatz_anteil"
            label="Anteil am Gesamtumsatz"
            value={data.shop_umsatz_anteil}
            onChange={(v) => onChange('shop_umsatz_anteil', v)}
            placeholder="z.B. 30%"
          />
        </div>
        
        <div className="mt-6">
          <AnalyseFormField
            type="multiselect"
            name="shop_zahlungsarten"
            label="Zahlungsarten"
            value={data.shop_zahlungsarten}
            onChange={(v) => onChange('shop_zahlungsarten', v)}
            options={DROPDOWN_OPTIONS.shop_zahlungsarten}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <AnalyseFormField
            type="checkbox"
            name="shop_erp_anbindung"
            label="ERP-Anbindung vorhanden"
            value={data.shop_erp_anbindung}
            onChange={(v) => onChange('shop_erp_anbindung', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="shop_versand_anbindung"
            label="Versanddienstleister-Anbindung"
            value={data.shop_versand_anbindung}
            onChange={(v) => onChange('shop_versand_anbindung', v)}
          />
        </div>
      </div>

      {/* Buchungssystem */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Online-Buchung / Terminvereinbarung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="buchungssystem_vorhanden"
            label="Online-Buchungssystem vorhanden"
            value={data.buchungssystem_vorhanden}
            onChange={(v) => onChange('buchungssystem_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="buchungssystem_typ"
            label="Welches System?"
            value={data.buchungssystem_typ}
            onChange={(v) => onChange('buchungssystem_typ', v)}
            options={DROPDOWN_OPTIONS.buchungssystem_typ}
          />
          <AnalyseFormField
            type="text"
            name="buchungssystem_integration"
            label="Integrationen"
            value={data.buchungssystem_integration}
            onChange={(v) => onChange('buchungssystem_integration', v)}
            placeholder="z.B. Kalender, CRM, E-Mail..."
          />
        </div>
      </div>

      {/* Zusatzinfos */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="online_zusatz"
          label="Weitere Anmerkungen zum Online-Auftritt"
          value={data.online_zusatz}
          onChange={(v) => onChange('online_zusatz', v)}
          placeholder="Gibt es besondere Anforderungen, geplante Projekte oder bekannte Probleme?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default OnlineModule;
