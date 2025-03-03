
import { Step } from '@/lib/types';
import PersonalInfo from '@/components/steps/PersonalInfo';
import Accommodation from '@/components/steps/Accommodation';
import Meals from '@/components/steps/Meals';
import Programs from '@/components/steps/Programs';
import CostSharing from '@/components/steps/CostSharing';
import Summary from '@/components/steps/Summary';

// Define steps for the registration process
export const registrationSteps: Step[] = [
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
