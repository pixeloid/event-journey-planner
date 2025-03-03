
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MealOption, SelectedMeal } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addDays } from 'date-fns';
import { UtensilsCrossedIcon, CupSodaIcon, SaladIcon, ChefHatIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock meal options
const MEAL_OPTIONS: MealOption[] = [
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

type MealsProps = {
  data: SelectedMeal[];
  checkIn?: Date | null;
  checkOut?: Date | null;
  updateData: (meals: SelectedMeal[]) => void;
  allData?: any;
};

const Meals: React.FC<MealsProps> = ({ data, checkIn, checkOut, updateData, allData }) => {
  // Extra validation to ensure we have valid dates
  if (!checkIn || !checkOut || !(checkIn instanceof Date) || !(checkOut instanceof Date) || 
      isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Kérjük, először válasszon ki egy szállást és adja meg a foglalás dátumait.</p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<string>(format(checkIn, 'yyyy-MM-dd'));
  
  // Generate array of days between checkIn and checkOut
  const daysCount = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));
  const days = Array.from({ length: daysCount }, (_, i) => addDays(checkIn, i));
  
  // Initialize or get existing selected meals for each day
  const selectedMeals = days.map(day => {
    const existingSelection = data.find(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    return existingSelection || { date: day, meals: [] };
  });

  const handleMealToggle = (day: Date, meal: MealOption) => {
    const updatedMeals = [...selectedMeals];
    const dayIndex = updatedMeals.findIndex(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    if (dayIndex >= 0) {
      const existingMealIndex = updatedMeals[dayIndex].meals.findIndex(m => m.id === meal.id);
      
      if (existingMealIndex >= 0) {
        // Remove meal if already selected
        updatedMeals[dayIndex].meals = updatedMeals[dayIndex].meals.filter(m => m.id !== meal.id);
      } else {
        // Add meal
        updatedMeals[dayIndex].meals.push(meal);
      }
      
      updateData(updatedMeals);
    }
  };

  const isMealSelected = (day: Date, mealId: string): boolean => {
    const daySelection = selectedMeals.find(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    return daySelection ? daySelection.meals.some(meal => meal.id === mealId) : false;
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <CupSodaIcon className="h-5 w-5" />;
      case 'lunch':
        return <SaladIcon className="h-5 w-5" />;
      case 'dinner':
        return <UtensilsCrossedIcon className="h-5 w-5" />;
      case 'gala':
        return <ChefHatIcon className="h-5 w-5" />;
      default:
        return <UtensilsCrossedIcon className="h-5 w-5" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Étkezések kiválasztása</h2>
        <p className="text-muted-foreground">Válassza ki az étkezéseket minden napra</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8">
          {days.map((day) => (
            <TabsTrigger 
              key={format(day, 'yyyy-MM-dd')} 
              value={format(day, 'yyyy-MM-dd')}
              className="text-center"
            >
              <div className="flex flex-col items-center text-xs sm:text-sm">
                <span className="font-medium">{format(day, 'MMM d.')}</span>
                <span className="text-muted-foreground hidden sm:inline">{format(day, 'EEEE')}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => (
          <TabsContent 
            key={format(day, 'yyyy-MM-dd')} 
            value={format(day, 'yyyy-MM-dd')}
            className="space-y-6"
          >
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-xl font-medium">{format(day, 'yyyy. MMMM d.')}</h3>
              <p className="text-muted-foreground">{format(day, 'EEEE')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {MEAL_OPTIONS.map((meal) => {
                const isSelected = isMealSelected(day, meal.id);
                
                return (
                  <Card 
                    key={meal.id}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all border",
                      isSelected && "ring-2 ring-primary border-primary"
                    )}
                    onClick={() => handleMealToggle(day, meal)}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "p-1.5 rounded-full",
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {getMealIcon(meal.type)}
                          </div>
                          <h4 className="font-medium">{meal.name}</h4>
                        </div>
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => handleMealToggle(day, meal)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{meal.description}</p>
                      
                      <div className="mt-auto">
                        <span className="font-semibold">{meal.price.toLocaleString()} Ft</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8">
              {selectedMeals.find(m => format(m.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))?.meals.length ? (
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-medium mb-2">Kiválasztott étkezések erre a napra:</h4>
                  <div className="space-y-2">
                    {selectedMeals
                      .find(m => format(m.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                      ?.meals.map(meal => (
                        <div key={meal.id} className="flex justify-between">
                          <span>{meal.name} - {meal.description}</span>
                          <span>{meal.price.toLocaleString()} Ft</span>
                        </div>
                      ))
                    }
                    <div className="pt-2 mt-2 border-t border-border flex justify-between font-medium">
                      <span>Összesen</span>
                      <span>
                        {selectedMeals
                          .find(m => format(m.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                          ?.meals.reduce((sum, meal) => sum + meal.price, 0)
                          .toLocaleString()} Ft
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-muted text-muted-foreground rounded-lg">
                  <p>Nincs kiválasztott étkezés erre a napra</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-accent rounded-lg">
        <h4 className="font-medium mb-4">Étkezések összesítése</h4>
        <div className="space-y-2">
          {selectedMeals.map((dayMeals) => {
            if (dayMeals.meals.length === 0) return null;
            
            return (
              <div key={format(dayMeals.date, 'yyyy-MM-dd')} className="pb-2 border-b border-border last:border-0">
                <div className="font-medium">{format(dayMeals.date, 'yyyy. MMMM d. (EEEE)')}</div>
                <div className="space-y-1 mt-1">
                  {dayMeals.meals.map(meal => (
                    <div key={meal.id} className="flex justify-between text-sm">
                      <span>{meal.name}</span>
                      <span>{meal.price.toLocaleString()} Ft</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
            <span>Teljes összeg</span>
            <span>
              {selectedMeals
                .flatMap(day => day.meals)
                .reduce((sum, meal) => sum + meal.price, 0)
                .toLocaleString()} Ft
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Meals;
