import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav className={cn("w-full", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={step.id} className={cn("flex items-center", index < steps.length - 1 ? "flex-1" : "")}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isComplete && "border-primary bg-primary text-white",
                    isCurrent && "border-primary bg-primary/10 text-primary",
                    !isComplete && !isCurrent && "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  {isComplete ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span className={cn("mt-2 text-xs font-medium text-center max-w-[80px]", isCurrent ? "text-primary" : "text-muted-foreground")}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("h-0.5 flex-1 mx-2", isComplete ? "bg-primary" : "bg-slate-200")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
