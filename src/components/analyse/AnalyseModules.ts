// Module-Definitionen für die Digitalisierungs-Analyse

import { 
  Building2, Globe, Database, Settings, FileText, Target, 
  Users, Share2, BarChart3, BookOpen
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface AnalyseModule {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const ANALYSE_MODULES: AnalyseModule[] = [
  { id: 'stammdaten', label: 'Stammdaten', icon: Building2, description: 'Unternehmensprofil & Basisdaten' },
  { id: 'online', label: 'Online', icon: Globe, description: 'Website, SEO & E-Commerce' },
  { id: 'social', label: 'Social Media', icon: Share2, description: 'Kanäle, Content & Newsletter' },
  { id: 'systeme', label: 'Systeme', icon: Database, description: 'CRM, ERP & Dokumentenmanagement' },
  { id: 'prozesse', label: 'Prozesse', icon: Settings, description: 'Vertrieb, Aufträge & Service' },
  { id: 'daten', label: 'Daten & Sicherheit', icon: FileText, description: 'Backup, DSGVO & IT-Security' },
  { id: 'reporting', label: 'Reporting', icon: BarChart3, description: 'Kennzahlen & Dashboards' },
  { id: 'schulung', label: 'Wissen', icon: BookOpen, description: 'Onboarding & Dokumentation' },
  { id: 'ziele', label: 'Ziele', icon: Target, description: 'Digitalisierungsziele & Budget' },
  { id: 'intern', label: 'Intern', icon: Users, description: 'Interne Einschätzung (für Berater)' }
];

export const getModuleById = (id: string): AnalyseModule | undefined => {
  return ANALYSE_MODULES.find(m => m.id === id);
};
