
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SelectedAccommodation } from '@/lib/types';
import { BuildingIcon, BedIcon, BedDoubleIcon, UsersIcon } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { ACCOMMODATIONS } from '../accommodation/accommodationData';
import DateRangePicker from '../accommodation/DateRangePicker';
import AccommodationCard from '../accommodation/AccommodationCard';
import RoomTypeSelector from '../accommodation/RoomTypeSelector';
import GuestSelector from '../accommodation/GuestSelector';
import BookingSummary from '../accommodation/BookingSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      className="space-y-6"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Válasszon időpontot</CardTitle>
          <CardDescription>
            Adja meg az érkezés és távozás dátumát
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker 
            dateRange={dateRange}
            onDateChange={handleDateChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <BuildingIcon className="h-5 w-5 mr-2" />
            Válasszon szállást
          </CardTitle>
          <CardDescription>
            Kattintson egy szállásra a kiválasztáshoz
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {data?.accommodation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <BedIcon className="h-5 w-5 mr-2" />
              Szobatípus - {data.accommodation.name}
            </CardTitle>
            <CardDescription>
              Válasszon az elérhető szobatípusok közül
            </CardDescription>
            
            <Tabs defaultValue="all" className="mt-3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" onClick={() => setBedTypeFilter('all')}>
                  Összes
                </TabsTrigger>
                <TabsTrigger value="single" onClick={() => setBedTypeFilter('single')}>
                  <BedIcon className="h-3 w-3 mr-1" />
                  Egyágyas
                </TabsTrigger>
                <TabsTrigger value="double" onClick={() => setBedTypeFilter('double')}>
                  <BedDoubleIcon className="h-3 w-3 mr-1" />
                  Kétágyas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {accommodationWithFilteredRooms && filteredRoomTypes.length > 0 ? (
              <RoomTypeSelector 
                accommodation={accommodationWithFilteredRooms}
                selectedRoomType={data.roomType}
                onRoomTypeChange={handleRoomTypeChange}
                numberOfGuests={data.numberOfGuests || 1}
              />
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nincs elérhető szoba a kiválasztott szűrőkkel
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {showGuestSelector && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Vendégek
            </CardTitle>
            <CardDescription>
              Adja meg hány vendég érkezik a szobába
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GuestSelector 
              numberOfGuests={data?.numberOfGuests || 1}
              maxGuests={maxGuests}
              onGuestsChange={handleGuestsChange}
            />
          </CardContent>
        </Card>
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
