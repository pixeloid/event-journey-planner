
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RegistrationData, Step, PersonalData, SelectedAccommodation, SelectedMeal, SelectedProgram, SponsorCompany } from '@/lib/types';
import StepIndicator from '@/components/UI/StepIndicator';
import AnimatedTransition from '@/components/UI/AnimatedTransition';
import PersonalInfo from '@/components/steps/PersonalInfo';
import Accommodation from '@/components/steps/Accommodation';
import Meals from '@/components/steps/Meals';
import Programs from '@/components/steps/Programs';
import CostSharing from '@/components/steps/CostSharing';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import Summary from '@/components/steps/Summary';

const defaultPersonalData: PersonalData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  position: ''
};

// Initial empty registration data
const initialRegistrationData: RegistrationData = {
  personalInfo: defaultPersonalData,
  accommodation: null,
  meals: [],
  programs: [],
  sponsors: []
};

// Define steps for the registration process
const steps: Step[] = [
  {
    id: 'personal',
    label: 'Személyes adatok',
    description: 'Adja meg a regisztrációhoz szükséges személyes adatait',
    component: PersonalInfo
  },
  {
    id: 'accommodation',
    label: 'Szállás',
    description: 'Válasszon szállást és szobatípust',
    component: Accommodation
  },
  {
    id: 'meals',
    label: 'Étkezés',
    description: 'Válassza ki az étkezéseket a tartózkodásra',
    component: Meals
  },
  {
    id: 'programs',
    label: 'Programok',
    description: 'Válasszon kiegészítő programokat',
    component: Programs
  },
  {
    id: 'cost',
    label: 'Költségmegosztás',
    description: 'Ossza meg a költségeket szponzorokkal',
    component: CostSharing
  },
  {
    id: 'summary',
    label: 'Összegzés',
    description: 'Foglalja össze a rendelést és küldje el',
    component: Summary
  }
];

const Index = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const updatePersonalInfo = (data: PersonalData) => {
    setRegistrationData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateAccommodation = (data: SelectedAccommodation | null) => {
    setRegistrationData(prev => ({ ...prev, accommodation: data }));
  };

  const updateMeals = (data: SelectedMeal[]) => {
    setRegistrationData(prev => ({ ...prev, meals: data }));
  };

  const updatePrograms = (data: SelectedProgram[]) => {
    setRegistrationData(prev => ({ ...prev, programs: data }));
  };

  const updateSponsors = (data: SponsorCompany[]) => {
    setRegistrationData(prev => ({ ...prev, sponsors: data }));
  };

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

  const CurrentStepComponent = currentStep.component;

  if (formSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-4xl p-8 bg-card rounded-lg shadow-lg text-center">
          <div className="rounded-full bg-green-100 p-4 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CheckIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sikeres regisztráció!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Köszönjük a regisztrációját. A visszaigazolást emailben elküldjük Önnek.
          </p>
          <Button onClick={() => window.location.reload()}>Új regisztráció</Button>
        </div>
      </div>
    );
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
            steps={steps.map(step => step.id)}
            currentStep={currentStepIndex}
            onStepClick={(index) => setCurrentStepIndex(index)}
          />
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">{currentStep.label}</h2>
            <p className="text-muted-foreground">{currentStep.description}</p>
          </div>

          <AnimatedTransition key={currentStep.id} isVisible={true}>
            <CurrentStepComponent
              data={
                currentStep.id === 'personal'
                  ? registrationData.personalInfo
                  : currentStep.id === 'accommodation'
                  ? registrationData.accommodation
                  : currentStep.id === 'meals'
                  ? registrationData.meals
                  : currentStep.id === 'programs'
                  ? registrationData.programs
                  : currentStep.id === 'cost'
                  ? registrationData.sponsors
                  : registrationData
              }
              updateData={
                currentStep.id === 'personal'
                  ? updatePersonalInfo
                  : currentStep.id === 'accommodation'
                  ? updateAccommodation
                  : currentStep.id === 'meals'
                  ? updateMeals
                  : currentStep.id === 'programs'
                  ? updatePrograms
                  : currentStep.id === 'cost'
                  ? updateSponsors
                  : () => {}
              }
              checkIn={registrationData.accommodation?.checkIn}
              checkOut={registrationData.accommodation?.checkOut}
              allData={registrationData}
            />
          </AnimatedTransition>
        </div>

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
            <Button onClick={goToNextStep} className="flex items-center space-x-2">
              <span>Tovább</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
