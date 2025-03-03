
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

  // Validate dates to ensure they are valid Date objects
  const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Create validated check-in and check-out dates
  const validCheckIn = checkIn && isValidDate(checkIn) ? checkIn : null;
  const validCheckOut = checkOut && isValidDate(checkOut) ? checkOut : null;

  // Render the appropriate component based on the current step
  const renderStepComponent = () => {
    switch (currentStep.id) {
      case 'meals':
        return (
          <CurrentStepComponent
            data={registrationData}
            updateData={updateData}
            checkIn={validCheckIn}
            checkOut={validCheckOut}
            allData={allData}
          />
        );
      case 'programs':
        return (
          <CurrentStepComponent
            selectedPrograms={registrationData}
            updatePrograms={updateData}
            allData={allData}
          />
        );
      case 'cost':
        return (
          <CurrentStepComponent
            sponsors={registrationData || []}
            updateSponsors={updateData}
            allData={allData}
          />
        );
      case 'summary':
        return (
          <CurrentStepComponent
            data={allData}
          />
        );
      default:
        return (
          <CurrentStepComponent
            data={registrationData}
            updateData={updateData}
            allData={allData}
          />
        );
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 md:p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">{currentStep.label}</h2>
        <p className="text-muted-foreground">{currentStep.description}</p>
      </div>

      <AnimatedTransition key={currentStep.id} isVisible={true}>
        {renderStepComponent()}
      </AnimatedTransition>
    </div>
  );
};

export default StepContainer;
