import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  score: number;
  messages: string[];
  isLeaked?: boolean;
  leakCount?: number;
  isChecking?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  score,
  messages,
  isLeaked,
  leakCount,
  isChecking
}) => {
  const getStrengthLabel = () => {
    if (score <= 2) return 'Schwach';
    if (score <= 3) return 'Mittel';
    if (score <= 4) return 'Gut';
    return 'Stark';
  };

  const getStrengthColor = () => {
    if (isLeaked) return 'bg-destructive';
    if (score <= 2) return 'bg-destructive';
    if (score <= 3) return 'bg-warning';
    if (score <= 4) return 'bg-accent';
    return 'bg-accent';
  };

  const formatLeakCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)} Mio.`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return count.toString();
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300 rounded-full',
              getStrengthColor()
            )}
            style={{ width: `${Math.min((score / 6) * 100, 100)}%` }}
          />
        </div>
        <span className={cn(
          'text-xs font-medium',
          isLeaked ? 'text-destructive' : 
          score <= 2 ? 'text-destructive' : 
          score <= 3 ? 'text-warning' : 'text-accent'
        )}>
          {getStrengthLabel()}
        </span>
      </div>

      {/* Leaked password warning */}
      {isLeaked && leakCount && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Kompromittiertes Passwort erkannt!</p>
            <p className="text-muted-foreground mt-0.5">
              Dieses Passwort wurde in {formatLeakCount(leakCount)} Datenlecks gefunden. 
              Bitte wählen Sie ein anderes Passwort.
            </p>
          </div>
        </div>
      )}

      {/* Checking indicator */}
      {isChecking && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 animate-pulse" />
          <span>Passwort wird geprüft...</span>
        </div>
      )}

      {/* Validation messages */}
      {messages.length > 0 && !isLeaked && (
        <div className="space-y-1">
          {messages.slice(0, 3).map((message, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3" />
              <span>{message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success indicator */}
      {score >= 4 && !isLeaked && !isChecking && (
        <div className="flex items-center gap-2 text-sm text-accent">
          <ShieldCheck className="w-4 h-4" />
          <span>Sicheres Passwort</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
