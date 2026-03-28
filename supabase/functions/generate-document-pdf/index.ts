import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEUTLICHT = {
  brand: "DeutLicht®",
  tagline: "Kreativ, individuell, erfolgreich – Ihre Agentur für Wachstum",
  legal: "Stadtnetz UG (haftungsbeschränkt)",
  tradingAs: "handelnd unter der Marke DeutLicht®",
  street: "Gemeindeweg 4 (Mäuseturm)",
  city: "07546 Gera (Deutschland)",
  gf: "Carsten van de Sand",
  phone: "+49 178 5549216",
  email: "info@deutlicht.de",
  taxNumber: "161/120/05343",
  hrb: "HRB 514530",
  court: "Amtsgericht Jena",
  betriebsnummer: "90892833",
  iban: "HIER_IBAN_EINTRAGEN",
  bic: "HIER_BIC_EINTRAGEN",
};

function escapeHtml(t: string | undefined | null): string {
  if (!t) return "";
  return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount) + " €";
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function today(): string { return formatDate(new Date()); }

const CSS = `
  @page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:10pt;line-height:1.5;background:white}
  .page{width:210mm;min-height:297mm;padding:18mm 20mm 30mm 20mm;position:relative;background:white;page-break-after:always}
  .page:last-child{page-break-after:auto}
  .doc-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6mm;padding-bottom:4mm;border-bottom:1.5px solid #1a1a1a}
  .logo-text{font-size:22pt;font-weight:700;color:#1a1a1a}
  .logo-sub{font-size:8.5pt;color:#555;font-style:italic;margin-top:2px}
  .doc-type{font-size:20pt;font-weight:700;color:#1a1a1a;margin:6mm 0 2mm 0}
  .doc-ref{font-size:10pt;color:#555;margin-bottom:6mm}
  .address-grid{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin:6mm 0}
  .address-block label{font-size:8.5pt;font-weight:700;color:#1a1a1a;display:block;margin-bottom:3px}
  .address-block p{font-size:10pt;color:#1a1a1a;line-height:1.6;margin:0}
  .doc-date{margin:5mm 0 4mm 0;font-size:10pt}
  .doc-intro{margin:3mm 0 5mm 0;font-size:10pt;line-height:1.6}
  .section-title{font-size:10pt;font-weight:700;color:#0055cc;text-transform:uppercase;letter-spacing:.5px;border-bottom:1.5px solid #0055cc;padding-bottom:3px;margin:6mm 0 4mm 0}
  .lit{width:100%;border-collapse:collapse;margin:3mm 0;font-size:9.5pt}
  .lit th{background:#0055cc;color:white;padding:7px 10px;text-align:left;font-weight:600;font-size:9pt}
  .lit th.r{text-align:right}
  .lit td{padding:8px 10px;border-bottom:1px solid #e8e8e8;vertical-align:top}
  .lit td.r{text-align:right;white-space:nowrap}
  .it{font-weight:600;color:#1a1a1a}
  .id{font-size:8.5pt;color:#666;margin-top:2px}
  .pc{color:#1a1a1a;font-weight:600}
  .incl{color:#28a745;font-weight:600}
  .sub td{background:#f5f5f5;font-weight:600;border-top:1.5px solid #ccc;border-bottom:none}
  .tr-row{display:flex;justify-content:space-between;padding:3px 0;font-size:10pt;border-bottom:1px solid #eee}
  .tr-disc{color:#cc0000}
  .tr-net{font-weight:600}
  .tr-gross{font-size:12pt;font-weight:700;color:#0055cc;border-top:2px solid #0055cc;border-bottom:2px solid #0055cc;padding:5px 0;margin-top:2px}
  .steps{list-style:none;padding:0;margin:3mm 0}
  .steps li{padding:4px 0 4px 22px;position:relative;font-size:10pt;border-bottom:1px solid #f0f0f0}
  .steps li::before{content:attr(data-num);position:absolute;left:0;font-weight:700;color:#0055cc}
  .steps li.done::before{content:"✓";color:#28a745}
  .pay{background:#f0f5ff;border:1px solid #ccd9ff;border-radius:5px;padding:5mm;margin:4mm 0;font-size:10pt}
  .pay .iban{font-family:'Courier New',monospace;font-size:11pt;font-weight:600}
  .sig-line{border-bottom:1px solid #1a1a1a;margin:8mm 0 2mm 0}
  .sig-label{font-size:9pt;color:#555}
  .footer{position:absolute;bottom:8mm;left:20mm;right:20mm;font-size:7.5pt;color:#888;border-top:1px solid #ddd;padding-top:3mm;line-height:1.6}
  .notice{border-left:3px solid #0055cc;background:#f8faff;padding:4mm 5mm;margin:4mm 0;font-size:9.5pt}
  .acc-box{border:1.5px solid #1a1a1a;border-radius:5px;padding:5mm;margin:5mm 0}
  .acc-pos{margin:2mm 0;font-size:9.5pt}
  .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-top:6mm}
  .opt{width:100%;border-collapse:collapse;font-size:9.5pt;margin:3mm 0}
  .opt th{background:#f5f5f5;padding:6px 8px;text-align:left;font-weight:600;border-bottom:1.5px solid #ddd;font-size:9pt}
  .opt th.r{text-align:right}
  .opt td{padding:7px 8px;border-bottom:1px solid #eee;vertical-align:top}
  .opt td.r{text-align:right}
  .ot{font-weight:600}
  .od{font-size:8.5pt;color:#666}
`;

function hdr(): string {
  return `<div class="doc-header"><div><div class="logo-text">${DEUTLICHT.brand}</div><div class="logo-sub">${DEUTLICHT.tagline}</div></div></div>`;
}

function ftr(n: string): string {
  return `<div class="footer">Pflichtangaben gemäß § 35a GmbHG: ${DEUTLICHT.legal} · Sitz: Gera · Registergericht: ${DEUTLICHT.court} · ${DEUTLICHT.hrb} · Geschäftsführer: ${DEUTLICHT.gf} · Steuernummer: ${DEUTLICHT.taxNumber} · Betriebsnummer: ${DEUTLICHT.betriebsnummer} · ${DEUTLICHT.brand} ist eine eingetragene bzw. angemeldete Marke der ${DEUTLICHT.legal}</div>`;
}

function addrBlock(label: string, lines: string[]): string {
  return `<div class="address-block"><label>${label}</label><p>${lines.filter(Boolean).join("<br>")}</p></div>`;
}

function renderItems(items: any[]): { html: string; setup: number; monthly: number; yearly: number } {
  let setup = 0, monthly = 0, yearly = 0;
  const html = items.map(item => {
    const qty = item.qty || 1;
    const amt = (item.amount || 0) * qty;
    if (item.priceType === "einmalig") setup += amt;
    else if (item.priceType === "monatlich") monthly += amt;
    else if (item.priceType === "jaehrlich") yearly += amt;
    const isIncl = item.amount === 0 || item.priceType === "inklusive";
    const priceStr = isIncl ? `<span class="incl">✓ inklusive</span>`
      : item.priceType === "monatlich" ? `<span class="pc">${formatCurrency(amt)} / Monat</span>`
      : item.priceType === "jaehrlich" ? `<span class="pc">${formatCurrency(amt)} / Jahr</span>`
      : `<span class="pc">${formatCurrency(amt)} einmalig</span>`;
    return `<tr><td><div class="it">${escapeHtml(item.title)}</div>${item.description ? `<div class="id">${escapeHtml(item.description)}</div>` : ""}</td><td class="r">${priceStr}</td></tr>`;
  }).join("");
  return { html, setup, monthly, yearly };
}

function generateAngebot(data: any): string {
  const c = data.customer;
  const { html: itemsHtml, setup, monthly, yearly } = renderItems(data.lineItems || []);
  const offerNum = escapeHtml(data.offerNumber);
  const offerDate = data.offerDate ? formatDate(data.offerDate) : today();
  const validDays = data.validDays || 14;

  const optHtml = (data.optionals || []).length > 0 ? buildOptionals(data.optionals) : "";

  const accItems = (data.lineItems || []).filter((i: any) => i.amount > 0 && i.priceType !== "inklusive").map((i: any, idx: number) => {
    const amt = (i.amount || 0) * (i.qty || 1);
    const priceStr = i.priceType === "monatlich" ? `${formatCurrency(amt)} netto / Monat`
      : i.priceType === "jaehrlich" ? `${formatCurrency(amt)} / Jahr`
      : `${formatCurrency(amt)} zzgl. 19 % MwSt.`;
    return `<div class="acc-pos">Position ${idx + 1}: ${escapeHtml(i.title)} — ${priceStr}</div>`;
  }).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="page">
  ${hdr()}
  <div class="doc-type">Angebot ${offerNum} für ${escapeHtml(data.projectTitle || "Ihre digitalen Leistungen")} für ${escapeHtml(c.companyName || c.name || "")}</div>
  ${c.website ? `<div class="doc-ref">${escapeHtml(c.companyName||"")} – ${escapeHtml(c.website)}</div>` : ""}
  <div class="address-grid">
    ${addrBlock("Auftraggeber:", [c.contactName, c.companyName, c.street, `${c.postalCode||""} ${c.city||""}`])}
    ${addrBlock("Auftragnehmer:", [DEUTLICHT.legal+" "+DEUTLICHT.tradingAs, DEUTLICHT.street, DEUTLICHT.city, "Geschäftsführer: "+DEUTLICHT.gf, "Telefon: "+DEUTLICHT.phone, "E-Mail: "+DEUTLICHT.email])}
  </div>
  <div class="doc-date">Gera, den ${offerDate}</div>
  <div class="doc-intro">${escapeHtml(data.introText || `wir haben für ${c.companyName||c.name||""} ein persönliches Paket zusammengestellt — mit allem, was Sie für einen soliden digitalen Auftritt benötigen.`)}</div>
  <div class="section-title">Ihr Paket</div>
  <table class="lit"><thead><tr><th>Leistung / Beschreibung</th><th class="r">Preis</th></tr></thead><tbody>
  ${itemsHtml}
    ${setup > 0 ? `<tr class="sub"><td>Einmalig gesamt:</td><td class="r">${formatCurrency(setup)}</td></tr>` : ""}
    ${yearly > 0 ? `<tr class="sub"><td>Jährlich laufend:</td><td class="r">${formatCurrency(yearly)} / Jahr</td></tr>` : ""}
    ${monthly > 0 ? `<tr class="sub"><td>Monatlich laufend:</td><td class="r">${formatCurrency(monthly)} / Monat</td></tr>` : ""}
  </tbody></table>
  <div class="notice">Alle Preise zzgl. 19 % MwSt.${data.vatNotes ? `<br>${escapeHtml(data.vatNotes)}` : ""}<br>Dieses Angebot ist freibleibend und gilt ${validDays} Tage ab Ausstellungsdatum.</div>
  ${optHtml}
  ${ftr(offerNum)}
  </div>

  <div class="page">
  ${hdr()}
  <div class="doc-type">Angebotsannahme</div>
  <div class="doc-intro">Hiermit nehme ich das Angebot ${offerNum} vom ${offerDate} verbindlich an.</div>
  <div class="acc-box">${accItems}</div>
  <div class="address-grid">
    ${addrBlock("Auftraggeber:", [c.contactName, c.companyName, c.street, `${c.postalCode||""} ${c.city||""}`])}
    <div>
    <div class="sig-line"></div>
    <div class="sig-label">Gera, den __________________________</div>
    <div class="sig-line"></div>
    <div class="sig-label">Unterschrift / Stempel</div>
    </div>
  </div>
  ${ftr(offerNum)}
  </div>

</body></html>`;
}

function generateAuftragsbestaetigung(data: any): string {
  const c = data.customer;
  const { html: itemsHtml, setup, monthly, yearly } = renderItems(data.lineItems || []);
  const offerNum = escapeHtml(data.offerNumber);
  const orderDate = data.orderDate ? formatDate(data.orderDate) : today();
  const steps = (data.nextSteps || [
    { label: "Rechnungsstellung für Einmalkosten" },
    { label: "Projektstart" },
    { label: "Umsetzung & Entwicklung" },
    { label: "Übergabe & Freigabe durch Auftraggeber" },
  ]).map((s: any, i: number) => `<li data-num="${i+1}.">${escapeHtml(s.label)}${s.note?` — ${escapeHtml(s.note)}`:""}</li>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="page">
  ${hdr()}
  <div class="doc-type">Auftragsbestätigung</div>
  <div class="doc-ref">zur Angebotsnummer ${offerNum}</div>
  <div class="address-grid">
    ${addrBlock("Auftraggeber:", [c.contactName, c.companyName, c.street, `${c.postalCode||""} ${c.city||""}`])}
    ${addrBlock("Auftragnehmer:", [DEUTLICHT.legal, DEUTLICHT.tradingAs, DEUTLICHT.street, DEUTLICHT.city, "Geschäftsführer: "+DEUTLICHT.gf, "Telefon: "+DEUTLICHT.phone, "E-Mail: "+DEUTLICHT.email])}
  </div>
  <div class="doc-date">Gera, den ${orderDate}</div>
  <div class="doc-intro">Wir bestätigen hiermit den am ${orderDate} ${data.orderType==="muendlich"?"mündlich":"schriftlich"} erteilten Auftrag durch ${escapeHtml(c.contactName||c.companyName||"")} (${escapeHtml(c.companyName||"")})${data.projectDescription?` zur ${escapeHtml(data.projectDescription)}`:""} gemäß Angebot ${offerNum} vom ${data.offerDate?formatDate(data.offerDate):orderDate}.</div>
  <div class="section-title">Beauftragte Leistungen</div>
  <table class="lit"><thead><tr><th>Leistung / Beschreibung</th><th class="r">Preis</th></tr></thead><tbody>
  ${itemsHtml}
    ${setup>0?`<tr class="sub"><td>Einmalig gesamt:</td><td class="r">${formatCurrency(setup)}</td></tr>`:""}
    ${yearly>0?`<tr class="sub"><td>Jährlich laufend${data.yearlyNote?` (${escapeHtml(data.yearlyNote)})`:""}: </td><td class="r">${formatCurrency(yearly)} / Jahr</td></tr>`:""}
    ${monthly>0?`<tr class="sub"><td>Monatlich laufend:</td><td class="r">${formatCurrency(monthly)} / Monat</td></tr>`:""}
  </tbody></table>
  <div class="notice">Alle Preise zzgl. 19 % MwSt.${data.vatNotes?` · ${escapeHtml(data.vatNotes)}`:""}${data.billingNotes?`<br>Hinweis zur Rechnungsstellung: ${escapeHtml(data.billingNotes)}`:""}</div>
  <div class="section-title">Nächste Schritte</div>
  <ol class="steps">${steps}</ol>
  <div class="doc-intro" style="margin-top:6mm">Für Rückfragen stehen wir Ihnen jederzeit zur Verfügung.<br><br>Mit freundlichen Grüßen<br><br>${DEUTLICHT.gf}<br>Geschäftsführer ${DEUTLICHT.brand}<br>${DEUTLICHT.legal}</div>
  ${ftr(offerNum)}
  </div>

</body></html>`;
}

function generateRechnung(data: any): string {
  const c = data.customer;
  const invoiceNum = escapeHtml(data.invoiceNumber);
  const invoiceDate = data.invoiceDate ? formatDate(data.invoiceDate) : today();
  const serviceDate = data.serviceDate ? formatDate(data.serviceDate) : invoiceDate;
  const dueDate = data.dueDate ? formatDate(data.dueDate) : formatDate(new Date(Date.now()+14*86400000));
  const offerRef = escapeHtml(data.offerNumber||"");
  let netTotal=0, discount=0;
  const itemsHtml = (data.lineItems||[]).map((item: any, idx: number) => {
    const qty=item.qty||1, up=item.amount||0, lt=up*qty;
    if(item.isDiscount) discount+=lt; else netTotal+=lt;
    return `<tr><td>${idx+1}</td><td><div class="it">${escapeHtml(item.title)}</div>${item.description?`<div class="id">${escapeHtml(item.description)}</div>`:""}</td><td class="r">${qty}</td><td class="r">${item.isDiscount?`– ${formatCurrency(up)}`:formatCurrency(up)}</td><td class="r">${item.isDiscount?`– ${formatCurrency(lt)}`:formatCurrency(lt)}</td></tr>`;
  }).join("");
  const netAfter=netTotal-discount, vr=data.vatRate??19, va=Math.round(netAfter*vr)/100, gross=netAfter+va;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="page">
  ${hdr()}
  <div class="doc-type">Rechnung</div>
  <table style="width:100%;font-size:9.5pt;margin:4mm 0">
    <tr><td style="width:50%">Rechnungsnummer:</td><td><strong>${invoiceNum}</strong></td></tr>
    <tr><td>Rechnungsdatum:</td><td>${invoiceDate}</td></tr>
    <tr><td>Leistungsdatum:</td><td>${serviceDate}</td></tr>
    <tr><td>Zahlungsziel:</td><td>${dueDate}</td></tr>
    ${offerRef?`<tr><td>Referenz:</td><td>${offerRef}</td></tr>`:""}
  </table>
  <div class="address-grid">
    ${addrBlock("Rechnungsempfänger:", [c.contactName, c.companyName, c.street, `${c.postalCode||""} ${c.city||""}`])}
    ${addrBlock("Rechnungssteller:", [DEUTLICHT.legal, DEUTLICHT.tradingAs, DEUTLICHT.street, DEUTLICHT.city, "Geschäftsführer: "+DEUTLICHT.gf, "Telefon: "+DEUTLICHT.phone, "E-Mail: "+DEUTLICHT.email, "Steuernummer: "+DEUTLICHT.taxNumber])}
  </div>
  <div class="doc-date">Gera, den ${invoiceDate}</div>
  <div class="doc-intro">wir erlauben uns, Ihnen folgende Leistungen${offerRef?` gemäß Angebot ${offerRef}${data.orderDate?` und Auftragsbestätigung vom ${formatDate(data.orderDate)}`:""}`:"" } in Rechnung zu stellen:</div>
  <table class="lit"><thead><tr><th>Pos.</th><th>Beschreibung</th><th class="r">Menge</th><th class="r">Einzelpreis</th><th class="r">Gesamt</th></tr></thead><tbody>
  ${itemsHtml}
  </tbody></table>
  <div style="margin-top:4mm">
    ${discount>0?`<div class="tr-row"><span>Nettobetrag (vor Nachlass):</span><span>${formatCurrency(netTotal)}</span></div><div class="tr-row tr-disc"><span>Nachlass:</span><span>– ${formatCurrency(discount)}</span></div>`:""}
    <div class="tr-row tr-net"><span>Nettobetrag${discount>0?" (nach Nachlass)":""}:</span><span>${formatCurrency(netAfter)}</span></div>
    <div class="tr-row"><span>zzgl. ${vr} % MwSt.:</span><span>${formatCurrency(va)}</span></div>
    <div class="tr-row tr-gross"><span>Rechnungsbetrag brutto:</span><span>${formatCurrency(gross)}</span></div>
  </div>
  <div class="pay">
    <p>Bitte überweisen Sie den Betrag von <strong>${formatCurrency(gross)}</strong> bis zum <strong>${dueDate}</strong> auf folgendes Konto:</p>
    <table style="margin-top:3mm;font-size:10pt">
      <tr><td style="padding:2px 10px 2px 0">Kontoinhaber:</td><td>${DEUTLICHT.legal}</td></tr>
      <tr><td style="padding:2px 10px 2px 0">IBAN:</td><td class="iban">${DEUTLICHT.iban}</td></tr>
      <tr><td style="padding:2px 10px 2px 0">BIC:</td><td>${DEUTLICHT.bic}</td></tr>
      <tr><td style="padding:2px 10px 2px 0">Verwendungszweck:</td><td>${invoiceNum} / ${escapeHtml(c.companyName||c.contactName||"")}</td></tr>
    </table>
    <p style="margin-top:3mm">Bei Fragen: ${DEUTLICHT.email} · ${DEUTLICHT.phone}</p>
  </div>
  ${data.recurringNote?`<div class="notice">${escapeHtml(data.recurringNote)}</div>`:""}
  ${ftr(invoiceNum)}
  </div>

</body></html>`;
}

function buildOptionals(optionals: any[]): string {
  const groups: Record<string, any[]> = {};
  optionals.forEach((o: any) => { const c=o.category||"Sonstige"; if(!groups[c]) groups[c]=[]; groups[c].push(o); });
  return Object.entries(groups).map(([cat,items]) =>
    `<div class="section-title">${escapeHtml(cat)}</div>
    <table class="opt"><thead><tr><th>Leistung</th><th class="r">Einmalig</th><th class="r">Monatlich</th><th class="r">Wahl</th></tr></thead><tbody>
    ${items.map((item: any) => `<tr><td><div class="ot">${escapeHtml(item.title)}${item.recommended?" ★ Empfehlung":""}</div>${item.description?`<div class="od">${escapeHtml(item.description)}</div>`:""}</td><td class="r">${item.setupPrice?formatCurrency(item.setupPrice):"—"}</td><td class="r">${item.monthlyPrice?formatCurrency(item.monthlyPrice)+"/Monat":"—"}</td><td class="r">☐</td></tr>`).join("")}
    </tbody></table>`
  ).join("");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { type, data } = await req.json();
    if (!type || !data) return new Response(JSON.stringify({ error: "type und data erforderlich" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    let html = "";
    if (type === "angebot") html = generateAngebot(data);
    else if (type === "auftragsbestaetigung") html = generateAuftragsbestaetigung(data);
    else if (type === "rechnung") html = generateRechnung(data);
    else return new Response(JSON.stringify({ error: "Unbekannter Typ" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    return new Response(JSON.stringify({ success: true, html }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
