
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RegistrationData } from '@/lib/types';
import { format } from 'date-fns';
import { Building2Icon, BedIcon, UtensilsIcon, CalendarIcon, BadgeEuroIcon, UsersIcon } from 'lucide-react';

interface RegistrationSummaryProps {
  data: RegistrationData;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ data }) => {
  const { accommodation, meals, programs } = data;

  // Calculate costs with safe checks for null/undefined
  const accommodationCost = (() => {
    if (!accommodation?.roomType?.pricePerNight || !accommodation?.numberOfNights) return 0;
    return accommodation.roomType.pricePerNight * accommodation.numberOfNights;
  })();
  
  const mealsCost = Array.isArray(meals) ? 
    meals.reduce((total, dayMeal) => 
      total + (Array.isArray(dayMeal.meals) ? 
        dayMeal.meals.reduce((mealTotal, mealItem) => 
          mealTotal + (typeof mealItem.meal.price === 'number' && typeof mealItem.quantity === 'number' ? 
            mealItem.meal.price * mealItem.quantity : 0), 0) : 0), 0) : 0;
  
  const programsCost = Array.isArray(programs) ? 
    programs.reduce((total, program) => 
      total + (typeof program.price === 'number' ? program.price : 0), 0) : 0;
  
  const totalCost = accommodationCost + mealsCost + programsCost;

  // Format date safely
  const formatDateSafely = (date: Date | null | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    return format(date, 'MMM d.');
  };

  // Calculate per person cost for accommodation
  const accommodationCostPerPerson = accommodation?.numberOfGuests && accommodation.numberOfGuests > 1 
    ? Math.round(accommodationCost / accommodation.numberOfGuests) 
    : accommodationCost;

  return (
    <Card className="sticky top-6 overflow-auto max-h-[calc(100vh-4rem)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Foglalási információk</h3>
        
        {accommodation?.accommodation && accommodation?.roomType && (
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Building2Icon className="h-4 w-4 text-primary" />
              <span>Szállás</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div className="font-medium">{accommodation.accommodation.name}</div>
              <div className="flex items-center gap-1">
                <BedIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{accommodation.roomType.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <UsersIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {accommodation.numberOfGuests || 1} fő
                  {accommodation.roomType.capacity !== accommodation.numberOfGuests && 
                    ` (${accommodation.roomType.capacity} fős szobában)`
                  }
                </span>
              </div>
              {accommodation.checkIn && accommodation.checkOut && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatDateSafely(accommodation.checkIn)} - {formatDateSafely(accommodation.checkOut)}
                  </span>
                </div>
              )}
              {accommodation.numberOfNights > 0 && (
                <div className="text-primary-foreground/80 font-medium">
                  {accommodationCost.toLocaleString()} Ft
                  <span className="text-xs text-muted-foreground ml-1">
                    ({accommodation.roomType.pricePerNight.toLocaleString()} Ft × {accommodation.numberOfNights} éj)
                  </span>
                  {accommodation.numberOfGuests && accommodation.numberOfGuests > 1 && (
                    <div className="text-xs text-muted-foreground">
                      {accommodationCostPerPerson.toLocaleString()} Ft / fő
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {Array.isArray(meals) && meals.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <UtensilsIcon className="h-4 w-4 text-primary" />
              <span>Étkezések</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              {meals.map((dayMeal, dayIndex) => {
                if (!dayMeal.meals || dayMeal.meals.length === 0) return null;
                
                return (
                  <div key={dayIndex} className="space-y-1">
                    <div className="text-xs text-muted-foreground font-medium">
                      {format(dayMeal.date, 'MMM d.')}
                    </div>
                    {dayMeal.meals.map((mealItem, mealIndex) => (
                      <div key={`${dayIndex}-${mealIndex}`} className="flex justify-between text-xs pl-2">
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
                );
              })}
              {mealsCost > 0 && (
                <div className="text-primary-foreground/80 font-medium pt-1 border-t border-border">
                  {mealsCost.toLocaleString()} Ft
                </div>
              )}
            </div>
          </div>
        )}
        
        {Array.isArray(programs) && programs.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>Programok</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div className="text-muted-foreground">
                {programs.length} program kiválasztva
              </div>
              {programsCost > 0 && (
                <div className="text-primary-foreground/80 font-medium">
                  {programsCost.toLocaleString()} Ft
                </div>
              )}
            </div>
          </div>
        )}

        {totalCost > 0 && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <BadgeEuroIcon className="h-4 w-4 text-primary" />
                <span>Összesen:</span>
              </div>
              <span>{totalCost.toLocaleString()} Ft</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RegistrationSummary;
