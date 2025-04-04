
import React from 'react';
import AnimatedTransition from '@/components/UI/AnimatedTransition';
import { Step } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

  // Handle errors during component rendering
  const renderWithErrorBoundary = (component: React.ReactNode) => {
    try {
      return component;
    } catch (error) {
      console.error(`Error rendering step ${currentStep.id}:`, error);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hiba történt</AlertTitle>
          <AlertDescription>
            Nem sikerült betölteni a lépést. Kérjük próbálja újra később vagy lépjen kapcsolatba a támogatással.
          </AlertDescription>
        </Alert>
      );
    }
  };

  // Render the appropriate component based on the current step
  const renderStepComponent = () => {
    try {
      switch (currentStep.id) {
        case 'meals':
          return (
            <CurrentStepComponent
              data={registrationData || []}
              updateData={updateData}
              checkIn={validCheckIn}
              checkOut={validCheckOut}
              allData={allData}
            />
          );
        case 'programs':
          return (
            <CurrentStepComponent
              selectedPrograms={registrationData || []}
              updatePrograms={updateData}
              allData={allData}
            />
          );
        case 'cost':
          // Calculate totals for accommodation, meals, and programs with safety checks
          const accommodationTotal = 
            (allData?.accommodation?.roomType?.pricePerNight || 0) * 
            (allData?.accommodation?.numberOfNights || 0) * 
            (allData?.accommodation?.numberOfGuests || 1);
          
          const mealsTotal = Array.isArray(allData?.meals) ? 
            allData.meals.reduce((total: number, meal: any) => 
              total + (Array.isArray(meal?.meals) ? 
                meal.meals.reduce((mealTotal: number, m: any) => 
                  mealTotal + (m?.price || 0), 0) : 0), 0) : 0;
          
          const programsTotal = Array.isArray(allData?.programs) ? 
            allData.programs.reduce((total: number, program: any) => 
              total + (program?.price || 0), 0) : 0;
          
          return (
            <CurrentStepComponent
              distributions={registrationData || []}
              updateDistributions={updateData}
              accommodationTotal={accommodationTotal || 0}
              mealsTotal={mealsTotal || 0}
              programsTotal={programsTotal || 0}
            />
          );
        case 'summary':
          return (
            <CurrentStepComponent
              data={allData || {}}
            />
          );
        default:
          return (
            <CurrentStepComponent
              data={registrationData || {}}
              updateData={updateData}
              allData={allData || {}}
            />
          );
      }
    } catch (error) {
      console.error(`Error preparing step ${currentStep.id}:`, error);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hiba történt</AlertTitle>
          <AlertDescription>
            Nem sikerült betölteni a lépést. Kérjük próbálja újra később vagy lépjen kapcsolatba a támogatással.
          </AlertDescription>
        </Alert>
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
          {renderWithErrorBoundary(renderStepComponent())}
        </AnimatedTransition>
      </CardContent>
    </Card>
  );
};

export default StepContainer;
