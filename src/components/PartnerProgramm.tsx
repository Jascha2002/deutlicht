import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Star,
  Handshake,
  Euro,
  Clock,
  Shield,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

const partnerTypes = [
  {
    id: "steuerberater",
    title: "Steuerberater & Kanzleien",
    description: "Empfehlen Sie Ihren Mandanten digitale Lösungen und profitieren Sie von wiederkehrenden Provisionen.",
    icon: Briefcase,
    benefits: ["Mandantenbindung stärken", "Zusätzliche Einnahmequelle", "Digitale Beratungskompetenz"]
  },
  {
    id: "marketing_agentur",
    title: "Marketing-Agenturen",
    description: "Erweitern Sie Ihr Leistungsportfolio um KI-gestützte Lösungen für Ihre Kunden.",
    icon: TrendingUp,
    benefits: ["Vollständiges Digitalportfolio", "White-Label-Lösungen", "Höhere Kundenbindung"]
  },
  {
    id: "webdesigner",
    title: "Webdesigner & Developer",
    description: "Bieten Sie Ihren Kunden mehr als nur Websites – intelligente Geschäftslösungen.",
    icon: Users,
    benefits: ["Upselling-Möglichkeiten", "Langfristige Kundenbeziehungen", "Technologie-Partnerschaft"]
  },
  {
    id: "it_dienstleister",
    title: "IT-Dienstleister & Systemhäuser",
    description: "Integrieren Sie KI-Agenten in Ihre bestehenden IT-Lösungen und Serviceangebote.",
    icon: Shield,
    benefits: ["Managed Services erweitern", "Automatisierungslösungen", "Wettbewerbsvorteil"]
  },
  {
    id: "unternehmensberater",
    title: "Unternehmensberater",
    description: "Unterstützen Sie Ihre Klienten bei der digitalen Transformation mit konkreten Lösungen.",
    icon: BookOpen,
    benefits: ["Strategieberatung + Umsetzung", "Messbare Ergebnisse", "Langfristige Begleitung"]
  }
];

const benefits = [
  {
    icon: Euro,
    title: "Attraktive Provisionen",
    description: "Bis zu 20% wiederkehrende Provision auf alle vermittelten Projekte"
  },
  {
    icon: Handshake,
    title: "Persönliche Betreuung",
    description: "Dedizierter Partner-Manager für Ihre Anliegen und Fragen"
  },
  {
    icon: Award,
    title: "Schulungen & Zertifizierungen",
    description: "Kostenlose Schulungen und offizielles Partner-Zertifikat"
  },
  {
    icon: Clock,
    title: "Schnelle Abwicklung",
    description: "Monatliche Provisionsauszahlung und transparentes Reporting"
  }
];

// Korrigierte Provisionsstufen:
// Bronze: 100€ - 9.999€ Jahresumsatz → 15%
// Silber: 10.000€ - 24.999€ Jahresumsatz → 17%
// Gold: ab 25.000€ Jahresumsatz → 20%
const commissionTiers = [
  { name: "Bronze", minRevenue: 100, maxRevenue: 9999, rate: 15, color: "bg-amber-600", description: "Ab 100 € Jahresumsatz" },
  { name: "Silber", minRevenue: 10000, maxRevenue: 24999, rate: 17, color: "bg-gray-400", description: "Ab 10.000 € Jahresumsatz" },
  { name: "Gold", minRevenue: 25000, maxRevenue: Infinity, rate: 20, color: "bg-yellow-500", description: "Ab 25.000 € Jahresumsatz" }
];

export function PartnerProgramm() {
  // Angepasst für kleinere Umsätze bei Bronze-Partnern
  const [annualRevenue, setAnnualRevenue] = useState([5000]);
  
  const calculateCommission = () => {
    const revenue = annualRevenue[0];
    
    // Provision erst ab 100€ Jahresumsatz
    if (revenue < 100) {
      return {
        annualRevenue: revenue,
        annualCommission: 0,
        monthlyCommission: 0,
        tier: null,
        belowMinimum: true
      };
    }
    
    // Korrekte Tier-Ermittlung basierend auf Jahresumsatz
    let tier = commissionTiers[0]; // Default Bronze
    if (revenue >= 25000) {
      tier = commissionTiers[2]; // Gold
    } else if (revenue >= 10000) {
      tier = commissionTiers[1]; // Silber
    }
    
    const annualCommission = revenue * (tier.rate / 100);
    return {
      annualRevenue: revenue,
      annualCommission,
      monthlyCommission: annualCommission / 12,
      tier,
      belowMinimum: false
    };
  };
  
  const calculation = calculateCommission();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <Badge variant="outline" className="text-accent border-accent">
          Partner-Programm
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
          Gemeinsam wachsen mit <span className="text-accent">DeutLicht</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Werden Sie Teil unseres Partner-Netzwerks und profitieren Sie von attraktiven 
          Provisionen, exklusiven Schulungen und einer langfristigen Zusammenarbeit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
            <Link to="/partner/anmelden">
              Jetzt Partner werden
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#rechner">
              <Calculator className="mr-2 h-5 w-5" />
              Provision berechnen
            </a>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ihre Vorteile als Partner</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitieren Sie von unserem bewährten Partner-Modell mit transparenten Konditionen.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border/50 hover:border-accent/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Für wen ist das Programm?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unser Partner-Programm richtet sich an Unternehmen, die ihren Kunden 
            Mehrwert durch digitale Lösungen bieten möchten.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerTypes.map((type) => (
            <Card key={type.id} className="border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                  <type.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Commission Tiers - JETZT VOR DEM RECHNER */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Unsere Provisions-Stufen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Je mehr Sie vermitteln, desto höher Ihre Provision – einfach und transparent.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {commissionTiers.map((tier, index) => (
            <Card key={tier.name} className={`border-2 ${index === 2 ? 'border-accent' : 'border-border/50'}`}>
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 rounded-full ${tier.color} mx-auto mb-4 flex items-center justify-center`}>
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <p className="text-4xl font-bold text-accent">{tier.rate}%</p>
                <p className="text-sm text-muted-foreground">Provision</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm font-medium">{tier.description}</p>
                {tier.maxRevenue !== Infinity && (
                  <p className="text-xs text-muted-foreground mt-1">
                    bis {tier.maxRevenue.toLocaleString('de-DE')} € Jahresumsatz
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Commission Calculator - JETZT NACH DEN STUFEN */}
      <section id="rechner" className="scroll-mt-24">
        <Card className="border-accent/20 bg-gradient-to-br from-background to-accent/5">
          <CardHeader className="text-center">
            <Badge variant="outline" className="w-fit mx-auto mb-4">
              <Calculator className="h-4 w-4 mr-2" />
              Provisions-Rechner
            </Badge>
            <CardTitle className="text-3xl">Berechnen Sie Ihr Potenzial</CardTitle>
            <p className="text-muted-foreground mt-2">
              Sehen Sie, wie viel Sie als DeutLicht-Partner verdienen können
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input - Vereinfacht auf Jahresumsatz */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Vermittelter Jahresumsatz (netto)</span>
                    <span className="text-accent font-bold text-lg">{annualRevenue[0].toLocaleString('de-DE')} €</span>
                  </label>
                  <Slider
                    value={annualRevenue}
                    onValueChange={setAnnualRevenue}
                    min={0}
                    max={50000}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 €</span>
                    <span className="text-amber-600">Bronze ab 100 €</span>
                    <span className="text-gray-500">Silber ab 10.000 €</span>
                    <span className="text-yellow-600">Gold ab 25.000 €</span>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-medium">Hinweis für Bronze-Partner:</p>
                  <p className="text-muted-foreground">
                    Bereits ab 100 € vermitteltem Jahresumsatz erhalten Sie 15% Provision. 
                    Ideal für den Einstieg – auch ohne regelmäßige Vermittlungen.
                  </p>
                </div>
              </div>
              
              {/* Results */}
              <div className="space-y-4">
                {calculation.belowMinimum ? (
                  <div className="rounded-lg p-4 bg-muted border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold text-muted-foreground">Minimum nicht erreicht</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Provisionen werden ab einem vermittelten Jahresumsatz von 100 € berechnet.
                    </p>
                  </div>
                ) : calculation.tier && (
                  <div className={`rounded-lg p-4 ${calculation.tier.color} text-white`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5" />
                      <span className="font-semibold">{calculation.tier.name}-Partner</span>
                      <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                        {calculation.tier.rate}% Provision
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">
                      {calculation.tier.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Monatliche Provision</p>
                      <p className="text-2xl font-bold text-accent">
                        {calculation.monthlyCommission.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Jährliche Provision</p>
                      <p className="text-2xl font-bold text-accent">
                        {calculation.annualCommission.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Basierend auf {calculation.annualRevenue.toLocaleString('de-DE')} € vermitteltem Jahresumsatz (netto)
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
                <Link to="/partner/anmelden">
                  Jetzt Partner werden und profitieren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-accent/5 rounded-2xl px-8">
        <h2 className="font-display text-3xl font-bold">Bereit durchzustarten?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Die Anmeldung ist kostenlos und unverbindlich. Unser Partner-Team meldet sich 
          innerhalb von 1-2 Werktagen bei Ihnen.
        </p>
        <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
          <Link to="/partner/anmelden">
            Kostenlos Partner werden
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default PartnerProgramm;
