import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Datenschutz = () => {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung | DeutLicht® - Ihre Privatsphäre</title>
        <meta name="description" content="Datenschutzerklärung der DeutLicht® GmbH - Informationen zum Umgang mit Ihren personenbezogenen Daten." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Datenschutzerklärung
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Informationen zum Umgang mit Ihren personenbezogenen Daten
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <ScrollReveal>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  1. Datenschutz auf einen Blick
                </h2>
                
                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                  Allgemeine Hinweise
                </h3>
                <p className="text-muted-foreground mb-4">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                  Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                  Datenerfassung auf dieser Website
                </h3>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                  Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Wie erfassen wir Ihre Daten?</strong><br />
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                  es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten 
                  werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Wofür nutzen wir Ihre Daten?</strong><br />
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                  gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  2. Verantwortliche Stelle
                </h2>
                <div className="text-muted-foreground space-y-1 mb-4">
                  <p className="font-semibold text-foreground">DeutLicht® GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>12345 Berlin</p>
                  <p>Telefon: +49 (0) 30 123 456 78</p>
                  <p>E-Mail: datenschutz@deutlicht.de</p>
                </div>
                <p className="text-muted-foreground">
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                  gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
                  Daten entscheidet.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  3. Ihre Rechte
                </h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und 
                    Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein 
                    Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
                  </p>
                  <p>
                    Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese 
                    jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten 
                    Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                  </p>
                  <p>
                    Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                  </p>
                  <p>
                    Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  4. Datenerfassung auf dieser Website
                </h2>

                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                  Cookies
                </h3>
                <p className="text-muted-foreground mb-4">
                  Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete 
                  und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für 
                  die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem 
                  Endgerät gespeichert.
                </p>
                <p className="text-muted-foreground mb-4">
                  Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies 
                  bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine 
                  automatische Löschung durch Ihren Webbrowser erfolgt.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                  Server-Log-Dateien
                </h3>
                <p className="text-muted-foreground mb-4">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten 
                  Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. 
                  Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
                  Kontaktformular
                </h3>
                <p className="text-muted-foreground mb-4">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                  Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                  der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben 
                  wir nicht ohne Ihre Einwilligung weiter.
                </p>
                <p className="text-muted-foreground mb-4">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                  sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung 
                  vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die 
                  Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an 
                  uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  5. SSL- bzw. TLS-Verschlüsselung
                </h2>
                <p className="text-muted-foreground mb-4">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                  Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber 
                  senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie 
                  daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an 
                  dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
                <p className="text-muted-foreground">
                  Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns 
                  übermitteln, nicht von Dritten mitgelesen werden.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  6. Speicherdauer
                </h2>
                <p className="text-muted-foreground mb-4">
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt 
                  wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die 
                  Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen 
                  oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, 
                  sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer 
                  personenbezogenen Daten haben.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  7. Änderung dieser Datenschutzerklärung
                </h2>
                <p className="text-muted-foreground mb-4">
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                  aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen 
                  in der Datenschutzerklärung umzusetzen.
                </p>
                <p className="text-muted-foreground">
                  Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <div className="p-6 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Stand:</strong> Dezember 2024
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Datenschutz;
