// Haupt-Analyse-App mit allen Modulen

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Save, BarChart, Download, ChevronLeft, ChevronRight, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { ANALYSE_MODULES, AnalyseModule } from './AnalyseModules';
import AnalyseDashboard from './AnalyseDashboard';
import AnalyseErgebnis from './AnalyseErgebnis';
import BeratungsberichtView from './BeratungsberichtView';
import StammdatenModule from './modules/StammdatenModule';
import OnlineModule from './modules/OnlineModule';
import SocialModule from './modules/SocialModule';
import SystemeModule from './modules/SystemeModule';
import ProzesseModule from './modules/ProzesseModule';
import DatenModule from './modules/DatenModule';
import ReportingModule from './modules/ReportingModule';
import SchulungModule from './modules/SchulungModule';
import ZieleModule from './modules/ZieleModule';
import InternModule from './modules/InternModule';
import { analyzeClientData, GesamtAnalyse, ClientData } from '@/lib/analysisEngine';
import { generateBeratungsberichtMarkdown } from '@/lib/reportGenerator';
import { cn } from '@/lib/utils';

interface ClientSummary {
  id: string;
  unternehmensname?: string;
  branche?: string;
  status: string;
  modified: string;
}

type ViewType = 'dashboard' | 'form' | 'analyse' | 'bericht';

export const DigitalisierungsAnalyseApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [view, setView] = useState<ViewType>('dashboard');
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [analysis, setAnalysis] = useState<GesamtAnalyse | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('kunde');
  const [isSendingToOdoo, setIsSendingToOdoo] = useState(false);
  
  // Form data for all modules
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>({
    stammdaten: {},
    online: {},
    social: {},
    systeme: {},
    prozesse: {},
    daten: {},
    reporting: {},
    schulung: {},
    ziele: {},
    intern: {}
  });

  const currentModule = ANALYSE_MODULES[currentModuleIndex];

  // Check auth and load user role
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      checkUserRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      setTimeout(() => {
        checkUserRole(session.user.id);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (data && data.length > 0) {
        // Check for highest role
        if (data.some(r => r.role === 'admin')) {
          setUserRole('admin');
        } else if (data.some(r => r.role === 'mitarbeiter')) {
          setUserRole('mitarbeiter');
        } else {
          setUserRole('kunde');
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const canEdit = userRole === 'admin' || userRole === 'mitarbeiter';

  // Load clients on mount
  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('analysis_clients')
        .select('id, unternehmensname, branche, status, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setClients((data || []).map(c => ({
        id: c.id,
        unternehmensname: c.unternehmensname,
        branche: c.branche || undefined,
        status: c.status,
        modified: c.updated_at
      })));
    } catch (err) {
      console.error('Error loading clients:', err);
      toast({
        title: 'Fehler beim Laden',
        description: 'Kunden konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadClientDetails = async (clientId: string) => {
    setIsLoading(true);
    try {
      // Load all related tables in parallel
      const [
        { data: client },
        { data: online },
        { data: social },
        { data: systeme },
        { data: prozesse },
        { data: daten },
        { data: reporting },
        { data: schulung },
        { data: ziele },
        { data: intern }
      ] = await Promise.all([
        supabase.from('analysis_clients').select('*').eq('id', clientId).single(),
        supabase.from('analysis_online').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_social').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_systeme').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_prozesse').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_daten').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_reporting').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_schulung').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_ziele').select('*').eq('client_id', clientId).maybeSingle(),
        supabase.from('analysis_intern').select('*').eq('client_id', clientId).maybeSingle()
      ]);

      setFormData({
        stammdaten: client || {},
        online: online || {},
        social: social || {},
        systeme: systeme || {},
        prozesse: prozesse || {},
        daten: daten || {},
        reporting: reporting || {},
        schulung: schulung || {},
        ziele: ziele || {},
        intern: intern || {}
      });

      setCurrentClientId(clientId);
      setCurrentModuleIndex(0);
      setView('form');
    } catch (err) {
      console.error('Error loading client details:', err);
      toast({
        title: 'Fehler beim Laden',
        description: 'Details konnten nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewClient = () => {
    setCurrentClientId(null);
    setFormData({
      stammdaten: {},
      online: {},
      social: {},
      systeme: {},
      prozesse: {},
      daten: {},
      reporting: {},
      schulung: {},
      ziele: {},
      intern: {}
    });
    setAnalysis(null);
    setCurrentModuleIndex(0);
    setView('form');
  };

  const handleChange = (module: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [field]: value
      }
    }));
  };

  const saveClient = async () => {
    if (!formData.stammdaten.unternehmensname) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie einen Unternehmensnamen ein.',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Nicht angemeldet',
          description: 'Bitte melden Sie sich an.',
          variant: 'destructive'
        });
        return;
      }

      let clientId = currentClientId;

      // Create or update main client record
      if (!clientId) {
        const { data, error } = await supabase
          .from('analysis_clients')
          .insert({
            created_by: user.id,
            unternehmensname: formData.stammdaten.unternehmensname,
            branche: formData.stammdaten.branche,
            rechtsform: formData.stammdaten.rechtsform,
            gruendungsjahr: formData.stammdaten.gruendungsjahr ? parseInt(formData.stammdaten.gruendungsjahr) : null,
            mitarbeiterzahl: formData.stammdaten.mitarbeiterzahl ? parseInt(formData.stammdaten.mitarbeiterzahl) : null,
            mitarbeiterzahl_kategorie: formData.stammdaten.mitarbeiterzahl_kategorie,
            jahresumsatz_kategorie: formData.stammdaten.jahresumsatz_kategorie,
            standorte: formData.stammdaten.standorte,
            hauptsitz_plz: formData.stammdaten.hauptsitz_plz,
            hauptsitz_ort: formData.stammdaten.hauptsitz_ort,
            ansprechpartner_name: formData.stammdaten.ansprechpartner_name,
            ansprechpartner_position: formData.stammdaten.ansprechpartner_position,
            ansprechpartner_email: formData.stammdaten.ansprechpartner_email,
            ansprechpartner_telefon: formData.stammdaten.ansprechpartner_telefon,
            geschaeftsmodell: formData.stammdaten.geschaeftsmodell,
            zielgruppen_b2b: formData.stammdaten.zielgruppen_b2b,
            zielgruppen_b2c: formData.stammdaten.zielgruppen_b2c,
            zielgruppen_beschreibung: formData.stammdaten.zielgruppen_beschreibung,
            status: 'entwurf'
          })
          .select()
          .single();

        if (error) throw error;
        clientId = data.id;
        setCurrentClientId(clientId);
      } else {
        const { error } = await supabase
          .from('analysis_clients')
          .update({
            modified_by: user.id,
            unternehmensname: formData.stammdaten.unternehmensname,
            branche: formData.stammdaten.branche,
            rechtsform: formData.stammdaten.rechtsform,
            gruendungsjahr: formData.stammdaten.gruendungsjahr ? parseInt(formData.stammdaten.gruendungsjahr) : null,
            mitarbeiterzahl: formData.stammdaten.mitarbeiterzahl ? parseInt(formData.stammdaten.mitarbeiterzahl) : null,
            mitarbeiterzahl_kategorie: formData.stammdaten.mitarbeiterzahl_kategorie,
            jahresumsatz_kategorie: formData.stammdaten.jahresumsatz_kategorie,
            standorte: formData.stammdaten.standorte,
            hauptsitz_plz: formData.stammdaten.hauptsitz_plz,
            hauptsitz_ort: formData.stammdaten.hauptsitz_ort,
            ansprechpartner_name: formData.stammdaten.ansprechpartner_name,
            ansprechpartner_position: formData.stammdaten.ansprechpartner_position,
            ansprechpartner_email: formData.stammdaten.ansprechpartner_email,
            ansprechpartner_telefon: formData.stammdaten.ansprechpartner_telefon,
            geschaeftsmodell: formData.stammdaten.geschaeftsmodell,
            zielgruppen_b2b: formData.stammdaten.zielgruppen_b2b,
            zielgruppen_b2c: formData.stammdaten.zielgruppen_b2c,
            zielgruppen_beschreibung: formData.stammdaten.zielgruppen_beschreibung,
            updated_at: new Date().toISOString()
          })
          .eq('id', clientId);

        if (error) throw error;
      }

      // Upsert related tables
      const upsertPromises = [
        supabase.from('analysis_online').upsert({ client_id: clientId, ...formData.online }, { onConflict: 'client_id' }),
        supabase.from('analysis_social').upsert({ client_id: clientId, ...formData.social }, { onConflict: 'client_id' }),
        supabase.from('analysis_systeme').upsert({ client_id: clientId, ...formData.systeme }, { onConflict: 'client_id' }),
        supabase.from('analysis_prozesse').upsert({ client_id: clientId, ...formData.prozesse }, { onConflict: 'client_id' }),
        supabase.from('analysis_daten').upsert({ client_id: clientId, ...formData.daten }, { onConflict: 'client_id' }),
        supabase.from('analysis_reporting').upsert({ client_id: clientId, ...formData.reporting }, { onConflict: 'client_id' }),
        supabase.from('analysis_schulung').upsert({ client_id: clientId, ...formData.schulung }, { onConflict: 'client_id' }),
        supabase.from('analysis_ziele').upsert({ client_id: clientId, ...formData.ziele }, { onConflict: 'client_id' }),
        supabase.from('analysis_intern').upsert({ client_id: clientId, ...formData.intern }, { onConflict: 'client_id' })
      ];

      await Promise.all(upsertPromises);

      toast({
        title: 'Gespeichert',
        description: 'Alle Daten wurden erfolgreich gespeichert.'
      });

      await loadClients();
    } catch (err) {
      console.error('Error saving:', err);
      toast({
        title: 'Fehler beim Speichern',
        description: 'Daten konnten nicht gespeichert werden.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const runAnalysis = () => {
    const clientData: ClientData = {
      stammdaten: formData.stammdaten,
      online: formData.online,
      systeme: formData.systeme,
      prozesse: formData.prozesse,
      daten: formData.daten,
      social: formData.social,
      reporting: formData.reporting,
      schulung: formData.schulung
    };

    const result = analyzeClientData(clientData);
    setAnalysis(result);
    setView('analyse');
  };

  // Send to Odoo CRM and generate report
  const completeAnalysisAndSendToOdoo = async () => {
    setIsSendingToOdoo(true);
    
    try {
      // First save the client
      await saveClient();
      
      // Run the analysis
      const clientData: ClientData = {
        stammdaten: formData.stammdaten,
        online: formData.online,
        systeme: formData.systeme,
        prozesse: formData.prozesse,
        daten: formData.daten,
        social: formData.social,
        reporting: formData.reporting,
        schulung: formData.schulung
      };

      const result = analyzeClientData(clientData);
      setAnalysis(result);

      // Prepare data for Odoo CRM
      const odooData = {
        name: `Digitalisierungsanalyse: ${formData.stammdaten.unternehmensname}`,
        contact_name: formData.stammdaten.ansprechpartner_name,
        email_from: formData.stammdaten.ansprechpartner_email,
        phone: formData.stammdaten.ansprechpartner_telefon,
        company_name: formData.stammdaten.unternehmensname,
        street: '',
        city: formData.stammdaten.hauptsitz_ort,
        zip: formData.stammdaten.hauptsitz_plz,
        description: `Digitalisierungsanalyse abgeschlossen.\n\nGesamtscore: ${result.gesamtscore}/100\n\nTop Empfehlungen:\n${result.empfehlungen.slice(0, 5).map(e => `- ${e.titel}`).join('\n')}\n\nInterne Einschätzung:\n${formData.intern.gesamteindruck || 'Keine Angabe'}\n\nDigitalisierungsgrad: ${formData.intern.digitalisierungsgrad || 'k.A.'}/10`,
        source: 'digitalisierungsanalyse',
        industry: formData.stammdaten.branche,
        company_size: formData.stammdaten.mitarbeiterzahl_kategorie
      };

      // Send to Odoo CRM
      const { data, error } = await supabase.functions.invoke('odoo-crm-lead', {
        body: {
          type: 'analyse',
          data: odooData
        }
      });

      if (error) {
        console.error('Odoo CRM error:', error);
        toast({
          title: 'Hinweis',
          description: 'Analyse erstellt. CRM-Übertragung konnte nicht durchgeführt werden.',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Erfolgreich',
          description: 'Analyse abgeschlossen und an CRM übertragen.'
        });
      }

      // Show the report view
      setView('bericht');
    } catch (error) {
      console.error('Error completing analysis:', error);
      toast({
        title: 'Fehler',
        description: 'Analyse konnte nicht abgeschlossen werden.',
        variant: 'destructive'
      });
    } finally {
      setIsSendingToOdoo(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

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

    const report = generateBeratungsberichtMarkdown(fullClientData as any, analysis);

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Digitalisierungsanalyse_${formData.stammdaten.unternehmensname || 'Unbenannt'}_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderModule = () => {
    const moduleData = formData[currentModule.id] || {};
    const onChange = (field: string, value: any) => handleChange(currentModule.id, field, value);

    switch (currentModule.id) {
      case 'stammdaten':
        return <StammdatenModule data={moduleData} onChange={onChange} />;
      case 'online':
        return <OnlineModule data={moduleData} onChange={onChange} />;
      case 'social':
        return <SocialModule data={moduleData} onChange={onChange} />;
      case 'systeme':
        return <SystemeModule data={moduleData} onChange={onChange} />;
      case 'prozesse':
        return <ProzesseModule data={moduleData} onChange={onChange} />;
      case 'daten':
        return <DatenModule data={moduleData} onChange={onChange} />;
      case 'reporting':
        return <ReportingModule data={moduleData} onChange={onChange} />;
      case 'schulung':
        return <SchulungModule data={moduleData} onChange={onChange} />;
      case 'ziele':
        return <ZieleModule data={moduleData} onChange={onChange} />;
      case 'intern':
        return <InternModule data={moduleData} onChange={onChange} />;
      default:
        return <div className="text-center py-20 text-muted-foreground">Modul nicht gefunden</div>;
    }
  };

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <AnalyseDashboard
        clients={clients}
        onNewClient={handleNewClient}
        onSelectClient={loadClientDetails}
        isLoading={isLoading}
      />
    );
  }

  // Analysis Result View
  if (view === 'analyse' && analysis) {
    return (
      <AnalyseErgebnis
        analysis={analysis}
        unternehmensname={formData.stammdaten.unternehmensname}
        onDownloadReport={downloadReport}
        onBack={() => setView('form')}
      />
    );
  }

  // Report View
  if (view === 'bericht' && analysis) {
    return (
      <BeratungsberichtView
        analysis={analysis}
        formData={formData}
        canEdit={canEdit}
        onBack={() => setView('form')}
      />
    );
  }

  // Check if we're on the last module (Intern)
  const isLastModule = currentModuleIndex === ANALYSE_MODULES.length - 1;

  // Form View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setView('dashboard')}>
              <Home size={24} />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {formData.stammdaten.unternehmensname || 'Neuer Kunde'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formData.stammdaten.branche || 'Analyse in Bearbeitung'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={runAnalysis}
              className="gap-2"
            >
              <BarChart size={18} />
              Analysieren
            </Button>
            <Button
              onClick={saveClient}
              disabled={isSaving}
              className="gap-2"
            >
              <Save size={18} />
              {isSaving ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-thin">
            {ANALYSE_MODULES.map((m, index) => {
              const Icon = m.icon;
              const isActive = currentModuleIndex === index;
              return (
                <button
                  key={m.id}
                  onClick={() => setCurrentModuleIndex(index)}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all text-sm",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon size={18} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-card rounded-xl shadow-lg p-8 border">
          {renderModule()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
            disabled={currentModuleIndex === 0}
            className="gap-2"
          >
            <ChevronLeft size={18} />
            Zurück
          </Button>
          
          {isLastModule ? (
            <Button
              onClick={completeAnalysisAndSendToOdoo}
              disabled={isSendingToOdoo}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              <Send size={18} />
              {isSendingToOdoo ? 'Wird verarbeitet...' : 'Analyse abschließen & Bericht erstellen'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentModuleIndex(Math.min(ANALYSE_MODULES.length - 1, currentModuleIndex + 1))}
              className="gap-2"
            >
              Weiter
              <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalisierungsAnalyseApp;
