import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OfferFormData } from '@/types/offer';
import { Mail, Phone, Calendar } from 'lucide-react';
import stepKontaktImg from '@/assets/step-kontakt.jpg';

interface Step2Props {
  formData: OfferFormData;
  onChange: (field: keyof OfferFormData, value: string) => void;
}

export const Step2Contact = ({ formData, onChange }: Step2Props) => {
  const [resetHint, setResetHint] = useState(false);

  // If project_start_timing changes and project_deadline is before it, clear deadline
  useEffect(() => {
    if (
      formData.project_start_timing &&
      formData.project_deadline &&
      formData.project_deadline < formData.project_start_timing
    ) {
      setResetHint(true);
      const timer = setTimeout(() => {
        onChange('project_deadline', '');
        setResetHint(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.project_start_timing]);

  const formattedStart = formData.project_start_timing
    ? new Date(formData.project_start_timing).toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={stepKontaktImg} 
          alt="Kontakt & Zeitplan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <CardTitle className="text-2xl text-foreground">Kontakt & Zeitplan</CardTitle>
          <CardDescription className="text-muted-foreground">Wie können wir Sie erreichen und wann soll es losgehen?</CardDescription>
        </div>
      </div>
      <CardHeader className="pt-4 pb-2" />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-Mail *
            </Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => onChange('customer_email', e.target.value)}
              placeholder="max@muster.de"
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefon *
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => onChange('customer_phone', e.target.value)}
              placeholder="+49 123 456789"
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Projektzeitleiste</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_start_timing">Gewünschter Projektstart</Label>
              <Input
                id="project_start_timing"
                type="date"
                value={formData.project_start_timing}
                onChange={(e) => onChange('project_start_timing', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_deadline">Gewünschte Fertigstellung</Label>
              <Input
                id="project_deadline"
                type="date"
                value={formData.project_deadline}
                min={formData.project_start_timing || undefined}
                onChange={(e) => onChange('project_deadline', e.target.value)}
                className="h-12"
              />
              {resetHint ? (
                <p className="text-xs text-destructive mt-1">
                  Fertigstellungsdatum wurde zurückgesetzt
                </p>
              ) : formData.project_start_timing ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Frühestens ab {formattedStart}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Bitte zuerst einen Projektstart wählen
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
