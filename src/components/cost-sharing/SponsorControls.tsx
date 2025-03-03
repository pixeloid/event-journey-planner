
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, MinusIcon, TrashIcon } from 'lucide-react';
import { CostDistribution } from '@/lib/types';

type SponsorControlsProps = {
  distribution: CostDistribution;
  index: number;
  accommodationAmount: number;
  mealsAmount: number;
  programsAmount: number;
  totalAmount: number;
  onRemove: (index: number) => void;
  onUpdateCoverage: (index: number, field: keyof Omit<CostDistribution, 'sponsorCompany'>, value: number) => void;
};

const SponsorControls: React.FC<SponsorControlsProps> = ({
  distribution,
  index,
  accommodationAmount,
  mealsAmount,
  programsAmount,
  totalAmount,
  onRemove,
  onUpdateCoverage
}) => {
  return (
    <Card className="relative">
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute top-4 right-4"
        onClick={() => onRemove(index)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      
      <CardHeader>
        <CardTitle>{distribution.sponsorCompany?.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="mb-2">Szállás költség megosztása ({distribution.accommodationCoverage}%)</Label>
            <span>{accommodationAmount.toLocaleString()} Ft</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onUpdateCoverage(
                index, 
                'accommodationCoverage', 
                Math.max(0, distribution.accommodationCoverage - 10)
              )}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Slider
              max={100}
              step={5}
              value={[distribution.accommodationCoverage]}
              onValueChange={(values) => onUpdateCoverage(index, 'accommodationCoverage', values[0])}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onUpdateCoverage(
                index, 
                'accommodationCoverage', 
                Math.min(100, distribution.accommodationCoverage + 10)
              )}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="mb-2">Étkezések költségmegosztása ({distribution.mealsCoverage}%)</Label>
            <span>{mealsAmount.toLocaleString()} Ft</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onUpdateCoverage(
                index, 
                'mealsCoverage', 
                Math.max(0, distribution.mealsCoverage - 10)
              )}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Slider
              max={100}
              step={5}
              value={[distribution.mealsCoverage]}
              onValueChange={(values) => onUpdateCoverage(index, 'mealsCoverage', values[0])}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onUpdateCoverage(
                index, 
                'mealsCoverage', 
                Math.min(100, distribution.mealsCoverage + 10)
              )}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="mb-2">Programok költségmegosztása ({distribution.programsCoverage}%)</Label>
            <span>{programsAmount.toLocaleString()} Ft</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onUpdateCoverage(
                index, 
                'programsCoverage', 
                Math.max(0, distribution.programsCoverage - 10)
              )}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <Slider
              max={100}
              step={5}
              value={[distribution.programsCoverage]}
              onValueChange={(values) => onUpdateCoverage(index, 'programsCoverage', values[0])}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onUpdateCoverage(
                index, 
                'programsCoverage', 
                Math.min(100, distribution.programsCoverage + 10)
              )}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="pt-4 mt-2 border-t border-border flex justify-between text-lg font-medium">
          <span>Összesen:</span>
          <span>{totalAmount.toLocaleString()} Ft</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorControls;
