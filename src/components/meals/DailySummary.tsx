
import React from 'react';
import { format } from 'date-fns';
import { MealOption } from '@/lib/types';

interface DailySummaryProps {
  date: Date;
  selectedMeals: MealOption[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ date, selectedMeals }) => {
  const totalPrice = selectedMeals.reduce((sum, meal) => sum + meal.price, 0);

  return (
    <div className="mt-8">
      {selectedMeals.length ? (
        <div className="p-4 bg-accent rounded-lg">
          <h4 className="font-medium mb-2">Kiválasztott étkezések erre a napra:</h4>
          <div className="space-y-2">
            {selectedMeals.map(meal => (
              <div key={meal.id} className="flex justify-between">
                <span>{meal.name} - {meal.description}</span>
                <span>{meal.price.toLocaleString()} Ft</span>
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
