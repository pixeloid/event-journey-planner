
import React, { createContext, useContext, useState } from 'react';
import { RegistrationData, PersonalData, SelectedAccommodation, SelectedMeal, SelectedProgram, SponsorCompany } from '@/lib/types';

// Default personal data
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

type RegistrationContextType = {
  registrationData: RegistrationData;
  updatePersonalInfo: (data: PersonalData) => void;
  updateAccommodation: (data: SelectedAccommodation | null) => void;
  updateMeals: (data: SelectedMeal[]) => void;
  updatePrograms: (data: SelectedProgram[]) => void;
  updateSponsors: (data: SponsorCompany[]) => void;
  formSubmitted: boolean;
  setFormSubmitted: (submitted: boolean) => void;
  resetForm: () => void;
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
  
  const resetForm = () => {
    setRegistrationData(initialRegistrationData);
    setFormSubmitted(false);
  };

  return (
    <RegistrationContext.Provider value={{
      registrationData,
      updatePersonalInfo,
      updateAccommodation,
      updateMeals,
      updatePrograms,
      updateSponsors,
      formSubmitted,
      setFormSubmitted,
      resetForm
    }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
