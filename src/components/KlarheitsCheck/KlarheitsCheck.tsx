import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StepIndicator from "./StepIndicator";
import { KlarheitsCheckData, initialFormData } from "./types";
import Step1Unternehmen from "./steps/Step1Unternehmen";
import Step2Projektanlass from "./steps/Step2Projektanlass";
import Step3ZeitRahmen from "./steps/Step3ZeitRahmen";
import Step4Leistungen from "./steps/Step4Leistungen";
import ConditionalWebsite from "./steps/ConditionalWebsite";
import ConditionalSocialMedia from "./steps/ConditionalSocialMedia";
import ConditionalKI from "./steps/ConditionalKI";
import ConditionalVoicebots from "./steps/ConditionalVoicebots";
import ConditionalProzesse from "./steps/ConditionalProzesse";
import StepZusammenarbeit from "./steps/StepZusammenarbeit";

interface KlarheitsCheckProps {
  onComplete?: (data: KlarheitsCheckData) => void;
}

const KlarheitsCheck = ({ onComplete }: KlarheitsCheckProps) => {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KlarheitsCheckData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof KlarheitsCheckData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Determine which conditional steps to show
  const conditionalSteps = useMemo(() => {
    const steps: { key: string; label: string; component: React.ReactNode }[] = [];
    
    if (formData.services_needed.includes('Website') || formData.services_needed.includes('Webshop')) {
      steps.push({
        key: 'website',
        label: 'Website',
        component: <ConditionalWebsite data={formData} onChange={handleChange} />,
      });
    }
    
    if (formData.services_needed.includes('Social Media Marketing')) {
      steps.push({
        key: 'social',
        label: 'Social Media',
        component: <ConditionalSocialMedia data={formData} onChange={handleChange} />,
      });
    }
    
    if (formData.services_needed.includes('KI-Agenten / Automation')) {
      steps.push({
        key: 'ki',
        label: 'KI-Agenten',
        component: <ConditionalKI data={formData} onChange={handleChange} />,
      });
    }
    
    if (formData.services_needed.includes('Voicebots / Sprachassistenz')) {
      steps.push({
        key: 'voicebots',
        label: 'Voicebots',
        component: <ConditionalVoicebots data={formData} onChange={handleChange} />,
      });
    }
    
    if (formData.services_needed.includes('Prozessoptimierung / Digitalstrategie')) {
      steps.push({
        key: 'prozesse',
        label: 'Prozesse',
        component: <ConditionalProzesse data={formData} onChange={handleChange} />,
      });
    }
    
    return steps;
  }, [formData.services_needed, formData]);

  // Build full step list
  const allSteps = useMemo(() => {
    const baseSteps = [
      { key: 'unternehmen', label: 'Unternehmen' },
      { key: 'projektanlass', label: 'Projektanlass' },
      { key: 'zeitrahmen', label: 'Zeit & Rahmen' },
      { key: 'leistungen', label: 'Leistungen' },
    ];
    
    const conditionalLabels = conditionalSteps.map(s => ({ key: s.key, label: s.label }));
    
    return [
      ...baseSteps,
      ...conditionalLabels,
      { key: 'zusammenarbeit', label: 'Zusammenarbeit' },
    ];
  }, [conditionalSteps]);

  const totalSteps = allSteps.length;

  const renderCurrentStep = () => {
    if (currentStep === 1) return <Step1Unternehmen data={formData} onChange={handleChange} />;
    if (currentStep === 2) return <Step2Projektanlass data={formData} onChange={handleChange} />;
    if (currentStep === 3) return <Step3ZeitRahmen data={formData} onChange={handleChange} />;
    if (currentStep === 4) return <Step4Leistungen data={formData} onChange={handleChange} />;
    
    // Handle conditional steps
    const conditionalIndex = currentStep - 5;
    if (conditionalIndex >= 0 && conditionalIndex < conditionalSteps.length) {
      return conditionalSteps[conditionalIndex].component;
    }
    
    // Final step
    return <StepZusammenarbeit data={formData} onChange={handleChange} />;
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.company_name.trim() || !formData.contact_person.trim() || !formData.email.trim()) {
          toast({
            title: "Pflichtfelder ausfüllen",
            description: "Bitte füllen Sie alle Pflichtfelder aus.",
            variant: "destructive",
          });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast({
            title: "Ungültige E-Mail",
            description: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        if (formData.services_needed.length === 0) {
          toast({
            title: "Leistung wählen",
            description: "Bitte wählen Sie mindestens eine Leistung aus.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateLeadAnalysis = () => {
    const priorityScore = 
      (formData.project_start === 'sofort' ? 30 : formData.project_start === '1-3-monate' ? 20 : 10) +
      (formData.services_needed.length * 10) +
      (formData.fixed_deadline === 'ja' ? 15 : 0) +
      (formData.budget_range ? 10 : 0);

    const priority = priorityScore >= 60 ? 'Hoch' : priorityScore >= 35 ? 'Mittel' : 'Normal';

    const packages: string[] = [];
    if (formData.services_needed.includes('Website') || formData.services_needed.includes('Webshop')) {
      packages.push('Digital Presence Paket');
    }
    if (formData.services_needed.includes('KI-Agenten / Automation') || formData.services_needed.includes('Voicebots / Sprachassistenz')) {
      packages.push('AI & Automation Paket');
    }
    if (formData.services_needed.includes('Social Media Marketing') || formData.services_needed.includes('SEO')) {
      packages.push('Marketing & Visibility Paket');
    }
    if (formData.services_needed.includes('Prozessoptimierung / Digitalstrategie')) {
      packages.push('Strategy & Consulting Paket');
    }

    const nextStep = formData.project_start === 'sofort' 
      ? 'Sofortige Terminvereinbarung für Erstgespräch'
      : formData.project_start === '1-3-monate'
        ? 'Angebot erstellen und Follow-up in 2 Wochen'
        : 'In Lead-Nurturing-Pipeline aufnehmen';

    return {
      lead_priority: priority,
      priority_score: priorityScore,
      recommended_packages: packages,
      suggested_next_step: nextStep,
    };
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    try {
      const analysis = generateLeadAnalysis();
      
      const fullData = {
        ...formData,
        _meta: {
          submitted_at: new Date().toISOString(),
          form_version: '1.0',
          ...analysis,
        },
      };

      // Send to edge function
      const { error } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          type: 'klarheitscheck',
          data: fullData,
        },
      });

      if (error) throw error;

      setIsComplete(true);
      onComplete?.(formData);

      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Wir melden uns zeitnah bei Ihnen.",
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

  // Entry screen
  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Der DeutLicht-Klarheits-Check
          </h1>
          
          <p className="text-lg text-muted-foreground">
            In wenigen Minuten zur richtigen digitalen Lösung.
            <br />
            <span className="font-medium text-foreground">Durchblick. DeutLicht.</span>
          </p>
          
          <div className="bg-muted/50 rounded-xl p-6 text-left">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">DeutLicht.</strong> Wo Komplexes einfach wird.
              <br /><br />
              Unser digitaler Klarheits-Check zeigt in wenigen Minuten,
              welche Lösung wirklich zu Ihnen passt.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 bg-primary/60 rounded-full"></span>
            <span>Dauer: ca. 2–4 Minuten</span>
          </div>
          
          <Button 
            size="lg" 
            onClick={() => setStarted(true)}
            className="gap-2 text-lg px-8 py-6"
          >
            Bedarf klären
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    );
  }

  // Success screen
  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold">Vielen Dank!</h1>
          
          <p className="text-lg text-muted-foreground">
            Ihre Anfrage wurde erfolgreich übermittelt.
            <br />
            Wir melden uns zeitnah bei Ihnen.
          </p>
          
          <div className="bg-muted/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Was passiert jetzt?</strong>
              <br /><br />
              Unser Team analysiert Ihre Angaben und bereitet ein individuelles Angebot vor. 
              Sie erhalten in Kürze eine E-Mail mit den nächsten Schritten.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setStarted(false);
              setIsComplete(false);
              setCurrentStep(1);
              setFormData(initialFormData);
            }}
          >
            Neuen Klarheits-Check starten
          </Button>
        </div>
      </Card>
    );
  }

  // Form steps
  return (
    <Card className="max-w-3xl mx-auto p-6 md:p-10">
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        stepLabels={allSteps.map(s => s.label)}
      />
      
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={handleNext} className="gap-2">
            Weiter
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>Wird gesendet...</>
            ) : (
              <>
                Anfrage absenden
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default KlarheitsCheck;
