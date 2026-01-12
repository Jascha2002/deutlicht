import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Download, 
  Eye, 
  Loader2,
  CheckCircle2,
  Building2,
  Calendar,
  Euro
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KlarheitsCheckData } from "./types";
import { berechneAngebot, formatCurrency, getBranchenPaketByIndustry } from "@/data/branchenPakete";
import { useToast } from "@/hooks/use-toast";

interface OfferPreviewProps {
  data: KlarheitsCheckData;
  onDownload?: () => void;
}

const OfferPreview = ({ data, onDownload }: OfferPreviewProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfHtml, setPdfHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const kalkulation = berechneAngebot(
    data.industry || "Sonstiges",
    data.company_size || "1-10",
    data.project_start || "1-3-monate"
  );

  const paket = getBranchenPaketByIndustry(data.industry || "Sonstiges");

  const generatePdf = async () => {
    setIsGenerating(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-offer-pdf', {
        body: { data }
      });

      if (error) throw error;

      if (response?.html) {
        setPdfHtml(response.html);
        
        // Use html2pdf.js to generate PDF
        const html2pdf = (await import('html2pdf.js')).default;
        
        const element = document.createElement('div');
        element.innerHTML = response.html;
        document.body.appendChild(element);

        const opt = {
          margin: 0,
          filename: `DeutLicht-Angebot-${data.company_name || 'Kunde'}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
          pagebreak: { mode: 'css' as const }
        };

        await html2pdf().set(opt).from(element).save();
        
        document.body.removeChild(element);

        toast({
          title: "PDF erstellt!",
          description: "Ihr Angebot wurde heruntergeladen.",
        });

        onDownload?.();
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Fehler beim Erstellen",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewOffer = async () => {
    setIsGenerating(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-offer-pdf', {
        body: { data }
      });

      if (error) throw error;

      if (response?.html) {
        setPdfHtml(response.html);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Fehler beim Laden der Vorschau",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ihr Paket</p>
              <p className="font-semibold text-lg">DeutLicht {paket.botName}</p>
              <p className="text-sm text-muted-foreground">{paket.branche}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Euro className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Einmalig</p>
              <p className="font-semibold text-lg">{formatCurrency(kalkulation.einmalpreisFinal)}</p>
              <p className="text-sm text-muted-foreground">+ {formatCurrency(kalkulation.gesamtMonatlich)}/Monat</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Umsetzung</p>
              <p className="font-semibold text-lg">{paket.umsetzungWochen} Wochen</p>
              <p className="text-sm text-muted-foreground">Bis {kalkulation.umsetzungEnde}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Kostenübersicht
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Basispreis ({paket.botName})</span>
            <span className="font-medium">{formatCurrency(kalkulation.basispreis)}</span>
          </div>
          
          {kalkulation.unternehmenfaktor !== 1 && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Unternehmensgröße (×{kalkulation.unternehmenfaktor.toFixed(1)})</span>
              <span className="font-medium text-primary">
                +{formatCurrency(Math.round(kalkulation.basispreis * (kalkulation.unternehmenfaktor - 1)))}
              </span>
            </div>
          )}
          
          {kalkulation.zeitfaktor !== 1 && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">
                {kalkulation.zeitfaktor > 1 ? 'Express-Zuschlag' : 'Planungs-Rabatt'} (×{kalkulation.zeitfaktor.toFixed(2)})
              </span>
              <span className={`font-medium ${kalkulation.zeitfaktor > 1 ? 'text-primary' : 'text-green-600'}`}>
                {kalkulation.zeitfaktor > 1 ? '+' : ''}{formatCurrency(Math.round(kalkulation.basispreis * kalkulation.unternehmenfaktor * (kalkulation.zeitfaktor - 1)))}
              </span>
            </div>
          )}
          
          <div className="flex justify-between py-3 bg-muted/50 rounded-lg px-3 -mx-3">
            <span className="font-semibold">Einmalkosten gesamt</span>
            <span className="font-bold text-lg text-primary">{formatCurrency(kalkulation.einmalpreisFinal)}</span>
          </div>

          <div className="pt-4 mt-4 border-t">
            <h4 className="font-medium mb-3">Monatliche Kosten</h4>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Betrieb & Support</span>
              <span className="font-medium">{formatCurrency(kalkulation.monatspreisFinal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Hosting (Onepager + Service)</span>
              <span className="font-medium">{formatCurrency(kalkulation.hostingKosten)}</span>
            </div>
            <div className="flex justify-between py-3 bg-accent/10 rounded-lg px-3 -mx-3 mt-2">
              <span className="font-semibold">Monatlich gesamt</span>
              <span className="font-bold text-lg text-accent">{formatCurrency(kalkulation.gesamtMonatlich)}/Monat</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Enthaltene Leistungen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {paket.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 py-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={previewOffer}
          variant="outline"
          disabled={isGenerating}
          className="flex-1 gap-2"
        >
          {isGenerating && !showPreview ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          Vorschau anzeigen
        </Button>
        
        <Button 
          onClick={generatePdf}
          disabled={isGenerating}
          className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isGenerating && showPreview ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          PDF herunterladen
        </Button>
      </div>

      {/* Preview Modal */}
      {showPreview && pdfHtml && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Angebotsvorschau</h3>
              <div className="flex gap-2">
                <Button onClick={generatePdf} size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  PDF herunterladen
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Schließen
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe 
                srcDoc={pdfHtml}
                className="w-full h-full"
                title="Angebotsvorschau"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferPreview;
