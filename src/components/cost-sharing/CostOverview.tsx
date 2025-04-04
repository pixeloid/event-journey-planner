
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SponsorCard from './SponsorCard';
import { CostDistribution } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

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
  const sponsorPercentage = Math.min(100, 100 - percentageForSelf);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              Összköltség
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">A kiválasztott szállás, étkezések és programok teljes költsége.</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Szállás:</span>
                <div className="flex items-center">
                  <span className="font-medium">{accommodationTotal.toLocaleString()} Ft</span>
                  {accommodationTotal > 0 && accommodationAmounts.percentageForSelf < 100 && (
                    <span className="text-xs ml-2 text-green-600">
                      ({100 - accommodationAmounts.percentageForSelf}% fedezve)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Étkezések:</span>
                <div className="flex items-center">
                  <span className="font-medium">{mealsTotal.toLocaleString()} Ft</span>
                  {mealsTotal > 0 && mealsAmounts.percentageForSelf < 100 && (
                    <span className="text-xs ml-2 text-green-600">
                      ({100 - mealsAmounts.percentageForSelf}% fedezve)
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Programok:</span>
                <div className="flex items-center">
                  <span className="font-medium">{programsTotal.toLocaleString()} Ft</span>
                  {programsTotal > 0 && programsAmounts.percentageForSelf < 100 && (
                    <span className="text-xs ml-2 text-green-600">
                      ({100 - programsAmounts.percentageForSelf}% fedezve)
                    </span>
                  )}
                </div>
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
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span>Szponzori hozzájárulás ({sponsorPercentage}%)</span>
              <span>{(totalCost - totalForSelf).toLocaleString()} Ft</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Saját költség ({percentageForSelf}%)</span>
              <span>{totalForSelf.toLocaleString()} Ft</span>
            </div>
            
            <div className="mt-3">
              <div className="flex w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full"
                  style={{ width: `${sponsorPercentage}%` }}
                ></div>
                <div 
                  className="bg-secondary h-full"
                  style={{ width: `${percentageForSelf}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-primary">Szponzor</span>
                <span className="text-secondary">Saját</span>
              </div>
            </div>
          </div>
          
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
            
            <div className="bg-secondary/20 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Saját költség</span>
                <span className="font-semibold">{totalForSelf.toLocaleString()} Ft</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Szállás:</span>
                  <span>
                    {accommodationAmounts.amountForSelf.toLocaleString()} Ft 
                    {accommodationTotal > 0 && (
                      <span className="text-muted-foreground ml-1">
                        ({accommodationAmounts.percentageForSelf}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Étkezések:</span>
                  <span>
                    {mealsAmounts.amountForSelf.toLocaleString()} Ft 
                    {mealsTotal > 0 && (
                      <span className="text-muted-foreground ml-1">
                        ({mealsAmounts.percentageForSelf}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Programok:</span>
                  <span>
                    {programsAmounts.amountForSelf.toLocaleString()} Ft 
                    {programsTotal > 0 && (
                      <span className="text-muted-foreground ml-1">
                        ({programsAmounts.percentageForSelf}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CostOverview;
