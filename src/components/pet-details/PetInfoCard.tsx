
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pet } from '@/lib/mockData';

interface PetInfoCardProps {
  pet: Pet;
}

const PetInfoCard: React.FC<PetInfoCardProps> = ({ pet }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Pet Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between sm:block">
            <dt className="text-muted-foreground">Age</dt>
            <dd className="font-medium sm:mt-1">{pet.age} years</dd>
          </div>
          <div className="flex justify-between sm:block">
            <dt className="text-muted-foreground">Weight</dt>
            <dd className="font-medium sm:mt-1">{pet.weight} lbs</dd>
          </div>
          <div className="flex justify-between sm:block">
            <dt className="text-muted-foreground">Owner Name</dt>
            <dd className="font-medium sm:mt-1">{pet.ownerName}</dd>
          </div>
          <div className="flex justify-between sm:block">
            <dt className="text-muted-foreground">Owner Contact</dt>
            <dd className="font-medium sm:mt-1">{pet.ownerContact}</dd>
          </div>
          <div className="flex justify-between sm:block">
            <dt className="text-muted-foreground">Last Visit</dt>
            <dd className="font-medium sm:mt-1">{new Date(pet.lastVisit).toLocaleDateString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default PetInfoCard;
