// Social Media & Marketing Modul für die Analyse

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { DROPDOWN_OPTIONS } from '@/data/analysisDropdownOptions';

interface SocialModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const SocialModule: React.FC<SocialModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Social Media & Marketing</h3>
        <p className="text-muted-foreground">Kanäle, Content-Erstellung, Newsletter & Online-Werbung</p>
      </div>

      {/* Aktive Kanäle */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Aktive Social-Media-Kanäle</h4>
        <AnalyseFormField
          type="multiselect"
          name="kanaele_aktiv"
          label="Welche Kanäle werden aktiv genutzt?"
          value={data.kanaele_aktiv}
          onChange={(v) => onChange('kanaele_aktiv', v)}
          options={DROPDOWN_OPTIONS.social_kanaele}
        />
      </div>

      {/* Kanal-Details */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Kanal-Details</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="number"
            name="linkedin_follower"
            label="LinkedIn Follower"
            value={data.linkedin_follower}
            onChange={(v) => onChange('linkedin_follower', v)}
            placeholder="z.B. 500"
          />
          <AnalyseFormField
            type="select"
            name="linkedin_frequenz"
            label="LinkedIn Posting-Frequenz"
            value={data.linkedin_frequenz}
            onChange={(v) => onChange('linkedin_frequenz', v)}
            options={DROPDOWN_OPTIONS.frequenz_optionen}
          />
          <AnalyseFormField
            type="number"
            name="facebook_follower"
            label="Facebook Follower"
            value={data.facebook_follower}
            onChange={(v) => onChange('facebook_follower', v)}
            placeholder="z.B. 1200"
          />
          <AnalyseFormField
            type="select"
            name="facebook_frequenz"
            label="Facebook Posting-Frequenz"
            value={data.facebook_frequenz}
            onChange={(v) => onChange('facebook_frequenz', v)}
            options={DROPDOWN_OPTIONS.frequenz_optionen}
          />
          <AnalyseFormField
            type="number"
            name="instagram_follower"
            label="Instagram Follower"
            value={data.instagram_follower}
            onChange={(v) => onChange('instagram_follower', v)}
            placeholder="z.B. 800"
          />
          <AnalyseFormField
            type="select"
            name="instagram_frequenz"
            label="Instagram Posting-Frequenz"
            value={data.instagram_frequenz}
            onChange={(v) => onChange('instagram_frequenz', v)}
            options={DROPDOWN_OPTIONS.frequenz_optionen}
          />
        </div>
      </div>

      {/* Content-Erstellung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Content-Erstellung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="select"
            name="content_ersteller"
            label="Wer erstellt den Content?"
            value={data.content_ersteller}
            onChange={(v) => onChange('content_ersteller', v)}
            options={DROPDOWN_OPTIONS.content_ersteller}
          />
          <AnalyseFormField
            type="checkbox"
            name="content_redaktionsplan"
            label="Redaktionsplan vorhanden"
            value={data.content_redaktionsplan}
            onChange={(v) => onChange('content_redaktionsplan', v)}
          />
          <AnalyseFormField
            type="text"
            name="content_budget_monatlich"
            label="Monatliches Content-Budget"
            value={data.content_budget_monatlich}
            onChange={(v) => onChange('content_budget_monatlich', v)}
            placeholder="z.B. 500 €"
          />
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">E-Mail-Marketing / Newsletter</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="newsletter_vorhanden"
            label="Newsletter vorhanden"
            value={data.newsletter_vorhanden}
            onChange={(v) => onChange('newsletter_vorhanden', v)}
          />
          <AnalyseFormField
            type="select"
            name="newsletter_tool"
            label="Newsletter-Tool"
            value={data.newsletter_tool}
            onChange={(v) => onChange('newsletter_tool', v)}
            options={DROPDOWN_OPTIONS.newsletter_tool}
          />
          <AnalyseFormField
            type="number"
            name="newsletter_abonnenten"
            label="Anzahl Abonnenten"
            value={data.newsletter_abonnenten}
            onChange={(v) => onChange('newsletter_abonnenten', v)}
            placeholder="z.B. 2000"
          />
          <AnalyseFormField
            type="select"
            name="newsletter_frequenz"
            label="Versandfrequenz"
            value={data.newsletter_frequenz}
            onChange={(v) => onChange('newsletter_frequenz', v)}
            options={DROPDOWN_OPTIONS.frequenz_optionen}
          />
          <AnalyseFormField
            type="text"
            name="newsletter_oeffnungsrate"
            label="Öffnungsrate"
            value={data.newsletter_oeffnungsrate}
            onChange={(v) => onChange('newsletter_oeffnungsrate', v)}
            placeholder="z.B. 25%"
          />
        </div>
      </div>

      {/* Online-Werbung */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Online-Werbung</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <AnalyseFormField
            type="checkbox"
            name="online_werbung_aktiv"
            label="Online-Werbung aktiv"
            value={data.online_werbung_aktiv}
            onChange={(v) => onChange('online_werbung_aktiv', v)}
          />
          <AnalyseFormField
            type="text"
            name="werbung_budget_monatlich"
            label="Monatliches Werbebudget"
            value={data.werbung_budget_monatlich}
            onChange={(v) => onChange('werbung_budget_monatlich', v)}
            placeholder="z.B. 1000 €"
          />
          <AnalyseFormField
            type="checkbox"
            name="werbung_google_ads"
            label="Google Ads"
            value={data.werbung_google_ads}
            onChange={(v) => onChange('werbung_google_ads', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="werbung_facebook_ads"
            label="Facebook/Instagram Ads"
            value={data.werbung_facebook_ads}
            onChange={(v) => onChange('werbung_facebook_ads', v)}
          />
          <AnalyseFormField
            type="checkbox"
            name="werbung_linkedin_ads"
            label="LinkedIn Ads"
            value={data.werbung_linkedin_ads}
            onChange={(v) => onChange('werbung_linkedin_ads', v)}
          />
        </div>
      </div>

      {/* Zusatz */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="social_zusatz"
          label="Weitere Anmerkungen zu Social Media & Marketing"
          value={data.social_zusatz}
          onChange={(v) => onChange('social_zusatz', v)}
          placeholder="Gibt es besondere Herausforderungen oder Ziele im Marketing?"
          rows={3}
        />
      </div>
    </div>
  );
};

export default SocialModule;
