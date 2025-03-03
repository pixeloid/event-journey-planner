
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { SponsorCompany } from '@/lib/types';

type SponsorSelectorProps = {
  availableSponsors: SponsorCompany[];
  onAddNew: (name: string) => void;
  onSelectExisting: (company: SponsorCompany) => void;
};

const SponsorSelector: React.FC<SponsorSelectorProps> = ({
  availableSponsors,
  onAddNew,
  onSelectExisting
}) => {
  const [newCompanyName, setNewCompanyName] = useState('');

  return (
    <div className="space-y-6">
      <div className="p-4 bg-accent rounded-lg">
        <h3 className="font-medium mb-4">Új szponzor hozzáadása</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newSponsor">Szponzor neve</Label>
            <div className="flex space-x-2">
              <Input
                id="newSponsor"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Cég neve"
              />
              <Button 
                onClick={() => {
                  onAddNew(newCompanyName);
                  setNewCompanyName('');
                }} 
                disabled={!newCompanyName.trim()}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Hozzáad
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-accent rounded-lg">
        <h3 className="font-medium mb-4">Szponzorok listája</h3>
        <div className="space-y-2">
          {availableSponsors.length > 0 ? (
            availableSponsors.map(company => (
              <Card 
                key={company.id} 
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onSelectExisting(company)}
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    {company.contactPerson && (
                      <p className="text-xs text-muted-foreground">{company.contactPerson}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center p-2">
              Minden elérhető szponzor hozzá lett adva
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorSelector;
