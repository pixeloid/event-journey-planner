
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registrationSteps } from '@/config/registrationSteps';
import StepIndicator from '@/components/UI/StepIndicator';
import StepContainer from '@/components/registration/StepContainer';
import FormNavigation from '@/components/registration/FormNavigation';
import RegistrationSuccess from '@/components/registration/RegistrationSuccess';
import { RegistrationProvider, useRegistration } from '@/contexts/RegistrationContext';

const RegistrationForm = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { 
    registrationData, 
    updatePersonalInfo, 
    updateAccommodation, 
    updateMeals, 
    updatePrograms, 
    updateSponsors,
    formSubmitted,
    setFormSubmitted
  } = useRegistration();

  const currentStep = registrationSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === registrationSteps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted with data:', registrationData);
    setFormSubmitted(true);
    // Here you would typically send the data to your backend
  };

  // Determine which update function to use based on current step
  const getCurrentUpdateFunction = () => {
    switch (currentStep.id) {
      case 'personal':
        return updatePersonalInfo;
      case 'accommodation':
        return updateAccommodation;
      case 'meals':
        return updateMeals;
      case 'programs':
        return updatePrograms;
      case 'cost':
        return updateSponsors;
      default:
        return () => {};
    }
  };

  // Determine which data to pass based on current step
  const getCurrentStepData = () => {
    switch (currentStep.id) {
      case 'personal':
        return registrationData.personalInfo;
      case 'accommodation':
        return registrationData.accommodation;
      case 'meals':
        return registrationData.meals;
      case 'programs':
        return registrationData.programs;
      case 'cost':
        return registrationData.sponsors;
      default:
        return registrationData;
    }
  };

  if (formSubmitted) {
    return <RegistrationSuccess />;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Rendezvény regisztráció</h1>
          <p className="text-muted-foreground mt-2">Töltse ki az alábbi űrlapot a rendezvényre való regisztrációhoz</p>
        </div>

        <div className="mb-12">
          <StepIndicator
            steps={registrationSteps.map(step => step.id)}
            currentStep={currentStepIndex}
            onStepClick={setCurrentStepIndex}
          />
        </div>

        <StepContainer 
          currentStep={currentStep}
          registrationData={getCurrentStepData()}
          updateData={getCurrentUpdateFunction()}
          checkIn={registrationData.accommodation?.checkIn}
          checkOut={registrationData.accommodation?.checkOut}
          allData={registrationData}
        />

        <FormNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

const Index = () => (
  <RegistrationProvider>
    <RegistrationForm />
  </RegistrationProvider>
);

export default Index;
