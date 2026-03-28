import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export type DocumentType = 'angebot' | 'auftragsbestaetigung' | 'rechnung';

const DOC_LABELS: Record<DocumentType, string> = {
  angebot: 'Angebot',
  auftragsbestaetigung: 'Auftragsbestätigung',
  rechnung: 'Rechnung',
};

export function useDocumentPdf() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocument = async (
    type: DocumentType,
    data: any,
    options?: { preview?: boolean }
  ): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-document-pdf', {
        body: { type, data },
      });
      if (error) throw error;
      if (!result?.success) throw new Error(result?.error || 'Fehler');

      if (!result.html) throw new Error('Kein HTML erhalten');

      const label = DOC_LABELS[type];

      if (options?.preview) {
        // Open preview in new window
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(result.html);
          win.document.close();
          win.document.title = `${label} – DeutLicht`;
        }
        toast({ title: 'Vorschau geöffnet', description: `${label} wird im neuen Fenster angezeigt.` });
        return result.html;
      }

      // Generate actual downloadable PDF using html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default;

      const container = document.createElement('div');
      const parser = new DOMParser();
      const doc = parser.parseFromString(result.html, 'text/html');
      while (doc.body.firstChild) {
        container.appendChild(doc.body.firstChild);
      }
      // Copy styles
      const styles = doc.querySelectorAll('style');
      styles.forEach(style => container.prepend(style.cloneNode(true)));

      document.body.appendChild(container);

      const customerName = data.customer?.companyName || data.customer?.contactName || 'Kunde';
      const docNum = data.offerNumber || data.invoiceNumber || '';
      const filename = `DeutLicht-${label}${docNum ? `-${docNum}` : ''}-${customerName}.pdf`
        .replace(/[^a-zA-Z0-9äöüÄÖÜß\-_.]/g, '_');

      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        pagebreak: { mode: 'css' as const },
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);

      toast({
        title: `${label} heruntergeladen`,
        description: `${filename} wurde als PDF gespeichert.`,
      });

      return result.html;
    } catch (err) {
      console.error('PDF error:', err);
      toast({
        title: 'Fehler',
        description: 'Dokument konnte nicht erstellt werden.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const offerToData = async (offerId: string) => {
    const { data: offer } = await supabase
      .from('crm_offers')
      .select('*, crm_companies(company_name,email,phone,street,street_number,postal_code,city,contact_person_name,website), crm_leads(company_name,contact_email,contact_phone,contact_first_name,contact_last_name)')
      .eq('id', offerId)
      .single();
    if (!offer) return null;

    const co = offer.crm_companies;
    const le = offer.crm_leads;
    const customer = {
      companyName: co?.company_name || le?.company_name || '',
      contactName: co?.contact_person_name || [le?.contact_first_name, le?.contact_last_name].filter(Boolean).join(' ') || '',
      street: co ? `${co.street || ''} ${co.street_number || ''}`.trim() : '',
      postalCode: co?.postal_code || '',
      city: co?.city || '',
      email: co?.email || le?.contact_email || '',
      phone: co?.phone || le?.contact_phone || '',
      website: co?.website || '',
    };

    const raw = offer.line_items;
    let lineItems: any[] = [];
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const arr = Array.isArray(parsed) ? parsed : (parsed?.items || []);
      lineItems = arr.map((item: any) => ({
        title: item.title || item.bezeichnung || item.name || 'Leistung',
        description: item.description || item.beschreibung || '',
        qty: item.menge || item.quantity || 1,
        amount: item.setup || item.einmalig || item.amount_setup || item.amount || 0,
        priceType: (item.monthly > 0 || item.monatlich > 0) ? 'monatlich' : 'einmalig',
      }));
    } catch { /* ignore parse errors */ }

    return {
      offerNumber: offer.offer_number || offer.id,
      offerDate: offer.valid_from,
      validUntil: offer.valid_until,
      projectTitle: offer.title,
      introText: offer.description,
      customer,
      lineItems,
    };
  };

  const invoiceToData = async (invoiceId: string) => {
    const { data: inv } = await supabase
      .from('crm_invoices')
      .select('*, crm_companies(company_name,email,phone,street,street_number,postal_code,city,contact_person_name), crm_orders(order_date)')
      .eq('id', invoiceId)
      .single();
    if (!inv) return null;

    const co = inv.crm_companies;
    const customer = {
      companyName: co?.company_name || '',
      contactName: co?.contact_person_name || '',
      street: co ? `${co.street || ''} ${co.street_number || ''}`.trim() : '',
      postalCode: co?.postal_code || '',
      city: co?.city || '',
    };

    let lineItems: any[] = [];
    try {
      const raw = inv.line_items;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const arr = Array.isArray(parsed) ? parsed : (parsed?.items || []);
      if (arr.length > 0) {
        lineItems = arr.map((item: any) => ({
          title: item.title || item.bezeichnung || 'Leistung',
          description: item.description || item.beschreibung || '',
          qty: item.menge || item.quantity || 1,
          amount: item.einmalig || item.setup || item.amount || 0,
          isDiscount: item.isDiscount || false,
        }));
      }
    } catch { /* ignore parse errors */ }

    if (lineItems.length === 0) {
      lineItems = [{ title: inv.title || 'Leistungen gemäß Auftrag', qty: 1, amount: inv.amount_net || 0 }];
    }

    return {
      invoiceNumber: inv.invoice_number || inv.id,
      invoiceDate: inv.invoice_date,
      serviceDate: inv.invoice_date,
      dueDate: inv.due_date,
      vatRate: inv.tax_rate || 19,
      orderDate: inv.crm_orders?.order_date,
      customer,
      lineItems,
    };
  };

  return { generateDocument, offerToData, invoiceToData, isGenerating };
}
