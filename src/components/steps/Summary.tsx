
import React from 'react';
import { motion } from 'framer-motion';
import { RegistrationData, RoomType } from '@/lib/types';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserIcon, BedIcon, UtensilsCrossedIcon, 
  TicketIcon, BuildingIcon, AlertCircleIcon 
} from 'lucide-react';

type SummaryProps = {
  allData: RegistrationData;
};

const Summary: React.FC<SummaryProps> = ({ allData }) => {
  const { personalInfo, accommodation, meals, programs, sponsors } = allData;

  // Calculate cost summaries
  const accommodationCost = accommodation ? 
    // Get price based on room type
    (accommodation.accommodation.pricePerNight?.[accommodation.roomType] || 0) * 
    (accommodation.checkOut.getTime() - accommodation.checkIn.getTime()) / (1000 * 60 * 60 * 24) : 0;
  
  const mealsCost = meals.reduce((total, dayMeal) => 
    total + dayMeal.meals.reduce((sum, meal) => sum + meal.price, 0), 0);
  
  const programsCost = programs.reduce((total, program) => total + program.price, 0);
  
  const totalCost = accommodationCost + mealsCost + programsCost;

  // Calculate sponsor contributions
  const sponsorContributions = sponsors.map(sponsor => {
    const accommodationContribution = (accommodationCost * sponsor.contributions.accommodation) / 100;
    const mealsContribution = (mealsCost * sponsor.contributions.meals) / 100;
    const programsContribution = (programsCost * sponsor.contributions.programs) / 100;
    const totalContribution = (totalCost * sponsor.contributions.total) / 100;
    
    return {
      sponsor,
      accommodationContribution,
      mealsContribution,
      programsContribution,
      totalContribution
    };
  });

  const totalSponsorContribution = sponsorContributions.reduce(
    (total, { totalContribution }) => total + totalContribution, 0
  );

  const remainingCost = totalCost - totalSponsorContribution;

  const getRoomTypeName = (type: RoomType): string => {
    if (type === 'single') return 'Egyágyas';
    if (type === 'double') return 'Kétágyas';
    if (type === 'suite') return 'Lakosztály';
    return 'Apartman';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Foglalási összegzés</h2>
        <p className="text-muted-foreground">Ellenőrizze a megadott adatokat a véglegesítés előtt</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Személyes adatok</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Név:</span>
                <span className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</span>
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <BedIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Szállás</h3>
            </div>
            {accommodation ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Szálláshely:</span>
                  <span className="font-medium">{accommodation.accommodation.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Szobatípus:</span>
                  <span>{getRoomTypeName(accommodation.roomType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendégek száma:</span>
                  <span>{accommodation.numberOfGuests} fő</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Érkezés:</span>
                  <span>{format(accommodation.checkIn, 'yyyy. MM. dd.')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Távozás:</span>
                  <span>{format(accommodation.checkOut, 'yyyy. MM. dd.')}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border mt-2">
                  <span>Összesen:</span>
                  <span>{accommodationCost.toLocaleString()} Ft</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Nincs kiválasztva szállás</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meals */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <UtensilsCrossedIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Étkezések</h3>
          </div>
          {meals.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dátum</TableHead>
                    <TableHead>Étkezés</TableHead>
                    <TableHead className="text-right">Ár</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meals.map((dayMeal, index) => (
                    dayMeal.meals.map((meal, mealIndex) => (
                      <TableRow key={`${index}-${mealIndex}`}>
                        {mealIndex === 0 && (
                          <TableCell rowSpan={dayMeal.meals.length} className="align-top">
                            {format(dayMeal.date, 'yyyy. MM. dd.')}
                          </TableCell>
                        )}
                        <TableCell>{meal.name}</TableCell>
                        <TableCell className="text-right">{meal.price.toLocaleString()} Ft</TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between font-medium pt-2 border-t border-border">
                <span>Összesen:</span>
                <span>{mealsCost.toLocaleString()} Ft</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>Nincs kiválasztva étkezés</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Programs */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <TicketIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Programok</h3>
          </div>
          {programs.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Dátum és idő</TableHead>
                    <TableHead>Időtartam</TableHead>
                    <TableHead className="text-right">Ár</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>
                        {format(program.date, 'yyyy. MM. dd.')} {format(program.date, 'HH:mm')}
                      </TableCell>
                      <TableCell>{program.duration}</TableCell>
                      <TableCell className="text-right">{program.price.toLocaleString()} Ft</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between font-medium pt-2 border-t border-border">
                <span>Összesen:</span>
                <span>{programsCost.toLocaleString()} Ft</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>Nincs kiválasztva program</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Sharing */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <BuildingIcon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Költségmegosztás</h3>
          </div>
          
          {sponsors.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Szponzor</TableHead>
                    <TableHead className="text-right">Szállás</TableHead>
                    <TableHead className="text-right">Étkezés</TableHead>
                    <TableHead className="text-right">Programok</TableHead>
                    <TableHead className="text-right">Összesen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsorContributions.map(({ sponsor, accommodationContribution, mealsContribution, programsContribution, totalContribution }, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{sponsor.name}</TableCell>
                      <TableCell className="text-right">{accommodationContribution.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right">{mealsContribution.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right">{programsContribution.toLocaleString()} Ft</TableCell>
                      <TableCell className="text-right">{totalContribution.toLocaleString()} Ft</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="font-semibold">Szponzorálás összesen</TableCell>
                    <TableCell className="text-right font-semibold">{totalSponsorContribution.toLocaleString()} Ft</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>Nincs hozzáadva szponzor cég</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Costs */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Végösszeg</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Szállás:</span>
              <span>{accommodationCost.toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between">
              <span>Étkezések:</span>
              <span>{mealsCost.toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between">
              <span>Programok:</span>
              <span>{programsCost.toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span>Bruttó végösszeg:</span>
              <span className="font-bold">{totalCost.toLocaleString()} Ft</span>
            </div>
            
            {sponsors.length > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Szponzorálás:</span>
                  <span>-{totalSponsorContribution.toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2 text-lg font-bold">
                  <span>Fizetendő összeg:</span>
                  <span>{remainingCost.toLocaleString()} Ft</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Summary;
