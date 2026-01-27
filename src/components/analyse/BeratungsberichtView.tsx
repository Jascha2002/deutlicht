import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Edit, Save, X, FileText, Printer, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { GesamtAnalyse } from '@/lib/analysisEngine';
import { generateBeratungsberichtMarkdown } from '@/lib/reportGenerator';

interface BeratungsberichtViewProps {
  analysis: GesamtAnalyse;
  formData: Record<string, Record<string, any>>;
  canEdit: boolean;
  onBack: () => void;
}

const BeratungsberichtView: React.FC<BeratungsberichtViewProps> = ({
  analysis,
  formData,
  canEdit,
  onBack
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate the report
  const fullClientData = {
    stammdaten: formData.stammdaten,
    online: formData.online,
    systeme: formData.systeme,
    prozesse: formData.prozesse,
    daten: formData.daten,
    social: formData.social,
    reporting: formData.reporting,
    schulung: formData.schulung,
    ziele: formData.ziele
  };

  const originalReport = generateBeratungsberichtMarkdown(fullClientData as any, analysis);
  const displayReport = editedReport || originalReport;

  const handleDownload = () => {
    const blob = new Blob([displayReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Beratungsbericht_${formData.stammdaten.unternehmensname || 'Unbenannt'}_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Bericht heruntergeladen',
      description: 'Der Beratungsbericht wurde als Markdown-Datei gespeichert.'
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Kopiert',
        description: 'Der Bericht wurde in die Zwischenablage kopiert.'
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Der Bericht konnte nicht kopiert werden.',
        variant: 'destructive'
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Beratungsbericht - ${formData.stammdaten.unternehmensname || 'Unbenannt'}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 2rem; max-width: 800px; margin: 0 auto; }
            pre { white-space: pre-wrap; word-wrap: break-word; line-height: 1.5; }
          </style>
        </head>
        <body>
          <pre>${displayReport}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleEdit = () => {
    setEditedReport(displayReport);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Änderungen gespeichert',
      description: 'Der Bericht wurde aktualisiert.'
    });
  };

  const handleCancel = () => {
    setEditedReport('');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <X size={18} />
              Zurück
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Beratungsbericht</h2>
                <p className="text-sm text-muted-foreground">
                  {formData.stammdaten.unternehmensname || 'Unbenannt'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {canEdit && !isEditing && (
              <Button variant="outline" onClick={handleEdit} className="gap-2">
                <Edit size={18} />
                Bearbeiten
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X size={18} />
                  Abbrechen
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save size={18} />
                  Speichern
                </Button>
              </>
            )}
            {!isEditing && (
              <>
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  {copied ? 'Kopiert!' : 'Kopieren'}
                </Button>
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                  <Printer size={18} />
                  Drucken
                </Button>
                <Button onClick={handleDownload} className="gap-2">
                  <Download size={18} />
                  Herunterladen
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
          {/* Score Summary */}
          <div className="p-6 border-b bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{analysis.gesamtscore}</div>
                <div className="text-sm text-muted-foreground">Gesamtscore</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analysis.staerken.length}</div>
                <div className="text-sm text-muted-foreground">Stärken</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive">{analysis.schwaechen.length}</div>
                <div className="text-sm text-muted-foreground">Potenziale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{analysis.empfehlungen.length}</div>
                <div className="text-sm text-muted-foreground">Empfehlungen</div>
              </div>
            </div>
          </div>

          {/* Report Text */}
          <div className="p-6">
            {isEditing ? (
              <Textarea
                value={editedReport}
                onChange={(e) => setEditedReport(e.target.value)}
                className="font-mono text-sm min-h-[600px] leading-relaxed"
              />
            ) : (
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                {displayReport}
              </pre>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Erstellt am {new Date().toLocaleDateString('de-DE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} durch DeutLicht Digitalisierungsberatung
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeratungsberichtView;
