
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SelectedAccommodation } from '@/lib/types';
import { BuildingIcon, BedIcon } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { ACCOMMODATIONS } from '../accommodation/accommodationData';
import DateRangePicker from '../accommodation/DateRangePicker';
import AccommodationCard from '../accommodation/AccommodationCard';
import RoomTypeSelector from '../accommodation/RoomTypeSelector';
import GuestSelector from '../accommodation/GuestSelector';
import BookingSummary from '../accommodation/BookingSummary';

type AccommodationProps = {
  data: SelectedAccommodation | null;
  updateFields: (fields: Partial<SelectedAccommodation>) => void;
};

const Accommodation: React.FC<AccommodationProps> = ({ data, updateFields }) => {
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>(data?.accommodation?.id || '');
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: data?.checkIn || null,
    to: data?.checkOut || null
  });

  const handleAccommodationChange = (accommodationId: string) => {
    setSelectedAccommodationId(accommodationId);
    const selectedAccommodation = ACCOMMODATIONS.find(acc => acc.id === accommodationId) || null;
    updateFields({ 
      accommodation: selectedAccommodation,
      roomType: null
    });
  };

  const handleRoomTypeChange = (roomTypeId: string) => {
    if (!data?.accommodation) return;
    
    const selectedRoomType = data.accommodation.roomTypes.find(room => room.id === roomTypeId) || null;
    updateFields({ roomType: selectedRoomType });
  };

  const handleGuestsChange = (value: string) => {
    updateFields({ numberOfGuests: parseInt(value) });
  };

  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
    
    if (range.from && range.to) {
      const nights = differenceInDays(range.to, range.from);
      updateFields({ 
        checkIn: range.from,
        checkOut: range.to,
        numberOfNights: nights
      });
    }
  };

  // Calculate max guests based on selected room type
  const maxGuests = data?.roomType?.capacity || 1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Szállásfoglalás</h2>
        <p className="text-muted-foreground">Válassza ki a szállását és a szoba típusát</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Dátumok kiválasztása</h3>
          <DateRangePicker 
            dateRange={dateRange}
            onDateChange={handleDateChange}
          />
        </div>

        {data?.roomType && (
          <GuestSelector 
            numberOfGuests={data.numberOfGuests || 1}
            maxGuests={maxGuests}
            onGuestsChange={handleGuestsChange}
          />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <BuildingIcon className="h-5 w-5 mr-2" />
          Válasszon szállást
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACCOMMODATIONS.map((accommodation) => (
            <AccommodationCard 
              key={accommodation.id}
              accommodation={accommodation}
              isSelected={selectedAccommodationId === accommodation.id}
              onClick={() => handleAccommodationChange(accommodation.id)}
            />
          ))}
        </div>
      </div>

      {data?.accommodation && (
        <div className="space-y-4 bg-accent/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium flex items-center">
            <BedIcon className="h-5 w-5 mr-2" />
            Szobatípusok ({data.accommodation.name})
          </h3>
          <RoomTypeSelector 
            accommodation={data.accommodation}
            selectedRoomType={data.roomType}
            onRoomTypeChange={handleRoomTypeChange}
          />
        </div>
      )}

      {data?.accommodation && data.roomType && data.numberOfNights > 0 && data.checkIn && data.checkOut && (
        <BookingSummary 
          roomType={data.roomType}
          numberOfNights={data.numberOfNights}
          checkIn={data.checkIn}
          checkOut={data.checkOut}
        />
      )}
    </motion.div>
  );
};

export default Accommodation;
