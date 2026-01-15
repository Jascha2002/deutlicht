import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileCheck, 
  PenTool, 
  CheckCircle2, 
  FileText, 
  Loader2,
  Download,
  ExternalLink
} from "lucide-react";

const AngebotsAnnahme = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: searchParams.get("name") || "",
    company: searchParams.get("company") || "",
    email: searchParams.get("email") || "",
    agbAccepted: false,
    datenschutzAccepted: false
  });
  
  const offerId = searchParams.get("offerId") || "";
  const offerNumber = searchParams.get("offerNumber") || "";
  const totalAmount = searchParams.get("amount") || "0";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus.");
      return;
    }
    
    if (!formData.agbAccepted || !formData.datenschutzAccepted) {
      toast.error("Bitte akzeptieren Sie die AGB und Datenschutzerklärung.");
      return;
    }
    
    if (!hasSignature) {
      toast.error("Bitte unterschreiben Sie das Angebot.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas?.toDataURL("image/png");
      
      const { error } = await supabase.functions.invoke("accept-offer", {
        body: {
          offerId,
          offerNumber,
          totalAmount,
          fullName: formData.fullName,
          company: formData.company,
          email: formData.email,
          signature: signatureDataUrl,
          acceptedAt: new Date().toISOString(),
          agbAccepted: formData.agbAccepted,
          datenschutzAccepted: formData.datenschutzAccepted
        }
      });
      
      if (error) throw error;
      
      setIsAccepted(true);
      toast.success("Angebot erfolgreich angenommen! Sie erhalten eine Auftragsbestätigung per E-Mail.");
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Fehler beim Annehmen des Angebots. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAccepted) {
    return (
      <>
        <Helmet>
          <title>Angebot angenommen | DeutLicht®</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <Navigation />
        
        <section className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Vielen Dank für Ihr Vertrauen!
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Ihr Angebot <strong className="text-foreground">{offerNumber}</strong> wurde erfolgreich angenommen.
              </p>
              
              <Card className="mb-8 text-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Nächste Schritte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Auftragsbestätigung per E-Mail</p>
                      <p className="text-sm text-muted-foreground">
                        Sie erhalten in Kürze eine detaillierte Auftragsbestätigung an {formData.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Kick-off Termin</p>
                      <p className="text-sm text-muted-foreground">
                        Wir melden uns innerhalb von 24 Stunden für ein Abstimmungsgespräch
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Projektstart</p>
                      <p className="text-sm text-muted-foreground">
                        Nach dem Kick-off beginnen wir mit der Umsetzung Ihres Projekts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate("/")} variant="outline">
                  Zur Startseite
                </Button>
                <Button onClick={() => navigate("/kontakt")}>
                  Kontakt aufnehmen
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Angebot annehmen | DeutLicht®</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navigation />
      
      <section className="pt-32 pb-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Angebot annehmen
                </h1>
                <p className="text-xl text-muted-foreground">
                  Bestätigen Sie das Angebot mit Ihrer digitalen Unterschrift
                </p>
              </div>
            </ScrollReveal>
            
            {/* Angebots-Info */}
            <ScrollReveal delay={0.1}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Angebotsübersicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Angebotsnummer</p>
                      <p className="font-semibold">{offerNumber || "–"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
                      <p className="font-semibold text-primary">
                        {parseFloat(totalAmount).toLocaleString("de-DE")} € netto
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unternehmen</p>
                      <p className="font-semibold">{formData.company || "–"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ansprechpartner</p>
                      <p className="font-semibold">{formData.fullName || "–"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
            
            {/* Persönliche Daten */}
            <ScrollReveal delay={0.2}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Ihre Daten bestätigen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Vollständiger Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Max Mustermann"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Unternehmen</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Firma GmbH"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="max@beispiel.de"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
            
            {/* Unterschrift */}
            <ScrollReveal delay={0.3}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    Digitale Unterschrift
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unterschreiben Sie mit der Maus oder dem Finger im Feld unten:
                  </p>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-2 bg-white">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full touch-none cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      {hasSignature ? "✓ Unterschrift vorhanden" : "Noch keine Unterschrift"}
                    </p>
                    <Button variant="outline" size="sm" onClick={clearSignature}>
                      Unterschrift löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
            
            {/* AGB & Datenschutz */}
            <ScrollReveal delay={0.4}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Rechtliche Bestätigungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="agb"
                      checked={formData.agbAccepted}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agbAccepted: checked as boolean })
                      }
                    />
                    <Label htmlFor="agb" className="text-sm leading-relaxed cursor-pointer">
                      Ich habe die{" "}
                      <a 
                        href="/agb" 
                        target="_blank" 
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Allgemeinen Geschäftsbedingungen (AGB)
                        <ExternalLink className="w-3 h-3" />
                      </a>{" "}
                      gelesen und akzeptiere diese. *
                    </Label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="datenschutz"
                      checked={formData.datenschutzAccepted}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, datenschutzAccepted: checked as boolean })
                      }
                    />
                    <Label htmlFor="datenschutz" className="text-sm leading-relaxed cursor-pointer">
                      Ich habe die{" "}
                      <a 
                        href="/datenschutz" 
                        target="_blank" 
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Datenschutzerklärung
                        <ExternalLink className="w-3 h-3" />
                      </a>{" "}
                      gelesen und stimme der Verarbeitung meiner Daten zu. *
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
            
            {/* Submit Button */}
            <ScrollReveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.agbAccepted || !formData.datenschutzAccepted || !hasSignature}
                  className="min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird verarbeitet...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Angebot verbindlich annehmen
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Mit dem Klick auf "Angebot verbindlich annehmen" schließen Sie einen Vertrag 
                mit der Stadtnetz UG (haftungsbeschränkt) ab.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default AngebotsAnnahme;