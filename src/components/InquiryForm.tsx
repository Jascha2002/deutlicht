import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmission } from "@/lib/analytics";
import { Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ANLIEGEN_OPTIONS = [
  "Digitale Strategie & Klarheit",
  "Digitalisierungsberatung",
  "KI-Agenten & Automatisierung",
  "Prozessanalyse & Optimierung",
  "Systemintegration",
  "Website / digitale Plattform",
  "Shopsystem / digitale Verkaufslösung",
  "Online-Marketing",
  "Fördermöglichkeiten prüfen",
  "Sonstiges",
];

const MITARBEITER_OPTIONS = [
  "1-5 Mitarbeitende",
  "6-10 Mitarbeitende",
  "11-25 Mitarbeitende",
  "26-50 Mitarbeitende",
  "51-100 Mitarbeitende",
  "101-250 Mitarbeitende",
  "Mehr als 250 Mitarbeitende",
];

const UMSATZ_OPTIONS = [
  "Unter 100.000 €",
  "100.000 € - 500.000 €",
  "500.000 € - 1 Mio. €",
  "1 Mio. € - 5 Mio. €",
  "5 Mio. € - 10 Mio. €",
  "10 Mio. € - 50 Mio. €",
  "Über 50 Mio. €",
  "Andere",
];

interface InquiryFormProps {
  onSuccess?: () => void;
}

const InquiryForm = ({ onSuccess }: InquiryFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Section 1 - Anliegen
  const [anliegen, setAnliegen] = useState<string[]>([]);
  
  // Section 2 - Kontaktdaten
  const [kontakt, setKontakt] = useState({
    name: "",
    funktion: "",
    unternehmen: "",
    email: "",
    telefon: "",
    adresse: "",
  });
  
  // Section 3 - Unternehmensdaten
  const [unternehmen, setUnternehmen] = useState({
    branche: "",
    website: "",
    gruendungsdatum: "",
    mitarbeiter: "",
    umsatz: "",
    umsatzFreitext: "",
  });
  
  // Section 4 - Freitext
  const [beschreibung, setBeschreibung] = useState("");
  
  // Section 5 - Datenschutz
  const [datenschutzAkzeptiert, setDatenschutzAkzeptiert] = useState(false);

  const showFoerderFelder = anliegen.includes("Fördermöglichkeiten prüfen");

  const handleAnliegenChange = (option: string, checked: boolean) => {
    if (checked) {
      setAnliegen([...anliegen, option]);
    } else {
      setAnliegen(anliegen.filter((a) => a !== option));
    }
  };

  const handleKontaktChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKontakt((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnternehmenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnternehmen((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (anliegen.length === 0) {
      toast({
        title: "Bitte wählen Sie mindestens ein Anliegen aus",
        variant: "destructive",
      });
      return false;
    }

    const requiredKontakt = ["name", "funktion", "unternehmen", "email", "telefon", "adresse"];
    for (const field of requiredKontakt) {
      if (!kontakt[field as keyof typeof kontakt].trim()) {
        toast({
          title: "Bitte füllen Sie alle Kontaktfelder aus",
          variant: "destructive",
        });
        return false;
      }
    }

    if (showFoerderFelder) {
      if (!unternehmen.gruendungsdatum || !unternehmen.mitarbeiter || !unternehmen.umsatz) {
        toast({
          title: "Bitte füllen Sie die Förder-relevanten Felder aus",
          variant: "destructive",
        });
        return false;
      }
      if (unternehmen.umsatz === "Andere" && !unternehmen.umsatzFreitext.trim()) {
        toast({
          title: "Bitte geben Sie den Umsatz im Freitextfeld an",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!datenschutzAkzeptiert) {
      toast({
        title: "Bitte akzeptieren Sie die Datenschutzerklärung",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataPayload = {
        type: "inquiry",
        anliegen,
        kontakt,
        unternehmen: {
          ...unternehmen,
          foerderRelevant: showFoerderFelder,
        },
        beschreibung,
      };

      // Send email notification
      const { error } = await supabase.functions.invoke("send-inquiry-email", {
        body: formDataPayload,
      });

      if (error) throw error;

      // Send to Odoo CRM (non-blocking)
      supabase.functions.invoke("odoo-crm-lead", {
        body: {
          type: "kontakt",
          data: formDataPayload,
        },
      }).then(({ error: odooError }) => {
        if (odooError) {
          console.error("Odoo CRM error:", odooError);
        } else {
          console.log("Lead successfully sent to Odoo CRM");
        }
      });

      trackFormSubmission("inquiry_form", true);

      toast({
        title: "Anfrage erfolgreich gesendet!",
        description: "Vielen Dank! Ein persönlicher Ansprechpartner wird sich zeitnah bei Ihnen melden.",
      });

      // Reset form
      setAnliegen([]);
      setKontakt({
        name: "",
        funktion: "",
        unternehmen: "",
        email: "",
        telefon: "",
        adresse: "",
      });
      setUnternehmen({
        branche: "",
        website: "",
        gruendungsdatum: "",
        mitarbeiter: "",
        umsatz: "",
        umsatzFreitext: "",
      });
      setBeschreibung("");
      setDatenschutzAkzeptiert(false);

      onSuccess?.();
    } catch (error: any) {
      console.error("Error sending inquiry:", error);
      trackFormSubmission("inquiry_form", false);

      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1 - Anliegen */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">1. Ihr Anliegen</h3>
          <p className="text-sm text-muted-foreground">Wählen Sie alle zutreffenden Bereiche aus *</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {ANLIEGEN_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-3">
              <Checkbox
                id={`anliegen-${option}`}
                checked={anliegen.includes(option)}
                onCheckedChange={(checked) => handleAnliegenChange(option, checked as boolean)}
              />
              <Label
                htmlFor={`anliegen-${option}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 - Kontaktdaten */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">2. Ansprechpartner & Kontaktdaten</h3>
          <p className="text-sm text-muted-foreground">Alle Felder sind Pflichtfelder *</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vor- und Nachname *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Max Mustermann"
              value={kontakt.name}
              onChange={handleKontaktChange}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="funktion">Funktion / Rolle im Unternehmen *</Label>
            <Input
              id="funktion"
              name="funktion"
              placeholder="Geschäftsführer, IT-Leiter, etc."
              value={kontakt.funktion}
              onChange={handleKontaktChange}
              required
              className="bg-background"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unternehmen">Unternehmen *</Label>
          <Input
            id="unternehmen"
            name="unternehmen"
            placeholder="Firmenname GmbH"
            value={kontakt.unternehmen}
            onChange={handleKontaktChange}
            required
            className="bg-background"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="max.mustermann@firma.de"
              value={kontakt.email}
              onChange={handleKontaktChange}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefon">Telefonnummer *</Label>
            <Input
              id="telefon"
              name="telefon"
              type="tel"
              placeholder="+49 123 456789"
              value={kontakt.telefon}
              onChange={handleKontaktChange}
              required
              className="bg-background"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse *</Label>
          <Input
            id="adresse"
            name="adresse"
            placeholder="Straße, PLZ Ort"
            value={kontakt.adresse}
            onChange={handleKontaktChange}
            required
            className="bg-background"
          />
        </div>
      </div>

      {/* Section 3 - Unternehmensdaten */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">3. Unternehmensdaten</h3>
          <p className="text-sm text-muted-foreground">
            {showFoerderFelder 
              ? "Für die Prüfung von Fördermöglichkeiten benötigen wir zusätzliche Angaben *" 
              : "Optionale Angaben für eine bessere Beratung"}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="branche">Branche</Label>
            <Input
              id="branche"
              name="branche"
              placeholder="z.B. Einzelhandel, Handwerk, Gesundheit"
              value={unternehmen.branche}
              onChange={handleUnternehmenChange}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              placeholder="www.ihre-firma.de"
              value={unternehmen.website}
              onChange={handleUnternehmenChange}
              className="bg-background"
            />
          </div>
        </div>

        {/* Förder-spezifische Felder */}
        {showFoerderFelder && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">
              Für die Förderprüfung benötigen wir folgende Angaben:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gruendungsdatum">Gründungsdatum des Unternehmens *</Label>
                <Input
                  id="gruendungsdatum"
                  name="gruendungsdatum"
                  type="date"
                  value={unternehmen.gruendungsdatum}
                  onChange={handleUnternehmenChange}
                  required={showFoerderFelder}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mitarbeiter">Anzahl der Mitarbeitenden *</Label>
                <Select
                  value={unternehmen.mitarbeiter}
                  onValueChange={(value) =>
                    setUnternehmen((prev) => ({ ...prev, mitarbeiter: value }))
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Bitte auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {MITARBEITER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="umsatz">Vorjahresumsatz *</Label>
              <Select
                value={unternehmen.umsatz}
                onValueChange={(value) =>
                  setUnternehmen((prev) => ({ ...prev, umsatz: value }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Bitte auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {UMSATZ_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {unternehmen.umsatz === "Andere" && (
              <div className="space-y-2">
                <Label htmlFor="umsatzFreitext">Umsatz (Freitext) *</Label>
                <Input
                  id="umsatzFreitext"
                  name="umsatzFreitext"
                  placeholder="Bitte Umsatz angeben"
                  value={unternehmen.umsatzFreitext}
                  onChange={handleUnternehmenChange}
                  required={unternehmen.umsatz === "Andere"}
                  className="bg-background"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 4 - Freitext */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">4. Ihr Anliegen im Detail</h3>
          <p className="text-sm text-muted-foreground">Beschreiben Sie kurz Ihr Vorhaben oder Ihre Fragen</p>
        </div>
        <Textarea
          placeholder="Beschreiben Sie hier kurz Ihr Anliegen, aktuelle Herausforderungen oder konkrete Fragen..."
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          rows={5}
          className="bg-background resize-none"
        />
      </div>

      {/* Section 5 - Datenschutz */}
      <div className="space-y-4">
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-semibold text-foreground">5. Datenschutz & Absenden</h3>
        </div>
        <div className="flex items-start space-x-3">
          <Checkbox
            id="datenschutz"
            checked={datenschutzAkzeptiert}
            onCheckedChange={(checked) => setDatenschutzAkzeptiert(checked as boolean)}
          />
          <Label htmlFor="datenschutz" className="text-sm font-normal leading-relaxed cursor-pointer">
            Ich habe die{" "}
            <Link to="/datenschutz" className="text-primary underline hover:no-underline">
              Datenschutzerklärung
            </Link>{" "}
            gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu. *
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Anfrage wird gesendet...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Verbindliche Anfrage senden
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ein persönlicher Ansprechpartner wird sich innerhalb von 24 Stunden bei Ihnen melden.
        </p>
      </div>
    </form>
  );
};

export default InquiryForm;
