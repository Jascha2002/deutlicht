import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Euro, Building2, User, FileText, Settings, Calculator,
  Globe, Megaphone, Search, Bot, Phone, Cog, GraduationCap, Package,
  ClipboardPaste, Loader2, Sparkles
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import {
  SERVICE_OPTIONS,
  WEBSITE_FEATURES,
  INDUSTRIES,
  COMPANY_SIZES,
  CMS_SYSTEMS,
  VOICEBOT_ANWENDUNGEN,
  BERATUNG_TOPICS,
  SOCIAL_PLATFORMS,
  OfferFormData,
  initialFormData
} from '@/components/AngebotsGenerator/types';
import {
  hostingPakete,
  serviceVertraege,
  seoPakete,
  kiAgentenPreise,
  voicebotPreise,
  COMPANY_SIZE_FACTORS,
  TIME_FACTORS,
  formatCurrency,
  proHostingPakete
} from '@/data/branchenPakete';

// Shop-Systeme Optionen
const SHOP_SYSTEMS = [
  { id: 'woocommerce', name: 'WooCommerce (WordPress)' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'shopware', name: 'Shopware' },
  { id: 'magento', name: 'Magento' },
  { id: 'prestashop', name: 'PrestaShop' },
  { id: 'andere', name: 'Andere' }
];

const SHOP_PRODUCT_RANGES = [
  { id: 'klein', name: 'Bis 100 Produkte', hosting: 'shop_klein' },
  { id: 'mittel', name: '100-500 Produkte', hosting: 'shop_mittel' },
  { id: 'gross', name: '500+ Produkte', hosting: 'shop_gross' }
];

interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_setup: number;
  price_monthly: number;
  price_yearly: number;
}

interface SelectedCatalogProduct extends CatalogProduct {
  quantity: number;
}

interface Company {
  id: string;
  company_name: string;
  industry: string | null;
  employee_count: string | null;
  email: string | null;
  phone: string | null;
}

interface Lead {
  id: string;
  lead_number: string;
  company_name: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  industry: string | null;
  company_size: string | null;
  services_interested: string[] | null;
  project_description: string | null;
}

interface OfferCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prefillLeadId?: string;
  prefillCompanyId?: string;
}

export function OfferCreateDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  prefillLeadId,
  prefillCompanyId 
}: OfferCreateDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>([]);
  const [selectedCatalogProducts, setSelectedCatalogProducts] = useState<SelectedCatalogProduct[]>([]);
  const [currentTab, setCurrentTab] = useState('kunde');

  // Mitarbeiter/Ersteller
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');

  // Kundenauswahl
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');

  // Referenzkunde
  const [isReferenceCustomer, setIsReferenceCustomer] = useState(false);

  // Angebotsdaten (basierend auf AngebotsGenerator)
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [validDays, setValidDays] = useState(14);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');

  // Smart Paste
  const [smartPasteText, setSmartPasteText] = useState('');
  const [smartPasteLoading, setSmartPasteLoading] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  const [smartPasteResult, setSmartPasteResult] = useState<string | null>(null);

  // Manuell editierbare Preise (überschreiben kalkulierte Werte)
  const [manualSetupPrice, setManualSetupPrice] = useState<number | null>(null);
  const [manualMonthlyPrice, setManualMonthlyPrice] = useState<number | null>(null);
  const [priceEditMode, setPriceEditMode] = useState(false);

  useEffect(() => {
    if (open) {
      loadReferenceData();
      loadCurrentUser();
      if (prefillLeadId) setSelectedLeadId(prefillLeadId);
      if (prefillCompanyId) setSelectedCompanyId(prefillCompanyId);
    }
  }, [open, prefillLeadId, prefillCompanyId]);

  // Wenn Lead ausgewählt wird, Daten vorausfüllen
  useEffect(() => {
    if (selectedLeadId && selectedLeadId !== '_none') {
      const lead = leads.find(l => l.id === selectedLeadId);
      if (lead) {
        setFormData(prev => ({
          ...prev,
          company_name: lead.company_name || '',
          contact_person: [lead.contact_first_name, lead.contact_last_name].filter(Boolean).join(' '),
          email: lead.contact_email || '',
          phone: lead.contact_phone || '',
          industry: lead.industry || '',
          company_size: mapCompanySize(lead.company_size) || '1-10',
          services_selected: mapServicesFromLead(lead.services_interested),
          additional_notes: lead.project_description || ''
        }));
        setOfferTitle(`Angebot für ${lead.company_name || 'Interessent'}`);
        setSelectedCompanyId('');
      }
    }
  }, [selectedLeadId, leads]);

  // Wenn Firma ausgewählt wird
  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== '_none') {
      const company = companies.find(c => c.id === selectedCompanyId);
      if (company) {
        setFormData(prev => ({
          ...prev,
          company_name: company.company_name,
          email: company.email || '',
          phone: company.phone || '',
          industry: company.industry || '',
          company_size: mapCompanySize(company.employee_count) || '1-10'
        }));
        setOfferTitle(`Angebot für ${company.company_name}`);
        setSelectedLeadId('');
      }
    }
  }, [selectedCompanyId, companies]);

  const mapCompanySize = (size: string | null): string => {
    if (!size) return '1-10';
    if (size.includes('1-10') || size.includes('klein')) return '1-10';
    if (size.includes('11-50') || size.includes('mittel')) return '11-50';
    if (size.includes('51-250')) return '51-250';
    if (size.includes('>250') || size.includes('groß')) return '>250';
    return '1-10';
  };

  const mapServicesFromLead = (services: string[] | null): string[] => {
    if (!services) return [];
    const mapped: string[] = [];
    services.forEach(s => {
      const lower = s.toLowerCase();
      if (lower.includes('website') || lower.includes('web')) mapped.push('Website & Digitale Plattformen');
      if (lower.includes('social')) mapped.push('Social Media Marketing');
      if (lower.includes('seo')) mapped.push('SEO & Sichtbarkeit');
      if (lower.includes('ki') || lower.includes('agent')) mapped.push('KI-Agenten & Automation');
      if (lower.includes('voice') || lower.includes('sprach')) mapped.push('Voicebots / Sprachassistenz');
      if (lower.includes('prozess') || lower.includes('digital')) mapped.push('Prozessoptimierung & Digitalstrategie');
      if (lower.includes('berat') || lower.includes('schul')) mapped.push('Beratung & Schulung');
    });
    return [...new Set(mapped)];
  };

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCreatorEmail(user.email || '');
      // Versuche Namen aus Profil zu laden
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      if (profile?.full_name) {
        setCreatorName(profile.full_name);
      }
    }
  };

  const loadReferenceData = async () => {
    try {
      const [companiesRes, leadsRes, productsRes] = await Promise.all([
        supabase.from('crm_companies').select('id, company_name, industry, employee_count, email, phone').order('company_name'),
        supabase.from('crm_leads').select('id, lead_number, company_name, contact_first_name, contact_last_name, contact_email, contact_phone, industry, company_size, services_interested, project_description').in('status', ['neu', 'qualifiziert', 'kontaktiert']).order('created_at', { ascending: false }),
        supabase.from('crm_products').select('id, name, category, description, price_setup, price_monthly, price_yearly').eq('is_active', true).order('category').order('name')
      ]);

      if (companiesRes.data) setCompanies(companiesRes.data);
      if (leadsRes.data) setLeads(leadsRes.data as Lead[]);
      if (productsRes.data) setCatalogProducts(productsRes.data as CatalogProduct[]);
    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services_selected: prev.services_selected.includes(service)
        ? prev.services_selected.filter(s => s !== service)
        : [...prev.services_selected, service]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Remove highlight when user manually edits
    if (highlightedFields.has(name)) {
      setHighlightedFields(prev => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  };

  const handleSmartPaste = async () => {
    if (!smartPasteText.trim() || smartPasteText.trim().length < 5) {
      toast({ title: 'Fehler', description: 'Bitte fügen Sie zuerst Text ein.', variant: 'destructive' });
      return;
    }
    setSmartPasteLoading(true);
    setSmartPasteResult(null);
    try {
      const prompt = `Analysiere den folgenden Text und extrahiere alle Kontaktdaten. Antworte NUR mit einem JSON-Objekt mit diesen Feldern (leere Felder als leeren String lassen): { "company_name": "", "contact_person": "", "email": "", "phone": "", "industry": "", "company_size": "" } Industrie-Wert muss exakt einer dieser Optionen entsprechen wenn erkennbar: Handel, Handwerk, Gastronomie, Gesundheit, Immobilien, IT & Software, Industrie, Dienstleistungen, Bildung, Tourismus, Landwirtschaft, Sonstige. Unternehmensgröße muss exakt einer dieser Werte sein wenn erkennbar: 1-10, 11-50, 51-250, >250. Text: ${smartPasteText}`;

      const { data, error } = await supabase.functions.invoke('deutlicht-chat', {
        body: { messages: [{ role: 'user', content: prompt }] },
      });

      if (error) throw error;

      // Parse streamed response or direct response
      let responseText = '';
      if (typeof data === 'string') {
        // Parse SSE stream
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) responseText += content;
            } catch { /* skip unparseable lines */ }
          }
        }
      } else if (data?.choices?.[0]?.message?.content) {
        responseText = data.choices[0].message.content;
      }

      // Extract JSON from response (may be wrapped in markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');

      const parsed = JSON.parse(jsonMatch[0]);
      const fields: (keyof typeof parsed)[] = ['company_name', 'contact_person', 'email', 'phone', 'industry', 'company_size'];
      const filled = new Set<string>();
      let filledCount = 0;

      const updates: Partial<OfferFormData> = {};
      for (const field of fields) {
        const value = parsed[field];
        if (value && typeof value === 'string' && value.trim()) {
          (updates as any)[field] = value.trim();
          filled.add(field);
          filledCount++;
        }
      }

      setFormData(prev => ({ ...prev, ...updates }));
      setHighlightedFields(filled);
      setSmartPasteResult(`✅ ${filledCount} von 6 Felder erkannt`);

      if (parsed.company_name) {
        setOfferTitle(`Angebot für ${parsed.company_name}`);
      }
    } catch (err) {
      console.error('Smart Paste error:', err);
      toast({ title: 'Fehler', description: 'Automatisches Ausfüllen fehlgeschlagen – bitte Daten manuell eingeben.', variant: 'destructive' });
    } finally {
      setSmartPasteLoading(false);
    }
  };

  const getFieldHighlightClass = (fieldName: string) => {
    return highlightedFields.has(fieldName)
      ? 'bg-green-50 dark:bg-green-950/30 border-green-300'
      : '';
  };

  // ===== PRICE CALCULATIONS (from AngebotsGenerator) =====
  const getSizeFactor = (): number => COMPANY_SIZE_FACTORS[formData.company_size] || 1.0;
  const getTimeFactor = (): number => TIME_FACTORS[formData.project_start_timing]?.factor || 1.0;

  const calculateWebsitePrice = (): { setup: number; monthly: number } => {
    const factor = getSizeFactor();
    const timeFactor = getTimeFactor();
    let basePrice = 0;
    let monthly = 0;

    // Website-Typ
    if (formData.website_type === 'onepager') basePrice += 1200;
    else if (formData.website_type === 'landingpage') basePrice += 1500;
    else if (formData.website_type === 'landingpage_starter') basePrice += 299;
    else if (formData.website_type === '5-10') {
      const pages = parseInt(formData.website_pages_count) || 5;
      basePrice += 1900 + (pages - 5) * 300;
    } else if (formData.website_type === '10-20') {
      const pages = parseInt(formData.website_pages_count) || 10;
      basePrice += 3400 + (pages - 10) * 250;
    } else if (formData.website_type === '20-30') {
      const pages = parseInt(formData.website_pages_count) || 20;
      basePrice += 5900 + (pages - 20) * 200;
    } else if (formData.website_type === '>30') {
      const pages = parseInt(formData.website_pages_count) || 30;
      basePrice += 7900 + (pages - 30) * 180;
    }

    // Features
    if (formData.website_features.includes('Lead-/Vertriebsfokus')) basePrice += 2000;
    if (formData.website_features.includes('Konfigurator')) basePrice += 4500;
    if (formData.website_features.includes('ERP-Anbindung')) basePrice += 3500;
    if (formData.website_features.includes('Blog/News-Bereich')) basePrice += 800;
    if (formData.website_features.includes('Mehrsprachigkeit')) basePrice += 1500;
    if (formData.website_features.includes('Online-Terminbuchung')) basePrice += 600;
    if (formData.website_features.includes('Mitgliederbereich')) basePrice += 2500;

    // Shop-Kosten
    if (formData.shop_needed === 'ja') {
      // Basis Shop-Setup je nach System
      if (formData.shop_system === 'woocommerce') basePrice += 2500;
      else if (formData.shop_system === 'shopify') basePrice += 1500;
      else if (formData.shop_system === 'shopware') basePrice += 4000;
      else if (formData.shop_system === 'magento') basePrice += 6000;
      else if (formData.shop_system === 'prestashop') basePrice += 3000;
      else if (formData.shop_system) basePrice += 2500; // Andere
      
      // Zusätzliche Kosten nach Produktanzahl
      if (formData.shop_products === 'mittel') basePrice += 500;
      else if (formData.shop_products === 'gross') basePrice += 1500;
    }

    // Hosting
    if (formData.hosting_type) {
      // Prüfe zuerst Pro-Hosting
      const proHosting = proHostingPakete.find(h => h.id === formData.hosting_type);
      if (proHosting) {
        monthly += proHosting.monatlich;
      } else {
        const hosting = hostingPakete.find(h => h.id === formData.hosting_type);
        if (hosting) monthly += hosting.monatlich;
      }
    }

    // Service
    if (formData.service_contract) {
      const service = serviceVertraege.find(s => s.id === formData.service_contract);
      if (service) monthly += service.monatlich;
    }

    return { setup: Math.round(basePrice * factor * timeFactor), monthly };
  };

  const calculateSEOPrice = (): { setup: number; monthly: number } => {
    if (!formData.seo_package) return { setup: 0, monthly: 0 };
    const paket = seoPakete.find(p => p.id === formData.seo_package);
    return paket ? { setup: paket.setup || 0, monthly: paket.monthly || 0 } : { setup: 0, monthly: 0 };
  };

  const calculateKIPrice = (): { setup: number; monthly: number } => {
    if (!formData.ki_type) return { setup: 0, monthly: 0 };
    // kiAgentenPreise ist ein Objekt, kein Array
    const kiType = formData.ki_type as keyof typeof kiAgentenPreise;
    if (kiType === 'branche') {
      // Branchenspezifische KI-Pakete
      const branche = formData.ki_branche as keyof typeof kiAgentenPreise.branche;
      if (branche && kiAgentenPreise.branche[branche]) {
        const paket = kiAgentenPreise.branche[branche];
        return { setup: paket.setup, monthly: paket.monthly };
      }
      return { setup: 0, monthly: 0 };
    }
    const ki = kiAgentenPreise[kiType];
    if (ki && 'setup' in ki) {
      return { setup: ki.setup, monthly: ki.monthly };
    }
    return { setup: 0, monthly: 0 };
  };

  const calculateVoicebotPrice = (): { setup: number; monthly: number } => {
    if (!formData.voice_type) return { setup: 0, monthly: 0 };
    // voicebotPreise ist ein einfaches Objekt mit festen Werten
    const voiceType = formData.voice_type as keyof typeof voicebotPreise;
    const setupPrice = voicebotPreise[voiceType];
    if (typeof setupPrice === 'number') {
      return { setup: setupPrice, monthly: 0 };
    }
    return { setup: 0, monthly: 0 };
  };

  const calculateTotalPrice = (): { setup: number; monthly: number; yearly: number; calculatedSetup: number; calculatedMonthly: number } => {
    let setup = 0;
    let monthly = 0;

    if (formData.services_selected.includes('Website & Digitale Plattformen')) {
      const web = calculateWebsitePrice();
      setup += web.setup;
      monthly += web.monthly;
    }
    if (formData.services_selected.includes('SEO & Sichtbarkeit')) {
      const seo = calculateSEOPrice();
      setup += seo.setup;
      monthly += seo.monthly;
    }
    if (formData.services_selected.includes('KI-Agenten & Automation')) {
      const ki = calculateKIPrice();
      setup += ki.setup;
      monthly += ki.monthly;
    }
    if (formData.services_selected.includes('Voicebots / Sprachassistenz')) {
      const voice = calculateVoicebotPrice();
      setup += voice.setup;
      monthly += voice.monthly;
    }

    // Katalog-Produkte hinzufügen
    selectedCatalogProducts.forEach(p => {
      setup += (p.price_setup || 0) * p.quantity;
      monthly += (p.price_monthly || 0) * p.quantity;
    });

    // Manuelle Preise überschreiben kalkulierte Werte
    const finalSetup = manualSetupPrice !== null ? manualSetupPrice : setup;
    const finalMonthly = manualMonthlyPrice !== null ? manualMonthlyPrice : monthly;

    return { 
      setup: finalSetup, 
      monthly: finalMonthly, 
      yearly: finalSetup + (finalMonthly * 12),
      calculatedSetup: setup,
      calculatedMonthly: monthly
    };
  };

  const handleSubmit = async () => {
    if (!offerTitle.trim()) {
      toast({ title: 'Fehler', description: 'Bitte geben Sie einen Titel ein.', variant: 'destructive' });
      return;
    }
    if (!selectedCompanyId && !selectedLeadId) {
      toast({ title: 'Fehler', description: 'Bitte wählen Sie eine Firma oder einen Lead aus.', variant: 'destructive' });
      return;
    }
    if (formData.services_selected.length === 0 && selectedCatalogProducts.length === 0) {
      toast({ title: 'Fehler', description: 'Bitte wählen Sie mindestens eine Leistung oder einen Artikel aus.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const totals = calculateTotalPrice();
      const validFrom = new Date();
      const validUntil = addDays(validFrom, validDays);

      // Line Items aus den Leistungen generieren
      const lineItems = generateLineItems();

      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser();

      const { error: offerError } = await supabase
        .from('crm_offers')
        .insert([{
          title: offerTitle,
          description: offerDescription || null,
          company_id: selectedCompanyId && selectedCompanyId !== '_none' ? selectedCompanyId : null,
          lead_id: selectedLeadId && selectedLeadId !== '_none' ? selectedLeadId : null,
          status: 'entwurf',
          amount_setup: totals.setup,
          amount_monthly: totals.monthly,
          discount_percent: manualSetupPrice !== null || manualMonthlyPrice !== null 
            ? Math.round(((totals.calculatedSetup + totals.calculatedMonthly * 12) - totals.yearly) / (totals.calculatedSetup + totals.calculatedMonthly * 12) * 100) 
            : 0,
          valid_from: format(validFrom, 'yyyy-MM-dd'),
          valid_until: format(validUntil, 'yyyy-MM-dd'),
          created_by: user?.id,
          line_items: JSON.parse(JSON.stringify({
            items: lineItems,
            creator: { name: creatorName, email: creatorEmail },
            formData: formData,
            isReferenceCustomer: isReferenceCustomer,
            manualPricing: {
              enabled: manualSetupPrice !== null || manualMonthlyPrice !== null,
              calculatedSetup: totals.calculatedSetup,
              calculatedMonthly: totals.calculatedMonthly,
              finalSetup: totals.setup,
              finalMonthly: totals.monthly
            }
          }))
        }]);

      if (offerError) throw offerError;

      // Update company as reference customer if marked
      if (isReferenceCustomer && selectedCompanyId && selectedCompanyId !== '_none') {
        await supabase
          .from('crm_companies')
          .update({ is_reference_customer: true })
          .eq('id', selectedCompanyId);
      }

      toast({ title: 'Erfolg', description: `Angebot "${offerTitle}" wurde erstellt.` });
      
      // Reset
      setFormData(initialFormData);
      setOfferTitle('');
      setOfferDescription('');
      setSelectedCompanyId('');
      setSelectedLeadId('');
      setIsReferenceCustomer(false);
      setManualSetupPrice(null);
      setManualMonthlyPrice(null);
      setPriceEditMode(false);
      setSelectedCatalogProducts([]);
      setManualSetupPrice(null);
      setManualMonthlyPrice(null);
      setPriceEditMode(false);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({ title: 'Fehler', description: 'Angebot konnte nicht erstellt werden.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Detaillierte Produktbeschreibungen für die Angebotspositionen
  const getWebsiteTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'landingpage_starter': 'Starter Landingpage – Eine kompakte, konversionsorientierte Seite für schnellen Online-Auftritt',
      'onepager': 'Moderner Onepager – Kompakte Präsentation aller wichtigen Inhalte auf einer Seite mit ansprechendem Design',
      'landingpage': 'Professionelle Landingpage – Zielgerichtete Seite für Kampagnen, Lead-Generierung oder Produktvorstellung',
      '5-10': `Unternehmenswebsite (${formData.website_pages_count || '5-10'} Seiten) – Vollständige Webpräsenz mit individueller Gestaltung`,
      '10-20': `Umfangreiche Website (${formData.website_pages_count || '10-20'} Seiten) – Erweiterte Webpräsenz mit umfassender Inhaltsstruktur`,
      '20-30': `Große Webplattform (${formData.website_pages_count || '20-30'} Seiten) – Komplexe Website mit erweiterten Funktionen und Bereichen`,
      '>30': `Enterprise Website (${formData.website_pages_count || '30+'} Seiten) – Umfassende digitale Plattform für größere Unternehmen`
    };
    return labels[type] || 'Individuelle Website nach Maß';
  };

  const getFeatureDescriptions = (): string => {
    if (!formData.website_features.length) return '';
    const featureLabels: Record<string, string> = {
      'Lead-/Vertriebsfokus': 'Lead-Generierung & Conversion-Optimierung',
      'Konfigurator': 'Interaktiver Produkt-/Leistungskonfigurator',
      'ERP-Anbindung': 'Integration in Ihre Warenwirtschaft/ERP-System',
      'Blog/News-Bereich': 'Redaktioneller Bereich für Aktuelles & Artikel',
      'Mehrsprachigkeit': 'Multilinguale Website-Struktur',
      'Online-Terminbuchung': 'Direkte Terminvereinbarung für Ihre Kunden',
      'Mitgliederbereich': 'Geschützter Bereich für registrierte Nutzer'
    };
    return formData.website_features.map(f => featureLabels[f] || f).join('; ');
  };

  const getShopDescription = (): string => {
    if (formData.shop_needed !== 'ja') return '';
    const systems: Record<string, string> = {
      'woocommerce': 'WooCommerce (WordPress)',
      'shopify': 'Shopify',
      'shopware': 'Shopware',
      'magento': 'Magento',
      'prestashop': 'PrestaShop'
    };
    const ranges: Record<string, string> = {
      'klein': 'bis 100 Produkte',
      'mittel': '100-500 Produkte',
      'gross': '500+ Produkte'
    };
    return `Online-Shop mit ${systems[formData.shop_system] || 'Shop-System'} – ${ranges[formData.shop_products] || 'flexible Produktanzahl'}`;
  };

  const getSeoDescription = (): string => {
    const seoLabels: Record<string, string> = {
      'lokal': 'Lokales SEO-Paket – Optimierung für regionale Sichtbarkeit, Google My Business, lokale Keywords',
      'standard': 'Standard SEO – Technische Optimierung, OnPage-SEO, Content-Strategie für Ihre Zielgruppe',
      'premium': 'Premium SEO – Umfassende Suchmaschinenoptimierung mit Linkbuilding, Content-Marketing & Reporting',
      'enterprise': 'Enterprise SEO – Ganzheitliche SEO-Strategie für maximale organische Reichweite'
    };
    return seoLabels[formData.seo_package] || 'Professionelle Suchmaschinenoptimierung';
  };

  const getKiDescription = (): string => {
    const kiLabels: Record<string, string> = {
      'einfach': 'KI-Assistent (Basis) – Intelligenter Chatbot für FAQ, Kundenanfragen und einfache Automatisierungen',
      'workflow': 'Workflow-Agent – Automatisierung komplexer Prozesse mit KI-gestützter Entscheidungslogik',
      'multi': 'Multi-Agent-System – Mehrere spezialisierte KI-Agenten für komplexe Geschäftsprozesse',
      'branche': `Branchenspezifischer KI-Agent – Maßgeschneiderte Lösung für Ihre Branche (${formData.ki_branche || 'individuell'})`
    };
    return kiLabels[formData.ki_type] || 'KI-gestützte Automatisierung nach Maß';
  };

  const getVoicebotDescription = (): string => {
    const voiceLabels: Record<string, string> = {
      'weiterleitung': 'Voicebot Weiterleitung – Intelligente Anrufannahme mit automatischer Weiterleitung an zuständige Mitarbeiter',
      'vorqualifizierung': 'Voicebot mit Vorqualifizierung – Erfassung von Anliegen und Kundendaten vor der Weiterleitung',
      'vollautomatisch': 'Vollautomatischer Voicebot – Eigenständige Bearbeitung von Anfragen, Terminbuchungen und Auskünften'
    };
    return voiceLabels[formData.voice_type] || 'Sprachgesteuerter Assistent für Ihre Telefonzentrale';
  };

  const generateLineItems = () => {
    const items: Array<{ position: number; title: string; description: string; setup: number; monthly: number }> = [];
    let pos = 1;

    if (formData.services_selected.includes('Website & Digitale Plattformen')) {
      const web = calculateWebsitePrice();
      const featureDesc = getFeatureDescriptions();
      const shopDesc = getShopDescription();
      
      let description = getWebsiteTypeLabel(formData.website_type);
      if (featureDesc) description += `\n\nInkl. Features: ${featureDesc}`;
      if (shopDesc) description += `\n\n${shopDesc}`;
      if (formData.hosting_type) {
        const hosting = hostingPakete.find(h => h.id === formData.hosting_type) || proHostingPakete.find(h => h.id === formData.hosting_type);
        if (hosting) description += `\n\nHosting: ${hosting.name}`;
      }
      if (formData.service_contract) {
        const service = serviceVertraege.find(s => s.id === formData.service_contract);
        if (service) description += `\nService-Vertrag: ${service.name}`;
      }

      items.push({
        position: pos++,
        title: 'Website-Entwicklung & Digitale Plattform',
        description,
        setup: web.setup,
        monthly: web.monthly
      });
    }

    if (formData.services_selected.includes('SEO & Sichtbarkeit')) {
      const seo = calculateSEOPrice();
      items.push({
        position: pos++,
        title: 'Suchmaschinenoptimierung (SEO)',
        description: getSeoDescription(),
        setup: seo.setup,
        monthly: seo.monthly
      });
    }

    if (formData.services_selected.includes('KI-Agenten & Automation')) {
      const ki = calculateKIPrice();
      items.push({
        position: pos++,
        title: 'KI-Agenten & Intelligente Automation',
        description: getKiDescription(),
        setup: ki.setup,
        monthly: ki.monthly
      });
    }

    if (formData.services_selected.includes('Voicebots / Sprachassistenz')) {
      const voice = calculateVoicebotPrice();
      items.push({
        position: pos++,
        title: 'Voicebot / Telefonassistent',
        description: getVoicebotDescription(),
        setup: voice.setup,
        monthly: voice.monthly
      });
    }

    if (formData.services_selected.includes('Social Media Marketing')) {
      items.push({
        position: pos++,
        title: 'Social Media Marketing',
        description: `Professionelle Betreuung Ihrer Social-Media-Kanäle: ${formData.social_platforms.join(', ') || 'Plattformen nach Vereinbarung'}. Regelmäßige Content-Erstellung, Community-Management und Performance-Reporting.`,
        setup: 0,
        monthly: 0
      });
    }

    if (formData.services_selected.includes('Beratung & Schulung')) {
      const topics = formData.beratung_topics.length > 0 
        ? formData.beratung_topics.join(', ') 
        : 'nach individueller Absprache';
      items.push({
        position: pos++,
        title: 'Beratung & Schulung',
        description: `Individuelle Beratung und Schulungsmaßnahmen für Ihr Team. Themen: ${topics}. Praxisnahe Vermittlung für nachhaltigen Wissenstransfer.`,
        setup: 0,
        monthly: 0
      });
    }

    if (formData.services_selected.includes('Prozessoptimierung & Digitalstrategie')) {
      items.push({
        position: pos++,
        title: 'Prozessoptimierung & Digitalstrategie',
        description: 'Analyse Ihrer bestehenden Geschäftsprozesse und Entwicklung einer maßgeschneiderten Digitalisierungsstrategie. Identifikation von Automatisierungspotenzialen und Effizienzsteigerungen.',
        setup: 0,
        monthly: 0
      });
    }

    // Katalog-Produkte als eigene Positionen
    selectedCatalogProducts.forEach(p => {
      items.push({
        position: pos++,
        title: p.name,
        description: p.description || `${p.category} – ${p.name}`,
        setup: (p.price_setup || 0) * p.quantity,
        monthly: (p.price_monthly || 0) * p.quantity
      });
    });

    // Wenn manuelle Preise gesetzt sind, die Differenz auf die Positionen verteilen
    if (manualSetupPrice !== null || manualMonthlyPrice !== null) {
      const itemsSetupTotal = items.reduce((sum, i) => sum + i.setup, 0);
      const itemsMonthlyTotal = items.reduce((sum, i) => sum + i.monthly, 0);
      const finalSetup = manualSetupPrice ?? itemsSetupTotal;
      const finalMonthly = manualMonthlyPrice ?? itemsMonthlyTotal;

      // If items sum to 0 but manual prices exist, distribute evenly or assign to first item
      if (itemsSetupTotal === 0 && finalSetup > 0 && items.length > 0) {
        items[0].setup = finalSetup;
      }
      if (itemsMonthlyTotal === 0 && finalMonthly > 0 && items.length > 0) {
        items[0].monthly = finalMonthly;
      }
    }

    return items;
  };

  const totals = calculateTotalPrice();

  const serviceIcons: Record<string, React.ReactNode> = {
    'Website & Digitale Plattformen': <Globe className="h-4 w-4" />,
    'Social Media Marketing': <Megaphone className="h-4 w-4" />,
    'SEO & Sichtbarkeit': <Search className="h-4 w-4" />,
    'KI-Agenten & Automation': <Bot className="h-4 w-4" />,
    'Voicebots / Sprachassistenz': <Phone className="h-4 w-4" />,
    'Prozessoptimierung & Digitalstrategie': <Cog className="h-4 w-4" />,
    'Beratung & Schulung': <GraduationCap className="h-4 w-4" />
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Neues Angebot erstellen
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kunde" className="gap-2">
              <Building2 className="h-4 w-4" />
              Kunde
            </TabsTrigger>
            <TabsTrigger value="leistungen" className="gap-2">
              <Settings className="h-4 w-4" />
              Leistungen
            </TabsTrigger>
            <TabsTrigger value="details" className="gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="kalkulation" className="gap-2">
              <Calculator className="h-4 w-4" />
              Kalkulation
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Kunde */}
          <TabsContent value="kunde" className="space-y-6 mt-6">
            {/* Ersteller / Mitarbeiter */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Erstellt von (Ansprechpartner DeutLicht)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <Label>E-Mail</Label>
                    <Input
                      value={creatorEmail}
                      onChange={(e) => setCreatorEmail(e.target.value)}
                      placeholder="ihre@email.de"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kundenauswahl */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Kunde auswählen</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Aus Lead</Label>
                    <Select 
                      value={selectedLeadId || '_none'} 
                      onValueChange={(v) => setSelectedLeadId(v === '_none' ? '' : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Lead auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">— Kein Lead —</SelectItem>
                        {leads.map(l => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.lead_number} - {l.company_name || [l.contact_first_name, l.contact_last_name].filter(Boolean).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Oder Bestandskunde</Label>
                    <Select 
                      value={selectedCompanyId || '_none'} 
                      onValueChange={(v) => setSelectedCompanyId(v === '_none' ? '' : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Firma auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">— Keine Firma —</SelectItem>
                        {companies.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kundendaten (vorausgefüllt oder manuell) */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Kundendaten</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Firma *</Label>
                    <Input
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="Firmenname"
                    />
                  </div>
                  <div>
                    <Label>Ansprechpartner</Label>
                    <Input
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      placeholder="Name des Ansprechpartners"
                    />
                  </div>
                  <div>
                    <Label>E-Mail</Label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@firma.de"
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+49..."
                    />
                  </div>
                  <div>
                    <Label>Branche</Label>
                    <Select 
                      value={formData.industry || '_none'} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, industry: v === '_none' ? '' : v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Branche wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">— Bitte wählen —</SelectItem>
                        {INDUSTRIES.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Unternehmensgröße</Label>
                    <Select 
                      value={formData.company_size} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, company_size: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map(size => (
                          <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Referenzkunde Checkbox */}
                <div className="mt-4 pt-4 border-t">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Checkbox
                      checked={isReferenceCustomer}
                      onCheckedChange={(checked) => setIsReferenceCustomer(!!checked)}
                    />
                    <div>
                      <span className="font-medium text-primary">⭐ Referenzkunde</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Markieren Sie diesen Kunden als Referenzkunde für Sonderkonditionen
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentTab('leistungen')}>
                Weiter zu Leistungen →
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: Leistungen */}
          <TabsContent value="leistungen" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4">Gewünschte Leistungen auswählen</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SERVICE_OPTIONS.map(service => (
                    <label
                      key={service}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.services_selected.includes(service)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Checkbox
                        checked={formData.services_selected.includes(service)}
                        onCheckedChange={() => toggleService(service)}
                      />
                      <div className="flex items-center gap-2">
                        {serviceIcons[service]}
                        <span className="text-sm">{service}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Produkte aus Artikelstamm */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Aus Artikelstamm hinzufügen
                </h4>
                {catalogProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Keine Produkte im Artikelstamm verfügbar.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Kategorie-gruppierte Produktauswahl */}
                    {Object.entries(
                      catalogProducts.reduce<Record<string, CatalogProduct[]>>((acc, p) => {
                        const cat = p.category || 'sonstige';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(p);
                        return acc;
                      }, {})
                    ).map(([category, products]) => {
                      const categoryLabels: Record<string, string> = {
                        website: 'Website', hosting: 'Hosting', seo: 'SEO',
                        ki_agent: 'KI-Agenten', voicebot: 'Voicebots',
                        branchenbot: 'Branchenbots', service: 'Service',
                        sonstige: 'Sonstige'
                      };
                      return (
                        <div key={category}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            {categoryLabels[category] || category}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {products.map(product => {
                              const selected = selectedCatalogProducts.find(s => s.id === product.id);
                              return (
                                <div
                                  key={product.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selected
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                  onClick={() => {
                                    if (selected) {
                                      setSelectedCatalogProducts(prev => prev.filter(s => s.id !== product.id));
                                    } else {
                                      setSelectedCatalogProducts(prev => [...prev, { ...product, quantity: 1 }]);
                                    }
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {product.price_setup > 0 && `${formatCurrency(product.price_setup)} Setup`}
                                      {product.price_setup > 0 && product.price_monthly > 0 && ' + '}
                                      {product.price_monthly > 0 && `${formatCurrency(product.price_monthly)}/Monat`}
                                      {product.price_setup === 0 && product.price_monthly === 0 && 'Preis auf Anfrage'}
                                    </p>
                                  </div>
                                  {selected && (
                                    <div className="flex items-center gap-2 ml-2" onClick={(e) => e.stopPropagation()}>
                                      <Input
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={selected.quantity}
                                        onChange={(e) => {
                                          const qty = parseInt(e.target.value) || 1;
                                          setSelectedCatalogProducts(prev =>
                                            prev.map(s => s.id === product.id ? { ...s, quantity: qty } : s)
                                          );
                                        }}
                                        className="w-16 h-8 text-center"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setSelectedCatalogProducts(prev => prev.filter(s => s.id !== product.id))}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Ausgewählte Produkte Zusammenfassung */}
                    {selectedCatalogProducts.length > 0 && (
                      <div className="bg-muted/50 rounded-lg p-3 mt-2">
                        <p className="text-sm font-medium mb-1">{selectedCatalogProducts.length} Artikel ausgewählt</p>
                        <p className="text-xs text-muted-foreground">
                          Setup: {formatCurrency(selectedCatalogProducts.reduce((sum, p) => sum + (p.price_setup || 0) * p.quantity, 0))}
                          {' · '}
                          Monatlich: {formatCurrency(selectedCatalogProducts.reduce((sum, p) => sum + (p.price_monthly || 0) * p.quantity, 0))}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>


            {formData.services_selected.includes('Website & Digitale Plattformen') && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website-Konfiguration
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Website-Typ</Label>
                      <Select 
                        value={formData.website_type || '_none'} 
                        onValueChange={(v) => setFormData(prev => ({ ...prev, website_type: v === '_none' ? '' : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Typ wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">— Bitte wählen —</SelectItem>
                          <SelectItem value="landingpage_starter">Starter Landingpage (299€)</SelectItem>
                          <SelectItem value="onepager">Onepager (ab 1.200€)</SelectItem>
                          <SelectItem value="landingpage">Landingpage (ab 1.500€)</SelectItem>
                          <SelectItem value="5-10">5-10 Seiten (ab 1.900€)</SelectItem>
                          <SelectItem value="10-20">10-20 Seiten (ab 3.400€)</SelectItem>
                          <SelectItem value="20-30">20-30 Seiten (ab 5.900€)</SelectItem>
                          <SelectItem value=">30">&gt;30 Seiten (ab 7.900€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {['5-10', '10-20', '20-30', '>30'].includes(formData.website_type) && (
                      <div>
                        <Label>Anzahl Seiten</Label>
                        <Input
                          name="website_pages_count"
                          type="number"
                          value={formData.website_pages_count}
                          onChange={handleInputChange}
                          placeholder="z.B. 8"
                        />
                      </div>
                    )}
                    <div>
                      <Label>Hosting</Label>
                      <Select 
                        value={formData.hosting_type || '_none'} 
                        onValueChange={(v) => setFormData(prev => ({ ...prev, hosting_type: v === '_none' ? '' : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Hosting-Paket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">— Kein Hosting —</SelectItem>
                          {hostingPakete.map(h => (
                            <SelectItem key={h.id} value={h.id}>{h.name} ({h.monatlich}€/Monat)</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Service-Vertrag</Label>
                      <Select 
                        value={formData.service_contract || '_none'} 
                        onValueChange={(v) => setFormData(prev => ({ ...prev, service_contract: v === '_none' ? '' : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Service-Vertrag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">— Kein Service —</SelectItem>
                          {serviceVertraege.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name} ({s.monatlich}€/Monat)</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {WEBSITE_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={formData.website_features.includes(feature)}
                            onCheckedChange={() => setFormData(prev => ({
                              ...prev,
                              website_features: prev.website_features.includes(feature)
                                ? prev.website_features.filter(f => f !== feature)
                                : [...prev.website_features, feature]
                            }))}
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shop-Optionen */}
                  <div className="mt-6 pt-4 border-t">
                    <Label className="text-base font-medium">Online-Shop benötigt?</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['nein', 'ja'].map(option => (
                        <label 
                          key={option}
                          className={`flex items-center justify-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                            formData.shop_needed === option 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shop_needed"
                            value={option}
                            checked={formData.shop_needed === option}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              shop_needed: e.target.value,
                              // Reset shop fields when switching to "nein"
                              ...(e.target.value === 'nein' ? { shop_system: '', shop_products: '' } : {})
                            }))}
                            className="sr-only"
                          />
                          <span className="capitalize">{option === 'ja' ? 'Ja, Shop benötigt' : 'Nein'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shop-Details wenn benötigt */}
                  {formData.shop_needed === 'ja' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label>Shop-System</Label>
                        <Select 
                          value={formData.shop_system || '_none'} 
                          onValueChange={(v) => setFormData(prev => ({ ...prev, shop_system: v === '_none' ? '' : v }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Shop-System wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">— Bitte wählen —</SelectItem>
                            {SHOP_SYSTEMS.map(sys => (
                              <SelectItem key={sys.id} value={sys.id}>{sys.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Produktanzahl</Label>
                        <Select 
                          value={formData.shop_products || '_none'} 
                          onValueChange={(v) => {
                            const shopRange = SHOP_PRODUCT_RANGES.find(r => r.id === v);
                            setFormData(prev => ({ 
                              ...prev, 
                              shop_products: v === '_none' ? '' : v,
                              // Auto-select passenden Shop-Hosting-Plan
                              hosting_type: shopRange ? shopRange.hosting : prev.hosting_type
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Produktanzahl wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_none">— Bitte wählen —</SelectItem>
                            {SHOP_PRODUCT_RANGES.map(range => (
                              <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Pro-Shop-Server Option */}
                      <div className="col-span-2 mt-2">
                        <Label>Premium Shop-Hosting (optional)</Label>
                        <div className="mt-2 p-3 border rounded-lg bg-background">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <Checkbox
                              checked={formData.hosting_type === 'pro_shop_server'}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({ ...prev, hosting_type: 'pro_shop_server' }));
                                } else {
                                  // Zurück zum passenden Standard-Hosting
                                  const shopRange = SHOP_PRODUCT_RANGES.find(r => r.id === formData.shop_products);
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    hosting_type: shopRange ? shopRange.hosting : '' 
                                  }));
                                }
                              }}
                            />
                            <div>
                              <span className="font-medium">Pro-Shop-Server</span>
                              <p className="text-xs text-muted-foreground mt-1">
                                {proHostingPakete[0].beschreibung} – {proHostingPakete[0].monatlich}€/Monat
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* SEO */}
            {formData.services_selected.includes('SEO & Sichtbarkeit') && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    SEO-Paket
                  </h4>
                  <Select 
                    value={formData.seo_package || '_none'} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, seo_package: v === '_none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="SEO-Paket wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">— Bitte wählen —</SelectItem>
                      {seoPakete.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} {p.monthly > 0 ? `(${p.monthly}€/Monat)` : `(${p.setup}€ Setup)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* KI-Agenten */}
            {formData.services_selected.includes('KI-Agenten & Automation') && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    KI-Agent
                  </h4>
                  <Select 
                    value={formData.ki_type || '_none'} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, ki_type: v === '_none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="KI-Lösung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">— Bitte wählen —</SelectItem>
                      <SelectItem value="einfach">Einfacher Agent (Setup: {formatCurrency(kiAgentenPreise.einfach.setup)})</SelectItem>
                      <SelectItem value="workflow">Workflow-Agent (Setup: {formatCurrency(kiAgentenPreise.workflow.setup)})</SelectItem>
                      <SelectItem value="multi">Multi-Agent (Setup: {formatCurrency(kiAgentenPreise.multi.setup)})</SelectItem>
                      <SelectItem value="branche">Branchenspezifisch (Preis nach Branche)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Voicebots */}
            {formData.services_selected.includes('Voicebots / Sprachassistenz') && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Voicebot
                  </h4>
                  <Select 
                    value={formData.voice_type || '_none'} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, voice_type: v === '_none' ? '' : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Voicebot-Lösung wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">— Bitte wählen —</SelectItem>
                      <SelectItem value="weiterleitung">Weiterleitung ({formatCurrency(voicebotPreise.weiterleitung)})</SelectItem>
                      <SelectItem value="vorqualifizierung">Vorqualifizierung ({formatCurrency(voicebotPreise.vorqualifizierung)})</SelectItem>
                      <SelectItem value="vollautomatisch">Vollautomatisch ({formatCurrency(voicebotPreise.vollautomatisch)})</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Social Media */}
            {formData.services_selected.includes('Social Media Marketing') && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Social Media
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_PLATFORMS.map(platform => (
                      <label key={platform} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.social_platforms.includes(platform)}
                          onCheckedChange={() => setFormData(prev => ({
                            ...prev,
                            social_platforms: prev.social_platforms.includes(platform)
                              ? prev.social_platforms.filter(p => p !== platform)
                              : [...prev.social_platforms, platform]
                          }))}
                        />
                        {platform}
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('kunde')}>
                ← Zurück
              </Button>
              <Button onClick={() => setCurrentTab('details')}>
                Weiter zu Details →
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: Details */}
          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>Angebots-Titel *</Label>
                  <Input
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="z.B. Website-Relaunch inkl. SEO"
                  />
                </div>
                <div>
                  <Label>Beschreibung / Einleitung</Label>
                  <Textarea
                    value={offerDescription}
                    onChange={(e) => setOfferDescription(e.target.value)}
                    placeholder="Optionale Einleitung für das Angebot..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Projektstart</Label>
                    <Select 
                      value={formData.project_start_timing || '_none'} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, project_start_timing: v === '_none' ? '' : v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wann soll es losgehen?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">— Bitte wählen —</SelectItem>
                        <SelectItem value="sofort">Sofortstart (innerhalb 7 Tage)</SelectItem>
                        <SelectItem value="2wochen">In 2 Wochen</SelectItem>
                        <SelectItem value="4wochen">In 4 Wochen</SelectItem>
                        <SelectItem value="1-2monate">In 1-2 Monaten</SelectItem>
                        <SelectItem value="6monate">Innerhalb 6 Monate</SelectItem>
                        <SelectItem value="planung">Noch in Planung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gültigkeit (Tage)</Label>
                    <Input
                      type="number"
                      min={7}
                      max={90}
                      value={validDays}
                      onChange={(e) => setValidDays(parseInt(e.target.value) || 14)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Zusätzliche Notizen (intern)</Label>
                  <Textarea
                    name="additional_notes"
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                    placeholder="Interne Notizen zum Angebot..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('leistungen')}>
                ← Zurück
              </Button>
              <Button onClick={() => setCurrentTab('kalkulation')}>
                Weiter zur Kalkulation →
              </Button>
            </div>
          </TabsContent>

          {/* TAB 4: Kalkulation */}
          <TabsContent value="kalkulation" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Euro className="h-5 w-5" />
                    Preisübersicht {isReferenceCustomer && <Badge variant="outline" className="text-primary">⭐ Referenzkunde</Badge>}
                  </h4>
                  <Button 
                    variant={priceEditMode ? "default" : "outline"} 
                    size="sm"
                    onClick={() => {
                      if (priceEditMode) {
                        // Beim Deaktivieren: Preise zurücksetzen auf kalkulierte Werte
                        setManualSetupPrice(null);
                        setManualMonthlyPrice(null);
                      }
                      setPriceEditMode(!priceEditMode);
                    }}
                  >
                    {priceEditMode ? 'Automatisch berechnen' : '✏️ Preise manuell anpassen'}
                  </Button>
                </div>

                {/* Kalkulierte Positionen */}
                <div className="space-y-3 mb-6">
                  {formData.services_selected.includes('Website & Digitale Plattformen') && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Website-Entwicklung</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(calculateWebsitePrice().setup)}</span>
                        {calculateWebsitePrice().monthly > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">+ {formatCurrency(calculateWebsitePrice().monthly)}/Monat</span>
                        )}
                      </div>
                    </div>
                  )}
                  {formData.services_selected.includes('SEO & Sichtbarkeit') && calculateSEOPrice().monthly > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>SEO</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(calculateSEOPrice().setup)}</span>
                        <span className="text-sm text-muted-foreground ml-2">+ {formatCurrency(calculateSEOPrice().monthly)}/Monat</span>
                      </div>
                    </div>
                  )}
                  {formData.services_selected.includes('KI-Agenten & Automation') && calculateKIPrice().setup > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>KI-Agent</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(calculateKIPrice().setup)}</span>
                        <span className="text-sm text-muted-foreground ml-2">+ {formatCurrency(calculateKIPrice().monthly)}/Monat</span>
                      </div>
                    </div>
                  )}
                  {formData.services_selected.includes('Voicebots / Sprachassistenz') && calculateVoicebotPrice().setup > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Voicebot</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(calculateVoicebotPrice().setup)}</span>
                        <span className="text-sm text-muted-foreground ml-2">+ {formatCurrency(calculateVoicebotPrice().monthly)}/Monat</span>
                      </div>
                    </div>
                  )}
                  {/* Katalog-Produkte */}
                  {selectedCatalogProducts.map(p => (
                    <div key={p.id} className="flex justify-between py-2 border-b">
                      <span>{p.name} {p.quantity > 1 && `×${p.quantity}`}</span>
                      <div className="text-right">
                        {p.price_setup > 0 && <span className="font-medium">{formatCurrency(p.price_setup * p.quantity)}</span>}
                        {p.price_monthly > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">+ {formatCurrency(p.price_monthly * p.quantity)}/Monat</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Editierbare Preise */}
                {priceEditMode ? (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <span>⚠️</span>
                      Manuelle Preisanpassung aktiv – Kalkulierte Werte werden überschrieben
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Einmalpreis (Setup) €</Label>
                        <Input
                          type="number"
                          value={manualSetupPrice ?? totals.calculatedSetup}
                          onChange={(e) => setManualSetupPrice(parseFloat(e.target.value) || 0)}
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Kalkuliert: {formatCurrency(totals.calculatedSetup)}
                        </p>
                      </div>
                      <div>
                        <Label>Monatspreis €</Label>
                        <Input
                          type="number"
                          value={manualMonthlyPrice ?? totals.calculatedMonthly}
                          onChange={(e) => setManualMonthlyPrice(parseFloat(e.target.value) || 0)}
                          className="bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Kalkuliert: {formatCurrency(totals.calculatedMonthly)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Einmalig (Setup):</span>
                      <span className="font-bold">{formatCurrency(totals.setup)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Monatlich:</span>
                      <span className="font-bold">{formatCurrency(totals.monthly)}</span>
                    </div>
                    <div className="flex justify-between text-xl border-t pt-2 mt-2">
                      <span>Jahreswert (netto):</span>
                      <span className="font-bold text-primary">{formatCurrency(totals.yearly)}</span>
                    </div>
                  </div>
                )}

                {/* Manuelle Preisübersicht wenn aktiv */}
                {priceEditMode && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
                    <div className="flex justify-between text-lg">
                      <span>Angebotspreis Einmalig:</span>
                      <span className="font-bold">{formatCurrency(totals.setup)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Angebotspreis Monatlich:</span>
                      <span className="font-bold">{formatCurrency(totals.monthly)}</span>
                    </div>
                    <div className="flex justify-between text-xl border-t pt-2 mt-2">
                      <span>Jahreswert (netto):</span>
                      <span className="font-bold text-primary">{formatCurrency(totals.yearly)}</span>
                    </div>
                    {(manualSetupPrice !== null || manualMonthlyPrice !== null) && (
                      <p className="text-xs text-amber-600 mt-2">
                        💰 Rabatt: {formatCurrency((totals.calculatedSetup + totals.calculatedMonthly * 12) - totals.yearly)} Ersparnis für den Kunden
                      </p>
                    )}
                  </div>
                )}

                {formData.project_start_timing === 'sofort' && !priceEditMode && (
                  <Badge className="mt-4" variant="secondary">
                    ⚡ Expresszuschlag enthalten
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Zusammenfassung */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Zusammenfassung</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Kunde:</strong> {formData.company_name || '—'} {isReferenceCustomer && <Badge variant="outline" className="ml-2 text-xs">⭐ Referenzkunde</Badge>}</p>
                  <p><strong>Erstellt von:</strong> {creatorName || '—'}</p>
                  <p><strong>Leistungen:</strong> {[...formData.services_selected, ...selectedCatalogProducts.map(p => p.name)].join(', ') || '—'}</p>
                  <p><strong>Gültig:</strong> {validDays} Tage</p>
                  {(manualSetupPrice !== null || manualMonthlyPrice !== null) && (
                    <p className="text-amber-600"><strong>Hinweis:</strong> Manuelle Preisanpassung aktiv</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab('details')}>
                ← Zurück
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                {isLoading ? 'Wird erstellt...' : (
                  <>
                    <FileText className="h-4 w-4" />
                    Angebot erstellen
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
