
import React from 'react';
import { format } from 'date-fns';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DaySelectorProps {
  days: Date[];
  activeTab: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({ days, activeTab }) => {
  return (
    <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8">
      {days.map((day) => (
        <TabsTrigger 
          key={format(day, 'yyyy-MM-dd')} 
          value={format(day, 'yyyy-MM-dd')}
          className="text-center"
        >
          <div className="flex flex-col items-center text-xs sm:text-sm">
            <span className="font-medium">{format(day, 'MMM d.')}</span>
            <span className="text-muted-foreground hidden sm:inline">{format(day, 'EEEE')}</span>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default DaySelector;
