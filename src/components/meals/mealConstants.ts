
import { MealOption } from '@/lib/types';

// Mock meal options
export const MEAL_OPTIONS: MealOption[] = [
  {
    id: 'meal1',
    name: 'Reggeli',
    description: 'Kontinentális reggeli',
    price: 4500,
    type: 'breakfast'
  },
  {
    id: 'meal2',
    name: 'Ebéd',
    description: 'Háromfogásos ebéd',
    price: 6500,
    type: 'lunch'
  },
  {
    id: 'meal3',
    name: 'Vacsora',
    description: 'Büfévacsora',
    price: 7500,
    type: 'dinner'
  },
  {
    id: 'meal4',
    name: 'Gálavacsora',
    description: 'Exkluzív fogadás és gálavacsora',
    price: 18000,
    type: 'gala'
  }
];
