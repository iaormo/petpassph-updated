
import React, { useState } from 'react';
import { ChevronLeft, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Pet } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';
import { updatePet } from '@/lib/utils/petUtils';
import GenerateLoginButton from '@/components/GenerateLoginButton';

interface PetHeaderProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: "veterinary" | "owner";
}

const PetHeader = ({ pet, setPet, isEditing, setIsEditing, userRole }: PetHeaderProps) => {
  const [editedPet, setEditedPet] = useState<Partial<Pet>>({
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    weight: pet.weight,
    ownerName: pet.ownerName,
    ownerContact: pet.ownerContact,
    ownerEmail: pet.ownerEmail || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Convert numeric fields
    if (name === 'age' || name === 'weight') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setEditedPet({
      ...editedPet,
      [name]: parsedValue
    });
  };
  
  const handleSave = () => {
    // Update the pet data
    const updatedPet = {
      ...pet,
      ...editedPet
    };
    
    // Update in the mock data array
    const success = updatePet(updatedPet);
    
    if (success) {
      setPet(updatedPet);
      setIsEditing(false);
      toast({
        title: "Pet Updated",
        description: `${updatedPet.name}'s information has been updated.`
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Could not update pet information.",
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    // Reset to original values
    setEditedPet({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      ownerName: pet.ownerName,
      ownerContact: pet.ownerContact,
      ownerEmail: pet.ownerEmail || ''
    });
    setIsEditing(false);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          {isEditing ? (
            <Input 
              className="text-2xl font-bold w-64"
              name="name"
              value={editedPet.name}
              onChange={handleChange}
            />
          ) : (
            <h1 className="text-2xl font-bold">{pet.name}</h1>
          )}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            userRole === "veterinary" && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )
          )}
        </div>

        {userRole === "veterinary" && !isEditing && pet.ownerEmail && (
          <GenerateLoginButton pet={pet} />
        )}
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to={`/appointments`}>View Appointments</Link>
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
              Breed
            </label>
            <Input 
              id="breed"
              name="breed"
              value={editedPet.breed}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age (years)
            </label>
            <Input 
              id="age"
              name="age"
              type="number"
              value={editedPet.age}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <Input 
              id="weight"
              name="weight"
              type="number"
              value={editedPet.weight}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Name
            </label>
            <Input 
              id="ownerName"
              name="ownerName"
              value={editedPet.ownerName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ownerContact" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Contact
            </label>
            <Input 
              id="ownerContact"
              name="ownerContact"
              value={editedPet.ownerContact}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Email
            </label>
            <Input 
              id="ownerEmail"
              name="ownerEmail"
              value={editedPet.ownerEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PetHeader;
