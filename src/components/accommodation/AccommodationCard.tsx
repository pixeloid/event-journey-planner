
import React from 'react';
import { AccommodationOption } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccommodationCardProps {
  accommodation: AccommodationOption;
  isSelected: boolean;
  onClick: () => void;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ 
  accommodation, 
  isSelected, 
  onClick 
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer hover:bg-accent transition-colors overflow-hidden",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <div className="overflow-hidden h-32 w-full">
        <img
          src={accommodation.image}
          alt={accommodation.name}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{accommodation.name}</CardTitle>
          {isSelected && (
            <CheckIcon className="h-5 w-5 text-primary" />
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {accommodation.description} • {accommodation.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <div className="text-sm font-medium">
          Szobák ára: {accommodation.roomTypes[0].pricePerNight.toLocaleString()} Ft-tól / éj
        </div>
      </CardContent>
    </Card>
  );
};

export default AccommodationCard;
