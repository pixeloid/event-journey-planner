
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CostDistribution, SponsorCompany } from '@/lib/types';
import { SPONSOR_COMPANIES } from '../cost-sharing/costSharingData';
import { 
  calculateAmount, 
  calculateTotalPerSponsor, 
  updateSponsorContributions 
} from '../cost-sharing/costSharingUtils';
import CostOverview from '../cost-sharing/CostOverview';
import SponsorControls from '../cost-sharing/SponsorControls';
import SponsorSelector from '../cost-sharing/SponsorSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, HelpCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

type CostSharingProps = {
  distributions: CostDistribution[];
  accommodationTotal: number;
  mealsTotal: number;
  programsTotal: number;
  updateDistributions: (distributions: CostDistribution[]) => void;
};

const CostSharing: React.FC<CostSharingProps> = ({ 
  distributions = [], // Provide default empty array
  accommodationTotal = 0, // Provide default values
  mealsTotal = 0,
  programsTotal = 0,
  updateDistributions 
}) => {
  const [newCompanyName, setNewCompanyName] = useState('');
  const { toast } = useToast();
  
  const totalCost = accommodationTotal + mealsTotal + programsTotal;
  
  useEffect(() => {
    // Show helpful toast when component loads
    if (totalCost > 0 && distributions.length === 0) {
      toast({
        title: "Költségmegosztás tippek",
        description: "Válasszon ki egy szponzort vagy adjon hozzá új céget a költségek megosztásához.",
        duration: 5000,
      });
    }
  }, []);

  // Update sponsor contributions whenever distributions or totals change
  useEffect(() => {
    if (distributions.length > 0) {
      const updatedDistributions = updateSponsorContributions(
        distributions,
        accommodationTotal,
        mealsTotal,
        programsTotal
      );
      
      // Only update if there's a real change to avoid infinite loops
      if (JSON.stringify(updatedDistributions) !== JSON.stringify(distributions)) {
        updateDistributions(updatedDistributions);
      }
    }
  }, [distributions, accommodationTotal, mealsTotal, programsTotal]);
  
  const addSponsor = (name: string) => {
    if (!name.trim()) return;
    
    // Check if sponsor already exists
    if (distributions.some(dist => dist.sponsorCompany.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Már létező szponzor",
        description: "Ez a szponzor már hozzá van adva a listához.",
        variant: "destructive",
      });
      return;
    }
    
    const newCompany: SponsorCompany = {
      id: `new-${Date.now()}`,
      name: name,
      contributions: {
        accommodation: 0,
        meals: 0,
        programs: 0,
        total: 0
      }
    };
    
    const newDistribution: CostDistribution = {
      accommodationCoverage: 0,
      mealsCoverage: 0,
      programsCoverage: 0,
      sponsorCompany: newCompany
    };
    
    updateDistributions([...distributions, newDistribution]);
    setNewCompanyName('');
    
    toast({
      title: "Szponzor hozzáadva",
      description: `${name} sikeresen hozzáadva a szponzorok listájához.`,
    });
  };
  
  const removeSponsor = (index: number) => {
    const sponsorName = distributions[index]?.sponsorCompany?.name;
    const newDistributions = [...distributions];
    newDistributions.splice(index, 1);
    updateDistributions(newDistributions);
    
    if (sponsorName) {
      toast({
        title: "Szponzor eltávolítva",
        description: `${sponsorName} eltávolítva a szponzorok listájából.`,
      });
    }
  };
  
  const updateSponsorCoverage = (
    index: number, 
    field: keyof Omit<CostDistribution, 'sponsorCompany'>, 
    value: number
  ) => {
    const newDistributions = [...distributions];
    
    // Ensure the distribution at this index exists
    if (!newDistributions[index]) return;
    
    newDistributions[index] = {
      ...newDistributions[index],
      [field]: value
    };
    
    updateDistributions(newDistributions);
  };
  
  const accommodationAmounts = calculateAmount(
    distributions, 
    'accommodationCoverage', 
    accommodationTotal
  );
  const mealsAmounts = calculateAmount(distributions, 'mealsCoverage', mealsTotal);
  const programsAmounts = calculateAmount(distributions, 'programsCoverage', programsTotal);
  
  const totalPerSponsor = calculateTotalPerSponsor(
    distributions,
    accommodationAmounts,
    mealsAmounts,
    programsAmounts
  );
  
  const totalForSelf = accommodationAmounts.amountForSelf + mealsAmounts.amountForSelf + programsAmounts.amountForSelf;
  const percentageForSelf = Math.round((totalForSelf / totalCost) * 100) || 100; // Default to 100% if totalCost is 0
  
  const selectPredefinedSponsor = (company: SponsorCompany) => {
    if (distributions.some(dist => dist.sponsorCompany?.id === company.id)) {
      toast({
        title: "Már létező szponzor",
        description: "Ez a szponzor már hozzá van adva a listához.",
        variant: "destructive",
      });
      return;
    }
    
    // Make sure company has properly initialized contributions
    const sponsorWithContributions: SponsorCompany = {
      ...company,
      contributions: company.contributions || {
        accommodation: 0,
        meals: 0,
        programs: 0,
        total: 0
      }
    };
    
    const newDistribution: CostDistribution = {
      accommodationCoverage: 0,
      mealsCoverage: 0,
      programsCoverage: 0,
      sponsorCompany: sponsorWithContributions
    };
    
    updateDistributions([...distributions, newDistribution]);
    
    toast({
      title: "Szponzor hozzáadva",
      description: `${company.name} sikeresen hozzáadva a szponzorok listájához.`,
    });
  };

  // Filter out sponsors that are already selected
  const availableSponsors = SPONSOR_COMPANIES.filter(company => 
    !distributions.some(dist => dist.sponsorCompany?.id === company.id)
  );

  const hasNoItems = totalCost === 0;

  if (hasNoItems) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <Alert className="bg-amber-50">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Nincsenek még költségek, amelyeket meg lehetne osztani. Kérjük, előbb válasszon szállást, étkezést vagy programot.
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-8">
          <HelpCircleIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Hogyan működik a költségmegosztás?</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Ebben a lépésben megadhatja, hogy a szállás, étkezés és program költségeit milyen arányban fedezik a különböző szponzorok.
            A fennmaradó részt Ön fizeti.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              // Find the accommodation step index in the registration steps
              const accommodationStepIndex = 1; // Assuming it's the second step (index 1)
              if (typeof window !== 'undefined') {
                localStorage.setItem('event_registration_step', accommodationStepIndex.toString());
                window.location.reload();
              }
            }}
          >
            Vissza a Szállás lépéshez
          </Button>
        </div>
      </motion.div>
    );
  }

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

      <TooltipProvider>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            <CostOverview
              distributions={distributions}
              accommodationTotal={accommodationTotal}
              mealsTotal={mealsTotal}
              programsTotal={programsTotal}
              totalCost={totalCost}
              accommodationAmounts={accommodationAmounts}
              mealsAmounts={mealsAmounts}
              programsAmounts={programsAmounts}
              totalPerSponsor={totalPerSponsor}
              totalForSelf={totalForSelf}
              percentageForSelf={percentageForSelf}
            />

            {distributions.length === 0 && (
              <Alert className="bg-blue-50">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Még nincs hozzáadott szponzor. Válasszon ki egyet a jobb oldali listából, vagy adjon hozzá saját céget.
                </AlertDescription>
              </Alert>
            )}

            {distributions.map((dist, index) => (
              <SponsorControls
                key={dist.sponsorCompany.id}
                distribution={dist}
                index={index}
                accommodationAmount={accommodationAmounts.amountForSponsors[index] || 0}
                mealsAmount={mealsAmounts.amountForSponsors[index] || 0}
                programsAmount={programsAmounts.amountForSponsors[index] || 0}
                totalAmount={totalPerSponsor[index] || 0}
                onRemove={removeSponsor}
                onUpdateCoverage={updateSponsorCoverage}
              />
            ))}
          </div>
          
          <div className="space-y-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Szponzorok hozzáadása</h3>
                  <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Itt választhat előre definiált szponzorokat vagy adhat hozzá saját céget. 
                  Minden szponzorhoz megadhatja, hogy milyen százalékban fedezi a különböző költségeket.
                </p>
              </TooltipContent>
            </Tooltip>
            <SponsorSelector
              availableSponsors={availableSponsors}
              onAddNew={addSponsor}
              onSelectExisting={selectPredefinedSponsor}
              newCompanyName={newCompanyName}
              setNewCompanyName={setNewCompanyName}
            />
          </div>
        </div>
      </TooltipProvider>
    </motion.div>
  );
};

export default CostSharing;
