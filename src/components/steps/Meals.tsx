
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MealOption, SelectedMeal } from '@/lib/types';
import { Tabs } from '@/components/ui/tabs';
import { format, addDays } from 'date-fns';

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
            onMealToggle={handleMealToggle}
          />
        ))}
      </Tabs>

      <TotalSummary selectedMeals={selectedMeals} />
    </motion.div>
  );
};

export default Meals;
