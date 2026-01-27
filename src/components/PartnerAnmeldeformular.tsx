import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  User, 
  Briefcase, 
  Target, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const partnerFormSchema = z.object({
  // Schritt 1: Unternehmensdaten
  companyName: z.string().min(2, "Firmenname ist erforderlich"),
  legalForm: z.string().min(1, "Bitte wählen Sie eine Rechtsform"),
  taxId: z.string().optional(),
  website: z.string().url("Bitte geben Sie eine gültige URL ein").optional().or(z.literal("")),
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  
  // Schritt 2: Kontaktperson
  contactFirstName: z.string().min(2, "Vorname ist erforderlich"),
  contactLastName: z.string().min(2, "Nachname ist erforderlich"),
  contactEmail: z.string().email("Bitte geben Sie eine gültige E-Mail ein"),
  contactPhone: z.string().optional(),
  contactPosition: z.string().optional(),
  
  // Schritt 3: Geschäftsdetails
  partnerType: z.string().min(1, "Bitte wählen Sie einen Partner-Typ"),
  employeeCount: z.string().optional(),
  foundedYear: z.string().optional(),
  currentClients: z.string().optional(),
  averageProjectValue: z.string().optional(),
  
  // Schritt 4: Spezialisierung
  targetMarkets: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  experience: z.string().optional(),
  
  // Schritt 5: Motivation
  motivation: z.string().optional(),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  referencesText: z.string().optional(),
  expectedVolume: z.string().optional(),
  
  // Schritt 6: Bestätigung
  acceptTerms: z.boolean().refine(val => val === true, "Bitte akzeptieren Sie die Bedingungen"),
  acceptDataProcessing: z.boolean().refine(val => val === true, "Bitte akzeptieren Sie die Datenverarbeitung"),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

const steps = [
  { id: 1, title: "Unternehmen", icon: Building2 },
  { id: 2, title: "Kontakt", icon: User },
  { id: 3, title: "Geschäft", icon: Briefcase },
  { id: 4, title: "Spezialisierung", icon: Target },
  { id: 5, title: "Motivation", icon: FileText },
  { id: 6, title: "Bestätigung", icon: CheckCircle },
];

const partnerTypes = [
  { value: "steuerberater", label: "Steuerberater / Kanzlei" },
  { value: "marketing_agentur", label: "Marketing-Agentur" },
  { value: "webdesigner", label: "Webdesigner / Developer" },
  { value: "it_dienstleister", label: "IT-Dienstleister / Systemhaus" },
  { value: "unternehmensberater", label: "Unternehmensberater" },
  { value: "sonstige", label: "Sonstige" },
];

const legalForms = [
  { value: "einzelunternehmen", label: "Einzelunternehmen" },
  { value: "gbr", label: "GbR" },
  { value: "gmbh", label: "GmbH" },
  { value: "ug", label: "UG (haftungsbeschränkt)" },
  { value: "ag", label: "AG" },
  { value: "ohg", label: "OHG" },
  { value: "kg", label: "KG" },
  { value: "freiberufler", label: "Freiberufler" },
  { value: "sonstige", label: "Sonstige" },
];

const employeeCounts = [
  { value: "1", label: "1 (Selbstständig)" },
  { value: "2-5", label: "2-5 Mitarbeiter" },
  { value: "6-10", label: "6-10 Mitarbeiter" },
  { value: "11-25", label: "11-25 Mitarbeiter" },
  { value: "26-50", label: "26-50 Mitarbeiter" },
  { value: "51+", label: "Mehr als 50 Mitarbeiter" },
];

const clientCounts = [
  { value: "1-10", label: "1-10 Kunden" },
  { value: "11-25", label: "11-25 Kunden" },
  { value: "26-50", label: "26-50 Kunden" },
  { value: "51-100", label: "51-100 Kunden" },
  { value: "100+", label: "Mehr als 100 Kunden" },
];

const projectValues = [
  { value: "1000-3000", label: "1.000 - 3.000 €" },
  { value: "3000-5000", label: "3.000 - 5.000 €" },
  { value: "5000-10000", label: "5.000 - 10.000 €" },
  { value: "10000-25000", label: "10.000 - 25.000 €" },
  { value: "25000+", label: "Mehr als 25.000 €" },
];

const targetMarketOptions = [
  "Handwerk", "Gastronomie", "Einzelhandel", "Gesundheitswesen", 
  "Immobilien", "Industrie", "Dienstleistungen", "Bildung", 
  "Tourismus", "Landwirtschaft", "Öffentliche Verwaltung"
];

const specializationOptions = [
  "Webdesign", "SEO", "Social Media", "Content Marketing", 
  "E-Commerce", "Buchhaltung", "Steuern", "Unternehmensberatung",
  "IT-Support", "Cloud-Lösungen", "CRM/ERP", "Digitalisierung"
];

const experienceLevels = [
  { value: "0-2", label: "0-2 Jahre" },
  { value: "3-5", label: "3-5 Jahre" },
  { value: "6-10", label: "6-10 Jahre" },
  { value: "10+", label: "Mehr als 10 Jahre" },
];

const expectedVolumes = [
  { value: "1-3", label: "1-3 Kunden pro Monat" },
  { value: "4-6", label: "4-6 Kunden pro Monat" },
  { value: "7-10", label: "7-10 Kunden pro Monat" },
  { value: "10+", label: "Mehr als 10 Kunden pro Monat" },
];

export function PartnerAnmeldeformular() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      companyName: "",
      legalForm: "",
      taxId: "",
      website: "",
      street: "",
      postalCode: "",
      city: "",
      contactFirstName: "",
      contactLastName: "",
      contactEmail: "",
      contactPhone: "",
      contactPosition: "",
      partnerType: "",
      employeeCount: "",
      foundedYear: "",
      currentClients: "",
      averageProjectValue: "",
      targetMarkets: [],
      specializations: [],
      experience: "",
      motivation: "",
      portfolioUrl: "",
      referencesText: "",
      expectedVolume: "",
      acceptTerms: false,
      acceptDataProcessing: false,
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof PartnerFormData)[] => {
    switch (step) {
      case 1: return ["companyName", "legalForm"];
      case 2: return ["contactFirstName", "contactLastName", "contactEmail"];
      case 3: return ["partnerType"];
      case 4: return [];
      case 5: return [];
      case 6: return ["acceptTerms", "acceptDataProcessing"];
      default: return [];
    }
  };

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    try {
      // Insert into Supabase
      const { error } = await supabase.from("partners").insert({
        company_name: data.companyName,
        legal_form: data.legalForm,
        tax_id: data.taxId || null,
        website: data.website || null,
        street: data.street || null,
        postal_code: data.postalCode || null,
        city: data.city || null,
        contact_first_name: data.contactFirstName,
        contact_last_name: data.contactLastName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone || null,
        contact_position: data.contactPosition || null,
        partner_type: data.partnerType,
        employee_count: data.employeeCount || null,
        founded_year: data.foundedYear ? parseInt(data.foundedYear) : null,
        current_clients: data.currentClients || null,
        average_project_value: data.averageProjectValue || null,
        target_markets: data.targetMarkets || [],
        specializations: data.specializations || [],
        experience: data.experience || null,
        motivation: data.motivation || null,
        portfolio_url: data.portfolioUrl || null,
        references_text: data.referencesText || null,
        expected_volume: data.expectedVolume || null,
        status: "pending",
      });

      if (error) throw error;

      // Send to Odoo via Edge Function
      try {
        await supabase.functions.invoke("partner-register", {
          body: data,
        });
      } catch (odooError) {
        console.error("Odoo sync failed:", odooError);
        // Continue anyway - Supabase is the source of truth
      }

      setIsSubmitted(true);
      toast({
        title: "Anmeldung erfolgreich!",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Vielen Dank für Ihre Anmeldung!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Wir haben Ihre Partner-Anfrage erhalten und werden diese in den nächsten 
            1-2 Werktagen prüfen. Sie erhalten eine E-Mail mit weiteren Informationen.
          </p>
          <div className="pt-4">
            <Button asChild>
              <a href="/partner">Zurück zur Partner-Seite</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Partner-Anmeldung</h1>
          <Badge variant="outline">
            Schritt {currentStep} von {steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-2 text-sm ${
                step.id === currentStep 
                  ? "text-accent font-medium" 
                  : step.id < currentStep 
                    ? "text-green-600" 
                    : "text-muted-foreground"
              }`}
            >
              <step.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Erzählen Sie uns von Ihrem Unternehmen"}
                {currentStep === 2 && "Wer ist Ihr Hauptansprechpartner?"}
                {currentStep === 3 && "Details zu Ihrem Geschäft"}
                {currentStep === 4 && "Ihre Spezialisierungen und Zielgruppen"}
                {currentStep === 5 && "Warum möchten Sie Partner werden?"}
                {currentStep === 6 && "Bestätigen Sie Ihre Anmeldung"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Company */}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firmenname *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ihre Firma GmbH" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="legalForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rechtsform *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Rechtsform wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {legalForms.map((form) => (
                              <SelectItem key={form.value} value={form.value}>
                                {form.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steuernummer / USt-ID</FormLabel>
                          <FormControl>
                            <Input placeholder="DE123456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://ihre-firma.de" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Straße und Hausnummer</FormLabel>
                        <FormControl>
                          <Input placeholder="Musterstraße 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PLZ</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ort</FormLabel>
                          <FormControl>
                            <Input placeholder="Musterstadt" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactFirstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vorname *</FormLabel>
                          <FormControl>
                            <Input placeholder="Max" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactLastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nachname *</FormLabel>
                          <FormControl>
                            <Input placeholder="Mustermann" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="max@ihre-firma.de" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input placeholder="+49 123 456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Geschäftsführer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Business */}
              {currentStep === 3 && (
                <>
                  <FormField
                    control={form.control}
                    name="partnerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner-Typ *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wählen Sie Ihren Bereich" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partnerTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mitarbeiterzahl</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employeeCounts.map((count) => (
                                <SelectItem key={count.value} value={count.value}>
                                  {count.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gründungsjahr</FormLabel>
                          <FormControl>
                            <Input placeholder="2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentClients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aktuelle Kundenzahl</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clientCounts.map((count) => (
                                <SelectItem key={count.value} value={count.value}>
                                  {count.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageProjectValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ø Projektwert</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Auswählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projectValues.map((value) => (
                                <SelectItem key={value.value} value={value.value}>
                                  {value.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Step 4: Specialization */}
              {currentStep === 4 && (
                <>
                  <FormField
                    control={form.control}
                    name="targetMarkets"
                    render={() => (
                      <FormItem>
                        <FormLabel>Ziel-Branchen</FormLabel>
                        <FormDescription>
                          Welche Branchen bedienen Sie hauptsächlich?
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {targetMarketOptions.map((market) => (
                            <FormField
                              key={market}
                              control={form.control}
                              name="targetMarkets"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(market)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...(field.value || []), market]
                                          : field.value?.filter((v) => v !== market) || [];
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {market}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specializations"
                    render={() => (
                      <FormItem>
                        <FormLabel>Spezialisierungen</FormLabel>
                        <FormDescription>
                          In welchen Bereichen sind Sie Experte?
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {specializationOptions.map((spec) => (
                            <FormField
                              key={spec}
                              control={form.control}
                              name="specializations"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(spec)}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...(field.value || []), spec]
                                          : field.value?.filter((v) => v !== spec) || [];
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {spec}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branchenerfahrung</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {experienceLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 5: Motivation */}
              {currentStep === 5 && (
                <>
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warum möchten Sie DeutLicht-Partner werden?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Erzählen Sie uns, was Sie motiviert und welche Ziele Sie verfolgen..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio / Referenzen URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ihr-portfolio.de" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="referencesText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referenzen / Erfolgsgeschichten</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nennen Sie uns gerne einige Ihrer erfolgreichen Projekte..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Erwartetes Vermittlungsvolumen</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Auswählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expectedVolumes.map((volume) => (
                              <SelectItem key={volume.value} value={volume.value}>
                                {volume.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Zusammenfassung Ihrer Angaben:</h3>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p><strong>Unternehmen:</strong> {form.getValues("companyName")}</p>
                      <p><strong>Kontakt:</strong> {form.getValues("contactFirstName")} {form.getValues("contactLastName")}</p>
                      <p><strong>E-Mail:</strong> {form.getValues("contactEmail")}</p>
                      <p><strong>Partner-Typ:</strong> {partnerTypes.find(t => t.value === form.getValues("partnerType"))?.label}</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ich akzeptiere die <a href="/agb" className="text-accent underline" target="_blank">Partner-AGB</a> *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acceptDataProcessing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ich stimme der <a href="/datenschutz" className="text-accent underline" target="_blank">Datenverarbeitung</a> zu *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                
                {currentStep < steps.length ? (
                  <Button type="button" onClick={nextStep}>
                    Weiter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Anmeldung absenden
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default PartnerAnmeldeformular;
