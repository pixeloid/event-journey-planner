
import { SponsorCompany } from '@/lib/types';

// Mock sponsor companies
export const SPONSOR_COMPANIES: SponsorCompany[] = [
  { 
    id: 'comp1', 
    name: 'ABC Kft.', 
    contactPerson: 'Kiss János', 
    email: 'janos.kiss@abc.hu',
    contributions: {
      accommodation: 0,
      meals: 0,
      programs: 0,
      total: 0
    }
  },
  { 
    id: 'comp2', 
    name: 'XYZ Zrt.', 
    contactPerson: 'Nagy Béla', 
    email: 'bela.nagy@xyz.hu',
    contributions: {
      accommodation: 0,
      meals: 0,
      programs: 0,
      total: 0
    }
  },
  { 
    id: 'comp3', 
    name: 'Innovatív Rt.', 
    contactPerson: 'Szabó Anna', 
    email: 'anna.szabo@innovativ.hu',
    contributions: {
      accommodation: 0,
      meals: 0,
      programs: 0,
      total: 0
    }
  }
];
