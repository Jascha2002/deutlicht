import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronDown, AlertCircle, Send, CheckCircle2, Home, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  OfferFormData,
  initialFormData,
  SERVICE_OPTIONS,
  WEBSITE_FEATURES,
  SOCIAL_PLATFORMS,
  CMS_SYSTEMS,
  VOICEBOT_ANWENDUNGEN,
  BERATUNG_TOPICS,
  INDUSTRIES,
  COMPANY_SIZES
} from './types';
import {
  hostingPakete,
  proHostingPakete,
  serviceVertraege,
  seoPakete,
  kiAgentenPreise,
  voicebotPreise,
  voicebotAnwendungPreise,
  prozessPreise,
  beratungsPreise,
  COMPANY_SIZE_FACTORS,
  TIME_FACTORS,
  getIndustryFactor,
  websitePreise,
  websiteFeatures,
  migrationPreise,
  roundPrice,
  formatCurrency
} from '@/data/branchenPakete';
import OfferPreview from './OfferPreview';

interface AngebotsGeneratorProps {
  onComplete?: (data: OfferFormData) => void;
}

const AngebotsGenerator = ({ onComplete }: AngebotsGeneratorProps) => {
  const [started, setStarted] = useState(false);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  // ===== CALCULATION FUNCTIONS =====

  const calculateTimeFactor = (): number => {
    const timing = formData.project_start_timing;
    return TIME_FACTORS[timing]?.factor || 1.0;
  };

  const getSizeFactor = (): number => {
    return COMPANY_SIZE_FACTORS[formData.company_size] || 1.0;
  };

  const calculateWebsitePrice = (): { setup: number; monthly: number } => {
    const factor = getSizeFactor();
    const timeFactor = calculateTimeFactor();
    let basePrice = 0;
    
    if (formData.website_type === 'onepager') basePrice = 1200;
    else if (formData.website_type === 'landingpage') basePrice = 1500;
    else if (formData.website_type === 'landingpage_starter') basePrice = 299;
    else if (formData.website_type === '5-10') {
      const pages = parseInt(formData.website_pages_count) || 5;
      basePrice = 1900 + (pages - 5) * 300;
    } else if (formData.website_type === '10-20') {
      const pages = parseInt(formData.website_pages_count) || 10;
      basePrice = 3400 + (pages - 10) * 250;
    } else if (formData.website_type === '20-30') {
      const pages = parseInt(formData.website_pages_count) || 20;
      basePrice = 5900 + (pages - 20) * 200;
    } else if (formData.website_type === '>30') {
      const pages = parseInt(formData.website_pages_count) || 30;
      basePrice = 7900 + (pages - 30) * 180;
    }
    
    // Migration costs
    if (formData.website_migration_needed === 'ja') {
      const migPages = parseInt(formData.website_migration_pages) || 1;
      if (migPages <= 1) basePrice += 400;
      else if (migPages <= 5) basePrice += 600;
      else if (migPages <= 10) basePrice += 800;
      else basePrice += 1000;
    }
    
    // Feature costs
    if (formData.website_features.includes('Lead-/Vertriebsfokus')) basePrice += 2000;
    if (formData.website_features.includes('Konfigurator')) basePrice += 4500;
    if (formData.website_features.includes('ERP-Anbindung')) basePrice += 4500;
    if (formData.website_features.includes('Blog/News-Bereich')) basePrice += 800;
    if (formData.website_features.includes('Mehrsprachigkeit')) basePrice += 1200;
    if (formData.website_features.includes('Online-Terminbuchung')) basePrice += 1500;
    if (formData.website_features.includes('Mitgliederbereich')) basePrice += 2500;
    
    if (formData.domain_needed === 'ja') basePrice += 15;
    
    // Apply factors to setup price
    basePrice = basePrice * timeFactor * factor;
    
    // HOSTING - FIXE PREISE ohne Faktoren!
    let hostingMonthly = 0;
    if (formData.hosting_needed === 'ja' && formData.hosting_type) {
      const hosting = hostingPakete.find(h => h.id === formData.hosting_type);
      if (hosting) {
        hostingMonthly = hosting.monatlich; // FIX - keine Faktoren!
      }
      // Pro-Server Check
      const proHosting = proHostingPakete.find(h => h.id === formData.hosting_type);
      if (proHosting) {
        hostingMonthly = proHosting.monatlich; // FIX - keine Faktoren!
      }
    }
    
    // Service-Vertrag - FIXE PREISE
    let serviceMonthly = 0;
    if (formData.service_contract === 'ja' && formData.service_minutes) {
      const service = serviceVertraege.find(s => s.minuten.toString() === formData.service_minutes);
      if (service) {
        serviceMonthly = service.monatlich; // FIX - keine Faktoren!
      }
    }
    
    const totalMonthly = hostingMonthly + serviceMonthly;
    
    return { setup: roundPrice(basePrice), monthly: totalMonthly };
  };

  const calculateSocialMediaPrice = (): { setup: number; monthly: number } => {
    if (!formData.social_frequency || formData.social_platforms.length === 0) return { setup: 0, monthly: 0 };
    
    const base = 250;
    const freqFactors: Record<string, number> = {
      '1x/Monat': 0.8,
      '1x/14Tage': 1.0,
      '1x/Woche': 1.4,
      '2-3x/Woche': 2.0,
      'Mehrfach/Woche': 2.8
    };
    
    const channelFactors: Record<string, number> = {
      'LinkedIn': 1.0,
      'Facebook': 0.9,
      'Instagram': 1.2,
      'TikTok': 1.8,
      'X': 0.7
    };
    
    const contentFactors: Record<string, number> = {
      'Kunde_liefert_alles': 1.0,
      'DeutLicht_Texte': 1.3,
      'DeutLicht_beschafft_Medien': 1.8,
      'DeutLicht_erstellt_Medien': 2.5,
      'Fullservice': 3.5
    };
    
    const freqFactor = freqFactors[formData.social_frequency] || 1.0;
    const avgChannelFactor = formData.social_platforms.reduce((sum, p) => sum + (channelFactors[p] || 1.0), 0) / formData.social_platforms.length;
    const contentFactor = contentFactors[formData.social_content] || 1.0;
    
    let monthly = Math.round(base * freqFactor * avgChannelFactor * contentFactor);
    
    const setup = 1800;
    let vorOrt = 0;
    if (formData.social_vor_ort === '0.5') vorOrt = 790;
    else if (formData.social_vor_ort === '1') vorOrt = 1490;
    
    return { setup: setup + vorOrt, monthly };
  };

  const calculateSEOPrice = (): { setup: number; monthly: number } => {
    if (!formData.seo_package) return { setup: 0, monthly: 0 };
    const paket = seoPakete.find(p => p.id === formData.seo_package);
    return paket ? { setup: paket.setup, monthly: paket.monthly } : { setup: 0, monthly: 0 };
  };

  const calculateKIAgentPrice = (): { setup: number; monthly: number } => {
    if (!formData.ki_type) return { setup: 0, monthly: 0 };
    
    if (formData.ki_type === 'einfach') return kiAgentenPreise.einfach;
    if (formData.ki_type === 'workflow') return kiAgentenPreise.workflow;
    if (formData.ki_type === 'multi') return kiAgentenPreise.multi;
    
    if (formData.ki_type === 'branche' && formData.ki_branche) {
      const brancheKey = formData.ki_branche as keyof typeof kiAgentenPreise.branche;
      return kiAgentenPreise.branche[brancheKey] || { setup: 0, monthly: 0 };
    }
    
    return { setup: 0, monthly: 0 };
  };

  const calculateVoicebotPrice = (): { setup: number; monthly: number } => {
    if (!formData.voice_type) return { setup: 0, monthly: 0 };
    
    let basePrice = 0;
    let monthlyPrice = 0;
    
    if (formData.voice_type === 'weiterleitung') basePrice = voicebotPreise.weiterleitung;
    else if (formData.voice_type === 'vorqualifizierung') basePrice = voicebotPreise.vorqualifizierung;
    else if (formData.voice_type === 'vollautomatisch') basePrice = voicebotPreise.vollautomatisch;
    
    // Application-specific pricing (internal)
    if (formData.voice_anwendungen?.length > 0) {
      formData.voice_anwendungen.forEach(anw => {
        if (voicebotAnwendungPreise[anw]) {
          basePrice = Math.max(basePrice, voicebotAnwendungPreise[anw].setup);
          monthlyPrice = Math.max(monthlyPrice, voicebotAnwendungPreise[anw].monthly);
        }
      });
    }
    
    return { setup: basePrice, monthly: monthlyPrice };
  };

  const calculateProzessPrice = (): { setup: number; monthly: number } => {
    if (!formData.prozess_type) return { setup: 0, monthly: 0 };
    
    if (formData.prozess_type === 'audit') return { setup: prozessPreise.audit, monthly: 0 };
    if (formData.prozess_type === 'workshop') return { setup: prozessPreise.workshop, monthly: 0 };
    
    return { setup: 0, monthly: 0 };
  };

  const calculateBeratungPrice = (): number => {
    if (!formData.beratung_model) return 0;
    
    if (formData.beratung_model === 'kontingent') return beratungsPreise.kontingent;
    else if (formData.beratung_model === 'einzelstunden') {
      const hours = parseFloat(formData.beratung_hours) || 0;
      return Math.round(hours * beratungsPreise.stundenpreis);
    } else if (formData.beratung_model === 'beides') {
      const hours = parseFloat(formData.beratung_hours) || 0;
      return beratungsPreise.kontingent + Math.round(hours * beratungsPreise.stundenpreis);
    }
    
    return 0;
  };

  const calculateTotalPrice = (): { setup: number; monthly: number } => {
    let totalSetup = 0;
    let totalMonthly = 0;
    
    if (formData.services_selected.includes('Website & Digitale Plattformen')) {
      const wp = calculateWebsitePrice();
      totalSetup += wp.setup;
      totalMonthly += wp.monthly;
    }
    
    if (formData.services_selected.includes('Social Media Marketing')) {
      const sp = calculateSocialMediaPrice();
      totalSetup += sp.setup;
      totalMonthly += sp.monthly;
    }
    
    if (formData.services_selected.includes('SEO & Sichtbarkeit')) {
      const sep = calculateSEOPrice();
      totalSetup += sep.setup;
      totalMonthly += sep.monthly;
    }
    
    if (formData.services_selected.includes('KI-Agenten & Automation')) {
      const kp = calculateKIAgentPrice();
      totalSetup += kp.setup;
      totalMonthly += kp.monthly;
    }
    
    if (formData.services_selected.includes('Voicebots / Sprachassistenz')) {
      const vp = calculateVoicebotPrice();
      totalSetup += vp.setup;
      totalMonthly += vp.monthly;
    }
    
    if (formData.services_selected.includes('Prozessoptimierung & Digitalstrategie')) {
      const pp = calculateProzessPrice();
      totalSetup += pp.setup;
      totalMonthly += pp.monthly;
    }
    
    if (formData.services_selected.includes('Beratung & Schulung')) {
      totalSetup += calculateBeratungPrice();
    }
    
    return { setup: totalSetup, monthly: totalMonthly };
  };

  // ===== EVENT HANDLERS =====

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services_selected: prev.services_selected.includes(service)
        ? prev.services_selected.filter(s => s !== service)
        : [...prev.services_selected, service]
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      website_features: prev.website_features.includes(feature)
        ? prev.website_features.filter(f => f !== feature)
        : [...prev.website_features, feature]
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      social_platforms: prev.social_platforms.includes(platform)
        ? prev.social_platforms.filter(p => p !== platform)
        : [...prev.social_platforms, platform]
    }));
  };

  const toggleBeratungTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      beratung_topics: prev.beratung_topics.includes(topic)
        ? prev.beratung_topics.filter(t => t !== topic)
        : [...prev.beratung_topics, topic]
    }));
  };

  const toggleVoicebotAnwendung = (anwendung: string) => {
    setFormData(prev => ({
      ...prev,
      voice_anwendungen: prev.voice_anwendungen?.includes(anwendung)
        ? prev.voice_anwendungen.filter(a => a !== anwendung)
        : [...(prev.voice_anwendungen || []), anwendung]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.company_name || !formData.contact_person || !formData.email) {
      toast({
        title: "Pflichtfelder ausfüllen",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totals = calculateTotalPrice();
      
      const fullData = {
        ...formData,
        calculated_setup: totals.setup,
        calculated_monthly: totals.monthly,
        _meta: {
          submitted_at: new Date().toISOString(),
          form_version: '4.0',
          form_type: 'projektanfrage',
        },
      };

      const { error } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          type: 'projektanfrage',
          data: fullData,
        },
      });

      if (error) throw error;

      setIsComplete(true);
      onComplete?.(formData);

      toast({
        title: "Angebot wird erstellt!",
        description: "Sie erhalten es in Kürze per E-Mail.",
      });

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotalPrice();

  // ===== ENTRY SCREEN =====
  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-accent" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Die DeutLicht Projektanfrage
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Ihr personalisiertes Angebot in nur 5 Minuten.
            <br />
            <span className="font-medium text-foreground">Kostenlos und unverbindlich.</span>
          </p>
          
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 text-left">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">So funktioniert's:</strong>
              <br /><br />
              Wählen Sie Ihre gewünschten Leistungen und erhalten Sie 
              eine individuelle Kostenabschätzung mit konkreten Handlungsempfehlungen.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Dauer: ca. 5 Minuten
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-accent rounded-full"></span>
              100% kostenlos
            </span>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => setStarted(true)}
            className="gap-2 text-lg px-8 py-6"
          >
            Jetzt Angebot anfordern
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    );
  }

  // ===== SUCCESS SCREEN =====
  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 md:p-12">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold">Ihr Angebot ist fertig!</h1>
            
            <p className="text-lg text-muted-foreground">
              Laden Sie Ihr personalisiertes PDF-Angebot herunter oder sehen Sie sich die Vorschau an.
            </p>
          </div>

          <OfferPreview data={formData as any} />
          
          <div className="mt-8 pt-6 border-t">
            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">✉️ E-Mail-Bestätigung</strong>
                <br /><br />
                Eine Kopie Ihrer Anfrage wurde an <strong>{formData.email}</strong> gesendet. 
                Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  Zur Startseite
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setStarted(false);
                  setIsComplete(false);
                  setFormData(initialFormData);
                }}
              >
                Neues Angebot anfordern
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ===== MAIN FORM =====
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">DeutLicht®</h2>
            <p className="text-muted-foreground">Angebotsgenerator</p>
          </div>
        </div>

        {/* Unternehmensdaten */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold border-b pb-2">Unternehmensdaten</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Unternehmen *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Ihr Unternehmen"
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Branche</Label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Bitte wählen</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="company_size">Unternehmensgröße</Label>
              <select
                id="company_size"
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {COMPANY_SIZES.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="contact_person">Ansprechpartner *</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                placeholder="Ihr Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ihre@email.de"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+49 ..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_start_timing">Wann möchten Sie starten?</Label>
              <select
                id="project_start_timing"
                name="project_start_timing"
                value={formData.project_start_timing}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Bitte wählen</option>
                <option value="sofort">🚀 Sofortstart (innerhalb 7 Tage)</option>
                <option value="2wochen">📅 In 2 Wochen</option>
                <option value="4wochen">⏳ In 4 Wochen</option>
                <option value="1-2monate">📋 In 1-2 Monaten</option>
                <option value="6monate">⌛ Innerhalb 6 Monate</option>
                <option value="planung">🤔 Noch in Planung</option>
                <option value="unbekannt">❓ Unbekannt</option>
              </select>
            </div>
            <div>
              <Label htmlFor="project_deadline">Fertigstellung (ab Beauftragung)</Label>
              <select
                id="project_deadline"
                name="project_deadline"
                value={formData.project_deadline}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Bitte wählen</option>
                <option value="4wochen">Innerhalb 4 Wochen</option>
                <option value="8wochen">Innerhalb 8 Wochen</option>
                <option value="12wochen">Innerhalb 12 Wochen</option>
                <option value="flexibel">Flexibel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leistungsmodule */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold border-b pb-2">Leistungsmodule</h3>
          
          <div className="space-y-4">
            {SERVICE_OPTIONS.map(service => (
              <div key={service} className="border rounded-lg overflow-hidden">
                <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={formData.services_selected.includes(service)}
                    onCheckedChange={() => toggleService(service)}
                  />
                  <span className="font-medium">{service}</span>
                  {formData.services_selected.includes(service) && (
                    <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                  )}
                </label>

                {/* Website & Digitale Plattformen */}
                {formData.services_selected.includes(service) && service === 'Website & Digitale Plattformen' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>Website-Typ wählen</Label>
                      <select
                        name="website_type"
                        value={formData.website_type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="onepager">Onepager - Alles auf einer Seite, kompakt & übersichtlich</option>
                        <option value="landingpage_starter">🎯 Landingpage Starter - Perfekt für erste Schritte (299€)</option>
                        <option value="landingpage">Landingpage Professional - Mehr Funktionen, mehr Wirkung</option>
                        <option value="5-10">Website 5-10 Seiten - Ideal für kleine Unternehmen & Start-ups</option>
                        <option value="10-20">Website 10-20 Seiten - Perfekt für mehrere Leistungen</option>
                        <option value="20-30">Website 20-30 Seiten - Umfangreiche Unternehmensdarstellung</option>
                        <option value=">30">Website über 30 Seiten - Für komplexe Unternehmen (Gespräch empfohlen)</option>
                      </select>
                    </div>

                    {formData.website_type === 'landingpage_starter' && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <p className="font-medium text-green-800 dark:text-green-200">✅ Landingpage Starter inkl.:</p>
                        <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                          <li>• Responsive Design (mobil/desktop)</li>
                          <li>• 5-7 Sections (Hero, Vorteile, Referenzen, CTA, Kontakt, Footer)</li>
                          <li>• Kontaktformular + Telefon/Email</li>
                          <li>• SEO-Grundlagen (Meta-Tags, schnelle Ladezeit)</li>
                          <li>• Impressum/Datenschutz (rechtssicher)</li>
                        </ul>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                          Nicht enthalten: Custom Animationen, komplexe Integrationen, E-Commerce, Mehrsprachigkeit (optional buchbar)
                        </p>
                      </div>
                    )}
                    
                    {['5-10', '10-20', '20-30', '>30'].includes(formData.website_type) && (
                      <div>
                        <Label>Seitenanzahl</Label>
                        <Input
                          name="website_pages_count"
                          type="number"
                          value={formData.website_pages_count}
                          onChange={handleInputChange}
                          placeholder="Anzahl Seiten"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label>CMS-System wählen</Label>
                      <select
                        name="website_cms"
                        value={formData.website_cms}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        {CMS_SYSTEMS.map(cms => (
                          <option key={cms} value={cms}>{cms}</option>
                        ))}
                      </select>
                    </div>

                    {formData.website_cms === 'Andere' && (
                      <Input
                        name="website_cms_other"
                        value={formData.website_cms_other}
                        onChange={handleInputChange}
                        placeholder="Welches CMS?"
                      />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Hosting benötigt?</Label>
                        <select
                          name="hosting_needed"
                          value={formData.hosting_needed}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="ja">Ja</option>
                          <option value="nein">Nein</option>
                        </select>
                      </div>
                      
                      {formData.hosting_needed === 'ja' && (
                        <div>
                          <Label>Hosting-Paket wählen (FIXPREISE)</Label>
                          <select
                            name="hosting_type"
                            value={formData.hosting_type}
                            onChange={handleInputChange}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="">Bitte wählen</option>
                            <optgroup label="Standard Hosting">
                              {hostingPakete.map(h => (
                                <option key={h.id} value={h.id}>
                                  {h.name} - {h.monatlich}€/Monat ({h.jaehrlich}€/Jahr)
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Premium Hosting Deutschland">
                              {proHostingPakete.map(h => (
                                <option key={h.id} value={h.id}>
                                  {h.name} - {h.monatlich}€/Monat
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Service/Wartung</Label>
                        <select
                          name="service_contract"
                          value={formData.service_contract}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Optional</option>
                          <option value="ja">Ja</option>
                          <option value="nein">Nein</option>
                        </select>
                      </div>
                      
                      {formData.service_contract === 'ja' && (
                        <div>
                          <Label>Kontingent wählen (FIXPREISE)</Label>
                          <select
                            name="service_minutes"
                            value={formData.service_minutes}
                            onChange={handleInputChange}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="">Bitte wählen</option>
                            {serviceVertraege.map(s => (
                              <option key={s.id} value={s.minuten.toString()}>
                                {s.minuten} Min/Monat ({s.monatlich}€)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Zusatzfeatures</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {WEBSITE_FEATURES.map(feature => (
                          <label key={feature} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={formData.website_features.includes(feature)}
                              onCheckedChange={() => toggleFeature(feature)}
                            />
                            {feature}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Media Marketing */}
                {formData.services_selected.includes(service) && service === 'Social Media Marketing' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>Plattformen</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SOCIAL_PLATFORMS.map(p => (
                          <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={formData.social_platforms.includes(p)}
                              onCheckedChange={() => togglePlatform(p)}
                            />
                            {p}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Posting-Frequenz</Label>
                        <select
                          name="social_frequency"
                          value={formData.social_frequency}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="1x/Monat">1x/Monat</option>
                          <option value="1x/14Tage">1x/14 Tage</option>
                          <option value="1x/Woche">1x/Woche</option>
                          <option value="2-3x/Woche">2-3x/Woche</option>
                          <option value="Mehrfach/Woche">Mehrfach/Woche</option>
                        </select>
                      </div>
                      <div>
                        <Label>Content-Erstellung</Label>
                        <select
                          name="social_content"
                          value={formData.social_content}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="Kunde_liefert_alles">Kunde liefert alles</option>
                          <option value="DeutLicht_Texte">DeutLicht erstellt Texte</option>
                          <option value="DeutLicht_beschafft_Medien">DeutLicht beschafft Medien</option>
                          <option value="DeutLicht_erstellt_Medien">DeutLicht erstellt Medien</option>
                          <option value="Fullservice">Fullservice</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Vor-Ort Aufnahmen (optional)</Label>
                      <select
                        name="social_vor_ort"
                        value={formData.social_vor_ort}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Nicht benötigt</option>
                        <option value="0.5">0,5 Tag (+790€)</option>
                        <option value="1">1 Tag (+1.490€)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* SEO & Sichtbarkeit */}
                {formData.services_selected.includes(service) && service === 'SEO & Sichtbarkeit' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>SEO-Paket wählen</Label>
                      <select
                        name="seo_package"
                        value={formData.seo_package}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        <optgroup label="Einmalige Pakete">
                          {seoPakete.filter(p => p.monthly === 0).map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {p.setup}€ einmalig - {p.beschreibung}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Monatliche Pakete">
                          {seoPakete.filter(p => p.monthly > 0).map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} - {p.monthly}€/Monat - {p.beschreibung}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>
                )}

                {/* KI-Agenten & Automation */}
                {formData.services_selected.includes(service) && service === 'KI-Agenten & Automation' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>Art wählen</Label>
                      <select
                        name="ki_type"
                        value={formData.ki_type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="einfach">Einfacher Agent - für einzelne Aufgaben</option>
                        <option value="workflow">Workflow-Automation - 2-3 Systeme verbinden</option>
                        <option value="multi">Multi-System-Agent - komplexe Integrationen</option>
                        <option value="branche">Branchenspezifisches Komplettpaket</option>
                      </select>
                    </div>
                    
                    {formData.ki_type === 'branche' && (
                      <div>
                        <Label>Branche wählen</Label>
                        <select
                          name="ki_branche"
                          value={formData.ki_branche}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="kanzlei">Kanzlei - Mandantenbetreuung & Dokumenten-KI</option>
                          <option value="handwerk">Handwerk - Auftragsverwaltung & Kundenkommunikation</option>
                          <option value="ecommerce">E-Commerce - Shop-Automation & Kundenservice</option>
                          <option value="produktion">Produktion - Fertigungsplanung & Qualitätskontrolle</option>
                          <option value="gesundheit">Gesundheit - Patientenverwaltung & Terminkoordination</option>
                          <option value="bildung">Bildung - Lernplattform & Teilnehmerverwaltung</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Voicebots / Sprachassistenz */}
                {formData.services_selected.includes(service) && service === 'Voicebots / Sprachassistenz' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Typ wählen</Label>
                        <select
                          name="voice_type"
                          value={formData.voice_type}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="weiterleitung">Weiterleitung - Anrufe intelligent routen</option>
                          <option value="vorqualifizierung">Vorqualifizierung - Anliegen erfassen & kategorisieren</option>
                          <option value="vollautomatisch">Vollautomatisch - Komplette Gesprächsabwicklung</option>
                        </select>
                      </div>
                      <div>
                        <Label>Einsatzkanal wählen</Label>
                        <select
                          name="voice_channel"
                          value={formData.voice_channel}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="telefon">📞 Telefon - Bei eingehenden/ausgehenden Anrufen</option>
                          <option value="website">🌐 Website - Web-basierte Sprachinteraktion</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Anwendungsbereiche (Mehrfachauswahl)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                        {VOICEBOT_ANWENDUNGEN.map(anw => (
                          <label key={anw} className="flex items-start gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={formData.voice_anwendungen?.includes(anw)}
                              onCheckedChange={() => toggleVoicebotAnwendung(anw)}
                              className="mt-0.5"
                            />
                            {anw}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Prozessoptimierung & Digitalstrategie */}
                {formData.services_selected.includes(service) && service === 'Prozessoptimierung & Digitalstrategie' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>Typ wählen</Label>
                      <select
                        name="prozess_type"
                        value={formData.prozess_type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="audit">Klarheits-Audit - IST-Analyse & Optimierungspotenziale</option>
                        <option value="workshop">Workshop-Paket (2 Tage) - Strategie & Roadmap entwickeln</option>
                        <option value="begleitung">Umsetzungsbegleitung - nach individuellem Aufwand</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Beratung & Schulung */}
                {formData.services_selected.includes(service) && service === 'Beratung & Schulung' && (
                  <div className="p-4 pt-0 space-y-4 border-t bg-muted/20">
                    <div>
                      <Label>Buchungsmodell</Label>
                      <select
                        name="beratung_model"
                        value={formData.beratung_model}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="kontingent">Kontingent 3,5 Tage - oft 50-80% förderfähig (BAFA)</option>
                        <option value="einzelstunden">Einzelstunden - flexible Abrechnung je 15 Min</option>
                        <option value="beides">Kontingent + zusätzliche Einzelstunden</option>
                      </select>
                    </div>
                    
                    {(formData.beratung_model === 'einzelstunden' || formData.beratung_model === 'beides') && (
                      <div>
                        <Label>Anzahl Stunden</Label>
                        <Input
                          name="beratung_hours"
                          type="number"
                          value={formData.beratung_hours}
                          onChange={handleInputChange}
                          placeholder="Stunden"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label>Beratungsthemen</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {BERATUNG_TOPICS.map(topic => (
                          <label key={topic} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={formData.beratung_topics.includes(topic)}
                              onCheckedChange={() => toggleBeratungTopic(topic)}
                            />
                            {topic}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        {formData.services_selected.length > 0 && totals.setup > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <h3 className="text-lg font-semibold mb-4">Investitionsübersicht:</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Einmalige Einrichtung:</span>
                <span className="text-xl font-bold">{formatCurrency(totals.setup)} netto</span>
              </div>
              
              {totals.monthly > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Monatliche Kosten:</span>
                  <span className="text-xl font-bold text-accent">{formatCurrency(totals.monthly)} netto</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">zzgl. gesetzlicher MwSt.</p>
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
              <p className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Hinweis:</strong> Die Hosting-Preise sind Festpreise und werden nicht durch Faktoren beeinflusst. 
                  Bestandskunden erhalten 5% Rabatt auf den Jahrespreis.
                </span>
              </p>
            </div>
          </Card>
        )}

        {/* Additional Notes */}
        <div className="mb-8">
          <Label htmlFor="additional_notes">Zusätzliche Anmerkungen</Label>
          <textarea
            id="additional_notes"
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleInputChange}
            className="w-full min-h-24 p-3 rounded-md border border-input bg-background text-sm resize-y"
            placeholder="Gibt es etwas, das wir noch wissen sollten?"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || formData.services_selected.length === 0}
          className="w-full gap-2 bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg"
        >
          {isSubmitting ? (
            <>Wird gesendet...</>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Angebot anfordern
            </>
          )}
        </Button>
      </Card>

      <p className="text-center text-sm text-muted-foreground mt-6">
        DeutLicht. Wo Komplexes einfach wird.
      </p>
    </div>
  );
};

export default AngebotsGenerator;
