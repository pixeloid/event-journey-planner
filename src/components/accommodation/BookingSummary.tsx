
import React from 'react';
import { RoomType } from '@/lib/types';
import { format } from 'date-fns';
import { UsersIcon, CalendarIcon, BuildingIcon, BedIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BookingSummaryProps {
  roomType: RoomType;
  numberOfNights: number;
  numberOfGuests: number;
  checkIn: Date;
  checkOut: Date;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  roomType,
  numberOfNights,
  numberOfGuests,
  checkIn,
  checkOut
}) => {
  // Ensure the dates have valid time values before formatting
  const formatDate = (date: Date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, "yyyy. MMMM d.");
    }
    return "Invalid date";
  };

  const checkInFormatted = formatDate(checkIn);
  const checkOutFormatted = formatDate(checkOut);
  
  // Calculate total price
  const totalPrice = numberOfNights * roomType.pricePerNight;
  
  // Calculate price per person (if more than 1 guest)
  const pricePerPerson = numberOfGuests > 1 ? Math.round(totalPrice / numberOfGuests) : totalPrice;
  
  // Determine if room is under-occupied (fewer guests than capacity)
  const isUnderOccupied = numberOfGuests < roomType.capacity && roomType.capacity > 1;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <CardTitle className="text-lg mb-4">Foglalás összegzése</CardTitle>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <BedIcon className="h-4 w-4 mr-1 text-primary" />
                <span className="font-medium">{roomType.name}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground pl-5">
                <span>{numberOfNights} éjszaka × {roomType.pricePerNight.toLocaleString()} Ft</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{totalPrice.toLocaleString()} Ft</div>
              <div className="text-xs text-muted-foreground">teljes ár</div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
              <span>{checkInFormatted} - {checkOutFormatted}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1 text-primary" />
              <span>{numberOfGuests} fő</span>
              {isUnderOccupied && (
                <span className="text-amber-600 ml-2 text-xs">
                  (Megjegyzés: {roomType.capacity} fős szoba {numberOfGuests} főre foglalva)
                </span>
              )}
            </div>
          </div>

          {numberOfGuests > 1 && (
            <>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">Ár személyenként:</span>
                <div>
                  <div className="font-medium">{pricePerPerson.toLocaleString()} Ft / fő</div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
