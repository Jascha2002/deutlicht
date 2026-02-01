import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { WizardProgress } from '@/components/offer/WizardProgress';
import { Step1Company } from '@/components/offer/steps/Step1Company';
import { Step2Contact } from '@/components/offer/steps/Step2Contact';
import { Step3Services } from '@/components/offer/steps/Step3Services';
import { Step4Details } from '@/components/offer/steps/Step4Details';
import { Step5Summary } from '@/components/offer/steps/Step5Summary';
import { OfferFormData, initialFormData } from '@/types/offer';
import { calcTotal } from '@/lib/pricing';
import { getApproximatePriceRange, formatCurrencyRange } from '@/lib/pricingRanges';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnimatedLogo from '@/components/AnimatedLogo';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Send, CheckCircle, RotateCcw, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLeadTracking } from '@/hooks/useLeadTracking';
import heroProjektanfrage from '@/assets/hero-projektanfrage.jpg';

const STEPS = ['Unternehmen', 'Kontakt', 'Leistungen', 'Details', 'Zusammenfassung'];

const Projektanfrage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { saveLead, submitLead, isSaving } = useLeadTracking();

  // Auto-save lead data when form changes
  useEffect(() => {
    if (formData.company_name || formData.customer_email || formData.services_selected.length > 0) {
      saveLead(formData, currentStep);
    }
  }, [formData, currentStep, saveLead]);

  const handleChange = (field: keyof OfferFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services_selected: prev.services_selected.includes(service)
        ? prev.services_selected.filter((s) => s !== service)
        : [...prev.services_selected, service],
    }));
  };

  const handleToggleArray = (field: 'website_features' | 'social_platforms', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  // Überprüft, ob alle wesentlichen Kontaktdaten vorhanden sind
  const hasRequiredContactData = (): boolean => {
    return !!(
      formData.company_name.trim() &&
      formData.customer_email.trim() &&
      formData.customer_phone.trim() &&
      formData.company_street.trim() &&
      formData.company_zip.trim() &&
      formData.company_city.trim()
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.company_name.trim()) {
          toast({ title: 'Fehler', description: 'Bitte geben Sie einen Unternehmensnamen ein.', variant: 'destructive' });
          return false;
        }
        if (!formData.company_street.trim() || !formData.company_zip.trim() || !formData.company_city.trim()) {
          toast({ title: 'Fehler', description: 'Bitte geben Sie die vollständige Adresse an.', variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (!formData.customer_email.trim() || !formData.customer_phone.trim()) {
          toast({ title: 'Fehler', description: 'Bitte geben Sie E-Mail und Telefonnummer ein.', variant: 'destructive' });
          return false;
        }
        return true;
      case 3:
        if (formData.services_selected.length === 0) {
          toast({ title: 'Fehler', description: 'Bitte wählen Sie mindestens eine Leistung aus.', variant: 'destructive' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    // Validierung: Alle wesentlichen Daten müssen vorhanden sein
    if (!hasRequiredContactData()) {
      toast({ 
        title: 'Unvollständige Daten', 
        description: 'Bitte füllen Sie alle erforderlichen Felder aus (Adresse, E-Mail, Telefon).', 
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);
    const totals = calcTotal(formData);
    const priceRange = getApproximatePriceRange(formData);
    
    try {
      // Submit lead to tracking (saves internal prices)
      await submitLead(formData, currentStep, totals.setup, totals.monthly);

      // Send email notification (without exact prices to customer)
      const { error: emailError } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          type: 'projektanfrage',
          data: {
            ...formData,
            // Nur grobe Preisrahmen für interne Verwendung
            estimated_range: priceRange.label,
            // Interne Preise nur für DeutLicht-Team
            internal_setup: totals.setup,
            internal_monthly: totals.monthly,
          },
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
      }

      // Send to Odoo CRM (non-blocking)
      supabase.functions.invoke('odoo-crm-lead', {
        body: {
          type: 'projektanfrage',
          data: {
            ...formData,
            estimated_setup: totals.setup,
            estimated_monthly: totals.monthly,
          },
        },
      }).then(({ error: odooError }) => {
        if (odooError) {
          console.error('Odoo CRM error:', odooError);
        } else {
          console.log('Lead successfully sent to Odoo CRM');
        }
      });

      setSubmitted(true);
      toast({ title: 'Erfolg!', description: 'Ihre Anfrage wurde erfolgreich gesendet. Wir erstellen Ihnen ein individuelles Angebot.' });
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Fehler', description: 'Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmitted(false);
    // Clear session storage for new lead
    sessionStorage.removeItem('projektanfrage_session_id');
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Anfrage gesendet | DeutLicht</title>
        </Helmet>
        <Navigation />
        <main className="min-h-screen bg-secondary pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Vielen Dank!</h1>
            <p className="text-muted-foreground mb-8">
              Ihre Projektanfrage wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
            </p>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Neue Anfrage starten
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Projektanfrage | DeutLicht - Ihr persönliches Angebot</title>
        <meta name="description" content="Erstellen Sie Ihr individuelles Digitalpaket: Website, KI-Agenten, Voicebots, Social Media & SEO. Unverbindliche Preiskalkulation in 5 Minuten." />
      </Helmet>
      <Navigation />
      <main className="min-h-screen bg-secondary">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center overflow-hidden pt-32 pb-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={heroProjektanfrage} 
              alt="Projektanfrage Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-secondary" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center">
              <AnimatedLogo size="lg" className="mb-8" />
              
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground border border-accent/30 text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Kostenlos & Unverbindlich
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Projektanfrage
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Ihr individuelles Angebot in 5 Minuten
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pb-16">

          <WizardProgress currentStep={currentStep} totalSteps={5} steps={STEPS} />

          <div className="mb-8">
            {currentStep === 1 && <Step1Company formData={formData} onChange={handleChange} />}
            {currentStep === 2 && <Step2Contact formData={formData} onChange={handleChange} />}
            {currentStep === 3 && <Step3Services formData={formData} onToggleService={handleToggleService} />}
            {currentStep === 4 && <Step4Details formData={formData} onChange={handleChange} onToggleArray={handleToggleArray} />}
            {currentStep === 5 && <Step5Summary formData={formData} onGoToStep={handleGoToStep} />}
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              {isSaving && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Save className="w-3 h-3 animate-pulse" />
                  Speichern...
                </span>
              )}
            </div>
            {currentStep < 5 ? (
              <Button onClick={handleNext}>
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !hasRequiredContactData()}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
              </Button>
            )}
          </div>
        </div>

        {/* Info-Banner statt Preisanzeige */}
        {currentStep >= 3 && formData.services_selected.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-card border border-border rounded-xl shadow-lg p-4 max-w-[280px]">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Ihr individuelles Angebot</strong>
                <br />
                erhalten Sie nach Absenden Ihrer Anfrage per E-Mail.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Projektanfrage;
