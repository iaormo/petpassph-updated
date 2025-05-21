
import React from 'react';
import PetCard from '@/components/PetCard';
import { Pet } from '@/lib/models/types';

interface PetListProps {
  pets: Pet[];
  userRole: "veterinary" | "owner";
}

const PetList: React.FC<PetListProps> = ({ pets, userRole }) => {
  if (pets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No pets found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} showQR={userRole === "veterinary"} />
      ))}
    </div>
  );
};

export default PetList;
