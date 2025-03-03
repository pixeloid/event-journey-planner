
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CostDistribution, SponsorCompany } from '@/lib/types';
import { SPONSOR_COMPANIES } from '../cost-sharing/costSharingData';
import { calculateAmount, calculateTotalPerSponsor } from '../cost-sharing/costSharingUtils';
import CostOverview from '../cost-sharing/CostOverview';
import SponsorControls from '../cost-sharing/SponsorControls';
import SponsorSelector from '../cost-sharing/SponsorSelector';

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
  
  const totalCost = accommodationTotal + mealsTotal + programsTotal;
  
  const addSponsor = (name: string) => {
    if (!name.trim()) return;
    
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
  };
  
  const removeSponsor = (index: number) => {
    const newDistributions = [...distributions];
    newDistributions.splice(index, 1);
    updateDistributions(newDistributions);
  };
  
  const updateSponsorCoverage = (
    index: number, 
    field: keyof Omit<CostDistribution, 'sponsorCompany'>, 
    value: number
  ) => {
    const newDistributions = [...distributions];
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

  // Filter out sponsors that are already selected
  const availableSponsors = SPONSOR_COMPANIES.filter(company => 
    !distributions.some(dist => dist.sponsorCompany?.id === company.id)
  );

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
          <SponsorSelector
            availableSponsors={availableSponsors}
            onAddNew={addSponsor}
            onSelectExisting={selectPredefinedSponsor}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CostSharing;
