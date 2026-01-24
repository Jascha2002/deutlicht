import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OfferFormData, KI_BRANCHENLOESUNGEN, VOICE_ANWENDUNGEN } from '@/types/offer';
import { cn } from '@/lib/utils';
import { Check, Info } from 'lucide-react';
import detailKonfigHero from '@/assets/detail-konfiguration-hero.jpg';

interface Step4Props {
  formData: OfferFormData;
  onChange: (field: keyof OfferFormData, value: string) => void;
  onToggleArray: (field: 'website_features' | 'social_platforms', value: string) => void;
}

// Website-Typen mit Beschreibungen
const WEBSITE_TYPES = [
  { value: 'landingpage_starter', label: 'Landing Page Starter', description: 'Perfekt für schnelle Kampagnen oder Produktlaunches.', price: 'ab 399€' },
  { value: 'onepager', label: 'One-Pager', description: 'Elegante Einzelseite mit scrollenden Sektionen.', price: 'ab 1.200€' },
  { value: 'landingpage', label: 'Landing Page Pro', description: 'Erweiterte Landing Page mit A/B-Testing-Möglichkeiten.', price: 'ab 1.500€' },
  { value: '5-10', label: 'Website 5-10 Seiten', description: 'Klassische Unternehmenswebsite.', price: 'ab 1.900€' },
  { value: '10-20', label: 'Website 10-20 Seiten', description: 'Umfangreiche Website für größere Unternehmen.', price: 'ab 3.400€' },
  { value: '20-30', label: 'Website 20-30 Seiten', description: 'Komplexe Website mit tiefgehender Struktur.', price: 'ab 5.900€' },
  { value: '>30', label: 'Website 30+ Seiten', description: 'Enterprise-Website für große Organisationen.', price: 'ab 7.900€' },
];

// Shop-Typen mit Beschreibungen und Preisen
const SHOP_TYPES = [
  { value: 'webshop_starter', label: 'Webshop Starter', description: 'Einfacher Einstieg mit bis zu 50 Produkten.', price: '2.990€' },
  { value: 'webshop_standard', label: 'Webshop Standard', description: 'Professioneller Shop mit erweiterten Features.', price: 'ab 4.500€' },
  { value: 'webshop_professional', label: 'Webshop Professional', description: 'Umfangreicher Shop mit 500+ Produkten.', price: 'ab 6.500€' },
  { value: 'webshop_enterprise', label: 'Webshop Enterprise', description: 'Enterprise-Lösung mit Multi-Channel.', price: 'ab 9.500€' },
];

const WEBSITE_FEATURES_DETAILED = [
  { value: 'Lead-/Vertriebsfokus', label: 'Lead-/Vertriebsfokus', description: 'Optimierte Formulare und CTAs' },
  { value: 'Konfigurator', label: 'Konfigurator', description: 'Interaktiver Produktkonfigurator' },
  { value: 'ERP-Anbindung', label: 'ERP-Anbindung', description: 'Nahtlose Integration' },
  { value: 'Blog', label: 'Blog', description: 'Content-Management für Artikel' },
  { value: 'Mehrsprachigkeit', label: 'Mehrsprachigkeit', description: 'Vollständige Übersetzung' },
  { value: 'Terminbuchung', label: 'Terminbuchung', description: 'Online-Kalender' },
  { value: 'Mitgliederbereich', label: 'Mitgliederbereich', description: 'Geschützter Bereich mit Login' },
];

// Website Hosting
const HOSTING_TYPES_WEBSITE = [
  { value: 'onepager_landingpage', label: 'Onepager/Landingpage', price: '12€/Monat' },
  { value: 'website_5-10', label: 'Website 5-10 Seiten', price: '20€/Monat' },
  { value: 'website_10-20', label: 'Website 10-20 Seiten', price: '30€/Monat' },
  { value: 'website_20-30', label: 'Website 20-30 Seiten', price: '40€/Monat' },
  { value: 'website_30+', label: 'Website 30+ Seiten', price: '50€/Monat' },
];

// Shop Hosting
const HOSTING_TYPES_SHOP = [
  { value: 'shop_klein', label: 'Kleiner Shop', description: 'Bis 100 Produkte', price: '25€/Monat' },
  { value: 'shop_mittel', label: 'Mittelgroßer Shop', description: '100-500 Produkte', price: '40€/Monat' },
  { value: 'shop_gross', label: 'Großer Shop', description: '500+ Produkte', price: '60€/Monat' },
  { value: 'pro_shop_server', label: 'Pro-Shop-Server', description: 'Hohe Ausfallsicherheit, schnelle Zugriffe', price: '80€/Monat' },
  { value: 'pro_shop_2jahre', label: 'Pro-Shop-Server (2 Jahre)', description: '2-Jahres-Vertrag', price: '62,50€/Monat' },
  { value: 'pro_shop_3jahre', label: 'Pro-Shop-Server (3 Jahre)', description: '3-Jahres-Vertrag', price: '58,33€/Monat' },
];

const SERVICE_MINUTES = [
  { value: '20', label: '20 Minuten', price: '39€/Monat' },
  { value: '60', label: '60 Minuten', price: '99€/Monat' },
  { value: '120', label: '120 Minuten', price: '179€/Monat' },
];

const SOCIAL_PLATFORMS_DETAILED = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'X', label: 'X' },
];

const SOCIAL_FREQUENCY_OPTIONS = [
  { value: '1x/Monat', label: '1x pro Monat' },
  { value: '1x/14Tage', label: '1x alle 14 Tage' },
  { value: '1x/Woche', label: '1x pro Woche' },
  { value: '2-3x/Woche', label: '2-3x pro Woche' },
  { value: 'Mehrfach/Woche', label: 'Mehrfach pro Woche' },
];

const SOCIAL_CONTENT_OPTIONS = [
  { value: 'Kunde_liefert_alles', label: 'Kunde liefert alles' },
  { value: 'DeutLicht_Texte', label: 'DeutLicht erstellt Texte' },
  { value: 'DeutLicht_beschafft_Medien', label: 'DeutLicht beschafft Medien' },
  { value: 'DeutLicht_erstellt_Medien', label: 'DeutLicht erstellt Medien' },
  { value: 'Fullservice', label: 'Fullservice' },
];

const SEO_PACKAGES = [
  { value: 'micro', label: 'Micro', description: 'Grundlegende SEO-Analyse' },
  { value: 'starter', label: 'Starter', description: 'Keyword-Recherche, On-Page' },
  { value: 'quickwin', label: 'Quickwin', description: 'Schnelle Ranking-Verbesserungen' },
  { value: 'klein', label: 'Klein', description: 'Monatliche Betreuung' },
  { value: 'basic', label: 'Basic', description: 'Umfassende SEO-Strategie' },
  { value: 'pro', label: 'Pro', description: 'Professionelle SEO mit Reporting' },
  { value: 'enterprise', label: 'Enterprise', description: 'Enterprise-SEO' },
];

const KI_TYPES = [
  { value: 'einfach', label: 'Einfacher Agent', description: 'Automatisierung einzelner Aufgaben' },
  { value: 'workflow', label: 'Workflow-Agent', description: 'Verkettete Automatisierungen' },
  { value: 'multi', label: 'Multi-Agent-System', description: 'Mehrere spezialisierte KI-Agenten' },
];

const VOICE_TYPES = [
  { value: 'weiterleitung', label: 'Weiterleitung', description: 'Intelligente Anrufannahme' },
  { value: 'vorqualifizierung', label: 'Vorqualifizierung', description: 'Strukturierte Gesprächsführung' },
  { value: 'vollautomatisch', label: 'Vollautomatisch', description: 'Komplette Anrufabwicklung' },
];

const PROZESS_TYPES = [
  { value: 'audit', label: 'Audit', description: 'Umfassende Analyse Ihrer Prozesse' },
  { value: 'workshop', label: 'Workshop', description: 'Interaktiver Strategie-Workshop' },
];

const BERATUNG_MODELS = [
  { value: 'kontingent', label: 'Stundenkontingent', price: '3.500€ für 20 Stunden' },
  { value: 'einzelstunden', label: 'Einzelstunden', price: '199€/Stunde' },
  { value: 'beides', label: 'Kombination', price: 'Kontingent + Einzelstunden' },
];

export const Step4Details = ({ formData, onChange, onToggleArray }: Step4Props) => {
  const hasWebsite = formData.services_selected.includes('Website & Digitale Plattformen');
  const hasSocial = formData.services_selected.includes('Social Media Marketing');
  const hasSEO = formData.services_selected.includes('SEO & Sichtbarkeit');
  const hasKI = formData.services_selected.includes('KI-Agenten & Automation');
  const hasVoice = formData.services_selected.includes('Voicebots / Sprachassistenz');
  const hasProzess = formData.services_selected.includes('Prozessoptimierung & Digitalstrategie');
  const hasBeratung = formData.services_selected.includes('Beratung & Schulung');

  // Prüfen ob ein Shop-Typ gewählt ist
  const isShopType = ['webshop_starter', 'webshop_standard', 'webshop_professional', 'webshop_enterprise'].includes(formData.website_type);
  
  // Passendes Hosting-Array basierend auf Website-Typ
  const HOSTING_OPTIONS = isShopType ? HOSTING_TYPES_SHOP : HOSTING_TYPES_WEBSITE;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={detailKonfigHero} 
          alt="Detail-Konfiguration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <CardTitle className="text-2xl text-foreground">Detail-Konfiguration</CardTitle>
          <CardDescription className="text-muted-foreground">Konfigurieren Sie Ihre gewählten Leistungen</CardDescription>
        </div>
      </div>
      <CardHeader className="pt-4 pb-2" />
      <CardContent className="space-y-8">
        {/* Website Section */}
        {hasWebsite && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              🌐 Website & Digitale Plattformen
            </h3>

            <div className="space-y-2">
              <Label>Website-Typ</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WEBSITE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => onChange('website_type', type.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.website_type === type.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {formData.website_type === type.value && <Check className="w-4 h-4 text-primary" />}
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <span className="text-xs text-primary font-medium">{type.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Shop-Pakete */}
            <div className="space-y-2">
              <Label>Webshop-Pakete</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SHOP_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => onChange('website_type', type.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.website_type === type.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {formData.website_type === type.value && <Check className="w-4 h-4 text-primary" />}
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <span className="text-xs text-primary font-medium">{type.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {['5-10', '10-20', '20-30', '>30'].includes(formData.website_type) && (
              <div className="space-y-2">
                <Label>Genaue Seitenanzahl</Label>
                <Input
                  type="number"
                  value={formData.website_pages_count}
                  onChange={(e) => onChange('website_pages_count', e.target.value)}
                  placeholder="z.B. 8"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Zusatzfunktionen</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {WEBSITE_FEATURES_DETAILED.map((feature) => {
                  const isSelected = formData.website_features.includes(feature.value);
                  return (
                    <button
                      key={feature.value}
                      type="button"
                      onClick={() => onToggleArray('website_features', feature.value)}
                      className={cn(
                        'p-2 rounded-lg border text-left transition-all text-sm',
                        isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {isSelected && <Check className="w-3 h-3 text-primary" />}
                        {feature.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domain benötigt?</Label>
                <Select value={formData.domain_needed} onValueChange={(v) => onChange('domain_needed', v)}>
                  <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">Ja, Domain benötigt</SelectItem>
                    <SelectItem value="nein">Nein, Domain vorhanden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hosting benötigt?</Label>
                <Select value={formData.hosting_needed} onValueChange={(v) => onChange('hosting_needed', v)}>
                  <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">Ja, Hosting benötigt</SelectItem>
                    <SelectItem value="nein">Nein, Hosting vorhanden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.hosting_needed === 'ja' && (
              <div className="space-y-3">
                <Label>
                  {isShopType ? 'Shop-Hosting-Paket' : 'Website-Hosting-Paket'}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {HOSTING_OPTIONS.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => onChange('hosting_type', type.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        formData.hosting_type === type.value
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium block">{type.label}</span>
                          {'description' in type && type.description && (
                            <span className="text-xs text-muted-foreground">{type.description as string}</span>
                          )}
                        </div>
                        <span className="text-sm text-primary font-medium whitespace-nowrap">{type.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {isShopType && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Shop-Hosting beinhaltet SSL, tägliche Backups und Performance-Optimierung
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Service & Wartungsvertrag?</Label>
              <Select value={formData.service_contract} onValueChange={(v) => onChange('service_contract', v)}>
                <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">Ja, Service-Vertrag gewünscht</SelectItem>
                  <SelectItem value="nein">Nein, kein Service-Vertrag</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.service_contract === 'ja' && (
              <div className="space-y-2">
                <Label>Service-Paket</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {SERVICE_MINUTES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange('service_minutes', option.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        formData.service_minutes === option.value
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-sm text-muted-foreground">{option.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Media Section */}
        {hasSocial && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">📱 Social Media Marketing</h3>
            
            <div className="space-y-2">
              <Label>Plattformen</Label>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_PLATFORMS_DETAILED.map((platform) => {
                  const isSelected = formData.social_platforms.includes(platform.value);
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => onToggleArray('social_platforms', platform.value)}
                      className={cn(
                        'px-4 py-2 rounded-lg border transition-all',
                        isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Post-Frequenz</Label>
                <Select value={formData.social_frequency} onValueChange={(v) => onChange('social_frequency', v)}>
                  <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                  <SelectContent>
                    {SOCIAL_FREQUENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Content-Erstellung</Label>
                <Select value={formData.social_content} onValueChange={(v) => onChange('social_content', v)}>
                  <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                  <SelectContent>
                    {SOCIAL_CONTENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vor-Ort Termin für Content-Produktion?</Label>
              <Select value={formData.social_vor_ort} onValueChange={(v) => onChange('social_vor_ort', v)}>
                <SelectTrigger><SelectValue placeholder="Auswählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nein">Nein, kein Vor-Ort-Termin</SelectItem>
                  <SelectItem value="0.5">0.5 Tage - Kurzer Shooting-Termin</SelectItem>
                  <SelectItem value="1">1 Tag - Ausführliche Content-Produktion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* SEO Section */}
        {hasSEO && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">🔍 SEO & Sichtbarkeit</h3>
            <div className="space-y-2">
              <Label>SEO-Paket</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SEO_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.value}
                    type="button"
                    onClick={() => onChange('seo_package', pkg.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.seo_package === pkg.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium">{pkg.label}</div>
                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KI Section */}
        {hasKI && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">🤖 KI-Agenten & Automation</h3>
            
            <div className="space-y-2">
              <Label>KI-Agent Typ</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {KI_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => { onChange('ki_type', type.value); onChange('ki_branche', ''); }}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.ki_type === type.value && !formData.ki_branche
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium">{type.label}</div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Oder wählen Sie eine Branchenlösung:
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {KI_BRANCHENLOESUNGEN.map((branche) => (
                  <button
                    key={branche.value}
                    type="button"
                    onClick={() => { onChange('ki_branche', branche.value); onChange('ki_type', ''); }}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.ki_branche === branche.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium text-sm">{branche.label}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{branche.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voicebot Section */}
        {hasVoice && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">🎙️ Voicebots / Sprachassistenz</h3>
            
            <div className="space-y-2">
              <Label>Voicebot-Typ</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {VOICE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => onChange('voice_type', type.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.voice_type === type.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium">{type.label}</div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anwendungsbereich</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {VOICE_ANWENDUNGEN.map((anwendung) => (
                  <button
                    key={anwendung.value}
                    type="button"
                    onClick={() => onChange('voice_anwendung', anwendung.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.voice_anwendung === anwendung.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium text-sm">{anwendung.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prozess Section */}
        {hasProzess && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">⚙️ Prozessoptimierung & Digitalstrategie</h3>
            <div className="space-y-2">
              <Label>Leistungsart</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PROZESS_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => onChange('prozess_type', type.value)}
                    className={cn(
                      'p-4 rounded-lg border text-left transition-all',
                      formData.prozess_type === type.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium">{type.label}</div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Beratung Section */}
        {hasBeratung && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">💡 Beratung & Schulung</h3>
            <div className="space-y-2">
              <Label>Beratungsmodell</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {BERATUNG_MODELS.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => onChange('beratung_model', model.value)}
                    className={cn(
                      'p-4 rounded-lg border text-left transition-all',
                      formData.beratung_model === model.value
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium">{model.label}</div>
                    <p className="text-sm text-muted-foreground">{model.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {(formData.beratung_model === 'einzelstunden' || formData.beratung_model === 'beides') && (
              <div className="space-y-2">
                <Label>Anzahl zusätzlicher Stunden</Label>
                <Input
                  type="number"
                  value={formData.beratung_hours}
                  onChange={(e) => onChange('beratung_hours', e.target.value)}
                  placeholder="z.B. 10"
                />
              </div>
            )}
          </div>
        )}

        {formData.services_selected.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Bitte wählen Sie zuerst Leistungen in Schritt 3 aus.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
