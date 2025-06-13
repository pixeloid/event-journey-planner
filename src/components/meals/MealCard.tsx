
import React from 'react';
import { MealOption } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CupSodaIcon, SaladIcon, UtensilsCrossedIcon, ChefHatIcon, MinusIcon, PlusIcon } from 'lucide-react';

interface MealCardProps {
  meal: MealOption;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, quantity, onQuantityChange }) => {
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

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  const isSelected = quantity > 0;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border",
        isSelected && "ring-2 ring-primary border-primary"
      )}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-1.5 rounded-full",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {getMealIcon(meal.type)}
            </div>
            <h4 className="font-medium text-sm">{meal.name}</h4>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 flex-1">{meal.description}</p>
        
        <div className="space-y-3">
          <div className="font-semibold text-sm">{meal.price.toLocaleString()} Ft</div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mennyiség:</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleDecrease}
                disabled={quantity === 0}
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleIncrease}
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {quantity > 0 && (
            <div className="text-sm font-medium text-primary">
              Összesen: {(meal.price * quantity).toLocaleString()} Ft
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
