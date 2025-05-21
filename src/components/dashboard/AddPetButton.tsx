
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import PetForm from '@/components/PetForm';
import { Pet } from '@/lib/models/types';
import { PlusCircle } from 'lucide-react';

interface AddPetButtonProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onAddPet: (pet: Pet) => void;
}

const AddPetButton: React.FC<AddPetButtonProps> = ({ isOpen, setIsOpen, onAddPet }) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Pet
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Pet</SheetTitle>
          <SheetDescription>
            Fill in the pet's information below to add them to the system.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <PetForm onSubmit={onAddPet} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddPetButton;
