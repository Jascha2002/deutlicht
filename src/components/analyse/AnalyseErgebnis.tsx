// Analyse-Ergebnis-Ansicht

import React from 'react';
import { Download, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GesamtAnalyse, Empfehlung } from '@/lib/analysisEngine';
import { cn } from '@/lib/utils';

interface AnalyseErgebnisProps {
  analysis: GesamtAnalyse;
  unternehmensname?: string;
  onDownloadReport: () => void;
  onBack: () => void;
}

const getBewertungColor = (bewertung: string) => {
  switch (bewertung) {
    case 'reif': return 'text-green-600 bg-green-100';
    case 'ausbaufaehig': return 'text-amber-600 bg-amber-100';
    case 'kritisch': return 'text-red-600 bg-red-100';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getBewertungLabel = (bewertung: string) => {
  switch (bewertung) {
    case 'reif': return 'Reif';
    case 'ausbaufaehig': return 'Ausbaufähig';
    case 'kritisch': return 'Kritisch';
    default: return bewertung;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const getPrioritaetBadge = (prioritaet: string) => {
  switch (prioritaet) {
    case 'hoch':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Hoch</Badge>;
    case 'mittel':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Mittel</Badge>;
    default:
      return <Badge variant="secondary">Niedrig</Badge>;
  }
};

export const AnalyseErgebnis: React.FC<AnalyseErgebnisProps> = ({
  analysis,
  unternehmensname,
  onDownloadReport,
  onBack
}) => {
  const bereicheArray = Object.values(analysis.bereiche);
  const topEmpfehlungen = analysis.empfehlungen.slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analyse-Ergebnis: {unternehmensname || 'Unbenannt'}
            </h1>
            <p className="text-muted-foreground">
              Erstellt am {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Zurück zur Bearbeitung
            </Button>
            <Button onClick={onDownloadReport} className="gap-2">
              <Download size={18} />
              Bericht herunterladen
            </Button>
          </div>
        </div>

        {/* Gesamtscore */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Digitalisierungsgrad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className={cn("text-6xl font-bold", getScoreColor(analysis.gesamtscore))}>
                {analysis.gesamtscore}
              </div>
              <div className="flex-1">
                <Progress value={analysis.gesamtscore} className="h-4 mb-2" />
                <p className="text-sm text-muted-foreground">
                  von 100 möglichen Punkten
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bereiche-Übersicht */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bereicheArray.map((bereich) => (
            <Card key={bereich.name}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-foreground">{bereich.label}</h3>
                  <Badge className={getBewertungColor(bereich.bewertung)}>
                    {getBewertungLabel(bereich.bewertung)}
                  </Badge>
                </div>
                <div className={cn("text-3xl font-bold mb-2", getScoreColor(bereich.score))}>
                  {bereich.score}
                </div>
                <Progress value={bereich.score} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stärken & Schwächen */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle />
                Stärken ({analysis.staerken.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.staerken.length === 0 ? (
                <p className="text-muted-foreground">Keine Stärken identifiziert</p>
              ) : (
                <ul className="space-y-2">
                  {analysis.staerken.slice(0, 8).map((staerke, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                      <span>{staerke}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle />
                Handlungsbedarf ({analysis.schwaechen.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.schwaechen.length === 0 ? (
                <p className="text-muted-foreground">Keine Schwächen identifiziert</p>
              ) : (
                <ul className="space-y-2">
                  {analysis.schwaechen.slice(0, 8).map((schwaeche, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <span>{schwaeche}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Empfehlungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-amber-500" />
              Top {topEmpfehlungen.length} Empfehlungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topEmpfehlungen.length === 0 ? (
              <p className="text-muted-foreground">Keine Empfehlungen generiert</p>
            ) : (
              <div className="space-y-4">
                {topEmpfehlungen.map((empfehlung, i) => (
                  <div key={empfehlung.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{empfehlung.titel}</h4>
                          <p className="text-sm text-muted-foreground">{empfehlung.bereich}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getPrioritaetBadge(empfehlung.prioritaet)}
                        {empfehlung.foerderrelevant === 'ja' && (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Förderfähig</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{empfehlung.beschreibung}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span><strong>Nutzen:</strong> {empfehlung.nutzen}</span>
                      <span><strong>Aufwand:</strong> {empfehlung.aufwand}</span>
                      <span><strong>Kosten:</strong> {empfehlung.kosten}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyseErgebnis;
