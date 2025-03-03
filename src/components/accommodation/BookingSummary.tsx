
import React from 'react';
import { RoomType } from '@/lib/types';
import { format } from 'date-fns';

interface BookingSummaryProps {
  roomType: RoomType;
  numberOfNights: number;
  checkIn: Date;
  checkOut: Date;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  roomType,
  numberOfNights,
  checkIn,
  checkOut
}) => {
  return (
    <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Foglalás összegzése</h4>
          <p className="text-sm">
            {numberOfNights} éjszaka × {roomType.pricePerNight.toLocaleString()} Ft
          </p>
          <p className="text-sm text-muted-foreground">
            {format(checkIn, "yyyy. MMMM d.")} - {format(checkOut, "yyyy. MMMM d.")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {(numberOfNights * roomType.pricePerNight).toLocaleString()} Ft
          </div>
          <div className="text-xs text-muted-foreground">Teljes összeg</div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
