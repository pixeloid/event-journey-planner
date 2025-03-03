
import React from 'react';
import AnimatedTransition from '@/components/UI/AnimatedTransition';
import { Step } from '@/lib/types';

type StepContainerProps = {
  currentStep: Step;
  registrationData: any;
  updateData: (data: any) => void;
  checkIn?: Date | null;
  checkOut?: Date | null;
  allData: any;
};

const StepContainer: React.FC<StepContainerProps> = ({
  currentStep,
  registrationData,
  updateData,
  checkIn,
  checkOut,
  allData
}) => {
  const CurrentStepComponent = currentStep.component;

  // Only render meals component if both dates are valid Date objects
  const mealsWithDates = 
    currentStep.id === 'meals' && 
    checkIn instanceof Date && 
    checkOut instanceof Date && 
    !isNaN(checkIn.getTime()) && 
    !isNaN(checkOut.getTime());

  return (
    <div className="bg-card rounded-lg shadow-md p-6 md:p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">{currentStep.label}</h2>
        <p className="text-muted-foreground">{currentStep.description}</p>
      </div>

      <AnimatedTransition key={currentStep.id} isVisible={true}>
        {mealsWithDates ? (
          <CurrentStepComponent
            data={registrationData}
            updateData={updateData}
            checkIn={checkIn}
            checkOut={checkOut}
            allData={allData}
          />
        ) : (
          <CurrentStepComponent
            data={registrationData}
            updateData={updateData}
            allData={allData}
          />
        )}
      </AnimatedTransition>
    </div>
  );
};

export default StepContainer;
