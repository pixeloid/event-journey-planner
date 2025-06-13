
import React from 'react';
import { format } from 'date-fns';
import { TabsContent } from '@/components/ui/tabs';
import { MealOption, SelectedMeal } from '@/lib/types';
import MealCard from './MealCard';
import DailySummary from './DailySummary';
import { MEAL_OPTIONS } from './mealConstants';

interface DayContentProps {
  day: Date;
  selectedMeals: SelectedMeal[];
  onMealQuantityChange: (day: Date, meal: MealOption, quantity: number) => void;
}

const DayContent: React.FC<DayContentProps> = ({ day, selectedMeals, onMealQuantityChange }) => {
  const getMealQuantity = (mealId: string): number => {
    const daySelection = selectedMeals.find(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    const mealItem = daySelection?.meals.find(item => item.meal.id === mealId);
    return mealItem?.quantity || 0;
  };

  const dayMeals = selectedMeals.find(
    item => item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
  )?.meals || [];

  const handleQuantityChange = (meal: MealOption, quantity: number) => {
    console.log(`Changing quantity for meal: ${meal.name} to ${quantity} for day: ${format(day, 'yyyy-MM-dd')}`);
    onMealQuantityChange(day, meal, quantity);
  };

  return (
    <TabsContent 
      value={format(day, 'yyyy-MM-dd')}
      className="space-y-6"
    >
      <div className="flex flex-col items-center mb-6">
        <h3 className="text-xl font-medium">{format(day, 'yyyy. MMMM d.')}</h3>
        <p className="text-muted-foreground">{format(day, 'EEEE')}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {MEAL_OPTIONS.map((meal) => {
          const quantity = getMealQuantity(meal.id);
          console.log(`Rendering meal: ${meal.name}, quantity: ${quantity}`);
          
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              quantity={quantity}
              onQuantityChange={(qty) => handleQuantityChange(meal, qty)}
            />
          );
        })}
      </div>
      
      <DailySummary date={day} selectedMeals={dayMeals} />
    </TabsContent>
  );
};

export default DayContent;
