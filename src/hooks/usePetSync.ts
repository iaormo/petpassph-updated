
import { useState } from 'react';
import { Pet } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';

export const usePetSync = () => {
  const [syncingPets, setSyncingPets] = useState(false);

  const syncPetToGoHighLevel = async (pet: Pet) => {
    try {
      const response = await fetch('/api/functions/v1/go-high-level-sync/sync-pet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: pet.id,
          petName: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          ownerName: pet.ownerName,
          ownerEmail: pet.ownerEmail || 'unknown@example.com',
          ownerContact: pet.ownerContact || 'unknown'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync pet with Go High Level');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error syncing pet to Go High Level:', error);
      throw error;
    }
  };

  const syncAllPets = async (pets: Pet[]) => {
    setSyncingPets(true);
    
    try {
      // Only sync pets that have owner emails
      const petsToSync = pets.filter(pet => pet.ownerEmail);
      
      if (petsToSync.length === 0) {
        toast({
          title: "No Pets to Sync",
          description: "There are no pets with owner emails to sync to Go High Level.",
          variant: "destructive"
        });
        return;
      }
      
      // Sync each pet sequentially
      for (const pet of petsToSync) {
        await syncPetToGoHighLevel(pet);
      }
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${petsToSync.length} pets to Go High Level.`,
      });
    } catch (error: any) {
      console.error('Error syncing pets:', error);
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSyncingPets(false);
    }
  };

  return {
    syncPetToGoHighLevel,
    syncAllPets,
    syncingPets
  };
};
