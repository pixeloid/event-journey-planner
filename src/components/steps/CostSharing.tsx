
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CostDistribution, SponsorCompany } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PlusIcon, MinusIcon, TrashIcon, BuildingIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock sponsor companies
const SPONSOR_COMPANIES: SponsorCompany[] = [
  { id: 'comp1', name: 'ABC Kft.', contactPerson: 'Kiss János', email: 'janos.kiss@abc.hu' },
  { id: 'comp2', name: 'XYZ Zrt.', contactPerson: 'Nagy Béla', email: 'bela.nagy@xyz.hu' },
  { id: 'comp3', name: 'Innovatív Rt.', contactPerson: 'Szabó Anna', email: 'anna.szabo@innovativ.hu' }
];

type CostSharingProps = {
  distributions: CostDistribution[];
  accommodationTotal: number;
  mealsTotal: number;
  programsTotal: number;
  updateDistributions: (distributions: CostDistribution[]) => void;
};

const CostSharing: React.FC<CostSharingProps> = ({ 
  distributions, 
  accommodationTotal, 
  mealsTotal, 
  programsTotal, 
  updateDistributions 
}) => {
  const [newCompanyName, setNewCompanyName] = useState('');
  
  const totalCost = accommodationTotal + mealsTotal + programsTotal;
  
  const addSponsor = () => {
    if (!newCompanyName.trim()) return;
    
    const newCompany: SponsorCompany = {
      id: `new-${Date.now()}`,
      name: newCompanyName
    };
    
    const newDistribution: CostDistribution = {
      accommodationCoverage: 0,
      mealsCoverage: 0,
      programsCoverage: 0,
      sponsorCompany: newCompany
    };
    
    updateDistributions([...distributions, newDistribution]);
    setNewCompanyName('');
  };
  
  const removeSponsor = (index: number) => {
    const newDistributions = [...distributions];
    newDistributions.splice(index, 1);
    updateDistributions(newDistributions);
  };
  
  const updateSponsorCoverage = (index: number, field: keyof Omit<CostDistribution, 'sponsorCompany'>, value: number) => {
    const newDistributions = [...distributions];
    newDistributions[index] = {
      ...newDistributions[index],
      [field]: value
    };
    updateDistributions(newDistributions);
  };
  
  // Calculate amounts
  const calculateAmount = (category: 'accommodationCoverage' | 'mealsCoverage' | 'programsCoverage') => {
    const totalPercentage = distributions.reduce((sum, dist) => sum + dist[category], 0);
    const percentageForSelf = Math.max(0, 100 - totalPercentage);
    
    const categoryTotals = {
      accommodationCoverage: accommodationTotal,
      mealsCoverage: mealsTotal,
      programsCoverage: programsTotal
    };
    
    const amountForSponsors = distributions.map(dist => {
      return (dist[category] / 100) * categoryTotals[category];
    });
    
    const amountForSelf = (percentageForSelf / 100) * categoryTotals[category];
    
    return {
      amountForSponsors,
      amountForSelf,
      percentageForSelf
    };
  };
  
  const accommodationAmounts = calculateAmount('accommodationCoverage');
  const mealsAmounts = calculateAmount('mealsCoverage');
  const programsAmounts = calculateAmount('programsCoverage');
  
  // Calculate totals per sponsor
  const calculateTotalPerSponsor = () => {
    return distributions.map((dist, index) => {
      const accommodationAmount = accommodationAmounts.amountForSponsors[index] || 0;
      const mealsAmount = mealsAmounts.amountForSponsors[index] || 0;
      const programsAmount = programsAmounts.amountForSponsors[index] || 0;
      
      return accommodationAmount + mealsAmount + programsAmount;
    });
  };
  
  const totalPerSponsor = calculateTotalPerSponsor();
  const totalForSelf = accommodationAmounts.amountForSelf + mealsAmounts.amountForSelf + programsAmounts.amountForSelf;
  const percentageForSelf = Math.round((totalForSelf / totalCost) * 100);
  
  // Select a predefined sponsor
  const selectPredefinedSponsor = (company: SponsorCompany) => {
    // Check if sponsor already exists
    if (distributions.some(dist => dist.sponsorCompany?.id === company.id)) {
      return;
    }
    
    const newDistribution: CostDistribution = {
      accommodationCoverage: 0,
      mealsCoverage: 0,
      programsCoverage: 0,
      sponsorCompany: company
    };
    
    updateDistributions([...distributions, newDistribution]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Költségmegosztás</h2>
        <p className="text-muted-foreground">Ossza meg a költségeket szponzorok között</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Összköltség</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Szállás:</span>
                  <span className="font-medium">{accommodationTotal.toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Étkezések:</span>
                  <span className="font-medium">{mealsTotal.toLocaleString()} Ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Programok:</span>
                  <span className="font-medium">{programsTotal.toLocaleString()} Ft</span>
                </div>
                <div className="pt-2 mt-2 border-t border-border flex justify-between">
                  <span className="font-semibold">Összesen:</span>
                  <span className="font-semibold">{totalCost.toLocaleString()} Ft</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-accent rounded-lg">
            <h3 className="font-medium mb-4">Költségmegosztás áttekintése</h3>
            
            <div className="space-y-4">
              {distributions.map((dist, index) => (
                <div key={index} className="bg-card p-3 rounded-md border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{dist.sponsorCompany?.name}</span>
                    </div>
                    <span className="font-semibold">{totalPerSponsor[index].toLocaleString()} Ft</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Szállás:</span>
                      <span>
                        {(accommodationAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft 
                        ({dist.accommodationCoverage}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Étkezések:</span>
                      <span>
                        {(mealsAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft 
                        ({dist.mealsCoverage}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Programok:</span>
                      <span>
                        {(programsAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft 
                        ({dist.programsCoverage}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-secondary p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Saját költség</span>
                  <span className="font-semibold">{totalForSelf.toLocaleString()} Ft</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Szállás:</span>
                    <span>
                      {accommodationAmounts.amountForSelf.toLocaleString()} Ft 
                      ({accommodationAmounts.percentageForSelf}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Étkezések:</span>
                    <span>
                      {mealsAmounts.amountForSelf.toLocaleString()} Ft 
                      ({mealsAmounts.percentageForSelf}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Programok:</span>
                    <span>
                      {programsAmounts.amountForSelf.toLocaleString()} Ft 
                      ({programsAmounts.percentageForSelf}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between text-lg font-medium">
              <span>Teljes megosztás:</span>
              <span>{Math.min(100, 100 - percentageForSelf)}% szponzor, {percentageForSelf}% saját</span>
            </div>
          </div>

          {distributions.map((dist, index) => (
            <Card key={index} className="relative">
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-4 right-4"
                onClick={() => removeSponsor(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              
              <CardHeader>
                <CardTitle>{dist.sponsorCompany?.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="mb-2">Szállás költség megosztása ({dist.accommodationCoverage}%)</Label>
                    <span>{(accommodationAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'accommodationCoverage', 
                        Math.max(0, dist.accommodationCoverage - 10)
                      )}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <Slider
                      max={100}
                      step={5}
                      value={[dist.accommodationCoverage]}
                      onValueChange={(values) => updateSponsorCoverage(index, 'accommodationCoverage', values[0])}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'accommodationCoverage', 
                        Math.min(100, dist.accommodationCoverage + 10)
                      )}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="mb-2">Étkezések költségmegosztása ({dist.mealsCoverage}%)</Label>
                    <span>{(mealsAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'mealsCoverage', 
                        Math.max(0, dist.mealsCoverage - 10)
                      )}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <Slider
                      max={100}
                      step={5}
                      value={[dist.mealsCoverage]}
                      onValueChange={(values) => updateSponsorCoverage(index, 'mealsCoverage', values[0])}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'mealsCoverage', 
                        Math.min(100, dist.mealsCoverage + 10)
                      )}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="mb-2">Programok költségmegosztása ({dist.programsCoverage}%)</Label>
                    <span>{(programsAmounts.amountForSponsors[index] || 0).toLocaleString()} Ft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'programsCoverage', 
                        Math.max(0, dist.programsCoverage - 10)
                      )}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <Slider
                      max={100}
                      step={5}
                      value={[dist.programsCoverage]}
                      onValueChange={(values) => updateSponsorCoverage(index, 'programsCoverage', values[0])}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateSponsorCoverage(
                        index, 
                        'programsCoverage', 
                        Math.min(100, dist.programsCoverage + 10)
                      )}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 mt-2 border-t border-border flex justify-between text-lg font-medium">
                  <span>Összesen:</span>
                  <span>{totalPerSponsor[index].toLocaleString()} Ft</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-accent rounded-lg">
            <h3 className="font-medium mb-4">Új szponzor hozzáadása</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newSponsor">Szponzor neve</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newSponsor"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Cég neve"
                  />
                  <Button onClick={addSponsor} disabled={!newCompanyName.trim()}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Hozzáad
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-accent rounded-lg">
            <h3 className="font-medium mb-4">Szponzorok listája</h3>
            <div className="space-y-2">
              {SPONSOR_COMPANIES.filter(company => 
                !distributions.some(dist => dist.sponsorCompany?.id === company.id)
              ).map(company => (
                <Card 
                  key={company.id} 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => selectPredefinedSponsor(company)}
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.contactPerson}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {SPONSOR_COMPANIES.every(company => 
                distributions.some(dist => dist.sponsorCompany?.id === company.id)
              ) && (
                <p className="text-sm text-muted-foreground text-center p-2">
                  Minden elérhető szponzor hozzá lett adva
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CostSharing;
