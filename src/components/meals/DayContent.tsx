
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
  onMealToggle: (day: Date, meal: MealOption) => void;
}

const DayContent: React.FC<DayContentProps> = ({ day, selectedMeals, onMealToggle }) => {
  const isMealSelected = (mealId: string): boolean => {
    const daySelection = selectedMeals.find(item => 
      item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    
    return daySelection ? daySelection.meals.some(meal => meal.id === mealId) : false;
  };

  const dayMeals = selectedMeals.find(
    item => item.date instanceof Date && format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
  )?.meals || [];

  const handleMealToggle = (meal: MealOption) => {
    console.log(`Toggling meal: ${meal.name} for day: ${format(day, 'yyyy-MM-dd')}`);
    onMealToggle(day, meal);
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
          const isSelected = isMealSelected(meal.id);
          console.log(`Rendering meal: ${meal.name}, selected: ${isSelected}`);
          
          return (
            <MealCard
              key={meal.id}
              meal={meal}
              isSelected={isSelected}
              onToggle={() => handleMealToggle(meal)}
            />
          );
        })}
      </div>
      
      <DailySummary date={day} selectedMeals={dayMeals} />
    </TabsContent>
  );
};

export default DayContent;
