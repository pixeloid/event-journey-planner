
import React from 'react';
import { SponsorCompany } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, SearchIcon, BuildingIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type SponsorSelectorProps = {
  availableSponsors: SponsorCompany[];
  onAddNew: (name: string) => void;
  onSelectExisting: (company: SponsorCompany) => void;
  newCompanyName: string;
  setNewCompanyName: (name: string) => void;
};

const SponsorSelector: React.FC<SponsorSelectorProps> = ({
  availableSponsors,
  onAddNew,
  onSelectExisting,
  newCompanyName,
  setNewCompanyName
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSponsors = availableSponsors.filter(sponsor => 
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName.trim()) {
      onAddNew(newCompanyName);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Elérhető szponzorok</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableSponsors.length > 3 && (
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Keresés a szponzorok között..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}

        {filteredSponsors.length > 0 ? (
          <ScrollArea className="h-[200px] rounded-md border">
            <div className="p-4 space-y-2">
              {filteredSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  onClick={() => onSelectExisting(sponsor)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md border",
                    "cursor-pointer hover:bg-accent transition-colors"
                  )}
                >
                  <div className="flex items-center">
                    <BuildingIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{sponsor.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <PlusCircleIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : searchQuery ? (
          <div className="text-center py-4 text-muted-foreground">
            Nincs találat a keresésre
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Nincs több elérhető szponzor
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h4 className="text-sm font-medium">Új szponzor hozzáadása</h4>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Cég neve"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!newCompanyName.trim()}
                className="shrink-0"
              >
                Hozzáadás
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorSelector;
