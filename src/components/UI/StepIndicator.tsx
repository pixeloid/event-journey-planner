
import React from 'react';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "step-item",
              currentStep === index && "active",
              currentStep > index && "complete"
            )}
          >
            <div className="step-counter">
              {currentStep > index ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                index + 1
              )}
            </div>
            <p className="text-xs font-medium mt-2">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
