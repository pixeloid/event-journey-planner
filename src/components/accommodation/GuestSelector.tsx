
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersIcon } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vendégek száma</h3>
      <div className="flex items-center space-x-2">
        <UsersIcon className="h-5 w-5 text-muted-foreground" />
        <Select
          value={numberOfGuests?.toString() || "1"}
          onValueChange={onGuestsChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Válasszon" />
          </SelectTrigger>
          <SelectContent>
            {guestOptions.map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'vendég' : 'vendég'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GuestSelector;
