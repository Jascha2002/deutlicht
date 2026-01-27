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
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      can_access_client: { Args: { _client_id: string }; Returns: boolean }
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
      app_role: "admin" | "mitarbeiter" | "kunde" | "partner"
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
      app_role: ["admin", "mitarbeiter", "kunde", "partner"],
    },
  },
} as const
