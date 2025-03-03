
// Event registration form types
export type PersonalInfoData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  dietaryRestrictions?: string;
  specialRequirements?: string;
};

export type AccommodationOption = {
  id: string;
  name: string;
  description: string;
  image: string;
  roomTypes: RoomType[];
};

export type RoomType = {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  available: number;
};

export type SelectedAccommodation = {
  accommodation: AccommodationOption | null;
  roomType: RoomType | null;
  numberOfGuests: number;
  checkIn: Date;
  checkOut: Date;
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
  image: string;
  capacity: number;
  available: number;
};

export type SponsorCompany = {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
};

export type CostDistribution = {
  accommodationCoverage: number; // Percentage covered by sponsor
  mealsCoverage: number;
  programsCoverage: number;
  sponsorCompany: SponsorCompany | null;
};

export type FormData = {
  personalInfo: PersonalInfoData;
  accommodation: SelectedAccommodation;
  meals: SelectedMeal[];
  programs: ProgramOption[];
  costDistribution: CostDistribution[];
  totalCost: number;
};
