
/**
 * Calculates the amount for sponsors and self based on distributions and total amount
 */
export const calculateAmount = (
  distributions: any[] = [],
  field: string,
  totalAmount: number = 0
) => {
  if (!Array.isArray(distributions) || distributions.length === 0 || totalAmount <= 0) {
    return {
      amountForSponsors: [],
      amountForSelf: totalAmount,
      percentageForSelf: 100
    };
  }

  // Calculate amount for each sponsor with proper null/undefined checks
  const amountForSponsors = distributions.map(dist => {
    // Make sure the distribution object and the specified field exist
    if (!dist || typeof dist[field] !== 'number') {
      return 0;
    }
    const coverage = dist[field];
    return (coverage / 100) * totalAmount;
  });
  
  // Calculate total amount covered by sponsors
  const totalCoveredBySponsors = amountForSponsors.reduce((acc, amount) => acc + amount, 0);
  
  // Calculate amount and percentage for self
  const amountForSelf = Math.max(0, totalAmount - totalCoveredBySponsors);
  const percentageForSelf = totalAmount > 0 ? Math.round((amountForSelf / totalAmount) * 100) : 100;
  
  return {
    amountForSponsors,
    amountForSelf,
    percentageForSelf
  };
};

/**
 * Calculates the total amount per sponsor by summing accommodation, meals, and programs
 */
export const calculateTotalPerSponsor = (
  distributions: any[] = [],
  accommodationAmounts: { amountForSponsors: number[] } = { amountForSponsors: [] },
  mealsAmounts: { amountForSponsors: number[] } = { amountForSponsors: [] },
  programsAmounts: { amountForSponsors: number[] } = { amountForSponsors: [] }
) => {
  if (!Array.isArray(distributions) || distributions.length === 0) {
    return [];
  }

  return distributions.map((_, index) => {
    const accommodationAmount = Array.isArray(accommodationAmounts.amountForSponsors) ? 
      (accommodationAmounts.amountForSponsors[index] || 0) : 0;
    
    const mealsAmount = Array.isArray(mealsAmounts.amountForSponsors) ? 
      (mealsAmounts.amountForSponsors[index] || 0) : 0;
    
    const programsAmount = Array.isArray(programsAmounts.amountForSponsors) ? 
      (programsAmounts.amountForSponsors[index] || 0) : 0;
    
    return accommodationAmount + mealsAmount + programsAmount;
  });
};

/**
 * Updates the sponsor contributions based on the distribution percentages
 */
export const updateSponsorContributions = (distributions = [], 
  accommodationTotal = 0, 
  mealsTotal = 0, 
  programsTotal = 0) => {
  
  if (!Array.isArray(distributions)) return [];
  
  return distributions.map(dist => {
    if (!dist || !dist.sponsorCompany) return dist;
    
    // Safely get percentages with fallbacks to 0
    const accommodationPercent = typeof dist.accommodationCoverage === 'number' ? dist.accommodationCoverage : 0;
    const mealsPercent = typeof dist.mealsCoverage === 'number' ? dist.mealsCoverage : 0;
    const programsPercent = typeof dist.programsCoverage === 'number' ? dist.programsCoverage : 0;
    
    // Calculate contribution amounts
    const accommodationAmount = (accommodationPercent / 100) * accommodationTotal;
    const mealsAmount = (mealsPercent / 100) * mealsTotal;
    const programsAmount = (programsPercent / 100) * programsTotal;
    const totalAmount = accommodationAmount + mealsAmount + programsAmount;
    
    // Create a new sponsorCompany object with updated contributions
    const updatedCompany = {
      ...dist.sponsorCompany,
      contributions: {
        accommodation: accommodationAmount,
        meals: mealsAmount,
        programs: programsAmount,
        total: totalAmount
      }
    };
    
    // Return the updated distribution with the new sponsorCompany
    return {
      ...dist,
      sponsorCompany: updatedCompany
    };
  });
};
