
import React from 'react';
import { RoomType } from '@/lib/types';
import { format } from 'date-fns';
import { UsersIcon } from 'lucide-react';

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
    <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Foglalás összegzése</h4>
          <p className="text-sm">
            {numberOfNights} éjszaka × {roomType.pricePerNight.toLocaleString()} Ft
          </p>
          <p className="text-sm text-muted-foreground">
            {checkInFormatted} - {checkOutFormatted}
          </p>
          <div className="flex items-center text-sm mt-1">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>{numberOfGuests} fő</span>
            {isUnderOccupied && (
              <span className="text-amber-600 ml-2 text-xs">
                (Megjegyzés: {roomType.capacity} fős szoba {numberOfGuests} főre foglalva)
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {totalPrice.toLocaleString()} Ft
          </div>
          <div className="text-xs text-muted-foreground">Teljes összeg</div>
          {numberOfGuests > 1 && (
            <div className="text-xs text-muted-foreground">
              {pricePerPerson.toLocaleString()} Ft / fő
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
