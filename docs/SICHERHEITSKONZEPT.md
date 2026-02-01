# DeutLicht Sicherheitskonzept

**Version:** 1.0  
**Stand:** Februar 2026  
**Status:** Implementiert

---

## 1. Übersicht

Dieses Dokument beschreibt das umfassende Sicherheitskonzept für die DeutLicht Plattform. Es umfasst alle technischen und organisatorischen Maßnahmen zum Schutz von Daten, Systemen und Nutzern.

### 1.1 Schutzziele

- **Vertraulichkeit:** Nur autorisierte Personen haben Zugriff auf sensible Daten
- **Integrität:** Daten werden vor unbefugter Manipulation geschützt
- **Verfügbarkeit:** Systeme sind zuverlässig erreichbar
- **Authentizität:** Identitäten werden korrekt verifiziert

---

## 2. Authentifizierung & Zugriffskontrolle

### 2.1 Passwort-Sicherheit

#### Implementierte Maßnahmen:

| Maßnahme | Status | Beschreibung |
|----------|--------|--------------|
| **Have I Been Pwned Integration** | ✅ Aktiv | Passwörter werden bei der Registrierung gegen bekannte Datenlecks geprüft (k-Anonymität Verfahren) |
| **Passwort-Stärke-Indikator** | ✅ Aktiv | Echtzeit-Feedback zu Passwortqualität |
| **Mindestanforderungen** | ✅ Aktiv | Min. 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen |
| **E-Mail-Verifizierung** | ✅ Aktiv | Neue Konten müssen E-Mail bestätigen |

#### Technische Umsetzung (src/lib/passwordSecurity.ts):

```typescript
// K-Anonymität: Nur die ersten 5 Zeichen des SHA-1 Hash werden übertragen
// Das vollständige Passwort verlässt niemals den Client
const prefix = hashHex.substring(0, 5);
const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
```

**Kosten:** Kostenlos (HIBP API ist frei verfügbar)

### 2.2 Rollenbasierte Zugriffskontrolle (RBAC)

#### Rollenübersicht:

| Rolle | Rechte | Zugang |
|-------|--------|--------|
| **admin** | Vollzugriff auf alle Daten, Nutzerverwaltung, Partnerverwaltung | Backend-Dashboard |
| **mitarbeiter** | Lesen/Bearbeiten von Partner- und Kundendaten zur Betreuung | Admin-Dashboard (eingeschränkt) |
| **partner** | Eigene Referrals, Provisionen, Rechnungen | Partner-Dashboard |
| **kunde** | Eigene Projekte, Dateien, Support-Tickets | Kunden-Portal |

#### Implementierung:

```sql
-- Rollen werden in separater Tabelle gespeichert (nicht in profiles!)
CREATE TYPE public.app_role AS ENUM ('admin', 'mitarbeiter', 'partner', 'kunde');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Security Definer Funktion verhindert RLS-Rekursion
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
```

---

## 3. Row Level Security (RLS)

### 3.1 Aktive RLS-Policies

Alle sensiblen Tabellen haben aktivierte Row Level Security. Hier die wichtigsten:

#### Partner-Tabellen:

| Tabelle | Operation | Policy |
|---------|-----------|--------|
| `partners` | SELECT (eigene) | `user_id = auth.uid()` |
| `partners` | SELECT (alle) | Nur admin/mitarbeiter |
| `partners` | UPDATE (eigene) | `user_id = auth.uid()` |
| `partner_invoices` | INSERT | Validierung: partner_id gehört auth.uid() |
| `partner_invoices` | SELECT (eigene) | EXISTS-Subquery auf partners |
| `partner_commissions` | SELECT (eigene) | EXISTS-Subquery auf partners |
| `partner_referrals` | SELECT (eigene) | EXISTS-Subquery auf partners |

#### Analyse-Tabellen:

| Tabelle | Operation | Policy |
|---------|-----------|--------|
| `analysis_clients` | SELECT/INSERT/UPDATE | admin oder mitarbeiter + created_by |
| `analysis_intern` | ALL | Nur admin (sensible interne Notizen) |
| `analysis_*` (Module) | ALL | `can_access_client(client_id)` Funktion |

### 3.2 Sicherheitsfunktionen

```sql
-- Zentrale Zugriffsprüfung für Analyse-Clients
CREATE FUNCTION public.can_access_client(_client_id uuid)
RETURNS boolean
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR 
         public.has_role(auth.uid(), 'mitarbeiter')
$$;
```

#### Lead-Tracking (project_leads):

| Tabelle | Operation | Policy |
|---------|-----------|--------|
| `project_leads` | INSERT | Session-ID muss vorhanden sein (≥20 Zeichen) |
| `project_leads` | UPDATE | Nur eigene Session-ID |
| `project_leads` | SELECT | Nur admin/mitarbeiter (Leads sind für Nutzer nicht lesbar) |

**Hinweis:** Die `project_leads` Tabelle speichert auch abgebrochene Anfragen. Die internen Preisschätzungen (`internal_price_estimate_setup`, `internal_price_estimate_monthly`) sind nur für Mitarbeiter sichtbar – Kunden sehen keine exakten Preise.

---

## 4. Edge Functions Sicherheit

### 4.1 Öffentliche Endpunkte

Die folgenden Edge Functions sind bewusst öffentlich zugänglich (für Marketing-Website):

| Funktion | Zweck | Schutzmaßnahmen |
|----------|-------|-----------------|
| `send-contact-email` | Kontaktformular | Rate Limiting (5 req/IP/h), Input-Validierung |
| `send-inquiry-email` | Anfrage-Formular | Rate Limiting (5 req/IP/h), Input-Validierung |
| `deutlicht-chat` | KI-Chat | Server-seitiger API-Key, Input-Sanitization |
| `elevenlabs-tts` | Voice Demo | Server-seitiger API-Key |
| `generate-offer-pdf` | PDF-Erstellung | HTML-Sanitization |

**Begründung:** Diese Endpunkte müssen für anonyme Website-Besucher erreichbar sein. User-Authentifizierung würde den öffentlichen Charakter der Website einschränken.

### 4.2 Implementierte Schutzmaßnahmen

#### Rate Limiting (bereits implementiert):

```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 3600000; // 1 Stunde

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}
```

#### Input-Validierung:

```typescript
// Längenprüfung
if (text.length > 5000) {
  return { error: "Text zu lang" };
}

// HTML-Sanitization für PDF-Generierung
function sanitizeHtml(dirty: string): string {
  return dirty.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '');
}
```

---

## 5. Datenschutz (DSGVO)

### 5.1 Technische Maßnahmen

| Maßnahme | Status | Beschreibung |
|----------|--------|--------------|
| **Verschlüsselung at Rest** | ✅ | Supabase/Lovable Cloud verschlüsselt alle Daten |
| **Verschlüsselung in Transit** | ✅ | TLS 1.3 für alle Verbindungen |
| **Passwort-Hashing** | ✅ | bcrypt mit automatischem Salt |
| **Cookie-Banner** | ✅ | Einwilligung vor Tracking |
| **Datenschutzerklärung** | ✅ | /datenschutz |

### 5.2 Organisatorische Maßnahmen

- Rollen-basierte Zugriffskontrolle (nur notwendiger Zugriff)
- Separater Admin-Bereich für sensible Operationen
- Audit-Logging über created_at/updated_at Felder

---

## 6. API-Key Management

### 6.1 Secrets-Verwaltung

Alle API-Keys werden sicher in Lovable Cloud Secrets gespeichert:

| Secret | Verwendung | Zugriff |
|--------|------------|---------|
| `ELEVENLABS_API_KEY` | TTS Voice Demo | Nur Edge Functions |
| `RESEND_API_KEY` | E-Mail-Versand | Nur Edge Functions |
| `LOVABLE_API_KEY` | KI-Chat | Nur Edge Functions |
| `OdooCRMLeads` | CRM Integration | Nur Edge Functions |

**Wichtig:** Secrets sind nur server-seitig (Edge Functions) verfügbar und werden niemals an den Client übertragen.

### 6.2 Client-seitige Keys

Nur der Supabase Anon Key ist client-seitig verfügbar:

```typescript
// Sicher: Publishable Key (eingeschränkte Rechte durch RLS)
VITE_SUPABASE_PUBLISHABLE_KEY
```

---

## 7. Empfehlungen & Nächste Schritte

### 7.1 Bereits Implementiert ✅

1. ✅ Have I Been Pwned Passwort-Prüfung
2. ✅ Passwort-Stärke-Indikator
3. ✅ RBAC mit separater Rollen-Tabelle
4. ✅ RLS auf allen sensiblen Tabellen
5. ✅ Rate Limiting auf E-Mail-Endpunkten
6. ✅ Input-Validierung und Sanitization
7. ✅ Server-seitige API-Key Verwaltung
8. ✅ CORS-Konfiguration
9. ✅ E-Mail-Verifizierung für neue Konten

### 7.2 Optionale Erweiterungen (Kostenpflichtig)

| Maßnahme | Aufwand | Kosten | Empfehlung |
|----------|---------|--------|------------|
| **CAPTCHA für Formulare** | Mittel | ~$0/Monat (hCaptcha free) | Optional |
| **WAF (Web Application Firewall)** | Hoch | ~$20/Monat | Für Prod empfohlen |
| **Zwei-Faktor-Authentifizierung** | Mittel | Kostenlos | Für Admin empfohlen |
| **Security Monitoring/Alerting** | Mittel | Variabel | Für Prod empfohlen |

### 7.3 Was Sie tun können

1. **Supabase Leaked Password Protection aktivieren:**
   - Gehe zu: Lovable Cloud → Settings → Authentication
   - Aktiviere "Leaked Password Protection"
   - Dies ist zusätzlich zu unserer HIBP-Integration

2. **Regelmäßige Secret-Rotation:**
   - Odoo API-Key alle 90 Tage erneuern
   - Bei Verdacht auf Kompromittierung sofort rotieren

3. **Mitarbeiter-Schulung:**
   - Keine Passwörter teilen
   - Verdächtige Aktivitäten melden
   - Sichere Passwörter verwenden

---

## 8. Sicherheits-Checkliste für Entwicklung

### Bei neuen Features:

- [ ] RLS-Policy für neue Tabellen definiert?
- [ ] Input-Validierung implementiert?
- [ ] API-Keys nur server-seitig verwendet?
- [ ] Keine sensiblen Daten in Logs?
- [ ] CORS korrekt konfiguriert?

### Bei Edge Functions:

- [ ] Authentifizierung geprüft (falls erforderlich)?
- [ ] Rate Limiting implementiert (für öffentliche Endpoints)?
- [ ] Input sanitized?
- [ ] Generische Fehlermeldungen (keine Stack Traces)?

---

## 9. Kontakt & Support

Bei Sicherheitsfragen oder zur Meldung von Schwachstellen:

- **E-Mail:** sicherheit@deutlicht.de
- **Telefon:** [Ihre Support-Nummer]

---

*Dieses Dokument wird regelmäßig aktualisiert und an neue Sicherheitsanforderungen angepasst.*
