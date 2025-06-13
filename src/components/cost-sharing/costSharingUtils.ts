
/**
 * Calculates the amount for sponsors and self based on distributions and total amount
 */
export const calculateAmount = (
  distributions: any[] = [],
  field: string,
  totalAmount: number = 0
) => {
  console.log('calculateAmount called with:', { distributions, field, totalAmount });
  
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
    const amount = (coverage / 100) * totalAmount;
    console.log(`Sponsor ${dist.sponsorCompany?.name || 'Unknown'} covers ${coverage}% of ${field}: ${amount} Ft`);
    return amount;
  });
  
  // Calculate total amount covered by sponsors
  const totalCoveredBySponsors = amountForSponsors.reduce((acc, amount) => acc + amount, 0);
  
  // Calculate amount and percentage for self
  const amountForSelf = Math.max(0, totalAmount - totalCoveredBySponsors);
  const percentageForSelf = totalAmount > 0 ? Math.round((amountForSelf / totalAmount) * 100) : 100;
  
  console.log('calculateAmount result:', { amountForSponsors, amountForSelf, percentageForSelf });
  
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
  console.log('calculateTotalPerSponsor called with:', { distributions, accommodationAmounts, mealsAmounts, programsAmounts });
  
  if (!Array.isArray(distributions) || distributions.length === 0) {
    return [];
  }

  const totals = distributions.map((_, index) => {
    const accommodationAmount = Array.isArray(accommodationAmounts.amountForSponsors) ? 
      (accommodationAmounts.amountForSponsors[index] || 0) : 0;
    
    const mealsAmount = Array.isArray(mealsAmounts.amountForSponsors) ? 
      (mealsAmounts.amountForSponsors[index] || 0) : 0;
    
    const programsAmount = Array.isArray(programsAmounts.amountForSponsors) ? 
      (programsAmounts.amountForSponsors[index] || 0) : 0;
    
    const total = accommodationAmount + mealsAmount + programsAmount;
    console.log(`Sponsor ${index}: accommodation: ${accommodationAmount}, meals: ${mealsAmount}, programs: ${programsAmount}, total: ${total}`);
    
    return total;
  });
  
  console.log('calculateTotalPerSponsor result:', totals);
  return totals;
};

/**
 * Updates the sponsor contributions based on the distribution percentages
 */
export const updateSponsorContributions = (distributions = [], 
  accommodationTotal = 0, 
  mealsTotal = 0, 
  programsTotal = 0) => {
  
  console.log('updateSponsorContributions called with:', { distributions, accommodationTotal, mealsTotal, programsTotal });
  
  if (!Array.isArray(distributions)) return [];
  
  const updated = distributions.map(dist => {
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
    
    console.log(`Updated contributions for ${dist.sponsorCompany.name}:`, {
      accommodationAmount,
      mealsAmount,
      programsAmount,
      totalAmount
    });
    
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
  
  console.log('updateSponsorContributions result:', updated);
  return updated;
};
