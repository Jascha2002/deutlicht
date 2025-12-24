import { useState, useEffect } from "react";
import { Accessibility, Plus, Minus, Sun, Moon, Type, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largeSpacing, setLargeSpacing] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setFontSize(settings.fontSize || 100);
      setHighContrast(settings.highContrast || false);
      setLargeSpacing(settings.largeSpacing || false);
      setUnderlineLinks(settings.underlineLinks || false);
    }
  }, []);

  useEffect(() => {
    // Apply settings
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (largeSpacing) {
      document.documentElement.classList.add("large-spacing");
    } else {
      document.documentElement.classList.remove("large-spacing");
    }

    if (underlineLinks) {
      document.documentElement.classList.add("underline-links");
    } else {
      document.documentElement.classList.remove("underline-links");
    }

    // Save preferences
    localStorage.setItem("accessibility-settings", JSON.stringify({
      fontSize,
      highContrast,
      largeSpacing,
      underlineLinks
    }));
  }, [fontSize, highContrast, largeSpacing, underlineLinks]);

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(prev => prev + 10);
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) setFontSize(prev => prev - 10);
  };

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargeSpacing(false);
    setUnderlineLinks(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Barrierefreiheit-Einstellungen öffnen"
        aria-expanded={isOpen}
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Widget Panel */}
      <div
        className={cn(
          "fixed left-4 bottom-20 z-50 bg-card border border-border rounded-xl shadow-xl p-4 w-72 transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
        )}
        role="dialog"
        aria-label="Barrierefreiheit-Einstellungen"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-accent" />
            Barrierefreiheit
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Schriftgröße: {fontSize}%
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
              className="p-2 bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Schrift verkleinern"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all"
                style={{ width: `${((fontSize - 80) / 70) * 100}%` }}
              />
            </div>
            <button
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
              className="p-2 bg-muted hover:bg-muted/80 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Schrift vergrößern"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-3">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              highContrast ? "bg-accent/10 border-accent" : "bg-muted/50 border-transparent hover:bg-muted"
            )}
            aria-pressed={highContrast}
          >
            <span className="flex items-center gap-2 text-sm">
              <Sun className="w-4 h-4" />
              Hoher Kontrast
            </span>
            <span className={cn(
              "w-10 h-6 rounded-full transition-colors flex items-center px-1",
              highContrast ? "bg-accent justify-end" : "bg-muted-foreground/30 justify-start"
            )}>
              <span className="w-4 h-4 bg-white rounded-full shadow" />
            </span>
          </button>

          <button
            onClick={() => setLargeSpacing(!largeSpacing)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              largeSpacing ? "bg-accent/10 border-accent" : "bg-muted/50 border-transparent hover:bg-muted"
            )}
            aria-pressed={largeSpacing}
          >
            <span className="flex items-center gap-2 text-sm">
              <Type className="w-4 h-4" />
              Größerer Zeilenabstand
            </span>
            <span className={cn(
              "w-10 h-6 rounded-full transition-colors flex items-center px-1",
              largeSpacing ? "bg-accent justify-end" : "bg-muted-foreground/30 justify-start"
            )}>
              <span className="w-4 h-4 bg-white rounded-full shadow" />
            </span>
          </button>

          <button
            onClick={() => setUnderlineLinks(!underlineLinks)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
              underlineLinks ? "bg-accent/10 border-accent" : "bg-muted/50 border-transparent hover:bg-muted"
            )}
            aria-pressed={underlineLinks}
          >
            <span className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 underline font-bold">A</span>
              Links unterstreichen
            </span>
            <span className={cn(
              "w-10 h-6 rounded-full transition-colors flex items-center px-1",
              underlineLinks ? "bg-accent justify-end" : "bg-muted-foreground/30 justify-start"
            )}>
              <span className="w-4 h-4 bg-white rounded-full shadow" />
            </span>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetAll}
          className="w-full mt-4 flex items-center justify-center gap-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Zurücksetzen
        </button>
      </div>
    </>
  );
};

export default AccessibilityWidget;
