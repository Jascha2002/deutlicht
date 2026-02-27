export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analysis_clients: {
        Row: {
          ansprechpartner_email: string | null
          ansprechpartner_name: string | null
          ansprechpartner_position: string | null
          ansprechpartner_telefon: string | null
          branche: string | null
          branche_sonstiges: string | null
          created_at: string
          created_by: string
          geschaeftsmodell: string | null
          gruendungsjahr: number | null
          hauptsitz_ort: string | null
          hauptsitz_plz: string | null
          id: string
          jahresumsatz: string | null
          jahresumsatz_kategorie: string | null
          mitarbeiterzahl: number | null
          mitarbeiterzahl_kategorie: string | null
          modified_by: string | null
          rechtsform: string | null
          rechtsform_sonstiges: string | null
          standorte: string | null
          status: Database["public"]["Enums"]["analysis_status"]
          unternehmensname: string
          updated_at: string
          zielgruppen_b2b: boolean | null
          zielgruppen_b2c: boolean | null
          zielgruppen_beschreibung: string | null
        }
        Insert: {
          ansprechpartner_email?: string | null
          ansprechpartner_name?: string | null
          ansprechpartner_position?: string | null
          ansprechpartner_telefon?: string | null
          branche?: string | null
          branche_sonstiges?: string | null
          created_at?: string
          created_by: string
          geschaeftsmodell?: string | null
          gruendungsjahr?: number | null
          hauptsitz_ort?: string | null
          hauptsitz_plz?: string | null
          id?: string
          jahresumsatz?: string | null
          jahresumsatz_kategorie?: string | null
          mitarbeiterzahl?: number | null
          mitarbeiterzahl_kategorie?: string | null
          modified_by?: string | null
          rechtsform?: string | null
          rechtsform_sonstiges?: string | null
          standorte?: string | null
          status?: Database["public"]["Enums"]["analysis_status"]
          unternehmensname: string
          updated_at?: string
          zielgruppen_b2b?: boolean | null
          zielgruppen_b2c?: boolean | null
          zielgruppen_beschreibung?: string | null
        }
        Update: {
          ansprechpartner_email?: string | null
          ansprechpartner_name?: string | null
          ansprechpartner_position?: string | null
          ansprechpartner_telefon?: string | null
          branche?: string | null
          branche_sonstiges?: string | null
          created_at?: string
          created_by?: string
          geschaeftsmodell?: string | null
          gruendungsjahr?: number | null
          hauptsitz_ort?: string | null
          hauptsitz_plz?: string | null
          id?: string
          jahresumsatz?: string | null
          jahresumsatz_kategorie?: string | null
          mitarbeiterzahl?: number | null
          mitarbeiterzahl_kategorie?: string | null
          modified_by?: string | null
          rechtsform?: string | null
          rechtsform_sonstiges?: string | null
          standorte?: string | null
          status?: Database["public"]["Enums"]["analysis_status"]
          unternehmensname?: string
          updated_at?: string
          zielgruppen_b2b?: boolean | null
          zielgruppen_b2c?: boolean | null
          zielgruppen_beschreibung?: string | null
        }
        Relationships: []
      }
      analysis_daten: {
        Row: {
          antivirus_vorhanden: boolean | null
          backup_automatisiert: boolean | null
          backup_frequenz: string | null
          backup_getestet: string | null
          backup_speicherort: string | null
          backup_vorhanden: string | null
          client_id: string
          created_at: string
          daten_ablage_ort: Json | null
          daten_cloud_anbieter: string | null
          daten_dubletten: string | null
          daten_namenskonvention: string | null
          daten_ordnerstruktur: string | null
          daten_server_standort: string | null
          daten_zusatz: string | null
          dsgvo_auftragsverarbeiter_vertraege: boolean | null
          dsgvo_datenschutzbeauftragter: string | null
          dsgvo_loeschkonzept: string | null
          dsgvo_verzeichnis_vorhanden: boolean | null
          externe_zugriffe: string | null
          firewall_vorhanden: boolean | null
          id: string
          mitarbeiter_schulung_it_security: string | null
          passwort_manager: string | null
          passwort_richtlinie: string | null
          updated_at: string
          vpn_vorhanden: boolean | null
          zugriffskontrolle: string | null
          zwei_faktor_auth: string | null
        }
        Insert: {
          antivirus_vorhanden?: boolean | null
          backup_automatisiert?: boolean | null
          backup_frequenz?: string | null
          backup_getestet?: string | null
          backup_speicherort?: string | null
          backup_vorhanden?: string | null
          client_id: string
          created_at?: string
          daten_ablage_ort?: Json | null
          daten_cloud_anbieter?: string | null
          daten_dubletten?: string | null
          daten_namenskonvention?: string | null
          daten_ordnerstruktur?: string | null
          daten_server_standort?: string | null
          daten_zusatz?: string | null
          dsgvo_auftragsverarbeiter_vertraege?: boolean | null
          dsgvo_datenschutzbeauftragter?: string | null
          dsgvo_loeschkonzept?: string | null
          dsgvo_verzeichnis_vorhanden?: boolean | null
          externe_zugriffe?: string | null
          firewall_vorhanden?: boolean | null
          id?: string
          mitarbeiter_schulung_it_security?: string | null
          passwort_manager?: string | null
          passwort_richtlinie?: string | null
          updated_at?: string
          vpn_vorhanden?: boolean | null
          zugriffskontrolle?: string | null
          zwei_faktor_auth?: string | null
        }
        Update: {
          antivirus_vorhanden?: boolean | null
          backup_automatisiert?: boolean | null
          backup_frequenz?: string | null
          backup_getestet?: string | null
          backup_speicherort?: string | null
          backup_vorhanden?: string | null
          client_id?: string
          created_at?: string
          daten_ablage_ort?: Json | null
          daten_cloud_anbieter?: string | null
          daten_dubletten?: string | null
          daten_namenskonvention?: string | null
          daten_ordnerstruktur?: string | null
          daten_server_standort?: string | null
          daten_zusatz?: string | null
          dsgvo_auftragsverarbeiter_vertraege?: boolean | null
          dsgvo_datenschutzbeauftragter?: string | null
          dsgvo_loeschkonzept?: string | null
          dsgvo_verzeichnis_vorhanden?: boolean | null
          externe_zugriffe?: string | null
          firewall_vorhanden?: boolean | null
          id?: string
          mitarbeiter_schulung_it_security?: string | null
          passwort_manager?: string | null
          passwort_richtlinie?: string | null
          updated_at?: string
          vpn_vorhanden?: boolean | null
          zugriffskontrolle?: string | null
          zwei_faktor_auth?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_daten_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_intern: {
        Row: {
          bereitschaft_investition: number | null
          bereitschaft_veraenderung: number | null
          client_id: string
          created_at: string
          digitalisierungsgrad: number | null
          erfolgsfaktoren: string | null
          gesamteindruck: string | null
          handlungsbedarf: string | null
          id: string
          kritische_punkte: string | null
          naechste_schritte_intern: string | null
          potenzial: string | null
          risiken: string | null
          updated_at: string
        }
        Insert: {
          bereitschaft_investition?: number | null
          bereitschaft_veraenderung?: number | null
          client_id: string
          created_at?: string
          digitalisierungsgrad?: number | null
          erfolgsfaktoren?: string | null
          gesamteindruck?: string | null
          handlungsbedarf?: string | null
          id?: string
          kritische_punkte?: string | null
          naechste_schritte_intern?: string | null
          potenzial?: string | null
          risiken?: string | null
          updated_at?: string
        }
        Update: {
          bereitschaft_investition?: number | null
          bereitschaft_veraenderung?: number | null
          client_id?: string
          created_at?: string
          digitalisierungsgrad?: number | null
          erfolgsfaktoren?: string | null
          gesamteindruck?: string | null
          handlungsbedarf?: string | null
          id?: string
          kritische_punkte?: string | null
          naechste_schritte_intern?: string | null
          potenzial?: string | null
          risiken?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_intern_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_online: {
        Row: {
          buchungssystem_integration: string | null
          buchungssystem_typ: string | null
          buchungssystem_vorhanden: boolean | null
          client_id: string
          created_at: string
          id: string
          online_zusatz: string | null
          seo_aktiv_betrieben: string | null
          seo_backlinks_strategie: boolean | null
          seo_google_my_business: boolean | null
          seo_keywords_definiert: boolean | null
          seo_ranking_zufriedenheit: number | null
          shop_erp_anbindung: boolean | null
          shop_produkte_anzahl: number | null
          shop_system: string | null
          shop_system_sonstiges: string | null
          shop_umsatz_anteil: string | null
          shop_versand_anbindung: boolean | null
          shop_vorhanden: string | null
          shop_zahlungsarten: Json | null
          updated_at: string
          website_aktualisierung: string | null
          website_aktualisierung_wer: string | null
          website_barrierefreiheit: string | null
          website_cms: string | null
          website_cms_sonstiges: string | null
          website_hosting: string | null
          website_hosting_anbieter: string | null
          website_https: string | null
          website_ladezeit: string | null
          website_mehrsprachig: boolean | null
          website_responsive: string | null
          website_sprachen: number | null
          website_url: string | null
          website_vorhanden: string | null
        }
        Insert: {
          buchungssystem_integration?: string | null
          buchungssystem_typ?: string | null
          buchungssystem_vorhanden?: boolean | null
          client_id: string
          created_at?: string
          id?: string
          online_zusatz?: string | null
          seo_aktiv_betrieben?: string | null
          seo_backlinks_strategie?: boolean | null
          seo_google_my_business?: boolean | null
          seo_keywords_definiert?: boolean | null
          seo_ranking_zufriedenheit?: number | null
          shop_erp_anbindung?: boolean | null
          shop_produkte_anzahl?: number | null
          shop_system?: string | null
          shop_system_sonstiges?: string | null
          shop_umsatz_anteil?: string | null
          shop_versand_anbindung?: boolean | null
          shop_vorhanden?: string | null
          shop_zahlungsarten?: Json | null
          updated_at?: string
          website_aktualisierung?: string | null
          website_aktualisierung_wer?: string | null
          website_barrierefreiheit?: string | null
          website_cms?: string | null
          website_cms_sonstiges?: string | null
          website_hosting?: string | null
          website_hosting_anbieter?: string | null
          website_https?: string | null
          website_ladezeit?: string | null
          website_mehrsprachig?: boolean | null
          website_responsive?: string | null
          website_sprachen?: number | null
          website_url?: string | null
          website_vorhanden?: string | null
        }
        Update: {
          buchungssystem_integration?: string | null
          buchungssystem_typ?: string | null
          buchungssystem_vorhanden?: boolean | null
          client_id?: string
          created_at?: string
          id?: string
          online_zusatz?: string | null
          seo_aktiv_betrieben?: string | null
          seo_backlinks_strategie?: boolean | null
          seo_google_my_business?: boolean | null
          seo_keywords_definiert?: boolean | null
          seo_ranking_zufriedenheit?: number | null
          shop_erp_anbindung?: boolean | null
          shop_produkte_anzahl?: number | null
          shop_system?: string | null
          shop_system_sonstiges?: string | null
          shop_umsatz_anteil?: string | null
          shop_versand_anbindung?: boolean | null
          shop_vorhanden?: string | null
          shop_zahlungsarten?: Json | null
          updated_at?: string
          website_aktualisierung?: string | null
          website_aktualisierung_wer?: string | null
          website_barrierefreiheit?: string | null
          website_cms?: string | null
          website_cms_sonstiges?: string | null
          website_hosting?: string | null
          website_hosting_anbieter?: string | null
          website_https?: string | null
          website_ladezeit?: string | null
          website_mehrsprachig?: boolean | null
          website_responsive?: string | null
          website_sprachen?: number | null
          website_url?: string | null
          website_vorhanden?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_online_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_prozesse: {
        Row: {
          auftragsbearbeitung_medienbruch: boolean | null
          auftragsbearbeitung_system: string | null
          auftragseingang_kanal: Json | null
          auftragserfassung: string | null
          auftragsstatus_tracking: string | null
          client_id: string
          created_at: string
          dokumente_ablage: string | null
          dokumente_freigabe: string | null
          dokumente_suche: string | null
          dokumente_vorlagen: string | null
          entscheidungsprozesse: string | null
          id: string
          kundenkommunikation: string | null
          meetings_frequenz: string | null
          meetings_protokolle: string | null
          prozesse_zusatz: string | null
          rechnungsstellung: string | null
          rechnungsstellung_dauer: string | null
          rechnungsstellung_tool: string | null
          rechnungsversand: string | null
          service_kanal: Json | null
          service_reaktionszeit: string | null
          service_ticket_system: boolean | null
          service_ticket_tool: string | null
          service_wissensdatenbank: boolean | null
          updated_at: string
          vertrieb_angebotserstellung: string | null
          vertrieb_angebotserstellung_dauer: string | null
          vertrieb_angebotserstellung_tool: string | null
          vertrieb_crm_nutzung: string | null
          vertrieb_erfolgsquote: string | null
          vertrieb_leadgewinnung: Json | null
          vertrieb_nachverfolgung: string | null
        }
        Insert: {
          auftragsbearbeitung_medienbruch?: boolean | null
          auftragsbearbeitung_system?: string | null
          auftragseingang_kanal?: Json | null
          auftragserfassung?: string | null
          auftragsstatus_tracking?: string | null
          client_id: string
          created_at?: string
          dokumente_ablage?: string | null
          dokumente_freigabe?: string | null
          dokumente_suche?: string | null
          dokumente_vorlagen?: string | null
          entscheidungsprozesse?: string | null
          id?: string
          kundenkommunikation?: string | null
          meetings_frequenz?: string | null
          meetings_protokolle?: string | null
          prozesse_zusatz?: string | null
          rechnungsstellung?: string | null
          rechnungsstellung_dauer?: string | null
          rechnungsstellung_tool?: string | null
          rechnungsversand?: string | null
          service_kanal?: Json | null
          service_reaktionszeit?: string | null
          service_ticket_system?: boolean | null
          service_ticket_tool?: string | null
          service_wissensdatenbank?: boolean | null
          updated_at?: string
          vertrieb_angebotserstellung?: string | null
          vertrieb_angebotserstellung_dauer?: string | null
          vertrieb_angebotserstellung_tool?: string | null
          vertrieb_crm_nutzung?: string | null
          vertrieb_erfolgsquote?: string | null
          vertrieb_leadgewinnung?: Json | null
          vertrieb_nachverfolgung?: string | null
        }
        Update: {
          auftragsbearbeitung_medienbruch?: boolean | null
          auftragsbearbeitung_system?: string | null
          auftragseingang_kanal?: Json | null
          auftragserfassung?: string | null
          auftragsstatus_tracking?: string | null
          client_id?: string
          created_at?: string
          dokumente_ablage?: string | null
          dokumente_freigabe?: string | null
          dokumente_suche?: string | null
          dokumente_vorlagen?: string | null
          entscheidungsprozesse?: string | null
          id?: string
          kundenkommunikation?: string | null
          meetings_frequenz?: string | null
          meetings_protokolle?: string | null
          prozesse_zusatz?: string | null
          rechnungsstellung?: string | null
          rechnungsstellung_dauer?: string | null
          rechnungsstellung_tool?: string | null
          rechnungsversand?: string | null
          service_kanal?: Json | null
          service_reaktionszeit?: string | null
          service_ticket_system?: boolean | null
          service_ticket_tool?: string | null
          service_wissensdatenbank?: boolean | null
          updated_at?: string
          vertrieb_angebotserstellung?: string | null
          vertrieb_angebotserstellung_dauer?: string | null
          vertrieb_angebotserstellung_tool?: string | null
          vertrieb_crm_nutzung?: string | null
          vertrieb_erfolgsquote?: string | null
          vertrieb_leadgewinnung?: Json | null
          vertrieb_nachverfolgung?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_prozesse_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_reporting: {
        Row: {
          auswertungen_basis: string | null
          client_id: string
          created_at: string
          dashboard_tool: string | null
          dashboard_vorhanden: boolean | null
          datenqualitaet: string | null
          id: string
          kennzahlen_erfasst: boolean | null
          kennzahlen_liste: Json | null
          reporting_automatisiert: string | null
          reporting_frequenz: string | null
          reporting_zusatz: string | null
          updated_at: string
        }
        Insert: {
          auswertungen_basis?: string | null
          client_id: string
          created_at?: string
          dashboard_tool?: string | null
          dashboard_vorhanden?: boolean | null
          datenqualitaet?: string | null
          id?: string
          kennzahlen_erfasst?: boolean | null
          kennzahlen_liste?: Json | null
          reporting_automatisiert?: string | null
          reporting_frequenz?: string | null
          reporting_zusatz?: string | null
          updated_at?: string
        }
        Update: {
          auswertungen_basis?: string | null
          client_id?: string
          created_at?: string
          dashboard_tool?: string | null
          dashboard_vorhanden?: boolean | null
          datenqualitaet?: string | null
          id?: string
          kennzahlen_erfasst?: boolean | null
          kennzahlen_liste?: Json | null
          reporting_automatisiert?: string | null
          reporting_frequenz?: string | null
          reporting_zusatz?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_reporting_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_schulung: {
        Row: {
          arbeitsanweisungen_aktuell: boolean | null
          arbeitsanweisungen_format: string | null
          arbeitsanweisungen_vorhanden: boolean | null
          client_id: string
          created_at: string
          id: string
          onboarding_dauer: string | null
          onboarding_dokumentiert: boolean | null
          onboarding_prozess: string | null
          schulung_zusatz: string | null
          schulungen_intern_extern: string | null
          schulungen_regelmaessig: boolean | null
          updated_at: string
          wissensdatenbank_tool: string | null
          wissensdatenbank_vorhanden: boolean | null
        }
        Insert: {
          arbeitsanweisungen_aktuell?: boolean | null
          arbeitsanweisungen_format?: string | null
          arbeitsanweisungen_vorhanden?: boolean | null
          client_id: string
          created_at?: string
          id?: string
          onboarding_dauer?: string | null
          onboarding_dokumentiert?: boolean | null
          onboarding_prozess?: string | null
          schulung_zusatz?: string | null
          schulungen_intern_extern?: string | null
          schulungen_regelmaessig?: boolean | null
          updated_at?: string
          wissensdatenbank_tool?: string | null
          wissensdatenbank_vorhanden?: boolean | null
        }
        Update: {
          arbeitsanweisungen_aktuell?: boolean | null
          arbeitsanweisungen_format?: string | null
          arbeitsanweisungen_vorhanden?: boolean | null
          client_id?: string
          created_at?: string
          id?: string
          onboarding_dauer?: string | null
          onboarding_dokumentiert?: boolean | null
          onboarding_prozess?: string | null
          schulung_zusatz?: string | null
          schulungen_intern_extern?: string | null
          schulungen_regelmaessig?: boolean | null
          updated_at?: string
          wissensdatenbank_tool?: string | null
          wissensdatenbank_vorhanden?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_schulung_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_social: {
        Row: {
          client_id: string
          content_budget_monatlich: string | null
          content_ersteller: string | null
          content_redaktionsplan: boolean | null
          created_at: string
          facebook_follower: number | null
          facebook_frequenz: string | null
          id: string
          instagram_follower: number | null
          instagram_frequenz: string | null
          kanaele_aktiv: Json | null
          linkedin_follower: number | null
          linkedin_frequenz: string | null
          newsletter_abonnenten: number | null
          newsletter_frequenz: string | null
          newsletter_oeffnungsrate: string | null
          newsletter_tool: string | null
          newsletter_vorhanden: boolean | null
          online_werbung_aktiv: boolean | null
          social_zusatz: string | null
          updated_at: string
          werbung_budget_monatlich: string | null
          werbung_facebook_ads: boolean | null
          werbung_google_ads: boolean | null
          werbung_linkedin_ads: boolean | null
        }
        Insert: {
          client_id: string
          content_budget_monatlich?: string | null
          content_ersteller?: string | null
          content_redaktionsplan?: boolean | null
          created_at?: string
          facebook_follower?: number | null
          facebook_frequenz?: string | null
          id?: string
          instagram_follower?: number | null
          instagram_frequenz?: string | null
          kanaele_aktiv?: Json | null
          linkedin_follower?: number | null
          linkedin_frequenz?: string | null
          newsletter_abonnenten?: number | null
          newsletter_frequenz?: string | null
          newsletter_oeffnungsrate?: string | null
          newsletter_tool?: string | null
          newsletter_vorhanden?: boolean | null
          online_werbung_aktiv?: boolean | null
          social_zusatz?: string | null
          updated_at?: string
          werbung_budget_monatlich?: string | null
          werbung_facebook_ads?: boolean | null
          werbung_google_ads?: boolean | null
          werbung_linkedin_ads?: boolean | null
        }
        Update: {
          client_id?: string
          content_budget_monatlich?: string | null
          content_ersteller?: string | null
          content_redaktionsplan?: boolean | null
          created_at?: string
          facebook_follower?: number | null
          facebook_frequenz?: string | null
          id?: string
          instagram_follower?: number | null
          instagram_frequenz?: string | null
          kanaele_aktiv?: Json | null
          linkedin_follower?: number | null
          linkedin_frequenz?: string | null
          newsletter_abonnenten?: number | null
          newsletter_frequenz?: string | null
          newsletter_oeffnungsrate?: string | null
          newsletter_tool?: string | null
          newsletter_vorhanden?: boolean | null
          online_werbung_aktiv?: boolean | null
          social_zusatz?: string | null
          updated_at?: string
          werbung_budget_monatlich?: string | null
          werbung_facebook_ads?: boolean | null
          werbung_google_ads?: boolean | null
          werbung_linkedin_ads?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_social_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_systeme: {
        Row: {
          branchensoftware: Json | null
          branchensoftware_details: string | null
          buchhaltung_belege_digital: string | null
          buchhaltung_fibu_online: boolean | null
          buchhaltung_steuerberater_zugriff: boolean | null
          buchhaltung_system: string | null
          buchhaltung_system_sonstiges: string | null
          chat_tool: string | null
          client_id: string
          created_at: string
          crm_datenpflege: string | null
          crm_integration_email: boolean | null
          crm_integration_telefonie: boolean | null
          crm_nutzer_anzahl: number | null
          crm_system: string | null
          crm_system_sonstiges: string | null
          crm_vorhanden: string | null
          crm_zufriedenheit: number | null
          dms_berechtigungskonzept: string | null
          dms_system: string | null
          dms_system_sonstiges: string | null
          dms_versionierung: boolean | null
          dms_volltextsuche: boolean | null
          dms_vorhanden: string | null
          email_system: string | null
          erp_integration_crm: boolean | null
          erp_integration_shop: boolean | null
          erp_module: Json | null
          erp_system: string | null
          erp_system_sonstiges: string | null
          erp_vorhanden: string | null
          erp_zufriedenheit: number | null
          id: string
          pm_tool: string | null
          pm_tool_sonstiges: string | null
          pm_tool_vorhanden: boolean | null
          systeme_zusatz: string | null
          updated_at: string
          videokonferenz: string | null
          zeiterfassung_system: string | null
          zeiterfassung_vorhanden: boolean | null
        }
        Insert: {
          branchensoftware?: Json | null
          branchensoftware_details?: string | null
          buchhaltung_belege_digital?: string | null
          buchhaltung_fibu_online?: boolean | null
          buchhaltung_steuerberater_zugriff?: boolean | null
          buchhaltung_system?: string | null
          buchhaltung_system_sonstiges?: string | null
          chat_tool?: string | null
          client_id: string
          created_at?: string
          crm_datenpflege?: string | null
          crm_integration_email?: boolean | null
          crm_integration_telefonie?: boolean | null
          crm_nutzer_anzahl?: number | null
          crm_system?: string | null
          crm_system_sonstiges?: string | null
          crm_vorhanden?: string | null
          crm_zufriedenheit?: number | null
          dms_berechtigungskonzept?: string | null
          dms_system?: string | null
          dms_system_sonstiges?: string | null
          dms_versionierung?: boolean | null
          dms_volltextsuche?: boolean | null
          dms_vorhanden?: string | null
          email_system?: string | null
          erp_integration_crm?: boolean | null
          erp_integration_shop?: boolean | null
          erp_module?: Json | null
          erp_system?: string | null
          erp_system_sonstiges?: string | null
          erp_vorhanden?: string | null
          erp_zufriedenheit?: number | null
          id?: string
          pm_tool?: string | null
          pm_tool_sonstiges?: string | null
          pm_tool_vorhanden?: boolean | null
          systeme_zusatz?: string | null
          updated_at?: string
          videokonferenz?: string | null
          zeiterfassung_system?: string | null
          zeiterfassung_vorhanden?: boolean | null
        }
        Update: {
          branchensoftware?: Json | null
          branchensoftware_details?: string | null
          buchhaltung_belege_digital?: string | null
          buchhaltung_fibu_online?: boolean | null
          buchhaltung_steuerberater_zugriff?: boolean | null
          buchhaltung_system?: string | null
          buchhaltung_system_sonstiges?: string | null
          chat_tool?: string | null
          client_id?: string
          created_at?: string
          crm_datenpflege?: string | null
          crm_integration_email?: boolean | null
          crm_integration_telefonie?: boolean | null
          crm_nutzer_anzahl?: number | null
          crm_system?: string | null
          crm_system_sonstiges?: string | null
          crm_vorhanden?: string | null
          crm_zufriedenheit?: number | null
          dms_berechtigungskonzept?: string | null
          dms_system?: string | null
          dms_system_sonstiges?: string | null
          dms_versionierung?: boolean | null
          dms_volltextsuche?: boolean | null
          dms_vorhanden?: string | null
          email_system?: string | null
          erp_integration_crm?: boolean | null
          erp_integration_shop?: boolean | null
          erp_module?: Json | null
          erp_system?: string | null
          erp_system_sonstiges?: string | null
          erp_vorhanden?: string | null
          erp_zufriedenheit?: number | null
          id?: string
          pm_tool?: string | null
          pm_tool_sonstiges?: string | null
          pm_tool_vorhanden?: boolean | null
          systeme_zusatz?: string | null
          updated_at?: string
          videokonferenz?: string | null
          zeiterfassung_system?: string | null
          zeiterfassung_vorhanden?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_systeme_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_ziele: {
        Row: {
          budget_hoehe: string | null
          budget_verfuegbar: string | null
          client_id: string
          created_at: string
          digitalisierung_prioritaet: number | null
          foerderung_beratung_benoetigt: boolean | null
          foerderung_bereits_beantragt: boolean | null
          foerderung_interesse: boolean | null
          foerderung_programme: string | null
          id: string
          schmerzpunkte: Json | null
          schmerzpunkte_details: string | null
          updated_at: string
          wettbewerb_digitalisierung: string | null
          zeitrahmen: string | null
          ziele_details: string | null
          ziele_konkret: Json | null
          ziele_zusatz: string | null
        }
        Insert: {
          budget_hoehe?: string | null
          budget_verfuegbar?: string | null
          client_id: string
          created_at?: string
          digitalisierung_prioritaet?: number | null
          foerderung_beratung_benoetigt?: boolean | null
          foerderung_bereits_beantragt?: boolean | null
          foerderung_interesse?: boolean | null
          foerderung_programme?: string | null
          id?: string
          schmerzpunkte?: Json | null
          schmerzpunkte_details?: string | null
          updated_at?: string
          wettbewerb_digitalisierung?: string | null
          zeitrahmen?: string | null
          ziele_details?: string | null
          ziele_konkret?: Json | null
          ziele_zusatz?: string | null
        }
        Update: {
          budget_hoehe?: string | null
          budget_verfuegbar?: string | null
          client_id?: string
          created_at?: string
          digitalisierung_prioritaet?: number | null
          foerderung_beratung_benoetigt?: boolean | null
          foerderung_bereits_beantragt?: boolean | null
          foerderung_interesse?: boolean | null
          foerderung_programme?: string | null
          id?: string
          schmerzpunkte?: Json | null
          schmerzpunkte_details?: string | null
          updated_at?: string
          wettbewerb_digitalisierung?: string | null
          zeitrahmen?: string | null
          ziele_details?: string | null
          ziele_konkret?: Json | null
          ziele_zusatz?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_ziele_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string
          id: string
          ip_address: unknown
          is_gdpr_relevant: boolean | null
          is_tax_relevant: boolean | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          retention_until: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown
          is_gdpr_relevant?: boolean | null
          is_tax_relevant?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          retention_until?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown
          is_gdpr_relevant?: boolean | null
          is_tax_relevant?: boolean | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          retention_until?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      change_requests: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          id: string
          priority: string | null
          project_id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_acceptance_protocols: {
        Row: {
          acceptance_date: string
          company_id: string | null
          created_at: string
          created_by: string | null
          customer_comments: string | null
          customer_signature: string | null
          customer_signed_at: string | null
          customer_signed_name: string | null
          customer_signed_position: string | null
          defects_noted: string | null
          description: string | null
          follow_up_deadline: string | null
          follow_up_required: boolean | null
          id: string
          internal_notes: string | null
          items_accepted: Json | null
          order_id: string | null
          our_signature: string | null
          our_signed_at: string | null
          our_signed_name: string | null
          overall_result: string | null
          pdf_url: string | null
          project_id: string | null
          protocol_number: string | null
          sent_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          acceptance_date?: string
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_comments?: string | null
          customer_signature?: string | null
          customer_signed_at?: string | null
          customer_signed_name?: string | null
          customer_signed_position?: string | null
          defects_noted?: string | null
          description?: string | null
          follow_up_deadline?: string | null
          follow_up_required?: boolean | null
          id?: string
          internal_notes?: string | null
          items_accepted?: Json | null
          order_id?: string | null
          our_signature?: string | null
          our_signed_at?: string | null
          our_signed_name?: string | null
          overall_result?: string | null
          pdf_url?: string | null
          project_id?: string | null
          protocol_number?: string | null
          sent_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          acceptance_date?: string
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_comments?: string | null
          customer_signature?: string | null
          customer_signed_at?: string | null
          customer_signed_name?: string | null
          customer_signed_position?: string | null
          defects_noted?: string | null
          description?: string | null
          follow_up_deadline?: string | null
          follow_up_required?: boolean | null
          id?: string
          internal_notes?: string | null
          items_accepted?: Json | null
          order_id?: string | null
          our_signature?: string | null
          our_signed_at?: string | null
          our_signed_name?: string | null
          overall_result?: string | null
          pdf_url?: string | null
          project_id?: string | null
          protocol_number?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_acceptance_protocols_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_acceptance_protocols_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "crm_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_acceptance_protocols_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_calendar_events: {
        Row: {
          all_day: boolean | null
          attendees: Json | null
          company_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string
          event_type: string | null
          followup_id: string | null
          google_calendar_id: string | null
          google_event_id: string | null
          id: string
          last_synced_at: string | null
          lead_id: string | null
          location: string | null
          owner_id: string | null
          project_id: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean | null
          attendees?: Json | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time: string
          event_type?: string | null
          followup_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          last_synced_at?: string | null
          lead_id?: string | null
          location?: string | null
          owner_id?: string | null
          project_id?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean | null
          attendees?: Json | null
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string
          event_type?: string | null
          followup_id?: string | null
          google_calendar_id?: string | null
          google_event_id?: string | null
          id?: string
          last_synced_at?: string | null
          lead_id?: string | null
          location?: string | null
          owner_id?: string | null
          project_id?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_calendar_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_calendar_events_followup_id_fkey"
            columns: ["followup_id"]
            isOneToOne: false
            referencedRelation: "crm_followups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_calendar_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_calendar_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          account_holder: string | null
          address_line_2: string | null
          annual_revenue: string | null
          bank_name: string | null
          bic: string | null
          city: string | null
          company_name: string
          contact_person_email: string | null
          contact_person_name: string | null
          contact_person_phone: string | null
          contact_person_position: string | null
          contact_type: string
          country: string | null
          country_code: string | null
          created_at: string
          created_by: string | null
          email: string | null
          employee_count: string | null
          foreign_tax_id: string | null
          founded_year: number | null
          gdpr_consent_date: string | null
          gdpr_consent_given: boolean | null
          gdpr_consent_purpose: string | null
          gdpr_data_source: string | null
          gdpr_deletion_deadline: string | null
          gdpr_last_activity: string | null
          iban: string | null
          id: string
          industry: string | null
          internal_notes: string | null
          is_active: boolean | null
          is_reference_customer: boolean | null
          is_reverse_charge: boolean | null
          is_small_business: boolean | null
          legal_form: string | null
          modified_by: string | null
          payment_currency: string | null
          payment_terms_days: number | null
          phone: string | null
          phone_secondary: string | null
          postal_code: string | null
          reference_customer_notes: string | null
          referred_by_partner_id: string | null
          source_channel: string
          state_province: string | null
          street: string | null
          street_number: string | null
          tags: string[] | null
          tax_number: string | null
          tax_region: Database["public"]["Enums"]["tax_region"] | null
          trade_name: string | null
          updated_at: string
          user_id: string | null
          vat_id: string | null
          website: string | null
        }
        Insert: {
          account_holder?: string | null
          address_line_2?: string | null
          annual_revenue?: string | null
          bank_name?: string | null
          bic?: string | null
          city?: string | null
          company_name: string
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          contact_person_position?: string | null
          contact_type?: string
          country?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          employee_count?: string | null
          foreign_tax_id?: string | null
          founded_year?: number | null
          gdpr_consent_date?: string | null
          gdpr_consent_given?: boolean | null
          gdpr_consent_purpose?: string | null
          gdpr_data_source?: string | null
          gdpr_deletion_deadline?: string | null
          gdpr_last_activity?: string | null
          iban?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          is_active?: boolean | null
          is_reference_customer?: boolean | null
          is_reverse_charge?: boolean | null
          is_small_business?: boolean | null
          legal_form?: string | null
          modified_by?: string | null
          payment_currency?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          phone_secondary?: string | null
          postal_code?: string | null
          reference_customer_notes?: string | null
          referred_by_partner_id?: string | null
          source_channel?: string
          state_province?: string | null
          street?: string | null
          street_number?: string | null
          tags?: string[] | null
          tax_number?: string | null
          tax_region?: Database["public"]["Enums"]["tax_region"] | null
          trade_name?: string | null
          updated_at?: string
          user_id?: string | null
          vat_id?: string | null
          website?: string | null
        }
        Update: {
          account_holder?: string | null
          address_line_2?: string | null
          annual_revenue?: string | null
          bank_name?: string | null
          bic?: string | null
          city?: string | null
          company_name?: string
          contact_person_email?: string | null
          contact_person_name?: string | null
          contact_person_phone?: string | null
          contact_person_position?: string | null
          contact_type?: string
          country?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          employee_count?: string | null
          foreign_tax_id?: string | null
          founded_year?: number | null
          gdpr_consent_date?: string | null
          gdpr_consent_given?: boolean | null
          gdpr_consent_purpose?: string | null
          gdpr_data_source?: string | null
          gdpr_deletion_deadline?: string | null
          gdpr_last_activity?: string | null
          iban?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          is_active?: boolean | null
          is_reference_customer?: boolean | null
          is_reverse_charge?: boolean | null
          is_small_business?: boolean | null
          legal_form?: string | null
          modified_by?: string | null
          payment_currency?: string | null
          payment_terms_days?: number | null
          phone?: string | null
          phone_secondary?: string | null
          postal_code?: string | null
          reference_customer_notes?: string | null
          referred_by_partner_id?: string | null
          source_channel?: string
          state_province?: string | null
          street?: string | null
          street_number?: string | null
          tags?: string[] | null
          tax_number?: string | null
          tax_region?: Database["public"]["Enums"]["tax_region"] | null
          trade_name?: string | null
          updated_at?: string
          user_id?: string | null
          vat_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_companies_referred_by_partner_id_fkey"
            columns: ["referred_by_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_company_contacts: {
        Row: {
          company_id: string
          contact_id: string
          created_at: string
          id: string
          is_billing_contact: boolean | null
          is_primary: boolean | null
          is_technical_contact: boolean | null
          role_description: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          company_id: string
          contact_id: string
          created_at?: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          is_technical_contact?: boolean | null
          role_description?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          company_id?: string
          contact_id?: string
          created_at?: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          is_technical_contact?: boolean | null
          role_description?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_company_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_company_roles: {
        Row: {
          commission_rate: number | null
          company_id: string
          created_at: string
          credit_limit: number | null
          id: string
          is_active: boolean | null
          legacy_partner_id: string | null
          notes: string | null
          payment_rating: number | null
          role_type: Database["public"]["Enums"]["company_role_type"]
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          commission_rate?: number | null
          company_id: string
          created_at?: string
          credit_limit?: number | null
          id?: string
          is_active?: boolean | null
          legacy_partner_id?: string | null
          notes?: string | null
          payment_rating?: number | null
          role_type: Database["public"]["Enums"]["company_role_type"]
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          commission_rate?: number | null
          company_id?: string
          created_at?: string
          credit_limit?: number | null
          id?: string
          is_active?: boolean | null
          legacy_partner_id?: string | null
          notes?: string | null
          payment_rating?: number | null
          role_type?: Database["public"]["Enums"]["company_role_type"]
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_company_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_company_roles_legacy_partner_id_fkey"
            columns: ["legacy_partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          first_name: string
          gdpr_consent_date: string | null
          gdpr_consent_given: boolean | null
          gdpr_newsletter_consent: boolean | null
          has_own_address: boolean | null
          id: string
          internal_notes: string | null
          is_active: boolean | null
          last_name: string
          modified_by: string | null
          phone: string | null
          phone_mobile: string | null
          position: string | null
          postal_code: string | null
          preferred_contact_method: string | null
          preferred_language: string | null
          salutation: string | null
          street: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          first_name: string
          gdpr_consent_date?: string | null
          gdpr_consent_given?: boolean | null
          gdpr_newsletter_consent?: boolean | null
          has_own_address?: boolean | null
          id?: string
          internal_notes?: string | null
          is_active?: boolean | null
          last_name: string
          modified_by?: string | null
          phone?: string | null
          phone_mobile?: string | null
          position?: string | null
          postal_code?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          salutation?: string | null
          street?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          first_name?: string
          gdpr_consent_date?: string | null
          gdpr_consent_given?: boolean | null
          gdpr_newsletter_consent?: boolean | null
          has_own_address?: boolean | null
          id?: string
          internal_notes?: string | null
          is_active?: boolean | null
          last_name?: string
          modified_by?: string | null
          phone?: string | null
          phone_mobile?: string | null
          position?: string | null
          postal_code?: string | null
          preferred_contact_method?: string | null
          preferred_language?: string | null
          salutation?: string | null
          street?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_contracts: {
        Row: {
          auto_renewal: boolean | null
          company_id: string
          contact_id: string | null
          contract_number: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string | null
          currency: string | null
          description: string | null
          document_url: string | null
          end_date: string | null
          id: string
          is_indefinite: boolean | null
          modified_by: string | null
          notice_period_days: number | null
          order_id: string | null
          payment_terms: string | null
          renewal_period_months: number | null
          signed_at: string | null
          signed_document_url: string | null
          start_date: string
          status: string | null
          terminated_at: string | null
          termination_reason: string | null
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          auto_renewal?: boolean | null
          company_id: string
          contact_id?: string | null
          contract_number?: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          is_indefinite?: boolean | null
          modified_by?: string | null
          notice_period_days?: number | null
          order_id?: string | null
          payment_terms?: string | null
          renewal_period_months?: number | null
          signed_at?: string | null
          signed_document_url?: string | null
          start_date: string
          status?: string | null
          terminated_at?: string | null
          termination_reason?: string | null
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          auto_renewal?: boolean | null
          company_id?: string
          contact_id?: string | null
          contract_number?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          document_url?: string | null
          end_date?: string | null
          id?: string
          is_indefinite?: boolean | null
          modified_by?: string | null
          notice_period_days?: number | null
          order_id?: string | null
          payment_terms?: string | null
          renewal_period_months?: number | null
          signed_at?: string | null
          signed_document_url?: string | null
          start_date?: string
          status?: string | null
          terminated_at?: string | null
          termination_reason?: string | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contracts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contracts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contracts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "crm_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_documents: {
        Row: {
          company_id: string | null
          contract_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          document_number: string | null
          document_type: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          internal_notes: string | null
          invoice_id: string | null
          offer_id: string | null
          order_id: string | null
          project_id: string | null
          protocol_id: string | null
          sent_at: string | null
          sent_by: string | null
          sent_to: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          company_id?: string | null
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_number?: string | null
          document_type: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          offer_id?: string | null
          order_id?: string | null
          project_id?: string | null
          protocol_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          company_id?: string | null
          contract_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_number?: string | null
          document_type?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          offer_id?: string | null
          order_id?: string | null
          project_id?: string | null
          protocol_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "crm_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "crm_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "crm_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "crm_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_documents_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "crm_acceptance_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_followups: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          due_time: string | null
          followup_type: string | null
          id: string
          invoice_id: string | null
          lead_id: string | null
          offer_id: string | null
          priority: string | null
          project_id: string | null
          reminder_date: string | null
          result: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          due_time?: string | null
          followup_type?: string | null
          id?: string
          invoice_id?: string | null
          lead_id?: string | null
          offer_id?: string | null
          priority?: string | null
          project_id?: string | null
          reminder_date?: string | null
          result?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          due_time?: string | null
          followup_type?: string | null
          id?: string
          invoice_id?: string | null
          lead_id?: string | null
          offer_id?: string | null
          priority?: string | null
          project_id?: string | null
          reminder_date?: string | null
          result?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_followups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_followups_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "crm_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_followups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_followups_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "crm_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_followups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_invoice_items: {
        Row: {
          amount_gross: number
          amount_net: number
          created_at: string
          description: string | null
          discount_percent: number | null
          id: string
          invoice_id: string
          order_item_id: string | null
          position_number: number
          product_id: string | null
          quantity: number
          tax_amount: number
          tax_rate: number
          title: string
          unit: string | null
          unit_price_net: number
        }
        Insert: {
          amount_gross?: number
          amount_net?: number
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          invoice_id: string
          order_item_id?: string | null
          position_number?: number
          product_id?: string | null
          quantity?: number
          tax_amount?: number
          tax_rate?: number
          title: string
          unit?: string | null
          unit_price_net?: number
        }
        Update: {
          amount_gross?: number
          amount_net?: number
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          invoice_id?: string
          order_item_id?: string | null
          position_number?: number
          product_id?: string | null
          quantity?: number
          tax_amount?: number
          tax_rate?: number
          title?: string
          unit?: string | null
          unit_price_net?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "crm_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoice_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "crm_order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "crm_products"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_invoices: {
        Row: {
          amount_gross: number | null
          amount_net: number | null
          amount_paid: number | null
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          invoice_type: string | null
          is_recurring: boolean | null
          last_reminder_date: string | null
          legacy_invoice_id: string | null
          line_items: Json | null
          next_invoice_date: string | null
          offer_id: string | null
          order_id: string | null
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          pdf_url: string | null
          project_id: string | null
          recurring_interval: string | null
          reminder_count: number | null
          sent_at: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount: number | null
          tax_rate: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount_gross?: number | null
          amount_net?: number | null
          amount_paid?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_type?: string | null
          is_recurring?: boolean | null
          last_reminder_date?: string | null
          legacy_invoice_id?: string | null
          line_items?: Json | null
          next_invoice_date?: string | null
          offer_id?: string | null
          order_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          project_id?: string | null
          recurring_interval?: string | null
          reminder_count?: number | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount?: number | null
          tax_rate?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount_gross?: number | null
          amount_net?: number | null
          amount_paid?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_type?: string | null
          is_recurring?: boolean | null
          last_reminder_date?: string | null
          legacy_invoice_id?: string | null
          line_items?: Json | null
          next_invoice_date?: string | null
          offer_id?: string | null
          order_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          pdf_url?: string | null
          project_id?: string | null
          recurring_interval?: string | null
          reminder_count?: number | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          tax_amount?: number | null
          tax_rate?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_legacy_invoice_id_fkey"
            columns: ["legacy_invoice_id"]
            isOneToOne: false
            referencedRelation: "customer_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "crm_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "crm_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_activities: {
        Row: {
          activity_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          lead_id: string
          new_status: Database["public"]["Enums"]["lead_status"] | null
          old_status: Database["public"]["Enums"]["lead_status"] | null
          scheduled_at: string | null
          title: string | null
        }
        Insert: {
          activity_type: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id: string
          new_status?: Database["public"]["Enums"]["lead_status"] | null
          old_status?: Database["public"]["Enums"]["lead_status"] | null
          scheduled_at?: string | null
          title?: string | null
        }
        Update: {
          activity_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string
          new_status?: Database["public"]["Enums"]["lead_status"] | null
          old_status?: Database["public"]["Enums"]["lead_status"] | null
          scheduled_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          budget_range: string | null
          city: string | null
          company_name: string | null
          company_size: string | null
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          contact_phone: string | null
          converted_at: string | null
          converted_by: string | null
          converted_company_id: string | null
          converted_contact_id: string | null
          country: string | null
          created_at: string
          created_by: string | null
          estimated_value: number | null
          followup_notes: string | null
          id: string
          industry: string | null
          internal_notes: string | null
          last_contact_at: string | null
          lead_number: string | null
          legacy_project_lead_id: string | null
          lost_reason: string | null
          lost_to_competitor: string | null
          next_followup_at: string | null
          odoo_lead_id: number | null
          odoo_synced_at: string | null
          partner_referral_id: string | null
          postal_code: string | null
          priority: number | null
          project_description: string | null
          score: number | null
          services_interested: string[] | null
          source: Database["public"]["Enums"]["lead_source"]
          source_detail: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["lead_status"]
          street: string | null
          tags: string[] | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          converted_at?: string | null
          converted_by?: string | null
          converted_company_id?: string | null
          converted_contact_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          estimated_value?: number | null
          followup_notes?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          last_contact_at?: string | null
          lead_number?: string | null
          legacy_project_lead_id?: string | null
          lost_reason?: string | null
          lost_to_competitor?: string | null
          next_followup_at?: string | null
          odoo_lead_id?: number | null
          odoo_synced_at?: string | null
          partner_referral_id?: string | null
          postal_code?: string | null
          priority?: number | null
          project_description?: string | null
          score?: number | null
          services_interested?: string[] | null
          source: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          street?: string | null
          tags?: string[] | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          converted_at?: string | null
          converted_by?: string | null
          converted_company_id?: string | null
          converted_contact_id?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          estimated_value?: number | null
          followup_notes?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          last_contact_at?: string | null
          lead_number?: string | null
          legacy_project_lead_id?: string | null
          lost_reason?: string | null
          lost_to_competitor?: string | null
          next_followup_at?: string | null
          odoo_lead_id?: number | null
          odoo_synced_at?: string | null
          partner_referral_id?: string | null
          postal_code?: string | null
          priority?: number | null
          project_description?: string | null
          score?: number | null
          services_interested?: string[] | null
          source?: Database["public"]["Enums"]["lead_source"]
          source_detail?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          street?: string | null
          tags?: string[] | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_converted_company_id_fkey"
            columns: ["converted_company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_converted_contact_id_fkey"
            columns: ["converted_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_legacy_project_lead_id_fkey"
            columns: ["legacy_project_lead_id"]
            isOneToOne: false
            referencedRelation: "project_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_partner_referral_id_fkey"
            columns: ["partner_referral_id"]
            isOneToOne: false
            referencedRelation: "partner_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_offers: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          amount_monthly: number | null
          amount_setup: number | null
          amount_total: number | null
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          form_data: Json | null
          id: string
          lead_id: string | null
          legacy_project_lead_id: string | null
          line_items: Json | null
          offer_number: string | null
          pdf_url: string | null
          project_id: string | null
          rejection_reason: string | null
          sent_at: string | null
          signed_pdf_url: string | null
          status: Database["public"]["Enums"]["offer_status"] | null
          tax_rate: number | null
          title: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          amount_monthly?: number | null
          amount_setup?: number | null
          amount_total?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          form_data?: Json | null
          id?: string
          lead_id?: string | null
          legacy_project_lead_id?: string | null
          line_items?: Json | null
          offer_number?: string | null
          pdf_url?: string | null
          project_id?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          signed_pdf_url?: string | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          tax_rate?: number | null
          title: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          amount_monthly?: number | null
          amount_setup?: number | null
          amount_total?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          form_data?: Json | null
          id?: string
          lead_id?: string | null
          legacy_project_lead_id?: string | null
          line_items?: Json | null
          offer_number?: string | null
          pdf_url?: string | null
          project_id?: string | null
          rejection_reason?: string | null
          sent_at?: string | null
          signed_pdf_url?: string | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          tax_rate?: number | null
          title?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_offers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_offers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_offers_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_offers_legacy_project_lead_id_fkey"
            columns: ["legacy_project_lead_id"]
            isOneToOne: false
            referencedRelation: "project_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_offers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_order_items: {
        Row: {
          amount_net: number
          completed_at: string | null
          created_at: string
          description: string | null
          discount_percent: number | null
          id: string
          order_id: string
          position_number: number
          product_id: string | null
          quantity: number
          status: string | null
          tax_rate: number
          title: string
          unit: string | null
          unit_price_net: number
        }
        Insert: {
          amount_net?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          order_id: string
          position_number?: number
          product_id?: string | null
          quantity?: number
          status?: string | null
          tax_rate?: number
          title: string
          unit?: string | null
          unit_price_net?: number
        }
        Update: {
          amount_net?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          id?: string
          order_id?: string
          position_number?: number
          product_id?: string | null
          quantity?: number
          status?: string | null
          tax_rate?: number
          title?: string
          unit?: string | null
          unit_price_net?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "crm_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "crm_products"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_orders: {
        Row: {
          actual_completion_date: string | null
          amount_gross: number
          amount_net: number
          company_id: string | null
          confirmation_pdf_url: string | null
          confirmation_sent_at: string | null
          created_at: string
          created_by: string | null
          customer_signature: string | null
          customer_signed_at: string | null
          customer_signed_ip: unknown
          customer_signed_name: string | null
          description: string | null
          id: string
          internal_notes: string | null
          line_items: Json | null
          offer_id: string | null
          order_date: string
          order_number: string | null
          pdf_url: string | null
          project_id: string | null
          start_date: string | null
          status: string
          target_completion_date: string | null
          tax_amount: number
          tax_rate: number
          title: string
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          amount_gross?: number
          amount_net?: number
          company_id?: string | null
          confirmation_pdf_url?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_signature?: string | null
          customer_signed_at?: string | null
          customer_signed_ip?: unknown
          customer_signed_name?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          line_items?: Json | null
          offer_id?: string | null
          order_date?: string
          order_number?: string | null
          pdf_url?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string
          target_completion_date?: string | null
          tax_amount?: number
          tax_rate?: number
          title: string
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          amount_gross?: number
          amount_net?: number
          company_id?: string | null
          confirmation_pdf_url?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_signature?: string | null
          customer_signed_at?: string | null
          customer_signed_ip?: unknown
          customer_signed_name?: string | null
          description?: string | null
          id?: string
          internal_notes?: string | null
          line_items?: Json | null
          offer_id?: string | null
          order_date?: string
          order_number?: string | null
          pdf_url?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string
          target_completion_date?: string | null
          tax_amount?: number
          tax_rate?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_orders_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "crm_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          created_by: string | null
          description: string | null
          features: Json | null
          id: string
          implementation_weeks: number | null
          is_active: boolean | null
          modified_by: string | null
          name: string
          price_monthly: number | null
          price_setup: number | null
          price_yearly: number | null
          product_code: string | null
          sort_order: number | null
          source: string | null
          source_id: string | null
          target_group: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          implementation_weeks?: number | null
          is_active?: boolean | null
          modified_by?: string | null
          name: string
          price_monthly?: number | null
          price_setup?: number | null
          price_yearly?: number | null
          product_code?: string | null
          sort_order?: number | null
          source?: string | null
          source_id?: string | null
          target_group?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          implementation_weeks?: number | null
          is_active?: boolean | null
          modified_by?: string | null
          name?: string
          price_monthly?: number | null
          price_setup?: number | null
          price_yearly?: number | null
          product_code?: string | null
          sort_order?: number | null
          source?: string | null
          source_id?: string | null
          target_group?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_project_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          invoice_id: string | null
          offer_id: string | null
          performed_at: string | null
          performed_by: string | null
          project_id: string
          report_id: string | null
          title: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          offer_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
          project_id: string
          report_id?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          offer_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
          project_id?: string
          report_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_project_activities_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "crm_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_project_activities_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "crm_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_project_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_project_activities_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "crm_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_projects: {
        Row: {
          actual_end_date: string | null
          analysis_client_id: string | null
          assigned_to: string | null
          budget_monthly: number | null
          budget_setup: number | null
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          lead_id: string | null
          legacy_project_id: string | null
          modified_by: string | null
          progress_percent: number | null
          project_number: string | null
          services_included: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          target_end_date: string | null
          title: string
          total_invoiced: number | null
          total_paid: number | null
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          analysis_client_id?: string | null
          assigned_to?: string | null
          budget_monthly?: number | null
          budget_setup?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          legacy_project_id?: string | null
          modified_by?: string | null
          progress_percent?: number | null
          project_number?: string | null
          services_included?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          target_end_date?: string | null
          title: string
          total_invoiced?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          analysis_client_id?: string | null
          assigned_to?: string | null
          budget_monthly?: number | null
          budget_setup?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          legacy_project_id?: string | null
          modified_by?: string | null
          progress_percent?: number | null
          project_number?: string | null
          services_included?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          target_end_date?: string | null
          title?: string
          total_invoiced?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_projects_analysis_client_id_fkey"
            columns: ["analysis_client_id"]
            isOneToOne: false
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_projects_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_projects_legacy_project_id_fkey"
            columns: ["legacy_project_id"]
            isOneToOne: false
            referencedRelation: "customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_reports: {
        Row: {
          analysis_client_id: string | null
          analysis_results: Json | null
          analysis_score: number | null
          approved_at: string | null
          approved_by: string | null
          company_id: string | null
          content_html: string | null
          content_markdown: string | null
          created_at: string | null
          created_by: string | null
          id: string
          lead_id: string | null
          pdf_url: string | null
          project_id: string | null
          recommendations: Json | null
          report_number: string | null
          report_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          sent_to_client_at: string | null
          sent_to_email: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          analysis_client_id?: string | null
          analysis_results?: Json | null
          analysis_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          content_html?: string | null
          content_markdown?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id?: string | null
          pdf_url?: string | null
          project_id?: string | null
          recommendations?: Json | null
          report_number?: string | null
          report_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          sent_to_client_at?: string | null
          sent_to_email?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          analysis_client_id?: string | null
          analysis_results?: Json | null
          analysis_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string | null
          content_html?: string | null
          content_markdown?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id?: string | null
          pdf_url?: string | null
          project_id?: string | null
          recommendations?: Json | null
          report_number?: string | null
          report_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          sent_to_client_at?: string | null
          sent_to_email?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_reports_analysis_client_id_fkey"
            columns: ["analysis_client_id"]
            isOneToOne: false
            referencedRelation: "analysis_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          category: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          mime_type: string | null
          project_id: string | null
          status: string | null
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mime_type?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mime_type?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_files: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          project_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          project_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          project_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_invoices: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          due_date: string | null
          id: string
          invoice_number: string
          paid_date: string | null
          pdf_url: string | null
          project_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_date?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_date?: string | null
          pdf_url?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_projects: {
        Row: {
          assigned_staff: string | null
          created_at: string
          customer_id: string
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_staff?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_staff?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_team_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          company_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          notes: string | null
          role_in_team: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          role_in_team?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          role_in_team?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_team_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_templates: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          company_id: string | null
          customer_id: string
          id: string
          template_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          customer_id: string
          id?: string
          template_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          company_id?: string | null
          customer_id?: string
          id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      document_permissions: {
        Row: {
          can_delete: boolean | null
          can_download: boolean | null
          can_edit: boolean | null
          can_share: boolean | null
          can_view: boolean | null
          created_at: string
          granted_at: string | null
          granted_by: string | null
          id: string
          resource_id: string
          resource_type: string
          revoked_at: string | null
          revoked_by: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
          user_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          can_delete?: boolean | null
          can_download?: boolean | null
          can_edit?: boolean | null
          can_share?: boolean | null
          can_view?: boolean | null
          created_at?: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          resource_id: string
          resource_type: string
          revoked_at?: string | null
          revoked_by?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          can_delete?: boolean | null
          can_download?: boolean | null
          can_edit?: boolean | null
          can_share?: boolean | null
          can_view?: boolean | null
          created_at?: string
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          resource_id?: string
          resource_type?: string
          revoked_at?: string | null
          revoked_by?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          user_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_commissions: {
        Row: {
          amount: number
          base_amount: number | null
          commission_type: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          paid_at: string | null
          partner_id: string
          payment_reference: string | null
          percentage_applied: number | null
          period_end: string | null
          period_start: string | null
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          base_amount?: number | null
          commission_type: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_id: string
          payment_reference?: string | null
          percentage_applied?: number | null
          period_end?: string | null
          period_start?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          base_amount?: number | null
          commission_type?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_reference?: string | null
          percentage_applied?: number | null
          period_end?: string | null
          period_start?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          file_size: number | null
          id: string
          notes: string | null
          partner_id: string
          storage_path: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          file_size?: number | null
          id?: string
          notes?: string | null
          partner_id: string
          storage_path: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          partner_id?: string
          storage_path?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_invoices: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          gross_amount: number
          id: string
          invoice_date: string
          invoice_number: string
          net_amount: number
          notes: string | null
          paid_at: string | null
          partner_id: string
          payment_reference: string | null
          pdf_url: string | null
          period_end: string
          period_start: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          vat_amount: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          gross_amount?: number
          id?: string
          invoice_date?: string
          invoice_number: string
          net_amount?: number
          notes?: string | null
          paid_at?: string | null
          partner_id: string
          payment_reference?: string | null
          pdf_url?: string | null
          period_end: string
          period_start: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          gross_amount?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          net_amount?: number
          notes?: string | null
          paid_at?: string | null
          partner_id?: string
          payment_reference?: string | null
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "partner_invoices_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referrals: {
        Row: {
          conversion_date: string | null
          created_at: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          customer_user_id: string | null
          first_contact_date: string | null
          id: string
          lead_id: string | null
          lifetime_value: number | null
          notes: string | null
          partner_id: string
          referral_code: string | null
          referral_source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          conversion_date?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          customer_user_id?: string | null
          first_contact_date?: string | null
          id?: string
          lead_id?: string | null
          lifetime_value?: number | null
          notes?: string | null
          partner_id: string
          referral_code?: string | null
          referral_source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          conversion_date?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_user_id?: string | null
          first_contact_date?: string | null
          id?: string
          lead_id?: string | null
          lifetime_value?: number | null
          notes?: string | null
          partner_id?: string
          referral_code?: string | null
          referral_source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          account_holder: string | null
          approved_at: string | null
          approved_by: string | null
          average_project_value: string | null
          bank_name: string | null
          bic: string | null
          city: string | null
          commission_rate: number | null
          company_name: string
          contact_email: string
          contact_first_name: string
          contact_last_name: string
          contact_phone: string | null
          contact_position: string | null
          contract_draft_content: string | null
          contract_pdf_url: string | null
          contract_sent_at: string | null
          contract_signed_at: string | null
          contract_status: string | null
          country: string | null
          created_at: string
          current_clients: string | null
          employee_count: string | null
          expected_volume: string | null
          experience: string | null
          founded_year: number | null
          iban: string | null
          id: string
          internal_notes: string | null
          legal_form: string | null
          logo_url: string | null
          motivation: string | null
          notes: string | null
          odoo_partner_id: number | null
          partner_number: string | null
          partner_type: string
          portfolio_url: string | null
          postal_code: string | null
          references_text: string | null
          rejection_reason: string | null
          show_on_website: boolean | null
          specializations: string[] | null
          status: string
          street: string | null
          target_markets: string[] | null
          tax_id: string | null
          updated_at: string
          user_id: string | null
          website: string | null
          website_check_at: string | null
          website_check_result: Json | null
          website_check_status: string | null
          welcome_email_sent_at: string | null
          withdrawal_token: string | null
          withdrawn_at: string | null
        }
        Insert: {
          account_holder?: string | null
          approved_at?: string | null
          approved_by?: string | null
          average_project_value?: string | null
          bank_name?: string | null
          bic?: string | null
          city?: string | null
          commission_rate?: number | null
          company_name: string
          contact_email: string
          contact_first_name: string
          contact_last_name: string
          contact_phone?: string | null
          contact_position?: string | null
          contract_draft_content?: string | null
          contract_pdf_url?: string | null
          contract_sent_at?: string | null
          contract_signed_at?: string | null
          contract_status?: string | null
          country?: string | null
          created_at?: string
          current_clients?: string | null
          employee_count?: string | null
          expected_volume?: string | null
          experience?: string | null
          founded_year?: number | null
          iban?: string | null
          id?: string
          internal_notes?: string | null
          legal_form?: string | null
          logo_url?: string | null
          motivation?: string | null
          notes?: string | null
          odoo_partner_id?: number | null
          partner_number?: string | null
          partner_type: string
          portfolio_url?: string | null
          postal_code?: string | null
          references_text?: string | null
          rejection_reason?: string | null
          show_on_website?: boolean | null
          specializations?: string[] | null
          status?: string
          street?: string | null
          target_markets?: string[] | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          website_check_at?: string | null
          website_check_result?: Json | null
          website_check_status?: string | null
          welcome_email_sent_at?: string | null
          withdrawal_token?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          account_holder?: string | null
          approved_at?: string | null
          approved_by?: string | null
          average_project_value?: string | null
          bank_name?: string | null
          bic?: string | null
          city?: string | null
          commission_rate?: number | null
          company_name?: string
          contact_email?: string
          contact_first_name?: string
          contact_last_name?: string
          contact_phone?: string | null
          contact_position?: string | null
          contract_draft_content?: string | null
          contract_pdf_url?: string | null
          contract_sent_at?: string | null
          contract_signed_at?: string | null
          contract_status?: string | null
          country?: string | null
          created_at?: string
          current_clients?: string | null
          employee_count?: string | null
          expected_volume?: string | null
          experience?: string | null
          founded_year?: number | null
          iban?: string | null
          id?: string
          internal_notes?: string | null
          legal_form?: string | null
          logo_url?: string | null
          motivation?: string | null
          notes?: string | null
          odoo_partner_id?: number | null
          partner_number?: string | null
          partner_type?: string
          portfolio_url?: string | null
          postal_code?: string | null
          references_text?: string | null
          rejection_reason?: string | null
          show_on_website?: boolean | null
          specializations?: string[] | null
          status?: string
          street?: string | null
          target_markets?: string[] | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          website_check_at?: string | null
          website_check_result?: Json | null
          website_check_status?: string | null
          welcome_email_sent_at?: string | null
          withdrawal_token?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assets: {
        Row: {
          category: string | null
          company_id: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          project_id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_leads: {
        Row: {
          additional_notes: string | null
          ai_use_cases: string | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          current_step: number | null
          customer_address: string | null
          customer_city: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_postal_code: string | null
          id: string
          industry: string | null
          internal_notes: string | null
          internal_price_estimate_monthly: number | null
          internal_price_estimate_setup: number | null
          last_activity_at: string | null
          services_selected: string[] | null
          session_id: string
          social_platforms: string[] | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          voicebot_use_cases: string | null
          website_features: string[] | null
          website_type: string | null
        }
        Insert: {
          additional_notes?: string | null
          ai_use_cases?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          internal_price_estimate_monthly?: number | null
          internal_price_estimate_setup?: number | null
          last_activity_at?: string | null
          services_selected?: string[] | null
          session_id: string
          social_platforms?: string[] | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          voicebot_use_cases?: string | null
          website_features?: string[] | null
          website_type?: string | null
        }
        Update: {
          additional_notes?: string | null
          ai_use_cases?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          current_step?: number | null
          customer_address?: string | null
          customer_city?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_postal_code?: string | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          internal_price_estimate_monthly?: number | null
          internal_price_estimate_setup?: number | null
          last_activity_at?: string | null
          services_selected?: string[] | null
          session_id?: string
          social_platforms?: string[] | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          voicebot_use_cases?: string | null
          website_features?: string[] | null
          website_type?: string | null
        }
        Relationships: []
      }
      project_team_assignments: {
        Row: {
          access_level: string | null
          assigned_at: string | null
          assigned_by: string | null
          id: string
          notes: string | null
          project_id: string
          role_in_project: string | null
          user_id: string
        }
        Insert: {
          access_level?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          project_id: string
          role_in_project?: string | null
          user_id: string
        }
        Update: {
          access_level?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          role_in_project?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "crm_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          description: string | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "customer_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          url?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_create_invoices: boolean
          can_create_offers: boolean
          can_download_pdfs: boolean
          can_edit_products: boolean
          can_export_data: boolean
          can_view_abnahmen: boolean
          can_view_all_projects: boolean
          can_view_angebote: boolean
          can_view_auftraege: boolean
          can_view_berichte: boolean
          can_view_commissions: boolean
          can_view_financials: boolean
          can_view_rechnungen: boolean
          can_view_vertraege: boolean
          created_at: string
          granted_by: string | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          can_create_invoices?: boolean
          can_create_offers?: boolean
          can_download_pdfs?: boolean
          can_edit_products?: boolean
          can_export_data?: boolean
          can_view_abnahmen?: boolean
          can_view_all_projects?: boolean
          can_view_angebote?: boolean
          can_view_auftraege?: boolean
          can_view_berichte?: boolean
          can_view_commissions?: boolean
          can_view_financials?: boolean
          can_view_rechnungen?: boolean
          can_view_vertraege?: boolean
          created_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          can_create_invoices?: boolean
          can_create_offers?: boolean
          can_download_pdfs?: boolean
          can_edit_products?: boolean
          can_export_data?: boolean
          can_view_abnahmen?: boolean
          can_view_all_projects?: boolean
          can_view_angebote?: boolean
          can_view_auftraege?: boolean
          can_view_berichte?: boolean
          can_view_commissions?: boolean
          can_view_financials?: boolean
          can_view_rechnungen?: boolean
          can_view_vertraege?: boolean
          created_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: { Args: { p_target_user_id: string }; Returns: Json }
      admin_manage_user_role: {
        Args: { p_action: string; p_role: string; p_target_user_id: string }
        Returns: Json
      }
      can_access_client: { Args: { _client_id: string }; Returns: boolean }
      can_access_resource: {
        Args: {
          p_permission?: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: boolean
      }
      check_user_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      create_audit_log: {
        Args: {
          p_action: string
          p_changed_fields?: string[]
          p_is_gdpr_relevant?: boolean
          p_is_tax_relevant?: boolean
          p_new_values?: Json
          p_old_values?: Json
          p_record_id: string
          p_table_name: string
        }
        Returns: string
      }
      get_accessible_company_ids: {
        Args: { _user_id?: string }
        Returns: string[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      analysis_status: "entwurf" | "aktiv" | "abgeschlossen"
      app_role:
        | "admin"
        | "mitarbeiter"
        | "kunde"
        | "partner"
        | "freelancer_eu"
        | "freelancer_drittland"
        | "lieferant"
        | "ki_agent"
        | "produktion"
      company_role_type:
        | "kunde"
        | "partner"
        | "freelancer_eu"
        | "freelancer_drittland"
        | "lieferant"
        | "interessent"
        | "lead"
      contract_type:
        | "rahmenvertrag"
        | "einzelvertrag"
        | "nda"
        | "avv"
        | "retainer"
        | "projektvertrag"
      invoice_status:
        | "entwurf"
        | "gesendet"
        | "ueberfaellig"
        | "bezahlt"
        | "storniert"
        | "mahnung"
      lead_source:
        | "projektanfrage"
        | "kontaktformular"
        | "partner_referral"
        | "website"
        | "telefon"
        | "messe"
        | "empfehlung"
        | "social_media"
        | "google_ads"
        | "sonstige"
      lead_status:
        | "neu"
        | "kontaktiert"
        | "qualifiziert"
        | "angebot_erstellt"
        | "verhandlung"
        | "gewonnen"
        | "verloren"
        | "inaktiv"
      offer_status:
        | "entwurf"
        | "gesendet"
        | "angesehen"
        | "angenommen"
        | "abgelehnt"
        | "abgelaufen"
      price_type: "einmalig" | "monatlich" | "jaehrlich"
      product_category:
        | "website"
        | "hosting"
        | "seo"
        | "ki_agent"
        | "voicebot"
        | "social_media"
        | "beratung"
        | "prozess"
        | "branchenloesung"
        | "service"
      project_status:
        | "planung"
        | "aktiv"
        | "pausiert"
        | "abgeschlossen"
        | "abgebrochen"
      tax_region: "deutschland" | "eu" | "drittland"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analysis_status: ["entwurf", "aktiv", "abgeschlossen"],
      app_role: [
        "admin",
        "mitarbeiter",
        "kunde",
        "partner",
        "freelancer_eu",
        "freelancer_drittland",
        "lieferant",
        "ki_agent",
        "produktion",
      ],
      company_role_type: [
        "kunde",
        "partner",
        "freelancer_eu",
        "freelancer_drittland",
        "lieferant",
        "interessent",
        "lead",
      ],
      contract_type: [
        "rahmenvertrag",
        "einzelvertrag",
        "nda",
        "avv",
        "retainer",
        "projektvertrag",
      ],
      invoice_status: [
        "entwurf",
        "gesendet",
        "ueberfaellig",
        "bezahlt",
        "storniert",
        "mahnung",
      ],
      lead_source: [
        "projektanfrage",
        "kontaktformular",
        "partner_referral",
        "website",
        "telefon",
        "messe",
        "empfehlung",
        "social_media",
        "google_ads",
        "sonstige",
      ],
      lead_status: [
        "neu",
        "kontaktiert",
        "qualifiziert",
        "angebot_erstellt",
        "verhandlung",
        "gewonnen",
        "verloren",
        "inaktiv",
      ],
      offer_status: [
        "entwurf",
        "gesendet",
        "angesehen",
        "angenommen",
        "abgelehnt",
        "abgelaufen",
      ],
      price_type: ["einmalig", "monatlich", "jaehrlich"],
      product_category: [
        "website",
        "hosting",
        "seo",
        "ki_agent",
        "voicebot",
        "social_media",
        "beratung",
        "prozess",
        "branchenloesung",
        "service",
      ],
      project_status: [
        "planung",
        "aktiv",
        "pausiert",
        "abgeschlossen",
        "abgebrochen",
      ],
      tax_region: ["deutschland", "eu", "drittland"],
    },
  },
} as const
