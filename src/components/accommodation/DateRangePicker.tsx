
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onDateChange: (range: { from: Date | null; to: Date | null }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateChange }) => {
  return (
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
            onSelect={onDateChange as any}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {dateRange.from && dateRange.to && (
        <div className="text-sm text-muted-foreground">
          {differenceInDays(dateRange.to, dateRange.from)} éjszaka
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
