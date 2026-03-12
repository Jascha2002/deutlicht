import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Share2, Heart, Dna, CheckCircle, Sparkles, Quote } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

import codsHeroBg from "@/assets/cods-hero-bg.jpg";
import codsBusiness from "@/assets/cods-business.jpg";
import codsConnect from "@/assets/cods-connect.jpg";
import codsLife from "@/assets/cods-life.jpg";
import carstenImg from "@/assets/carsten-van-de-sand.jpg";

const produkte = [
{
  id: "business",
  name: "CODS Business",
  subtitle: "Der Prozess-Architekt",
  icon: Building2,
  image: codsBusiness,
  beschreibung:
  "Vollständige Abbildung von Unternehmensprozessen. Inklusive ERP-Anbindung, Warenwirtschaft und Auftragsmanagement.",
  zielgruppe: "Mittelstand, Handwerksbetriebe, E-Commerce-Unternehmen",
  nutzen:
  "Wegfall von Insellösungen. Alle Daten fließen in einem codierten System zusammen.",
  features: [
  "ERP-Integration & Warenwirtschaft",
  "Auftragsmanagement & Workflow-Automatisierung",
  "Zentrale Datenhaltung ohne Medienbrüche",
  "Skalierbar vom Einmannbetrieb bis zum Mittelstand"]

},
{
  id: "connect",
  name: "CODS Connect",
  subtitle: "Der Kommunikations-Knotenpunkt",
  icon: Share2,
  image: codsConnect,
  beschreibung:
  "Vernetzung von Kommunikationskanälen. Direkte Anbindung von Social Media Feeds (Instagram, LinkedIn etc.) mit Rückfluss von Interaktionsdaten in das CRM.",
  zielgruppe: "Marketingagenturen, Vereine, öffentliche Institutionen",
  nutzen:
  "Maximale Reichweite bei minimalem Pflegeaufwand durch automatisierte Schnittstellen.",
  features: [
  "Social Media Feed-Integration (Instagram, LinkedIn, etc.)",
  "Automatischer Rückfluss in CRM-Systeme",
  "Cross-Channel-Analyse & Reporting",
  "Content-Automatisierung & Planung"]

},
{
  id: "life",
  name: "CODS Life",
  subtitle: "Die individuelle Lebenshilfe",
  icon: Heart,
  image: codsLife,
  beschreibung:
  "Ein System, das private und berufliche Bedürfnisse synchronisiert. Individual-Programmierung für spezifische Lebenslagen.",
  zielgruppe:
  "Privatpersonen mit komplexen Verwaltungsbedürfnissen, Stiftungen, familiengeführte Unternehmen",
  nutzen:
  "Digitale Ordnung, die sich dem Menschen anpasst, nicht umgekehrt.",
  features: [
  "Familienverwaltung für große Stammbäume",
  "Persönliche Wissensdatenbanken",
  "Synchronisation privater & beruflicher Daten",
  "Individuelle Programmierung nach Lebenslage"]

}];


const CODS = () => {
  return (
    <>
      <Helmet>
        <title>CODS – Codierte Daten Systeme | Die Digitale DNA von DeutLicht®</title>
        <meta
          name="description"
          content="CODS (Codierte Daten Systeme) – Die Erfindung von Carsten van de Sand. Intelligente, mitwachsende digitale Organismen für Business, Kommunikation und Leben." />
        
        <link rel="canonical" href="https://deutlicht.de/cods" />
      </Helmet>

      <Navigation />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={codsHeroBg}
              alt="CODS Digitale DNA Visualisierung"
              className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-5 py-2.5 bg-primary/80 backdrop-blur-sm mb-8">
                <Dna className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent tracking-wider uppercase">
                  Eine Erfindung aus Gera
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-primary-foreground mb-6">
                <span className="text-accent">CODS</span>
                <br />
                <span className="text-3xl sm:text-4xl md:text-5xl font-medium opacity-90">
                  Codierte Daten Systeme
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-xl sm:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                Intelligente, mitwachsende digitale Organismen – die{" "}
                <strong className="text-accent">Digitale DNA</strong> hinter
                allen Lösungen von DeutLicht®.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/projektanfrage"
                  className="group flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-medium transition-all hover:scale-105">
                  
                  CODS-System anfragen
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#produkte"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all hover:bg-primary-foreground/20">
                  
                  Leistungsklassen entdecken
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Was ist CODS */}
        <section className="py-20 sm:py-28 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  Die Vision
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-4">
                  Was ist <span className="text-accent">CODS</span>?
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-10 h-10 text-accent flex-shrink-0 mt-1" />
                  <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground/90 italic">„CODS sind weit mehr als Webseiten. Sie sind intelligente, mitwachsende Organismen. Geboren aus der tiefen Verwurzelung des Erfinders in seiner Heimatstadt Gera und seiner familiären Geschichte, die bis ins erste Jahrtausend vom Niederrhein zurückreicht, steht CODS für Beständigkeit und Fortschritt zugleich."






                  </blockquote>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-6">
                  In einer Zeit, in der Software oft von der Stange kommt, setzt
                  Carsten van de Sand, Gründer der Stadtnetz UG, ein Zeichen für
                  echte Individualität. Mit seiner 2026 vorgestellten Erfindung
                  CODS schafft er eine Brücke zwischen menschlichen Bedürfnissen
                  und digitaler Effizienz. Ob es um die komplexe Anbindung von
                  Unternehmensprozessen (ERP) oder die intuitive Verknüpfung
                  sozialer Medien geht: Ein CODS-System wird exakt auf den
                  Nutzer zugeschnitten. Es ist die Antwort auf die Frage, wie
                  wir im digitalen Zeitalter arbeiten und leben wollen –
                  maßgeschneidert, sicher und effizient.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Produkte / Leistungsklassen */}
        <section id="produkte" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  Drei Leistungsklassen
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-4">
                  CODS-<span className="text-accent">Produktfamilie</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Drei dedizierte Systeme, ein gemeinsames Fundament: Ihre
                  individuelle Digitale DNA.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-20">
              {produkte.map((produkt, index) => {
                const Icon = produkt.icon;
                const isReversed = index % 2 !== 0;
                return (
                  <ScrollReveal key={produkt.id} delay={index * 0.1}>
                    <div
                      className={`flex flex-col ${
                      isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`
                      }>
                      
                      {/* Image */}
                      <div className="w-full lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square">
                          <img
                            src={produkt.image}
                            alt={produkt.name}
                            className="w-full h-full object-cover"
                            loading="lazy" />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                          <div className="absolute bottom-6 left-6">
                            <div className="flex items-center gap-3 bg-primary/80 backdrop-blur-sm rounded-xl px-5 py-3 border border-accent/20">
                              <Icon className="w-6 h-6 text-accent" />
                              <span className="font-display text-xl font-bold text-primary-foreground">
                                {produkt.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="w-full lg:w-1/2 space-y-6">
                        <div>
                          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                            {produkt.subtitle}
                          </span>
                          <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
                            {produkt.name}
                          </h3>
                        </div>

                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {produkt.beschreibung}
                        </p>

                        <div className="bg-muted/50 rounded-xl p-5 border border-border">
                          <p className="text-sm font-semibold text-foreground mb-1">
                            Zielgruppe
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {produkt.zielgruppe}
                          </p>
                        </div>

                        <div className="bg-accent/10 rounded-xl p-5 border border-accent/20">
                          <p className="text-sm font-semibold text-accent mb-1">
                            Ihr Nutzen
                          </p>
                          <p className="text-foreground text-sm">
                            {produkt.nutzen}
                          </p>
                        </div>

                        <ul className="space-y-3">
                          {produkt.features.map((feature) =>
                          <li
                            key={feature}
                            className="flex items-start gap-3">
                            
                              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-foreground/80">
                                {feature}
                              </span>
                            </li>
                          )}
                        </ul>

                        <Link
                          to="/projektanfrage"
                          className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all">
                          
                          {produkt.name} anfragen
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>);

              })}
            </div>
          </div>
        </section>

        {/* Der Erfinder */}
        <section className="py-20 sm:py-28 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-accent font-medium uppercase tracking-widest text-sm">
                  Der Visionär
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mt-4">
                  Die Revolution aus{" "}
                  <span className="text-accent">Gera</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex flex-col lg:flex-row gap-10 items-center">
                <div className="w-full lg:w-2/5">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4]">
                    <img
                      src={carstenImg}
                      alt="Carsten van de Sand – Erfinder von CODS"
                      className="w-full h-full object-cover"
                      loading="lazy" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-display text-xl font-bold text-primary-foreground">
                        Carsten van de Sand
                      </p>
                      <p className="text-primary-foreground/70 text-sm">
                        Visionär · Erfinder · Geschäftsführer der Stadtnetz UG
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-3/5 space-y-6">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Wie Carsten van de Sand mit CODS die digitale Welt neu
                    codiert
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-lg">
                    In einer Zeit, in der Software oft von der Stange kommt,
                    setzt Carsten van de Sand, Gründer der Stadtnetz UG, ein
                    Zeichen für echte Individualität. Mit seiner 2026
                    vorgestellten Erfindung CODS (Codierte Daten Systeme) schafft
                    er eine Brücke zwischen menschlichen Bedürfnissen und
                    digitaler Effizienz.
                  </p>

                  <p className="text-muted-foreground leading-relaxed">
                    Geboren aus der tiefen Verwurzelung des Erfinders in seiner
                    Heimatstadt Gera und seiner familiären Geschichte, die bis
                    ins erste Jahrtausend zurückreicht, steht CODS für
                    Beständigkeit und Fortschritt zugleich. Es ist die Antwort
                    auf die Frage, wie wir im digitalen Zeitalter arbeiten und
                    leben wollen – maßgeschneidert, sicher und effizient.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                    {[
                    { label: "Standort", value: "Gera, Thüringen" },
                    { label: "Gegründet", value: "Stadtnetz UG" },
                    { label: "Vorgestellt", value: "2026" }].
                    map((item) =>
                    <div
                      key={item.label}
                      className="bg-card border border-border rounded-xl p-4 text-center">
                      
                        <p className="text-accent font-bold text-lg">
                          {item.value}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {item.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/ueber-uns/hintergrund"
                    className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all pt-2">
                    
                    Mehr über die Geschichte erfahren
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <Sparkles className="w-12 h-12 text-accent mx-auto mb-6" />
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-6">
                Bereit für Ihre{" "}
                <span className="text-accent">Digitale DNA</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                Lassen Sie uns gemeinsam herausfinden, welches CODS-System
                perfekt zu Ihren Anforderungen passt – ob Business, Connect oder
                Life.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/projektanfrage"
                  className="group flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-accent/20">
                  
                  Kostenlose Beratung anfragen
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/kontakt"
                  className="flex items-center gap-2 bg-card border border-border text-foreground px-8 py-4 rounded-lg font-medium transition-all hover:bg-muted">
                  
                  Kontakt aufnehmen
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>);

};

export default CODS;