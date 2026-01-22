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
import { OfferFormData, INDUSTRIES } from '@/types/offer';
import { Building2 } from 'lucide-react';

interface Step1Props {
  formData: OfferFormData;
  onChange: (field: keyof OfferFormData, value: string) => void;
}

export const Step1Company = ({ formData, onChange }: Step1Props) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Unternehmensdaten</CardTitle>
        <CardDescription>Erzählen Sie uns von Ihrem Unternehmen</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Unternehmensname *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => onChange('company_name', e.target.value)}
            placeholder="Muster GmbH"
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_street">Straße</Label>
            <Input
              id="company_street"
              value={formData.company_street}
              onChange={(e) => onChange('company_street', e.target.value)}
              placeholder="Musterstraße 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_zip">PLZ</Label>
            <Input
              id="company_zip"
              value={formData.company_zip}
              onChange={(e) => onChange('company_zip', e.target.value)}
              placeholder="12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_city">Ort</Label>
            <Input
              id="company_city"
              value={formData.company_city}
              onChange={(e) => onChange('company_city', e.target.value)}
              placeholder="Musterstadt"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Branche</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => onChange('industry', value)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Branche auswählen" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.industry === 'Andere' && (
              <Input
                value={formData.industry_other}
                onChange={(e) => onChange('industry_other', e.target.value)}
                placeholder="Welche Branche?"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Unternehmensgröße</Label>
            <Select
              value={formData.company_size}
              onValueChange={(value) => onChange('company_size', value as OfferFormData['company_size'])}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Größe auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 Mitarbeiter</SelectItem>
                <SelectItem value="11-50">11-50 Mitarbeiter</SelectItem>
                <SelectItem value="51-250">51-250 Mitarbeiter</SelectItem>
                <SelectItem value=">250">Über 250 Mitarbeiter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_person">Ansprechpartner</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => onChange('contact_person', e.target.value)}
            placeholder="Max Mustermann"
            className="h-12"
          />
        </div>
      </CardContent>
    </Card>
  );
};
