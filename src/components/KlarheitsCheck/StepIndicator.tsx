import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          ca. 2–4 Minuten
        </span>
      </div>
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-3">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className={cn(
              "flex flex-col items-center",
              index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 transition-colors",
              index + 1 < currentStep 
                ? "bg-primary text-primary-foreground" 
                : index + 1 === currentStep 
                  ? "bg-primary/20 text-primary border-2 border-primary" 
                  : "bg-muted text-muted-foreground"
            )}>
              {index + 1 < currentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs hidden sm:block max-w-[80px] text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
