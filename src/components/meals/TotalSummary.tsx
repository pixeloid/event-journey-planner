
import React from 'react';
import { format } from 'date-fns';
import { SelectedMeal } from '@/lib/types';

interface TotalSummaryProps {
  selectedMeals: SelectedMeal[];
}

const TotalSummary: React.FC<TotalSummaryProps> = ({ selectedMeals }) => {
  const totalAmount = selectedMeals
    .flatMap(day => day.meals)
    .reduce((sum, mealItem) => sum + (mealItem.meal.price * mealItem.quantity), 0);

  return (
    <div className="mt-8 p-4 bg-accent rounded-lg">
      <h4 className="font-medium mb-4">Étkezések összesítése</h4>
      <div className="space-y-2">
        {selectedMeals.map((dayMeals) => {
          if (dayMeals.meals.length === 0) return null;
          
          return (
            <div key={format(dayMeals.date, 'yyyy-MM-dd')} className="pb-2 border-b border-border last:border-0">
              <div className="font-medium">{format(dayMeals.date, 'yyyy. MMMM d. (EEEE)')}</div>
              <div className="space-y-1 mt-1">
                {dayMeals.meals.map((mealItem, index) => (
                  <div key={`${mealItem.meal.id}-${index}`} className="flex justify-between text-sm">
                    <span>
                      {mealItem.meal.name}
                      {mealItem.quantity > 1 && (
                        <span className="text-muted-foreground ml-1">× {mealItem.quantity}</span>
                      )}
                    </span>
                    <span>{(mealItem.meal.price * mealItem.quantity).toLocaleString()} Ft</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
          <span>Teljes összeg</span>
          <span>{totalAmount.toLocaleString()} Ft</span>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
