import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { WizardProgress } from '@/components/offer/WizardProgress';
import { Step1Company } from '@/components/offer/steps/Step1Company';
import { Step2Contact } from '@/components/offer/steps/Step2Contact';
import { Step3Services } from '@/components/offer/steps/Step3Services';
import { Step4Details } from '@/components/offer/steps/Step4Details';
import { Step5Summary } from '@/components/offer/steps/Step5Summary';
import { PriceDisplay } from '@/components/offer/PriceDisplay';
import { OfferFormData, initialFormData } from '@/types/offer';
import { calcTotal } from '@/lib/pricing';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Send, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STEPS = ['Unternehmen', 'Kontakt', 'Leistungen', 'Details', 'Zusammenfassung'];

const Projektanfrage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.company_name.trim()) {
          toast({ title: 'Fehler', description: 'Bitte geben Sie einen Unternehmensnamen ein.', variant: 'destructive' });
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
    setIsSubmitting(true);
    const totals = calcTotal(formData);
    
    try {
      const { error } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          formData,
          totals,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'Erfolg!', description: 'Ihre Anfrage wurde erfolgreich gesendet.' });
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
      <main className="min-h-screen bg-secondary pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Projektanfrage</h1>
            <p className="text-muted-foreground">Ihr individuelles Angebot in 5 Minuten</p>
          </div>

          <WizardProgress currentStep={currentStep} totalSteps={5} steps={STEPS} />

          <div className="mb-8">
            {currentStep === 1 && <Step1Company formData={formData} onChange={handleChange} />}
            {currentStep === 2 && <Step2Contact formData={formData} onChange={handleChange} />}
            {currentStep === 3 && <Step3Services formData={formData} onToggleService={handleToggleService} />}
            {currentStep === 4 && <Step4Details formData={formData} onChange={handleChange} onToggleArray={handleToggleArray} />}
            {currentStep === 5 && <Step5Summary formData={formData} onGoToStep={handleGoToStep} />}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            {currentStep < 5 ? (
              <Button onClick={handleNext}>
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
              </Button>
            )}
          </div>
        </div>

        {currentStep >= 3 && <PriceDisplay formData={formData} />}
      </main>
      <Footer />
    </>
  );
};

export default Projektanfrage;
