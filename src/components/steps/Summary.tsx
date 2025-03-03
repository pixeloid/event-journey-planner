import React from 'react';
import { motion } from 'framer-motion';
import { RegistrationData } from '@/lib/types';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Summary = ({ data }: { data: RegistrationData }) => {
  const { personalInfo, accommodation, meals, programs, sponsors } = data;

  // Calculate cost summaries
  const accommodationCost = accommodation ? 
    (accommodation.accommodation && accommodation.roomType ? 
      accommodation.roomType.pricePerNight || 0 : 0) * 
    (accommodation.checkOut && accommodation.checkIn ? 
      (accommodation.checkOut.getTime() - accommodation.checkIn.getTime()) / (1000 * 60 * 60 * 24) : 0) : 0;
  
  const mealsCost = meals.reduce((total, dayMeal) => 
    total + dayMeal.meals.reduce((sum, meal) => sum + meal.price, 0), 0);
  
  const programsCost = programs.reduce((total, program) => total + program.price, 0);
  
  const totalCost = accommodationCost + mealsCost + programsCost;
  
  // Calculate sponsor contributions
  const sponsorContributions = sponsors.map(sponsor => ({
    name: sponsor.name,
    accommodation: (sponsor.contributions.accommodation / 100) * accommodationCost,
    meals: (sponsor.contributions.meals / 100) * mealsCost,
    programs: (sponsor.contributions.programs / 100) * programsCost,
    total: (
      (sponsor.contributions.accommodation / 100) * accommodationCost +
      (sponsor.contributions.meals / 100) * mealsCost +
      (sponsor.contributions.programs / 100) * programsCost
    )
  }));
  
  const totalSponsorContribution = sponsorContributions.reduce(
    (total, sponsor) => total + sponsor.total, 0
  );

  const remainingCost = totalCost - totalSponsorContribution;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Személyes adatok</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Név:</span>
                <span className="font-medium">{personalInfo.lastName} {personalInfo.firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefon:</span>
                <span>{personalInfo.phone}</span>
              </div>
              {personalInfo.company && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cég:</span>
                  <span>{personalInfo.company}</span>
                </div>
              )}
              {personalInfo.position && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pozíció:</span>
                  <span>{personalInfo.position}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Accommodation */}
        {accommodation && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Szállás</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Szálláshely:</span>
                  <span className="font-medium">{accommodation.accommodation?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Szobatípus:</span>
                  <span>{accommodation.roomType ? accommodation.roomType.name : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendégek száma:</span>
                  <span>{accommodation.numberOfGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Érkezés:</span>
                  <span>{accommodation.checkIn ? format(accommodation.checkIn, 'yyyy. MM. dd.') : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Távozás:</span>
                  <span>{accommodation.checkOut ? format(accommodation.checkOut, 'yyyy. MM. dd.') : ''}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
                  <span>Összesen:</span>
                  <span>{accommodationCost.toLocaleString()} Ft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Meals and Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meals */}
        {meals.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Étkezések</h3>
              <div className="space-y-2">
                {meals.map((dayMeal, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-md font-semibold">{format(dayMeal.date, 'yyyy. MM. dd.')}</h4>
                    {dayMeal.meals.map((meal) => (
                      <div key={meal.id} className="flex justify-between">
                        <span>{meal.name}</span>
                        <span>{meal.price.toLocaleString()} Ft</span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
                  <span>Összesen:</span>
                  <span>{mealsCost.toLocaleString()} Ft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Programs */}
        {programs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Programok</h3>
              <div className="space-y-2">
                {programs.map((program) => (
                  <div key={program.id} className="flex justify-between">
                    <span>{program.name}</span>
                    <span>{program.price.toLocaleString()} Ft</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
                  <span>Összesen:</span>
                  <span>{programsCost.toLocaleString()} Ft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Cost Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Költségek összesítése</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-base">
              <span>Szállás:</span>
              <span>{accommodationCost.toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Étkezések:</span>
              <span>{mealsCost.toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Programok:</span>
              <span>{programsCost.toLocaleString()} Ft</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-medium">
              <span>Összesen:</span>
              <span>{totalCost.toLocaleString()} Ft</span>
            </div>
          </div>
          
          {sponsors.length > 0 && (
            <>
              <h4 className="text-md font-semibold mt-6 mb-3">Szponzori hozzájárulások</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Cég</TableHead>
                    <TableHead className="text-right">Szállás</TableHead>
                    <TableHead className="text-right">Étkezés</TableHead>
                    <TableHead className="text-right">Program</TableHead>
                    <TableHead className="text-right">Összesen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsorContributions.map((sponsor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sponsor.name}</TableCell>
                      <TableCell className="text-right">{sponsor.accommodation.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right">{sponsor.meals.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right">{sponsor.programs.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right font-medium">{sponsor.total.toLocaleString()} Ft</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-base">
                  <span>Szponzori hozzájárulások:</span>
                  <span>{totalSponsorContribution.toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Önrész:</span>
                  <span>{remainingCost.toLocaleString()} Ft</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Summary;
