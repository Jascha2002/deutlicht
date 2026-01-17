import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ChevronDown, Sparkles, Bot } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { branchenLoesungen, strategischeBausteine, BranchenLoesung } from "@/data/branchenLoesungen";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackCTAClick } from "@/lib/analytics";
import AnimatedLogo from "@/components/AnimatedLogo";

const BranchenLoesungen = () => {
  const [selectedBranche, setSelectedBranche] = useState<string>("alle");
  const [selectedLoesung, setSelectedLoesung] = useState<BranchenLoesung | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredLoesungen = selectedBranche === "alle" 
    ? branchenLoesungen 
    : branchenLoesungen.filter(l => l.id === selectedBranche);

  const handleOpenDetail = (loesung: BranchenLoesung) => {
    setSelectedLoesung(loesung);
    setDialogOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>KI-Branchenlösungen | DeutLicht KI-Agenten</title>
        <meta name="description" content="Finden Sie die passende KI-Lösung für Ihre Branche. Von Verwaltung über Handwerk bis Gastronomie – DeutLicht bietet maßgeschneiderte KI-Agenten für jede Branche." />
      </Helmet>
      
      <Navigation />
      
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-accent/5 via-background to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-8">
              <AnimatedLogo size="md" />
            </div>
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground border border-accent/30 rounded-full px-4 py-2">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Branchenspezifische KI-Lösungen
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Finden Sie Ihren
                <br />
                <span className="text-accent">DeutLicht Agenten</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Wählen Sie Ihre Branche und entdecken Sie, wie unsere KI-Agenten 
                Ihre spezifischen Herausforderungen lösen.
              </p>
            </div>

            {/* Branch Filter */}
            <div className="max-w-md mx-auto mb-16">
              <Select value={selectedBranche} onValueChange={setSelectedBranche}>
                <SelectTrigger className="w-full h-14 text-lg bg-card border-2 border-border hover:border-accent transition-colors">
                  <SelectValue placeholder="Branche wählen..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="alle" className="text-base py-3">
                    Alle Branchen anzeigen
                  </SelectItem>
                  {branchenLoesungen.map((loesung) => (
                    <SelectItem key={loesung.id} value={loesung.id} className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <loesung.icon className="w-4 h-4 text-accent" />
                        {loesung.branche}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Solutions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLoesungen.map((loesung) => {
                const IconComponent = loesung.icon;
                return (
                  <div
                    key={loesung.id}
                    className="group bg-card border border-border rounded-2xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                          {loesung.branche}
                        </p>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {loesung.botName}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {loesung.loesung}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {loesung.roi.slice(0, 2).map((roi, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3" />
                          {roi}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors"
                      onClick={() => handleOpenDetail(loesung)}
                    >
                      Mehr erfahren
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategic Building Blocks */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Strategische Plattform-Bausteine
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Übergreifende Lösungen, die branchenübergreifend Mehrwert schaffen
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategischeBausteine.map((baustein) => (
                <div
                  key={baustein.id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{baustein.icon}</span>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        baustein.prioritaet === 'High' 
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        Priorität: {baustein.prioritaet}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {baustein.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {baustein.beschreibung}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Bereit für Ihre KI-Lösung?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Starten Sie jetzt Ihre Projektanfrage und erhalten Sie ein individuelles Angebot
              für Ihre Branche.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projektanfrage"
                onClick={() => trackCTAClick("Projektanfrage starten", "branchen-loesungen")}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg font-medium transition-all hover:scale-105"
              >
                Projektanfrage starten
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/ki-check"
                onClick={() => trackCTAClick("KI-Check machen", "branchen-loesungen")}
                className="inline-flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border text-foreground px-8 py-4 rounded-lg font-medium transition-colors"
              >
                Kostenloser KI-Check
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedLoesung && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <selectedLoesung.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {selectedLoesung.branche}
                    </p>
                    <DialogTitle className="font-display text-2xl">
                      {selectedLoesung.botName}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedLoesung.loesung}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Problem */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Das Problem
                  </h4>
                  <p className="text-muted-foreground">{selectedLoesung.problem}</p>
                </div>
                
                {/* Anwendungen */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    Konkrete Anwendungen
                  </h4>
                  <ul className="space-y-2">
                    {selectedLoesung.anwendungen.map((anwendung, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {anwendung}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* ROI */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Ihr ROI
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLoesung.roi.map((roi, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        → {roi}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Detailbeschreibung */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    Im Detail
                  </h4>
                  <p className="text-muted-foreground">{selectedLoesung.detailbeschreibung}</p>
                </div>
                
                {/* CTA */}
                <div className="pt-4 border-t border-border">
                  <Link
                    to="/projektanfrage"
                    onClick={() => {
                      trackCTAClick(`Projektanfrage ${selectedLoesung.botName}`, "branchen-detail-modal");
                      setDialogOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Jetzt Projektanfrage für {selectedLoesung.branche}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default BranchenLoesungen;
