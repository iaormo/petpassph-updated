
import React, { useState, useEffect } from 'react';
import { Pet } from '@/lib/models/types';
import { mockPets } from '@/lib/data/mockPets';
import { mockCredentials } from '@/lib/data/mockAuth';
import { addPet } from '@/lib/utils/petUtils';
import { toast } from '@/hooks/use-toast';
import { usePetSync } from './usePetSync';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [userRole, setUserRole] = useState<"veterinary" | "owner">("veterinary");
  const [dashboardTitle, setDashboardTitle] = useState("Vet Clinic Dashboard");
  const { syncPetToGoHighLevel, syncAllPets, syncingPets } = usePetSync();

  useEffect(() => {
    // Check user role and filter pets accordingly
    const username = localStorage.getItem('username');
    const user = mockCredentials.find(cred => cred.username === username);

    if (user) {
      setUserRole(user.role);
      
      if (user.role === "owner" && user.petsOwned) {
        // Filter pets for owners to only show their pets
        const ownerPets = mockPets.filter(pet => user.petsOwned?.includes(pet.id));
        setPets(ownerPets);
        setDashboardTitle("My Pets Dashboard");
      } else {
        // Show all pets for veterinary staff
        setPets([...mockPets]);
      }
    }
  }, []);

  const handleAddPet = (newPet: Pet) => {
    // Add the pet using the utility function which also updates the mockPets array
    const addedPet = addPet(newPet);
    
    // Update the local state based on user role
    if (userRole === "veterinary") {
      setPets([...mockPets]); // Use the updated mockPets array
    } else {
      // For owner, check if the new pet is owned by them
      const username = localStorage.getItem('username');
      const user = mockCredentials.find(cred => cred.username === username);
      
      if (user && user.petsOwned && user.petsOwned.includes(addedPet.id)) {
        setPets(prevPets => [addedPet, ...prevPets]);
      }
    }
    
    // Sync the new pet to Go High Level
    if (addedPet.ownerEmail) {
      syncPetToGoHighLevel(addedPet);
    }
    
    setIsAddingPet(false);
    toast({
      title: "Pet Added",
      description: `${addedPet.name} has been added successfully.`,
    });
  };

  const handleSyncAllPets = () => {
    if (userRole !== "veterinary") return;
    syncAllPets(pets);
  };

  return {
    pets,
    userRole,
    dashboardTitle,
    isAddingPet,
    setIsAddingPet,
    handleAddPet,
    handleSyncAllPets,
    syncingPets
  };
};
