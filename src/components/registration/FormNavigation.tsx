
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';

type FormNavigationProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  handleSubmit: () => void;
  isNextDisabled?: boolean;
};

const FormNavigation: React.FC<FormNavigationProps> = ({
  isFirstStep,
  isLastStep,
  goToPreviousStep,
  goToNextStep,
  handleSubmit,
  isNextDisabled = false
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep}
        className="flex items-center space-x-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Vissza</span>
      </Button>

      {isLastStep ? (
        <Button onClick={handleSubmit} className="flex items-center space-x-2">
          <span>Regisztráció véglegesítése</span>
          <CheckIcon className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          onClick={goToNextStep} 
          className="flex items-center space-x-2"
          disabled={isNextDisabled}
        >
          <span>Tovább</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
