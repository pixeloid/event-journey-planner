
import { AccommodationOption } from '@/lib/types';

// Mock data for accommodations
export const ACCOMMODATIONS: AccommodationOption[] = [
  {
    id: 'acc1',
    name: 'Grand Hotel',
    address: 'Budapest, Andrássy út 100',
    description: 'Luxus szálloda a belvárosban',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room1',
        name: 'Egyágyas szoba',
        capacity: 1,
        pricePerNight: 35000,
        description: 'Kényelmes szoba egy személyre',
        available: 10,
        bedType: 'single'
      },
      {
        id: 'room2',
        name: 'Kétágyas szoba',
        capacity: 2,
        pricePerNight: 45000,
        description: 'Tágas szoba két főre',
        available: 8,
        bedType: 'double'
      },
      {
        id: 'room3',
        name: 'Lakosztály',
        capacity: 4,
        pricePerNight: 85000,
        description: 'Luxus lakosztály kilátással',
        available: 3,
        bedType: 'multiple'
      }
    ]
  },
  {
    id: 'acc2',
    name: 'Park Inn',
    address: 'Budapest, Váci út 50',
    description: 'Modern szálloda zöld környezetben',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room4',
        name: 'Standard szoba',
        capacity: 2,
        pricePerNight: 32000,
        description: 'Kényelmes szoba egy vagy két főre',
        available: 15,
        bedType: 'double'
      },
      {
        id: 'room5',
        name: 'Superior szoba',
        capacity: 2,
        pricePerNight: 39000,
        description: 'Superior szoba panorámával',
        available: 12,
        bedType: 'double'
      },
      {
        id: 'room6',
        name: 'Családi szoba',
        capacity: 4,
        pricePerNight: 65000,
        description: 'Tágas szoba családok számára',
        available: 5,
        bedType: 'multiple'
      }
    ]
  },
  {
    id: 'acc3',
    name: 'City Boutique',
    address: 'Budapest, Király utca 25',
    description: 'Elegáns boutique hotel a városközpontban',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room7',
        name: 'Design szoba',
        capacity: 2,
        pricePerNight: 42000,
        description: 'Modern design szoba pároknak',
        available: 8,
        bedType: 'double'
      },
      {
        id: 'room8',
        name: 'Deluxe szoba',
        capacity: 2,
        pricePerNight: 52000,
        description: 'Tágas deluxe szoba francia ággyal',
        available: 6,
        bedType: 'double'
      },
      {
        id: 'room9',
        name: 'Penthouse',
        capacity: 4,
        pricePerNight: 95000,
        description: 'Exkluzív tetőtéri lakosztály',
        available: 2,
        bedType: 'multiple'
      }
    ]
  }
];
