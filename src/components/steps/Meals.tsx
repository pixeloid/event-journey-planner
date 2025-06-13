
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MealOption, SelectedMeal } from '@/lib/types';
import { Tabs } from '@/components/ui/tabs';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

import DaySelector from '@/components/meals/DaySelector';
import DayContent from '@/components/meals/DayContent';
import TotalSummary from '@/components/meals/TotalSummary';
import { MEAL_OPTIONS } from '@/components/meals/mealConstants';

type MealsProps = {
  data: SelectedMeal[];
  checkIn?: Date | null;
  checkOut?: Date | null;
  updateData: (meals: SelectedMeal[]) => void;
  allData?: any;
};

const Meals: React.FC<MealsProps> = ({ data, checkIn, checkOut, updateData, allData }) => {
  // Extra validation to ensure we have valid dates
  const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  if (!checkIn || !checkOut || !isValidDate(checkIn) || !isValidDate(checkOut)) {
    return (
      <div className="flex flex-col items-center p-8 space-y-4">
        <div className="text-center max-w-md">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Hiányzó dátumok</h3>
          <p className="text-muted-foreground mb-4">
            Kérjük, először adja meg a foglalás dátumait a Szállás lépésben. Az étkezések kiválasztásához szükséges a foglalás kezdő és záró dátuma.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              // Find the accommodation step index in the registration steps
              const accommodationStepIndex = 1; // Assuming it's the second step (index 1)
              if (typeof window !== 'undefined') {
                localStorage.setItem('event_registration_step', accommodationStepIndex.toString());
                window.location.reload();
              }
            }}
          >
            Vissza a Szállás lépéshez
          </Button>
        </div>
      </div>
    );
  }

  // Continue with the normal component logic for valid dates
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

  const handleMealQuantityChange = (day: Date, meal: MealOption, quantity: number) => {
    console.log(`Handling quantity change for ${meal.name} to ${quantity} on ${format(day, 'yyyy-MM-dd')}`);
    
    const updatedMeals = [...selectedMeals];
    const dayIndex = updatedMeals.findIndex(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    if (dayIndex >= 0) {
      const existingMealIndex = updatedMeals[dayIndex].meals.findIndex(item => item.meal.id === meal.id);
      
      if (quantity === 0) {
        // Remove meal if quantity is 0
        if (existingMealIndex >= 0) {
          console.log(`Removing meal: ${meal.name}`);
          updatedMeals[dayIndex].meals = updatedMeals[dayIndex].meals.filter(item => item.meal.id !== meal.id);
        }
      } else {
        // Add or update meal quantity
        if (existingMealIndex >= 0) {
          console.log(`Updating meal quantity: ${meal.name} to ${quantity}`);
          updatedMeals[dayIndex].meals[existingMealIndex].quantity = quantity;
        } else {
          console.log(`Adding meal: ${meal.name} with quantity ${quantity}`);
          updatedMeals[dayIndex].meals.push({ meal, quantity });
        }
      }
      
      console.log(`Updated meals for day:`, updatedMeals[dayIndex]);
      updateData(updatedMeals);
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
        <DaySelector days={days} activeTab={activeTab} />

        {days.map((day) => (
          <DayContent 
            key={format(day, 'yyyy-MM-dd')}
            day={day}
            selectedMeals={selectedMeals}
            onMealQuantityChange={handleMealQuantityChange}
          />
        ))}
      </Tabs>

      <TotalSummary selectedMeals={selectedMeals} />
    </motion.div>
  );
};

export default Meals;
