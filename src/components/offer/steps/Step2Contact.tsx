import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OfferFormData } from '@/types/offer';
import { Mail, Phone, Calendar } from 'lucide-react';

interface Step2Props {
  formData: OfferFormData;
  onChange: (field: keyof OfferFormData, value: string) => void;
}

export const Step2Contact = ({ formData, onChange }: Step2Props) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Kontakt & Zeitplan</CardTitle>
        <CardDescription>Wie können wir Sie erreichen und wann soll es losgehen?</CardDescription>
      </CardHeader>
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
              <Label>Gewünschter Projektstart</Label>
              <Select
                value={formData.project_start_timing}
                onValueChange={(value) => onChange('project_start_timing', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Zeitpunkt auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sofort">Sofort</SelectItem>
                  <SelectItem value="In 2 Wochen">In 2 Wochen</SelectItem>
                  <SelectItem value="In 4 Wochen">In 4 Wochen</SelectItem>
                  <SelectItem value="In 1-2 Monaten">In 1-2 Monaten</SelectItem>
                  <SelectItem value="In 6 Monaten">In 6 Monaten</SelectItem>
                  <SelectItem value="Noch in Planung">Noch in Planung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gewünschte Fertigstellung</Label>
              <Select
                value={formData.project_deadline}
                onValueChange={(value) => onChange('project_deadline', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Deadline auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In 4 Wochen">In 4 Wochen</SelectItem>
                  <SelectItem value="In 8 Wochen">In 8 Wochen</SelectItem>
                  <SelectItem value="In 12 Wochen">In 12 Wochen</SelectItem>
                  <SelectItem value="Flexibel">Flexibel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
