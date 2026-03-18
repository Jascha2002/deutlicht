import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ExternalLink, ArrowRight, Zap, Monitor, Bot, Mic, FileText,
  Globe, Search, Brain, Building2, UtensilsCrossed, Wrench,
  Home, Stethoscope, Calendar, Package, LayoutDashboard, Eye, EyeOff
} from 'lucide-react';

const ALL_DEEP_LINKS = [
  // ===== DEUTLICHT – intern =====
  {
    id: 'dl-voicebot-arzt',
    project: 'DeutLicht',
    label: 'Voicebot – Arztpraxis',
    category: 'Voicebot',
    icon: Stethoscope,
    description: 'Terminvereinbarung Arztpraxis – direkt starten',
    route: '/voicebot-demos?scenario=arzt',
    type: 'internal' as const,
  },
  {
    id: 'dl-voicebot-werkstatt',
    project: 'DeutLicht',
    label: 'Voicebot – Werkstatt',
    category: 'Voicebot',
    icon: Wrench,
    description: 'Werkstatt-Terminbuchung Demo',
    route: '/voicebot-demos?scenario=werkstatt',
    type: 'internal' as const,
  },
  {
    id: 'dl-voicebot-hausverwaltung',
    project: 'DeutLicht',
    label: 'Voicebot – Hausverwaltung',
    category: 'Voicebot',
    icon: Building2,
    description: 'Hausverwaltung Kundenservice Demo',
    route: '/voicebot-demos?scenario=hausverwaltung',
    type: 'internal' as const,
  },
  {
    id: 'dl-voicebot-immobilien',
    project: 'DeutLicht',
    label: 'Voicebot – Immobilien',
    category: 'Voicebot',
    icon: Home,
    description: 'Besichtigungstermin buchen',
    route: '/voicebot-demos?scenario=immobilien',
    type: 'internal' as const,
  },
  {
    id: 'dl-voicebot-alle-termine',
    project: 'DeutLicht',
    label: 'Voicebot – Alle Termine',
    category: 'Voicebot',
    icon: Calendar,
    description: 'Alle Terminvereinbarungs-Szenarien',
    route: '/voicebot-demos?category=termine',
    type: 'internal' as const,
  },
  {
    id: 'dl-angebot-website',
    project: 'DeutLicht',
    label: 'Angebotsgenerator – Website',
    category: 'KI-Tools',
    icon: Globe,
    description: 'Angebot mit Website vorausgewählt',
    route: '/angebots-generator?leistung=website',
    type: 'internal' as const,
  },
  {
    id: 'dl-angebot-ki',
    project: 'DeutLicht',
    label: 'Angebotsgenerator – KI',
    category: 'KI-Tools',
    icon: Bot,
    description: 'Angebot mit KI-Agenten vorausgewählt',
    route: '/angebots-generator?leistung=ki',
    type: 'internal' as const,
  },
  {
    id: 'dl-angebot-voicebot',
    project: 'DeutLicht',
    label: 'Angebotsgenerator – Voicebot',
    category: 'KI-Tools',
    icon: Mic,
    description: 'Angebot mit Voicebot vorausgewählt',
    route: '/angebots-generator?leistung=voicebot',
    type: 'internal' as const,
  },
  {
    id: 'dl-ki-check',
    project: 'DeutLicht',
    label: 'KI-Readiness-Check',
    category: 'KI-Tools',
    icon: Brain,
    description: 'KI-Bereitschaft des Kunden analysieren',
    route: '/ki-check',
    type: 'internal' as const,
  },
  {
    id: 'dl-admin',
    project: 'DeutLicht',
    label: 'Admin Dashboard',
    category: 'Admin',
    icon: LayoutDashboard,
    description: 'DeutLicht Admin-Bereich zeigen',
    route: '/admin',
    type: 'internal' as const,
  },

  // ===== NEXTPHONES – extern =====
  {
    id: 'np-admin-dashboard',
    project: 'nextphones',
    label: 'Admin – Dashboard',
    category: 'Admin-Bereich',
    icon: LayoutDashboard,
    description: 'Übersicht: Anfragen, Statistiken',
    url: 'https://nextphonevorlage1.lovable.app/admin?demo=true',
    type: 'external' as const,
  },
  {
    id: 'np-aktionen',
    project: 'nextphones',
    label: 'Admin – Aktionen',
    category: 'Admin-Bereich',
    icon: Zap,
    description: 'Tarif-Aktionen erstellen & verwalten',
    url: 'https://nextphonevorlage1.lovable.app/admin/aktionen?demo=true',
    type: 'external' as const,
  },
  {
    id: 'np-pakete',
    project: 'nextphones',
    label: 'Admin – Paket-Anfragen',
    category: 'Admin-Bereich',
    icon: Package,
    description: 'Bundle-Anfragen & Status',
    url: 'https://nextphonevorlage1.lovable.app/admin/pakete?demo=true',
    type: 'external' as const,
  },
  {
    id: 'np-bewertungen',
    project: 'nextphones',
    label: 'Admin – Bewertungen',
    category: 'Admin-Bereich',
    icon: Monitor,
    description: 'Bewertungen + Pie/Bar Charts',
    url: 'https://nextphonevorlage1.lovable.app/admin/bewertungen?demo=true',
    type: 'external' as const,
  },
  {
    id: 'np-standorte',
    project: 'nextphones',
    label: 'Admin – Standorte',
    category: 'Admin-Bereich',
    icon: Building2,
    description: 'Standorte & Öffnungszeiten',
    url: 'https://nextphonevorlage1.lovable.app/admin/standorte?demo=true',
    type: 'external' as const,
  },
  {
    id: 'np-tarifrechner',
    project: 'nextphones',
    label: 'Tarif-Rechner',
    category: 'Interaktive Tools',
    icon: FileText,
    description: 'Multi-Step Tarif-Empfehlungs-Tool',
    url: 'https://nextphonevorlage1.lovable.app/tarif-rechner',
    type: 'external' as const,
  },
  {
    id: 'np-pakete-konfigurator',
    project: 'nextphones',
    label: 'Bundle-Konfigurator',
    category: 'Interaktive Tools',
    icon: Package,
    description: 'Pakete konfigurieren & anfragen',
    url: 'https://nextphonevorlage1.lovable.app/pakete',
    type: 'external' as const,
  },
  {
    id: 'np-strom-check',
    project: 'nextphones',
    label: 'Strom-Check',
    category: 'Interaktive Tools',
    icon: Zap,
    description: 'Kostenloser Energietarif-Check',
    url: 'https://nextphonevorlage1.lovable.app/strom-check',
    type: 'external' as const,
  },

  // ===== CU-DINE – extern =====
  {
    id: 'cu-admin-dashboard',
    project: 'CU Kantine',
    label: 'Admin – Dashboard',
    category: 'Admin-Bereich',
    icon: LayoutDashboard,
    description: 'Kantinen-Übersicht & Statistiken',
    url: 'https://cu-dine-and-rent.lovable.app/admin/dashboard?demo=true',
    type: 'external' as const,
  },
  {
    id: 'cu-wochenkarten',
    project: 'CU Kantine',
    label: 'Admin – Wochenkarten',
    category: 'Admin-Bereich',
    icon: UtensilsCrossed,
    description: 'Speisekarten Mo-Do, Menü 1/2/Vegi/Suppe',
    url: 'https://cu-dine-and-rent.lovable.app/admin/weekly-menus?demo=true',
    type: 'external' as const,
  },
  {
    id: 'cu-menu-upload',
    project: 'CU Kantine',
    label: 'Admin – Bistro Ophelia Menü',
    category: 'Admin-Bereich',
    icon: FileText,
    description: 'Speiseplan & Snackkarte als PDF',
    url: 'https://cu-dine-and-rent.lovable.app/admin/menu-upload?demo=true',
    type: 'external' as const,
  },
  {
    id: 'cu-jobs',
    project: 'CU Kantine',
    label: 'Admin – Stellenanzeigen',
    category: 'Admin-Bereich',
    icon: Monitor,
    description: 'Jobs verwalten & Bewerbungen',
    url: 'https://cu-dine-and-rent.lovable.app/admin/jobs?demo=true',
    type: 'external' as const,
  },
  {
    id: 'cu-vorbestellen',
    project: 'CU Kantine',
    label: 'Vorbestellsystem',
    category: 'Kundenbereich',
    icon: UtensilsCrossed,
    description: 'Mittagessen vorbestellen – Live',
    url: 'https://cu-dine-and-rent.lovable.app/vorbestellen',
    type: 'external' as const,
  },
  {
    id: 'cu-kantinen',
    project: 'CU Kantine',
    label: 'Kantinen-Übersicht',
    category: 'Kundenbereich',
    icon: Building2,
    description: 'BZO, Bistro Ophelia, AWO, IHK',
    url: 'https://cu-dine-and-rent.lovable.app/kantinen',
    type: 'external' as const,
  },
];

const PROJECT_COLORS: Record<string, string> = {
  'DeutLicht': 'bg-blue-100 text-blue-800',
  'nextphones': 'bg-amber-100 text-amber-800',
  'CU Kantine': 'bg-orange-100 text-orange-800',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Voicebot': 'bg-blue-50 text-blue-700',
  'KI-Tools': 'bg-purple-50 text-purple-700',
  'Admin-Bereich': 'bg-amber-50 text-amber-700',
  'Interaktive Tools': 'bg-teal-50 text-teal-700',
  'Kundenbereich': 'bg-green-50 text-green-700',
  'Admin': 'bg-gray-100 text-gray-700',
};

export function DemosManagement() {
  const navigate = useNavigate();
  const [presentationMode, setPresentationMode] = useState(false);

  const handleClick = (link: typeof ALL_DEEP_LINKS[0]) => {
    if (link.type === 'internal') {
      navigate(link.route!);
    } else {
      window.open(link.url!, '_blank');
    }
  };

  const projects = ['DeutLicht', 'nextphones', 'CU Kantine'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Demos & Referenzen</h2>
          <p className="text-sm text-muted-foreground">
            Alle Module direkt öffnen – intern oder in neuem Tab
          </p>
        </div>
        <Button
          variant={presentationMode ? "default" : "outline"}
          onClick={() => setPresentationMode(!presentationMode)}
          className="gap-2"
        >
          {presentationMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {presentationMode ? 'Bearbeiten-Modus' : 'Präsentations-Modus'}
        </Button>
      </div>

      {presentationMode && (
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm text-accent-foreground">
          Präsentations-Modus aktiv – Admin-Elemente ausgeblendet. Klick auf ein Modul öffnet es direkt.
        </div>
      )}

      <Tabs defaultValue="schnellzugriff" className="w-full">
        <TabsList>
          <TabsTrigger value="schnellzugriff">Schnellzugriff</TabsTrigger>
          {!presentationMode && (
            <TabsTrigger value="referenzen">Referenzprojekte</TabsTrigger>
          )}
        </TabsList>

        {/* ===== SCHNELLZUGRIFF ===== */}
        <TabsContent value="schnellzugriff" className="space-y-8">
          {projects.map(project => {
            const links = ALL_DEEP_LINKS.filter(l => l.project === project);
            const categories = [...new Set(links.map(l => l.category))];

            return (
              <div key={project} className="space-y-4">
                {/* Projekt-Header */}
                <div className="flex items-center gap-3">
                  <Badge className={PROJECT_COLORS[project] || 'bg-muted text-muted-foreground'}>
                    {project}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {links.length} Module
                  </span>
                </div>

                {/* Kategorien */}
                {categories.map(category => {
                  const catLinks = links.filter(l => l.category === category);
                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {catLinks.map(link => {
                          const Icon = link.icon;
                          return (
                            <Card
                              key={link.id}
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleClick(link)}
                            >
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-muted">
                                    <Icon className="w-5 h-5 text-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-foreground">{link.label}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {link.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[link.category] || ''}`}>
                                    {link.category}
                                  </Badge>
                                  {link.type === 'external'
                                    ? <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    : <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                  }
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </TabsContent>

        {/* ===== REFERENZPROJEKTE ===== */}
        {!presentationMode && (
          <TabsContent value="referenzen">
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <Monitor className="w-12 h-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Referenzprojekte</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Hier kannst du Kundenprojekte anlegen und ihnen Module aus dem Schnellzugriff zuweisen.
              </p>
              <Button variant="outline" disabled>
                + Neues Projekt anlegen
              </Button>
              <p className="text-xs text-muted-foreground">
                (Datenbank-Tabellen demo_references + demo_modules werden bei Bedarf erstellt)
              </p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
