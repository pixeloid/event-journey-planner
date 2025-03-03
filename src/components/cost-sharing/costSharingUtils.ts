
import { CostDistribution } from '@/lib/types';

export const calculateAmount = (
  distributions: CostDistribution[] | undefined,
  category: 'accommodationCoverage' | 'mealsCoverage' | 'programsCoverage',
  categoryTotal: number
) => {
  // Return default values if distributions is undefined or empty
  if (!distributions || distributions.length === 0) {
    return {
      amountForSponsors: [],
      amountForSelf: categoryTotal,
      percentageForSelf: 100
    };
  }
  
  const totalPercentage = distributions.reduce((sum, dist) => sum + dist[category], 0);
  const percentageForSelf = Math.max(0, 100 - totalPercentage);
  
  const amountForSponsors = distributions.map(dist => {
    return (dist[category] / 100) * categoryTotal;
  });
  
  const amountForSelf = (percentageForSelf / 100) * categoryTotal;
  
  return {
    amountForSponsors,
    amountForSelf,
    percentageForSelf
  };
};

export const calculateTotalPerSponsor = (
  distributions: CostDistribution[] | undefined,
  accommodationAmounts: { amountForSponsors: number[] },
  mealsAmounts: { amountForSponsors: number[] },
  programsAmounts: { amountForSponsors: number[] }
) => {
  if (!distributions || distributions.length === 0) {
    return [];
  }
  
  return distributions.map((dist, index) => {
    const accommodationAmount = accommodationAmounts.amountForSponsors[index] || 0;
    const mealsAmount = mealsAmounts.amountForSponsors[index] || 0;
    const programsAmount = programsAmounts.amountForSponsors[index] || 0;
    
    return accommodationAmount + mealsAmount + programsAmount;
  });
};
