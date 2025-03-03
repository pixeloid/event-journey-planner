
import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Storage key for localStorage
const STORAGE_KEY = 'event_registration_data';

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
  // Initialize state from localStorage or use default values
  const loadInitialState = (): { data: RegistrationData, submitted: boolean } => {
    if (typeof window === 'undefined') {
      return { data: initialRegistrationData, submitted: false };
    }
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Restore date objects which were stringified in JSON
        if (parsedData.data?.accommodation?.checkIn) {
          parsedData.data.accommodation.checkIn = new Date(parsedData.data.accommodation.checkIn);
        }
        if (parsedData.data?.accommodation?.checkOut) {
          parsedData.data.accommodation.checkOut = new Date(parsedData.data.accommodation.checkOut);
        }
        
        // Restore dates in meals array
        if (parsedData.data?.meals?.length) {
          parsedData.data.meals = parsedData.data.meals.map((meal: any) => ({
            ...meal,
            date: new Date(meal.date)
          }));
        }
        
        // Restore dates in programs array
        if (parsedData.data?.programs?.length) {
          parsedData.data.programs = parsedData.data.programs.map((program: any) => ({
            ...program,
            date: new Date(program.date)
          }));
        }
        
        return {
          data: parsedData.data,
          submitted: parsedData.submitted || false
        };
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    
    return { data: initialRegistrationData, submitted: false };
  };
  
  const initialState = loadInitialState();
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialState.data);
  const [formSubmitted, setFormSubmitted] = useState(initialState.submitted);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: registrationData,
        submitted: formSubmitted
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [registrationData, formSubmitted]);

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
    localStorage.removeItem(STORAGE_KEY);
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
