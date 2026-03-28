import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DocumentType = 'angebot' | 'auftragsbestaetigung' | 'rechnung';

export function useDocumentPdf() {
  const { toast } = useToast();

  const generateDocument = async (type: DocumentType, data: any): Promise<string | null> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-document-pdf', {
        body: { type, data },
      });
      if (error) throw error;
      if (!result?.success) throw new Error(result?.error || 'Fehler');

      if (result.html) {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(result.html);
          win.document.close();
          win.document.title = `${type === 'rechnung' ? 'Rechnung' : type === 'angebot' ? 'Angebot' : 'Auftragsbestätigung'} – DeutLicht`;
          setTimeout(() => win.print(), 600);
        }
        toast({ title: 'Dokument geöffnet', description: 'Strg+P → Als PDF speichern im neuen Fenster.' });
      }
      return result.html || null;
    } catch (error) {
      console.error('PDF error:', error);
      toast({ title: 'Fehler', description: 'Dokument konnte nicht erstellt werden.', variant: 'destructive' });
      return null;
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
      street: co ? `${co.street||''} ${co.street_number||''}`.trim() : '',
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
    } catch {}

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
      street: co ? `${co.street||''} ${co.street_number||''}`.trim() : '',
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
    } catch {}

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

  return { generateDocument, offerToData, invoiceToData };
}
