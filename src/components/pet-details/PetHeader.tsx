
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import PetForm from '@/components/PetForm';
import { Pet } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';

interface PetHeaderProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: "veterinary" | "owner";
}

const PetHeader: React.FC<PetHeaderProps> = ({ pet, setPet, isEditing, setIsEditing, userRole }) => {
  const handlePetUpdate = (updatedPet: Pet) => {
    setPet(updatedPet);
    setIsEditing(false);
    toast({
      title: "Success!",
      description: "Pet information has been updated.",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 rounded-full overflow-hidden">
          <img 
            src={pet.profileImg} 
            alt={pet.name} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{pet.name}</h1>
          <p className="text-muted-foreground">{pet.species} - {pet.breed}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" asChild>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
        {userRole === "veterinary" && (
          <>
            <Button variant="outline" asChild>
              <Link to="/scanner">Back to Scanner</Link>
            </Button>
            <Sheet open={isEditing} onOpenChange={setIsEditing}>
              <SheetTrigger asChild>
                <Button>Edit Pet Info</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit Pet Information</SheetTitle>
                  <SheetDescription>
                    Make changes to {pet.name}'s information here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <PetForm pet={pet} onSubmit={handlePetUpdate} />
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </div>
  );
};

export default PetHeader;
