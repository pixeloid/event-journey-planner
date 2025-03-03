
// Registration Form Types
export type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
};

export type RoomType = 'single' | 'double' | 'suite' | 'apartment';

export type AccommodationOption = {
  id: string;
  name: string;
  address: string;
  description: string;
  price: Record<RoomType, number>;
  image: string;
};

export type SelectedAccommodation = {
  accommodation: AccommodationOption;
  roomType: RoomType;
  guests: number;
  checkIn: Date;
  checkOut: Date;
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
  time: string;
  duration: number;
  price: number;
  maxParticipants?: number;
  currentParticipants?: number;
  image?: string;
};

export type SelectedProgram = ProgramOption;

export type SponsorCompany = {
  id: string;
  name: string;
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
