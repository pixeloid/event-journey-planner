
import React from 'react';
import { RoomType, AccommodationOption } from '@/lib/types';
import { CheckIcon, UsersIcon, InfoIcon, BedIcon, BedDoubleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomTypeSelectorProps {
  accommodation: AccommodationOption;
  selectedRoomType: RoomType | null;
  onRoomTypeChange: (roomTypeId: string) => void;
  numberOfGuests: number;
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({
  accommodation,
  selectedRoomType,
  onRoomTypeChange,
  numberOfGuests
}) => {
  // Function to get the appropriate bed icon based on bed type
  const getBedIcon = (bedType: string) => {
    if (bedType === 'double') {
      return <BedDoubleIcon className="h-4 w-4 mr-1 text-muted-foreground" />;
    }
    return <BedIcon className="h-4 w-4 mr-1 text-muted-foreground" />;
  };

  // Calculate price per person for display
  const calculatePricePerPerson = (room: RoomType, guests: number) => {
    if (guests <= 0) return room.pricePerNight;
    return Math.round(room.pricePerNight / guests);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {accommodation.roomTypes.map((room) => {
        const pricePerPerson = calculatePricePerPerson(room, numberOfGuests);
        const isUnderOccupied = numberOfGuests < room.capacity && room.capacity > 1;
        
        return (
          <div
            key={room.id}
            className={cn(
              "cursor-pointer border rounded-lg p-4 bg-background hover:bg-accent/50 transition-colors",
              selectedRoomType?.id === room.id && "ring-2 ring-primary"
            )}
            onClick={() => onRoomTypeChange(room.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{room.name}</span>
                  {selectedRoomType?.id === room.id && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{room.description}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Max. {room.capacity} fő</span>
                  </div>
                  <div className="flex items-center">
                    {getBedIcon(room.bedType)}
                    <span>{room.bedType === 'single' ? 'Egyágyas' : room.bedType === 'double' ? 'Kétágyas' : 'Több ágyas'}</span>
                  </div>
                  <div className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Még {room.available} szabad</span>
                  </div>
                </div>
                {isUnderOccupied && (
                  <p className="text-xs text-amber-600 mt-1">
                    Figyelem: {room.capacity} fős szoba {numberOfGuests} főre foglalva
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{room.pricePerNight.toLocaleString()} Ft</div>
                <div className="text-xs text-muted-foreground">éjszakánként</div>
                {numberOfGuests > 1 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {pricePerPerson.toLocaleString()} Ft / fő
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomTypeSelector;
