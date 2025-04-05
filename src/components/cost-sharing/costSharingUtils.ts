
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
  const amountForSelf = totalAmount - totalCoveredBySponsors;
  const percentageForSelf = Math.round((amountForSelf / totalAmount) * 100);
  
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
