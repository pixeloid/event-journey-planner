
import React from 'react';
import { MealOption } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { CupSodaIcon, SaladIcon, UtensilsCrossedIcon, ChefHatIcon } from 'lucide-react';

interface MealCardProps {
  meal: MealOption;
  isSelected: boolean;
  onToggle: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, isSelected, onToggle }) => {
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering when clicking directly on the checkbox
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    onToggle();
  };

  const handleCheckboxChange = (checked: boolean) => {
    onToggle();
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all border",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={handleCardClick}
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
            onCheckedChange={handleCheckboxChange}
            className="data-[state=checked]:bg-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{meal.description}</p>
        
        <div className="mt-auto">
          <span className="font-semibold">{meal.price.toLocaleString()} Ft</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
