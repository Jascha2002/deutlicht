import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const WizardProgress = ({ currentStep, totalSteps, steps }: WizardProgressProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium hidden sm:block',
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2 rounded transition-all',
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
