
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RegistrationData } from '@/lib/types';
import { format } from 'date-fns';
import { Building2Icon, BedIcon, UtensilsIcon, CalendarIcon, BadgeEuroIcon } from 'lucide-react';

interface RegistrationSummaryProps {
  data: RegistrationData;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ data }) => {
  const { accommodation, meals, programs } = data;

  // Calculate costs
  const accommodationCost = accommodation?.roomType?.pricePerNight 
    ? accommodation.roomType.pricePerNight * (accommodation.numberOfNights || 0)
    : 0;
  
  const mealsCost = meals?.reduce((total, dayMeal) => 
    total + (dayMeal.meals?.reduce((mealTotal, meal) => mealTotal + (meal.price || 0), 0) || 0), 0) || 0;
  
  const programsCost = programs?.reduce((total, program) => 
    total + (program.price || 0), 0) || 0;
  
  const totalCost = accommodationCost + mealsCost + programsCost;

  return (
    <Card className="sticky top-6 overflow-auto max-h-[calc(100vh-4rem)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-lg">Foglalási információk</h3>
        
        {accommodation?.accommodation && (
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Building2Icon className="h-4 w-4 text-primary" />
              <span>Szállás</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div>{accommodation.accommodation.name}</div>
              {accommodation.roomType && (
                <div className="flex items-center gap-1">
                  <BedIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{accommodation.roomType.name}</span>
                </div>
              )}
              {accommodation.checkIn && accommodation.checkOut && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(accommodation.checkIn, "MMM d.")} - {format(accommodation.checkOut, "MMM d.")}
                  </span>
                </div>
              )}
              {accommodationCost > 0 && (
                <div className="text-primary-foreground/80 font-medium">
                  {accommodationCost.toLocaleString()} Ft
                </div>
              )}
            </div>
          </div>
        )}
        
        {meals && meals.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <UtensilsIcon className="h-4 w-4 text-primary" />
              <span>Étkezések</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div className="text-muted-foreground">
                {meals.length} napi étkezés kiválasztva
              </div>
              {mealsCost > 0 && (
                <div className="text-primary-foreground/80 font-medium">
                  {mealsCost.toLocaleString()} Ft
                </div>
              )}
            </div>
          </div>
        )}
        
        {programs && programs.length > 0 && (
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
