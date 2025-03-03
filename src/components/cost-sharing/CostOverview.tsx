
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SponsorCard from './SponsorCard';
import { CostDistribution } from '@/lib/types';

type CostOverviewProps = {
  distributions: CostDistribution[];
  accommodationTotal: number;
  mealsTotal: number;
  programsTotal: number;
  totalCost: number;
  accommodationAmounts: {
    amountForSponsors: number[];
    amountForSelf: number;
    percentageForSelf: number;
  };
  mealsAmounts: {
    amountForSponsors: number[];
    amountForSelf: number;
    percentageForSelf: number;
  };
  programsAmounts: {
    amountForSponsors: number[];
    amountForSelf: number;
    percentageForSelf: number;
  };
  totalPerSponsor: number[];
  totalForSelf: number;
  percentageForSelf: number;
};

const CostOverview: React.FC<CostOverviewProps> = ({
  distributions,
  accommodationTotal,
  mealsTotal,
  programsTotal,
  totalCost,
  accommodationAmounts,
  mealsAmounts,
  programsAmounts,
  totalPerSponsor,
  totalForSelf,
  percentageForSelf
}) => {
  return (
    <div>
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

      <div className="p-4 bg-accent rounded-lg mt-8">
        <h3 className="font-medium mb-4">Költségmegosztás áttekintése</h3>
        
        <div className="space-y-4">
          {distributions.map((dist, index) => (
            <SponsorCard
              key={index}
              distribution={dist}
              index={index}
              accommodationAmount={accommodationAmounts.amountForSponsors[index] || 0}
              mealsAmount={mealsAmounts.amountForSponsors[index] || 0}
              programsAmount={programsAmounts.amountForSponsors[index] || 0}
              totalAmount={totalPerSponsor[index]}
            />
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
    </div>
  );
};

export default CostOverview;
