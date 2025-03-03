
import React from 'react';
import { BuildingIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CostDistribution } from '@/lib/types';

type SponsorCardProps = {
  distribution: CostDistribution;
  index: number;
  accommodationAmount: number;
  mealsAmount: number;
  programsAmount: number;
  totalAmount: number;
};

const SponsorCard: React.FC<SponsorCardProps> = ({
  distribution,
  index,
  accommodationAmount,
  mealsAmount,
  programsAmount,
  totalAmount
}) => {
  return (
    <div className="bg-card p-3 rounded-md border">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{distribution.sponsorCompany?.name}</span>
        </div>
        <span className="font-semibold">{totalAmount.toLocaleString()} Ft</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Szállás:</span>
          <span>
            {accommodationAmount.toLocaleString()} Ft 
            ({distribution.accommodationCoverage}%)
          </span>
        </div>
        <div className="flex justify-between">
          <span>Étkezések:</span>
          <span>
            {mealsAmount.toLocaleString()} Ft 
            ({distribution.mealsCoverage}%)
          </span>
        </div>
        <div className="flex justify-between">
          <span>Programok:</span>
          <span>
            {programsAmount.toLocaleString()} Ft 
            ({distribution.programsCoverage}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default SponsorCard;
