
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface GuestSelectorProps {
  numberOfGuests: number;
  maxGuests: number;
  onGuestsChange: (value: string) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ 
  numberOfGuests, 
  maxGuests, 
  onGuestsChange 
}) => {
  // Generate options for number of guests select
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);
  
  const handleDecrement = () => {
    if (numberOfGuests > 1) {
      onGuestsChange((numberOfGuests - 1).toString());
    }
  };
  
  const handleIncrement = () => {
    if (numberOfGuests < maxGuests) {
      onGuestsChange((numberOfGuests + 1).toString());
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vendégek száma</h3>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between bg-background p-3 rounded-md border">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="font-medium">Vendégek</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleDecrement}
              disabled={numberOfGuests <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center font-medium">{numberOfGuests}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleIncrement}
              disabled={numberOfGuests >= maxGuests}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Ehhez a szobához legfeljebb {maxGuests} vendég foglalható.
        </p>
      </div>
    </div>
  );
};

export default GuestSelector;
