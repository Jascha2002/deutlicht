import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, ChevronDown, Loader2, FileCheck, Receipt, Eye, Download } from 'lucide-react';
import { useDocumentPdf } from '@/hooks/useDocumentPdf';

export function OfferPdfButton({ offerId, variant = 'outline' }: { offerId: string; variant?: 'default' | 'outline' | 'ghost' }) {
  const [loading, setLoading] = useState<string | null>(null);
  const { generateDocument, offerToData } = useDocumentPdf();

  const handle = async (type: 'angebot' | 'auftragsbestaetigung', preview = false) => {
    setLoading(type);
    try {
      const data = await offerToData(offerId);
      if (!data) return;
      if (type === 'auftragsbestaetigung') {
        await generateDocument('auftragsbestaetigung', {
          ...data,
          orderDate: new Date().toISOString(),
          orderType: 'muendlich',
          projectDescription: data.projectTitle ? `der ${data.projectTitle}` : 'der beauftragten Leistungen',
          billingNotes: 'Die Rechnung für die einmaligen Kosten wird Ihnen separat zugestellt.',
          nextSteps: [
            { label: 'Rechnungsstellung für Einmalkosten' },
            { label: 'Projektstart' },
            { label: 'Umsetzung & Entwicklung' },
            { label: 'Übergabe & Freigabe durch Auftraggeber' },
          ],
        }, { preview });
      } else {
        await generateDocument('angebot', data, { preview });
      }
    } finally {
      setLoading(null);
    }
  };

  if (loading) return <Button variant={variant} disabled><Loader2 className="h-4 w-4 animate-spin mr-2" />PDF wird erstellt...</Button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="gap-2">
          <FileText className="h-4 w-4" />
          PDF erstellen
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handle('angebot')} className="gap-2">
          <Download className="h-4 w-4" />
          Angebot PDF herunterladen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('angebot', true)} className="gap-2">
          <Eye className="h-4 w-4" />
          Angebot Vorschau
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handle('auftragsbestaetigung')} className="gap-2">
          <Download className="h-4 w-4" />
          Auftragsbestätigung PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle('auftragsbestaetigung', true)} className="gap-2">
          <Eye className="h-4 w-4" />
          Auftragsbestätigung Vorschau
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InvoicePdfButton({ invoiceId, variant = 'outline' }: { invoiceId: string; variant?: 'default' | 'outline' | 'ghost' }) {
  const [loading, setLoading] = useState(false);
  const { generateDocument, invoiceToData } = useDocumentPdf();

  const handle = async (preview = false) => {
    setLoading(true);
    try {
      const data = await invoiceToData(invoiceId);
      if (!data) return;
      await generateDocument('rechnung', data, { preview });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Receipt className="h-4 w-4" />}
          Rechnung PDF
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handle(false)} className="gap-2">
          <Download className="h-4 w-4" />
          Rechnung PDF herunterladen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle(true)} className="gap-2">
          <Eye className="h-4 w-4" />
          Rechnung Vorschau
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
