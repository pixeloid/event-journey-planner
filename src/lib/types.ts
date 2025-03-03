// Registration Form Types
export type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  dietaryRestrictions?: string;
  specialRequirements?: string;
};

export type RoomType = {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  available: number;
  bedType: 'single' | 'double' | 'multiple'; // Added bed type
};

export type AccommodationOption = {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  roomTypes: RoomType[];
};

export type SelectedAccommodation = {
  accommodation: AccommodationOption | null;
  roomType: RoomType | null;
  numberOfGuests: number;
  checkIn: Date | null;
  checkOut: Date | null;
  numberOfNights: number;
};

export type MealOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'gala';
};

export type SelectedMeal = {
  date: Date;
  meals: MealOption[];
};

export type ProgramOption = {
  id: string;
  name: string;
  description: string;
  date: Date;
  duration: string;
  price: number;
  capacity: number;
  available: number;
  image: string;
};

export type SelectedProgram = ProgramOption;

// Cost Distribution Types
export type CostDistribution = {
  sponsorCompany: SponsorCompany;
  accommodationCoverage: number;
  mealsCoverage: number;
  programsCoverage: number;
};

export type SponsorCompany = {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  contributions: {
    accommodation: number; // Percentage
    meals: number; // Percentage
    programs: number; // Percentage
    total: number; // Percentage of total
  };
};

export type RegistrationData = {
  personalInfo: PersonalData;
  accommodation: SelectedAccommodation | null;
  meals: SelectedMeal[];
  programs: SelectedProgram[];
  sponsors: SponsorCompany[];
};

export type Step = {
  id: string;
  label: string;
  description: string;
  component: React.ComponentType<any>;
};
