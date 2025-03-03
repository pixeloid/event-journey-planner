
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AccommodationOption, RoomType, SelectedAccommodation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, CheckIcon, BedIcon, UsersIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for accommodations
const ACCOMMODATIONS: AccommodationOption[] = [
  {
    id: 'acc1',
    name: 'Grand Hotel',
    address: 'Budapest, Andrássy út 100',
    description: 'Luxus szálloda a belvárosban',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room1',
        name: 'Egyágyas szoba',
        capacity: 1,
        pricePerNight: 35000,
        description: 'Kényelmes szoba egy személyre',
        available: 10
      },
      {
        id: 'room2',
        name: 'Kétágyas szoba',
        capacity: 2,
        pricePerNight: 45000,
        description: 'Tágas szoba két főre',
        available: 8
      },
      {
        id: 'room3',
        name: 'Lakosztály',
        capacity: 4,
        pricePerNight: 85000,
        description: 'Luxus lakosztály kilátással',
        available: 3
      }
    ]
  },
  {
    id: 'acc2',
    name: 'Park Inn',
    address: 'Budapest, Váci út 50',
    description: 'Modern szálloda zöld környezetben',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room4',
        name: 'Standard szoba',
        capacity: 2,
        pricePerNight: 32000,
        description: 'Kényelmes szoba egy vagy két főre',
        available: 15
      },
      {
        id: 'room5',
        name: 'Superior szoba',
        capacity: 2,
        pricePerNight: 39000,
        description: 'Superior szoba panorámával',
        available: 12
      },
      {
        id: 'room6',
        name: 'Családi szoba',
        capacity: 4,
        pricePerNight: 65000,
        description: 'Tágas szoba családok számára',
        available: 5
      }
    ]
  },
  {
    id: 'acc3',
    name: 'City Boutique',
    address: 'Budapest, Király utca 25',
    description: 'Elegáns boutique hotel a városközpontban',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2340',
    roomTypes: [
      {
        id: 'room7',
        name: 'Design szoba',
        capacity: 2,
        pricePerNight: 42000,
        description: 'Modern design szoba pároknak',
        available: 8
      },
      {
        id: 'room8',
        name: 'Deluxe szoba',
        capacity: 2,
        pricePerNight: 52000,
        description: 'Tágas deluxe szoba francia ággyal',
        available: 6
      },
      {
        id: 'room9',
        name: 'Penthouse',
        capacity: 4,
        pricePerNight: 95000,
        description: 'Exkluzív tetőtéri lakosztály',
        available: 2
      }
    ]
  }
];

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
  
  // Generate options for number of guests select
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

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
          <div className="flex flex-col space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-auto py-3"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "yyyy. MMMM d.")} - {format(dateRange.to, "yyyy. MMMM d.")}
                      </>
                    ) : (
                      format(dateRange.from, "yyyy. MMMM d.")
                    )
                  ) : (
                    <span>Válasszon dátumot</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from || undefined}
                  selected={dateRange as any}
                  onSelect={handleDateChange as any}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {dateRange.from && dateRange.to && (
              <div className="text-sm text-muted-foreground">
                {differenceInDays(dateRange.to, dateRange.from)} éjszaka
              </div>
            )}
          </div>
        </div>

        {data?.roomType && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vendégek száma</h3>
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
              <Select
                value={data.numberOfGuests?.toString() || "1"}
                onValueChange={handleGuestsChange}
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
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Válasszon szállást</h3>
        <RadioGroup
          value={selectedAccommodationId}
          onValueChange={handleAccommodationChange}
          className="grid grid-cols-1 gap-4"
        >
          {ACCOMMODATIONS.map((accommodation) => (
            <Label
              key={accommodation.id}
              htmlFor={accommodation.id}
              className={cn(
                "cursor-pointer rounded-lg border p-0 hover:bg-accent hover:text-accent-foreground transition-colors overflow-hidden",
                selectedAccommodationId === accommodation.id && "ring-2 ring-primary"
              )}
            >
              <Card className="bg-transparent border-0 shadow-none">
                <div className="overflow-hidden h-48 w-full">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{accommodation.name}</CardTitle>
                    <RadioGroupItem id={accommodation.id} value={accommodation.id} className="sr-only" />
                    {selectedAccommodationId === accommodation.id && (
                      <CheckIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>{accommodation.description}</CardDescription>
                </CardHeader>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {data?.accommodation && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Válasszon szobatípust</h3>
          <RadioGroup
            value={data.roomType?.id || ''}
            onValueChange={handleRoomTypeChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {data.accommodation.roomTypes.map((room) => (
              <Label
                key={room.id}
                htmlFor={room.id}
                className={cn(
                  "cursor-pointer border rounded-lg p-4 hover:bg-accent transition-colors",
                  data.roomType?.id === room.id && "ring-2 ring-primary bg-accent"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <BedIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{room.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{room.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <UsersIcon className="h-3 w-3" />
                      <span>Max. {room.capacity} fő</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-semibold">{room.pricePerNight.toLocaleString()} Ft</div>
                    <div className="text-xs text-muted-foreground">éjszakánként</div>
                    <RadioGroupItem id={room.id} value={room.id} className="sr-only" />
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {data?.accommodation && data.roomType && data.numberOfNights > 0 && (
        <div className="mt-8 p-4 bg-accent rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p>{data.numberOfNights} éjszaka × {data.roomType.pricePerNight.toLocaleString()} Ft</p>
              <p className="text-muted-foreground">{data.checkIn && format(data.checkIn, "yyyy. MMMM d.")} - {data.checkOut && format(data.checkOut, "yyyy. MMMM d.")}</p>
            </div>
            <div className="text-lg font-semibold">
              {(data.numberOfNights * data.roomType.pricePerNight).toLocaleString()} Ft
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Accommodation;
