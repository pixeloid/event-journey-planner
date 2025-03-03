
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SelectedAccommodation } from '@/lib/types';
import { BuildingIcon, BedIcon, BedDoubleIcon } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { ACCOMMODATIONS } from '../accommodation/accommodationData';
import DateRangePicker from '../accommodation/DateRangePicker';
import AccommodationCard from '../accommodation/AccommodationCard';
import RoomTypeSelector from '../accommodation/RoomTypeSelector';
import GuestSelector from '../accommodation/GuestSelector';
import BookingSummary from '../accommodation/BookingSummary';

type AccommodationProps = {
  data: SelectedAccommodation | null;
  updateData: (fields: Partial<SelectedAccommodation>) => void;
};

const Accommodation: React.FC<AccommodationProps> = ({ data, updateData }) => {
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>(data?.accommodation?.id || '');
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: data?.checkIn || null,
    to: data?.checkOut || null
  });
  
  // State to filter room types by bed type
  const [bedTypeFilter, setBedTypeFilter] = useState<'all' | 'single' | 'double'>('all');
  const [filteredRoomTypes, setFilteredRoomTypes] = useState(data?.accommodation?.roomTypes || []);

  useEffect(() => {
    if (data?.accommodation) {
      filterRoomTypes(data.accommodation.roomTypes);
    }
  }, [data?.accommodation, bedTypeFilter]);

  const filterRoomTypes = (roomTypes) => {
    if (!roomTypes) return [];
    
    if (bedTypeFilter === 'all') {
      setFilteredRoomTypes(roomTypes);
    } else {
      const filtered = roomTypes.filter(room => {
        if (bedTypeFilter === 'single') return room.bedType === 'single';
        if (bedTypeFilter === 'double') return room.bedType === 'double';
        return true;
      });
      setFilteredRoomTypes(filtered);
    }
  };

  const handleAccommodationChange = (accommodationId: string) => {
    setSelectedAccommodationId(accommodationId);
    const selectedAccommodation = ACCOMMODATIONS.find(acc => acc.id === accommodationId) || null;
    updateData({ 
      accommodation: selectedAccommodation,
      roomType: null,
      numberOfGuests: 1
    });
    
    if (selectedAccommodation) {
      filterRoomTypes(selectedAccommodation.roomTypes);
    }
  };

  const handleRoomTypeChange = (roomTypeId: string) => {
    if (!data?.accommodation) return;
    
    const selectedRoomType = data.accommodation.roomTypes.find(room => room.id === roomTypeId) || null;
    
    // Reset guest count to 1 or maintain current if it's valid for the new room type
    const newGuestCount = !data.numberOfGuests || data.numberOfGuests > selectedRoomType?.capacity 
      ? 1 
      : data.numberOfGuests;
    
    updateData({ 
      roomType: selectedRoomType,
      numberOfGuests: newGuestCount
    });
  };

  const handleGuestsChange = (value: string) => {
    updateData({ numberOfGuests: parseInt(value) });
  };

  const handleDateChange = (range: { from: Date | null; to: Date | null }) => {
    setDateRange(range);
    
    if (range.from && range.to) {
      const nights = differenceInDays(range.to, range.from);
      updateData({ 
        checkIn: range.from,
        checkOut: range.to,
        numberOfNights: nights
      });
    }
  };

  // Calculate max guests based on selected room type
  const maxGuests = data?.roomType?.capacity || 1;

  // Show guest selector immediately after selecting a room
  const showGuestSelector = data?.roomType !== null;

  // Create modified accommodation data with filtered room types for display
  const accommodationWithFilteredRooms = data?.accommodation 
    ? { 
        ...data.accommodation, 
        roomTypes: filteredRoomTypes 
      } 
    : null;

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

        {showGuestSelector && (
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <BedIcon className="h-5 w-5 mr-2" />
              Szobatípusok ({data.accommodation.name})
            </h3>
            
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={() => setBedTypeFilter('all')}
                className={`px-3 py-1 rounded text-sm ${bedTypeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                Összes
              </button>
              <button 
                type="button"
                onClick={() => setBedTypeFilter('single')}
                className={`px-3 py-1 rounded text-sm flex items-center ${bedTypeFilter === 'single' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                <BedIcon className="h-3 w-3 mr-1" />
                Egyágyas
              </button>
              <button 
                type="button"
                onClick={() => setBedTypeFilter('double')}
                className={`px-3 py-1 rounded text-sm flex items-center ${bedTypeFilter === 'double' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
              >
                <BedDoubleIcon className="h-3 w-3 mr-1" />
                Kétágyas
              </button>
            </div>
          </div>
          
          {accommodationWithFilteredRooms && (
            <RoomTypeSelector 
              accommodation={accommodationWithFilteredRooms}
              selectedRoomType={data.roomType}
              onRoomTypeChange={handleRoomTypeChange}
              numberOfGuests={data.numberOfGuests || 1}
            />
          )}
        </div>
      )}

      {data?.accommodation && data.roomType && data.numberOfNights > 0 && data.checkIn && data.checkOut && (
        <BookingSummary 
          roomType={data.roomType}
          numberOfNights={data.numberOfNights}
          numberOfGuests={data.numberOfGuests || 1}
          checkIn={data.checkIn}
          checkOut={data.checkOut}
        />
      )}
    </motion.div>
  );
};

export default Accommodation;
