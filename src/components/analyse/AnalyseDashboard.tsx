// Dashboard-Komponente für die Analyse-App

import React from 'react';
import { Building2, CheckCircle, BarChart, Users, Plus, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientSummary {
  id: string;
  unternehmensname?: string;
  branche?: string;
  status: string;
  modified: string;
}

interface AnalyseDashboardProps {
  clients: ClientSummary[];
  onNewClient: () => void;
  onSelectClient: (id: string) => void;
  isLoading?: boolean;
}

export const AnalyseDashboard: React.FC<AnalyseDashboardProps> = ({
  clients,
  onNewClient,
  onSelectClient,
  isLoading = false
}) => {
  const activeCount = clients.filter(c => c.status === 'aktiv').length;
  const completedCount = clients.filter(c => c.status === 'abgeschlossen').length;
  const draftCount = clients.filter(c => c.status === 'entwurf').length;

  const stats = [
    { label: 'Kunden erfasst', value: clients.length, icon: Building2, color: 'bg-primary' },
    { label: 'Aktive Analysen', value: activeCount, icon: CheckCircle, color: 'bg-green-600' },
    { label: 'Abgeschlossen', value: completedCount, icon: BarChart, color: 'bg-purple-600' },
    { label: 'Entwürfe', value: draftCount, icon: Clock, color: 'bg-amber-600' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktiv':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktiv</Badge>;
      case 'abgeschlossen':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Abgeschlossen</Badge>;
      default:
        return <Badge variant="secondary">Entwurf</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl shadow-xl p-8 border">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Digitale Unternehmensanalyse
              </h1>
              <p className="text-muted-foreground">
                IST-Aufnahme • Analyse • Strategie • Beratungsbericht
              </p>
            </div>
            <Button onClick={onNewClient} size="lg" className="gap-2">
              <Plus size={20} />
              Neue Analyse
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={cn("text-white border-0", stat.color)}>
                  <CardContent className="p-6">
                    <Icon size={32} className="mb-3 opacity-80" />
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Client List */}
          <h2 className="text-2xl font-bold mb-4 text-foreground">Ihre Kunden</h2>

          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>Lade Kunden...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Building2 size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Noch keine Kunden erfasst</p>
              <p className="text-sm">Klicken Sie auf "Neue Analyse" um zu starten</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(client => (
                <Card
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className="group cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary transition">
                          <Building2 size={24} className="text-primary group-hover:text-primary-foreground transition" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition">
                            {client.unternehmensname || 'Unbenannt'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {client.branche || 'Keine Branche'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
                      <span>
                        {new Date(client.modified).toLocaleDateString('de-DE')}
                      </span>
                      {getStatusBadge(client.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyseDashboard;
