import FormField from "../FormField";
import { KlarheitsCheckData, INDUSTRIES, COMPANY_SIZES } from "../types";

interface Step1Props {
  data: KlarheitsCheckData;
  onChange: (field: keyof KlarheitsCheckData, value: any) => void;
}

const Step1Unternehmen = ({ data, onChange }: Step1Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Unternehmensgrundlagen</h2>
        <p className="text-muted-foreground">
          Erzählen Sie uns von Ihrem Unternehmen.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            type="text"
            name="company_name"
            label="Unternehmensname"
            value={data.company_name}
            onChange={(v) => onChange('company_name', v)}
            required
            placeholder="Ihr Unternehmen"
          />
          <FormField
            type="text"
            name="contact_person"
            label="Ansprechpartner"
            value={data.contact_person}
            onChange={(v) => onChange('contact_person', v)}
            required
            placeholder="Vor- und Nachname"
          />
        </div>

        <FormField
          type="text"
          name="role"
          label="Position / Rolle"
          value={data.role}
          onChange={(v) => onChange('role', v)}
          placeholder="z.B. Geschäftsführer, IT-Leiter"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            type="email"
            name="email"
            label="E-Mail"
            value={data.email}
            onChange={(v) => onChange('email', v)}
            required
            placeholder="ihre@email.de"
          />
          <FormField
            type="tel"
            name="phone"
            label="Telefon"
            value={data.phone}
            onChange={(v) => onChange('phone', v)}
            placeholder="+49 ..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            type="select"
            name="industry"
            label="Branche"
            value={data.industry}
            onChange={(v) => onChange('industry', v)}
            options={INDUSTRIES}
            placeholder="Branche wählen"
          />
          <FormField
            type="select"
            name="company_size"
            label="Unternehmensgröße"
            value={data.company_size}
            onChange={(v) => onChange('company_size', v)}
            options={COMPANY_SIZES}
            placeholder="Mitarbeiteranzahl"
          />
        </div>
      </div>
    </div>
  );
};

export default Step1Unternehmen;
