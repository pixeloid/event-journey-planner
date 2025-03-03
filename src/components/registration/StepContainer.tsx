
import React from 'react';
import AnimatedTransition from '@/components/UI/AnimatedTransition';
import { Step } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        // Calculate totals for accommodation, meals, and programs
        const accommodationTotal = allData.accommodation?.roomType?.pricePerNight * 
                                  (allData.accommodation?.numberOfNights || 0) * 
                                  (allData.accommodation?.numberOfGuests || 1) || 0;
        
        const mealsTotal = allData.meals?.reduce((total: number, meal: any) => 
          total + (meal.meals?.reduce((mealTotal: number, m: any) => mealTotal + (m.price || 0), 0) || 0), 0) || 0;
        
        const programsTotal = allData.programs?.reduce((total: number, program: any) => 
          total + (program.price || 0), 0) || 0;
        
        return (
          <CurrentStepComponent
            distributions={registrationData || []}
            updateDistributions={updateData}
            accommodationTotal={accommodationTotal}
            mealsTotal={mealsTotal}
            programsTotal={programsTotal}
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
    <Card>
      <CardHeader>
        <CardTitle>{currentStep.label}</CardTitle>
        <CardDescription>{currentStep.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <AnimatedTransition key={currentStep.id} isVisible={true}>
          {renderStepComponent()}
        </AnimatedTransition>
      </CardContent>
    </Card>
  );
};

export default StepContainer;
