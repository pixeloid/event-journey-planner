
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProgramOption } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, UsersIcon, PlusIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock program options
const PROGRAM_OPTIONS: ProgramOption[] = [
  {
    id: 'prog1',
    name: 'Színházi előadás',
    description: 'Exkluzív színházi előadás a város híres színházában',
    date: new Date(2023, 8, 15, 19, 0),
    duration: '2 óra',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=2341',
    capacity: 50,
    available: 22
  },
  {
    id: 'prog2',
    name: 'Borkóstoló',
    description: 'Prémium borok kóstolója helyi borászok vezetésével',
    date: new Date(2023, 8, 16, 18, 30),
    duration: '1.5 óra',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2340',
    capacity: 30,
    available: 12
  },
  {
    id: 'prog3',
    name: 'Városnéző túra',
    description: 'Vezetett séta a város legszebb helyein',
    date: new Date(2023, 8, 17, 10, 0),
    duration: '3 óra',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&q=80&w=2342',
    capacity: 25,
    available: 8
  },
  {
    id: 'prog4',
    name: 'Szakmai workshop',
    description: 'Interaktív szakmai műhelymunka nemzetközi előadókkal',
    date: new Date(2023, 8, 16, 14, 0),
    duration: '4 óra',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&q=80&w=2340',
    capacity: 40,
    available: 15
  },
  {
    id: 'prog5',
    name: 'Grill vacsora',
    description: 'Szabadtéri grill vacsora élő zenével',
    date: new Date(2023, 8, 17, 19, 30),
    duration: '3 óra',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1544510808-91e64059d0ea?auto=format&fit=crop&q=80&w=2374',
    capacity: 60,
    available: 28
  },
  {
    id: 'prog6',
    name: 'Koncert',
    description: 'Exkluzív koncert a helyi zenekarral',
    date: new Date(2023, 8, 18, 20, 0),
    duration: '2 óra',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1499364615646-ec38552f4f34?auto=format&fit=crop&q=80&w=2342',
    capacity: 80,
    available: 35
  }
];

type ProgramsProps = {
  selectedPrograms: ProgramOption[];
  updatePrograms: (programs: ProgramOption[]) => void;
};

const Programs: React.FC<ProgramsProps> = ({ selectedPrograms = [], updatePrograms }) => {
  const handleProgramToggle = (program: ProgramOption) => {
    const isSelected = selectedPrograms.some(p => p.id === program.id);
    
    if (isSelected) {
      // Remove program if already selected
      updatePrograms(selectedPrograms.filter(p => p.id !== program.id));
    } else {
      // Add program
      updatePrograms([...selectedPrograms, program]);
    }
  };
  
  const isProgramSelected = (programId: string): boolean => {
    return selectedPrograms && selectedPrograms.some(program => program.id === programId);
  };

  const calculateTotalPrice = () => {
    return selectedPrograms ? selectedPrograms.reduce((sum, program) => sum + program.price, 0) : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Kiegészítő programok</h2>
        <p className="text-muted-foreground">Válasszon extra programokat az eseményhez</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAM_OPTIONS.map((program) => {
          const isSelected = isProgramSelected(program.id);
          
          return (
            <Card 
              key={program.id}
              className={cn(
                "overflow-hidden h-full flex flex-col transition-all",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <div className="overflow-hidden h-48 relative">
                <img
                  src={program.image}
                  alt={program.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm">
                    {program.price.toLocaleString()} Ft
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{program.name}</CardTitle>
                <CardDescription>{program.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 pb-4 flex-grow">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{format(program.date, 'yyyy. MMMM d. (EEEE)')}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <span>{format(program.date, 'HH:mm')} • {program.duration}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    <span>Még {program.available} szabad hely</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleProgramToggle(program)}
                >
                  {isSelected ? (
                    <>
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Kiválasztva
                    </>
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Hozzáadás
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        {selectedPrograms && selectedPrograms.length > 0 ? (
          <div className="p-4 bg-accent rounded-lg">
            <h4 className="font-medium mb-4">Kiválasztott programok</h4>
            <div className="space-y-2">
              {selectedPrograms.map(program => (
                <div key={program.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{program.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {format(program.date, 'yyyy. MMMM d.')} • {format(program.date, 'HH:mm')}
                    </div>
                  </div>
                  <span>{program.price.toLocaleString()} Ft</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
                <span>Összesen</span>
                <span>{calculateTotalPrice().toLocaleString()} Ft</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-muted text-muted-foreground rounded-lg">
            <p>Nincs kiválasztott program</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Programs;
