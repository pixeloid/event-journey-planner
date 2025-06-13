
import React from 'react';
import { format } from 'date-fns';
import { SelectedMealItem } from '@/lib/types';

interface DailySummaryProps {
  date: Date;
  selectedMeals: SelectedMealItem[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ date, selectedMeals }) => {
  const totalPrice = selectedMeals.reduce((sum, mealItem) => sum + (mealItem.meal.price * mealItem.quantity), 0);

  return (
    <div className="mt-8">
      {selectedMeals.length ? (
        <div className="p-4 bg-accent rounded-lg">
          <h4 className="font-medium mb-2">Kiválasztott étkezések erre a napra:</h4>
          <div className="space-y-2">
            {selectedMeals.map((mealItem, index) => (
              <div key={`${mealItem.meal.id}-${index}`} className="flex justify-between">
                <span>
                  {mealItem.meal.name} - {mealItem.meal.description}
                  {mealItem.quantity > 1 && (
                    <span className="text-muted-foreground ml-1">× {mealItem.quantity}</span>
                  )}
                </span>
                <span>{(mealItem.meal.price * mealItem.quantity).toLocaleString()} Ft</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-border flex justify-between font-medium">
              <span>Összesen</span>
              <span>{totalPrice.toLocaleString()} Ft</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-muted text-muted-foreground rounded-lg">
          <p>Nincs kiválasztott étkezés erre a napra</p>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
