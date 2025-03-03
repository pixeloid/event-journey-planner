
import React from 'react';
import { PersonalData } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

type PersonalInfoProps = {
  data: PersonalData;
  updateFields: (fields: Partial<PersonalData>) => void;
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, updateFields }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Személyes adatok</h2>
        <p className="text-muted-foreground">Kérjük, adja meg személyes adatait a regisztrációhoz</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="lastName">Vezetéknév</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={e => updateFields({ lastName: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">Keresztnév</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={e => updateFields({ firstName: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email cím</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={e => updateFields({ email: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonszám</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={e => updateFields({ phone: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Cég (opcionális)</Label>
          <Input
            id="company"
            value={data.company || ''}
            onChange={e => updateFields({ company: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Pozíció (opcionális)</Label>
          <Input
            id="position"
            value={data.position || ''}
            onChange={e => updateFields({ position: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dietaryRestrictions">Étrendi korlátozások (opcionális)</Label>
        <Textarea
          id="dietaryRestrictions"
          value={data.dietaryRestrictions || ''}
          onChange={e => updateFields({ dietaryRestrictions: e.target.value })}
          placeholder="Pl. vegetáriánus, gluténmentes, stb."
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialRequirements">Egyéb speciális igények (opcionális)</Label>
        <Textarea
          id="specialRequirements"
          value={data.specialRequirements || ''}
          onChange={e => updateFields({ specialRequirements: e.target.value })}
          placeholder="Bármilyen speciális igény vagy megjegyzés"
          className="resize-none"
        />
      </div>
    </motion.div>
  );
};

export default PersonalInfo;
