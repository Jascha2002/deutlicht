import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Save, X, FileText, Printer, Copy, CheckCircle, FileDown, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { GesamtAnalyse } from '@/lib/analysisEngine';
import { generateBeratungsberichtMarkdown } from '@/lib/reportGenerator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
  const [isEditing, setIsEditing] = useState(true); // Start im Editor-Modus
  const [editedReport, setEditedReport] = useState('');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  // Initialize editor with original report
  useEffect(() => {
    if (!editedReport) {
      setEditedReport(originalReport);
    }
  }, [originalReport]);

  const displayReport = editedReport || originalReport;

  const handleEditorChange = (value: string) => {
    setEditedReport(value);
    setHasChanges(value !== originalReport);
  };

  const handleResetToOriginal = () => {
    if (confirm('Möchten Sie alle Änderungen verwerfen und den Originalbericht wiederherstellen?')) {
      setEditedReport(originalReport);
      setHasChanges(false);
      toast({
        title: 'Zurückgesetzt',
        description: 'Der Originalbericht wurde wiederhergestellt.'
      });
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([displayReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Beratungsbericht_${formData.stammdaten?.unternehmensname || 'Unbenannt'}_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Markdown heruntergeladen',
      description: 'Der Beratungsbericht wurde als .md-Datei gespeichert.'
    });
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([displayReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Beratungsbericht_${formData.stammdaten?.unternehmensname || 'Unbenannt'}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Textdatei heruntergeladen',
      description: 'Der Beratungsbericht wurde als .txt-Datei gespeichert.'
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
          <title>Beratungsbericht - ${formData.stammdaten?.unternehmensname || 'Unbenannt'}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 2rem; 
              max-width: 800px; 
              margin: 0 auto; 
              line-height: 1.6;
            }
            pre { 
              white-space: pre-wrap; 
              word-wrap: break-word; 
              line-height: 1.5; 
            }
            @media print {
              body { padding: 0; }
            }
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack} size="sm" className="gap-1">
              <X size={16} />
              Schließen
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Beratungsbericht Editor</h2>
                <p className="text-xs text-muted-foreground">
                  {formData.stammdaten?.unternehmensname || 'Unbenannt'} 
                  {hasChanges && <span className="text-warning ml-2">• Ungespeicherte Änderungen</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {hasChanges && (
              <Button variant="outline" onClick={handleResetToOriginal} size="sm" className="gap-1">
                <RotateCcw size={14} />
                Zurücksetzen
              </Button>
            )}
            <Button variant="outline" onClick={handleCopy} size="sm" className="gap-1">
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Kopiert!' : 'Kopieren'}
            </Button>
            <Button variant="outline" onClick={handlePrint} size="sm" className="gap-1">
              <Printer size={14} />
              Drucken
            </Button>
            <Button variant="outline" onClick={handleDownloadTxt} size="sm" className="gap-1">
              <FileDown size={14} />
              .txt
            </Button>
            <Button onClick={handleDownloadMarkdown} size="sm" className="gap-1">
              <Download size={14} />
              .md
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-card">
              <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Edit size={14} />
                  Editor
                </span>
                <span className="text-xs text-muted-foreground">
                  {displayReport.length.toLocaleString()} Zeichen
                </span>
              </div>
              <textarea
                ref={editorRef}
                value={editedReport}
                onChange={(e) => handleEditorChange(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-0 border-0"
                style={{ minHeight: '100%' }}
                spellCheck={false}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col bg-muted/10">
              <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText size={14} />
                  Vorschau
                </span>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                  {displayReport}
                </pre>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Score Summary Bar */}
      <div className="bg-card border-t px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{analysis.gesamtscore}</div>
              <div className="text-xs text-muted-foreground">Gesamtscore</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{analysis.staerken.length}</div>
              <div className="text-xs text-muted-foreground">Stärken</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-destructive">{analysis.schwaechen.length}</div>
              <div className="text-xs text-muted-foreground">Potenziale</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{analysis.empfehlungen.length}</div>
              <div className="text-xs text-muted-foreground">Empfehlungen</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Erstellt am {new Date().toLocaleDateString('de-DE', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} durch DeutLicht
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeratungsberichtView;
