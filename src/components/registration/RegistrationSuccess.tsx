
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const RegistrationSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-4xl p-8 bg-card rounded-lg shadow-lg text-center">
        <div className="rounded-full bg-green-100 p-4 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckIcon className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Sikeres regisztráció!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Köszönjük a regisztrációját. A visszaigazolást emailben elküldjük Önnek.
        </p>
        <Button onClick={() => window.location.reload()}>Új regisztráció</Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
