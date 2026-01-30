// Externes Analyse-Modul für manuelle SEO-, Keyword- und Wettbewerber-Daten

import React from 'react';
import AnalyseFormField from '../AnalyseFormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Globe, Search, Users, TrendingUp, Video, MapPin, BarChart3 } from 'lucide-react';
import { EXTERNE_ANALYSE_OPTIONS } from '@/data/analysisExternalFields';

interface ExterneAnalyseModuleProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
}

export const ExterneAnalyseModule: React.FC<ExterneAnalyseModuleProps> = ({ data, onChange }) => {
  // Helper für Keyword-Management
  const addKeyword = () => {
    const current = data.keywords || [];
    onChange('keywords', [...current, { keyword: '', suchvolumen_monatlich: null, wettbewerb_anzahl: null, aktuelle_position: null }]);
  };

  const updateKeyword = (index: number, field: string, value: any) => {
    const current = [...(data.keywords || [])];
    current[index] = { ...current[index], [field]: value };
    onChange('keywords', current);
  };

  const removeKeyword = (index: number) => {
    const current = [...(data.keywords || [])];
    current.splice(index, 1);
    onChange('keywords', current);
  };

  // Helper für Wettbewerber-Management
  const addWettbewerber = () => {
    const current = data.wettbewerber || [];
    onChange('wettbewerber', [...current, { name: '', website: '', staerken: '', schwaechen: '', differenzierung: '' }]);
  };

  const updateWettbewerber = (index: number, field: string, value: any) => {
    const current = [...(data.wettbewerber || [])];
    current[index] = { ...current[index], [field]: value };
    onChange('wettbewerber', current);
  };

  const removeWettbewerber = (index: number) => {
    const current = [...(data.wettbewerber || [])];
    current.splice(index, 1);
    onChange('wettbewerber', current);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Externe Analysen</h3>
        <p className="text-muted-foreground">SEO-Tools, Keyword-Recherche, Wettbewerber-Analyse (manuell durch Agentur)</p>
      </div>

      {/* Website-Check Grunddaten */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Website-Analyse Metadaten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <AnalyseFormField
              type="checkbox"
              name="website_check_durchgefuehrt"
              label="Website-Check durchgeführt"
              value={data.website_check_durchgefuehrt}
              onChange={(v) => onChange('website_check_durchgefuehrt', v)}
            />
            <AnalyseFormField
              type="text"
              name="website_check_datum"
              label="Datum der Analyse"
              value={data.website_check_datum}
              onChange={(v) => onChange('website_check_datum', v)}
              placeholder="TT.MM.JJJJ"
            />
            <AnalyseFormField
              type="select"
              name="website_check_tool"
              label="Verwendetes Tool"
              value={data.website_check_tool}
              onChange={(v) => onChange('website_check_tool', v)}
              options={EXTERNE_ANALYSE_OPTIONS.analyse_tools}
            />
          </div>
        </CardContent>
      </Card>

      {/* Page Speed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Page Speed & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Desktop</h4>
              <div className="grid grid-cols-2 gap-4">
                <AnalyseFormField
                  type="select"
                  name="pagespeed_desktop"
                  label="Bewertung"
                  value={data.pagespeed_desktop}
                  onChange={(v) => onChange('pagespeed_desktop', v)}
                  options={['gut', 'mittel', 'schlecht']}
                />
                <AnalyseFormField
                  type="number"
                  name="pagespeed_desktop_score"
                  label="Score (0-100)"
                  value={data.pagespeed_desktop_score}
                  onChange={(v) => onChange('pagespeed_desktop_score', v)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Mobile</h4>
              <div className="grid grid-cols-2 gap-4">
                <AnalyseFormField
                  type="select"
                  name="pagespeed_mobile"
                  label="Bewertung"
                  value={data.pagespeed_mobile}
                  onChange={(v) => onChange('pagespeed_mobile', v)}
                  options={['gut', 'mittel', 'schlecht']}
                />
                <AnalyseFormField
                  type="number"
                  name="pagespeed_mobile_score"
                  label="Score (0-100)"
                  value={data.pagespeed_mobile_score}
                  onChange={(v) => onChange('pagespeed_mobile_score', v)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sichtbarkeit & Backlinks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Sichtbarkeit & Backlinks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <AnalyseFormField
              type="number"
              name="sichtbarkeit_index"
              label="Sichtbarkeits-Index"
              value={data.sichtbarkeit_index}
              onChange={(v) => onChange('sichtbarkeit_index', v)}
            />
            <AnalyseFormField
              type="select"
              name="sichtbarkeit_trend"
              label="Trend"
              value={data.sichtbarkeit_trend}
              onChange={(v) => onChange('sichtbarkeit_trend', v)}
              options={['steigend', 'stabil', 'fallend']}
            />
            <AnalyseFormField
              type="number"
              name="backlinks_anzahl"
              label="Backlinks Anzahl"
              value={data.backlinks_anzahl}
              onChange={(v) => onChange('backlinks_anzahl', v)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <AnalyseFormField
              type="select"
              name="backlinks_qualitaet"
              label="Backlink-Qualität"
              value={data.backlinks_qualitaet}
              onChange={(v) => onChange('backlinks_qualitaet', v)}
              options={['gut', 'mittel', 'schlecht', 'toxisch']}
            />
            <AnalyseFormField
              type="text"
              name="backlinks_notizen"
              label="Notizen zu Backlinks"
              value={data.backlinks_notizen}
              onChange={(v) => onChange('backlinks_notizen', v)}
              placeholder="z.B. Hauptquellen, toxische Links..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-accent" />
            Keyword-Analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data.keywords || []).map((kw: any, index: number) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-muted/30 rounded-lg">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Keyword</label>
                  <Input
                    value={kw.keyword || ''}
                    onChange={(e) => updateKeyword(index, 'keyword', e.target.value)}
                    placeholder="Suchbegriff..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vol./Monat</label>
                  <Input
                    type="number"
                    value={kw.suchvolumen_monatlich || ''}
                    onChange={(e) => updateKeyword(index, 'suchvolumen_monatlich', parseInt(e.target.value) || null)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Wettbewerber</label>
                  <Input
                    type="number"
                    value={kw.wettbewerb_anzahl || ''}
                    onChange={(e) => updateKeyword(index, 'wettbewerb_anzahl', parseInt(e.target.value) || null)}
                    placeholder="5"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Position</label>
                    <Input
                      type="number"
                      value={kw.aktuelle_position || ''}
                      onChange={(e) => updateKeyword(index, 'aktuelle_position', parseInt(e.target.value) || null)}
                      placeholder="-"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeKeyword(index)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addKeyword} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Keyword hinzufügen
            </Button>
          </div>
          <div className="mt-4">
            <AnalyseFormField
              type="textarea"
              name="keyword_analyse_notizen"
              label="Notizen zur Keyword-Analyse"
              value={data.keyword_analyse_notizen}
              onChange={(v) => onChange('keyword_analyse_notizen', v)}
              placeholder="Erkenntnisse, Empfehlungen..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Wettbewerber */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Wettbewerber-Analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data.wettbewerber || []).map((w: any, index: number) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Wettbewerber {index + 1}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeWettbewerber(index)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={w.name || ''}
                      onChange={(e) => updateWettbewerber(index, 'name', e.target.value)}
                      placeholder="Firmenname"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      value={w.website || ''}
                      onChange={(e) => updateWettbewerber(index, 'website', e.target.value)}
                      placeholder="www.beispiel.de"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium">Stärken</label>
                    <Textarea
                      value={w.staerken || ''}
                      onChange={(e) => updateWettbewerber(index, 'staerken', e.target.value)}
                      placeholder="Was macht der Wettbewerber gut?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Schwächen</label>
                    <Textarea
                      value={w.schwaechen || ''}
                      onChange={(e) => updateWettbewerber(index, 'schwaechen', e.target.value)}
                      placeholder="Wo ist er schwach?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unsere Differenzierung</label>
                    <Textarea
                      value={w.differenzierung || ''}
                      onChange={(e) => updateWettbewerber(index, 'differenzierung', e.target.value)}
                      placeholder="Was machen wir besser?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addWettbewerber} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Wettbewerber hinzufügen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Google My Business */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Google My Business & Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AnalyseFormField
                type="checkbox"
                name="gmb_vorhanden"
                label="GMB-Profil vorhanden"
                value={data.gmb_vorhanden}
                onChange={(v) => onChange('gmb_vorhanden', v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <AnalyseFormField
                  type="number"
                  name="gmb_bewertungen_anzahl"
                  label="Anzahl Bewertungen"
                  value={data.gmb_bewertungen_anzahl}
                  onChange={(v) => onChange('gmb_bewertungen_anzahl', v)}
                />
                <AnalyseFormField
                  type="number"
                  name="gmb_bewertungen_durchschnitt"
                  label="⌀ Sterne"
                  value={data.gmb_bewertungen_durchschnitt}
                  onChange={(v) => onChange('gmb_bewertungen_durchschnitt', v)}
                />
              </div>
              <AnalyseFormField
                type="checkbox"
                name="gmb_vollstaendig"
                label="Profil vollständig ausgefüllt"
                value={data.gmb_vollstaendig}
                onChange={(v) => onChange('gmb_vollstaendig', v)}
              />
            </div>
            <div className="space-y-4">
              <AnalyseFormField
                type="checkbox"
                name="listings_check"
                label="Listings-Check durchgeführt"
                value={data.listings_check}
                onChange={(v) => onChange('listings_check', v)}
              />
              <AnalyseFormField
                type="select"
                name="listings_konsistenz"
                label="Konsistenz der Daten"
                value={data.listings_konsistenz}
                onChange={(v) => onChange('listings_konsistenz', v)}
                options={['konsistent', 'inkonsistent', 'unvollstaendig']}
              />
              <AnalyseFormField
                type="multiselect"
                name="listings_portale"
                label="Geprüfte Portale"
                value={data.listings_portale}
                onChange={(v) => onChange('listings_portale', v)}
                options={EXTERNE_ANALYSE_OPTIONS.listings_portale}
              />
            </div>
          </div>
          <div className="mt-4">
            <AnalyseFormField
              type="textarea"
              name="gmb_notizen"
              label="Notizen zu GMB & Listings"
              value={data.gmb_notizen}
              onChange={(v) => onChange('gmb_notizen', v)}
              placeholder="Auffälligkeiten, fehlende Einträge..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Videomarketing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            Videomarketing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AnalyseFormField
                type="checkbox"
                name="videomarketing_vorhanden"
                label="Videomarketing vorhanden"
                value={data.videomarketing_vorhanden}
                onChange={(v) => onChange('videomarketing_vorhanden', v)}
              />
              <AnalyseFormField
                type="checkbox"
                name="youtube_kanal"
                label="YouTube-Kanal vorhanden"
                value={data.youtube_kanal}
                onChange={(v) => onChange('youtube_kanal', v)}
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AnalyseFormField
                  type="number"
                  name="youtube_abonnenten"
                  label="Abonnenten"
                  value={data.youtube_abonnenten}
                  onChange={(v) => onChange('youtube_abonnenten', v)}
                />
                <AnalyseFormField
                  type="number"
                  name="youtube_videos_anzahl"
                  label="Videos"
                  value={data.youtube_videos_anzahl}
                  onChange={(v) => onChange('youtube_videos_anzahl', v)}
                />
              </div>
              <AnalyseFormField
                type="select"
                name="video_qualitaet"
                label="Video-Qualität"
                value={data.video_qualitaet}
                onChange={(v) => onChange('video_qualitaet', v)}
                options={['professionell', 'semi-professionell', 'amateurhaft']}
              />
            </div>
          </div>
          <div className="mt-4">
            <AnalyseFormField
              type="textarea"
              name="video_notizen"
              label="Notizen zum Videomarketing"
              value={data.video_notizen}
              onChange={(v) => onChange('video_notizen', v)}
              placeholder="Potenzial, Empfehlungen..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* SWOT */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">SWOT-Analyse (externe Erkenntnisse)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <AnalyseFormField
              type="textarea"
              name="swot_staerken"
              label="Stärken"
              value={data.swot_staerken}
              onChange={(v) => onChange('swot_staerken', v)}
              placeholder="Was macht das Unternehmen gut?"
              rows={3}
            />
            <AnalyseFormField
              type="textarea"
              name="swot_schwaechen"
              label="Schwächen"
              value={data.swot_schwaechen}
              onChange={(v) => onChange('swot_schwaechen', v)}
              placeholder="Wo gibt es Defizite?"
              rows={3}
            />
            <AnalyseFormField
              type="textarea"
              name="swot_chancen"
              label="Chancen"
              value={data.swot_chancen}
              onChange={(v) => onChange('swot_chancen', v)}
              placeholder="Welche Möglichkeiten bietet der Markt?"
              rows={3}
            />
            <AnalyseFormField
              type="textarea"
              name="swot_risiken"
              label="Risiken"
              value={data.swot_risiken}
              onChange={(v) => onChange('swot_risiken', v)}
              placeholder="Welche Gefahren bestehen?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Zusätzliche Notizen */}
      <div className="bg-muted/30 rounded-lg p-6">
        <AnalyseFormField
          type="textarea"
          name="zusaetzliche_analysen"
          label="Weitere Analyse-Erkenntnisse"
          value={data.zusaetzliche_analysen}
          onChange={(v) => onChange('zusaetzliche_analysen', v)}
          placeholder="Zusätzliche Beobachtungen, Empfehlungen aus der externen Analyse..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default ExterneAnalyseModule;
