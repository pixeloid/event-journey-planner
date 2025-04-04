
import React from 'react';
import { CostDistribution } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, BuildingIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { sponsorCompany, accommodationCoverage, mealsCoverage, programsCoverage } = distribution;
  
  // Function to get text color based on coverage percentage
  const getCoverageColor = (coverage: number) => {
    if (coverage === 0) return "text-muted-foreground";
    if (coverage <= 25) return "text-amber-600";
    if (coverage <= 50) return "text-orange-600";
    if (coverage <= 75) return "text-emerald-600";
    return "text-green-600";
  };

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BuildingIcon className="h-5 w-5 mr-2 text-primary" />
            {sponsorCompany.name}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={() => onRemove(index)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Szállás hozzájárulás:</label>
              <Badge variant="outline" className={cn(getCoverageColor(accommodationCoverage))}>
                {accommodationCoverage}%
              </Badge>
            </div>
            <Slider
              value={[accommodationCoverage]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onUpdateCoverage(index, 'accommodationCoverage', value[0])}
              className="py-1"
            />
            <div className="text-right text-sm">
              <span className={accommodationCoverage > 0 ? "font-medium text-primary" : "text-muted-foreground"}>
                {accommodationAmount.toLocaleString()} Ft
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Étkezés hozzájárulás:</label>
              <Badge variant="outline" className={cn(getCoverageColor(mealsCoverage))}>
                {mealsCoverage}%
              </Badge>
            </div>
            <Slider
              value={[mealsCoverage]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onUpdateCoverage(index, 'mealsCoverage', value[0])}
              className="py-1"
            />
            <div className="text-right text-sm">
              <span className={mealsCoverage > 0 ? "font-medium text-primary" : "text-muted-foreground"}>
                {mealsAmount.toLocaleString()} Ft
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Program hozzájárulás:</label>
              <Badge variant="outline" className={cn(getCoverageColor(programsCoverage))}>
                {programsCoverage}%
              </Badge>
            </div>
            <Slider
              value={[programsCoverage]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onUpdateCoverage(index, 'programsCoverage', value[0])}
              className="py-1"
            />
            <div className="text-right text-sm">
              <span className={programsCoverage > 0 ? "font-medium text-primary" : "text-muted-foreground"}>
                {programsAmount.toLocaleString()} Ft
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border flex justify-between items-center">
          <span className="font-medium">Összesen:</span>
          <Badge className="bg-primary hover:bg-primary text-white">
            {totalAmount.toLocaleString()} Ft
          </Badge>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              onUpdateCoverage(index, 'accommodationCoverage', 0);
              onUpdateCoverage(index, 'mealsCoverage', 0);
              onUpdateCoverage(index, 'programsCoverage', 0);
            }}
          >
            0%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              onUpdateCoverage(index, 'accommodationCoverage', 25);
              onUpdateCoverage(index, 'mealsCoverage', 25);
              onUpdateCoverage(index, 'programsCoverage', 25);
            }}
          >
            25%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              onUpdateCoverage(index, 'accommodationCoverage', 50);
              onUpdateCoverage(index, 'mealsCoverage', 50);
              onUpdateCoverage(index, 'programsCoverage', 50);
            }}
          >
            50%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              onUpdateCoverage(index, 'accommodationCoverage', 100);
              onUpdateCoverage(index, 'mealsCoverage', 100);
              onUpdateCoverage(index, 'programsCoverage', 100);
            }}
          >
            100%
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorControls;
