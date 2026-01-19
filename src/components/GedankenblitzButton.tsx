import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GedankenblitzModal from './GedankenblitzModal';

const GedankenblitzButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 left-6 z-50 group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Gedankenblitz öffnen – KI-Brainstorming starten"
            >
              {/* Pulse ring animation */}
              <span className="absolute inset-0 rounded-full bg-gold-400/30 animate-ping" />
              
              {/* Hover burst ring */}
              <span className="absolute inset-0 rounded-full bg-gold-400/20 scale-100 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
              
              {/* Icon container with scale animation */}
              <span className="relative z-10 animate-pulse-subtle">
                <Zap className="w-7 h-7 fill-current" />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="bg-card text-card-foreground border-border shadow-lg max-w-[200px]"
          >
            <p className="text-sm font-medium">Gedankenblitz</p>
            <p className="text-xs text-muted-foreground">Lass KI in Sekunden Ideen sprühen!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <GedankenblitzModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default GedankenblitzButton;
