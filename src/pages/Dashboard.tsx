
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import PetCard from '@/components/PetCard';
import { mockPets } from '@/lib/data/mockPets';
import { Pet } from '@/lib/models/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import PetForm from '@/components/PetForm';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { addPet, getPetsByOwner } from '@/lib/utils/petUtils';
import { mockCredentials } from '@/lib/data/mockAuth';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [userRole, setUserRole] = useState<"veterinary" | "owner">("veterinary");
  const [dashboardTitle, setDashboardTitle] = useState("Vet Clinic Dashboard");
  const [syncingPets, setSyncingPets] = useState(false);

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

  const handleSyncAllPets = async () => {
    if (userRole !== "veterinary") return;
    
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{dashboardTitle}</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            {userRole === "veterinary" && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleSyncAllPets}
                  disabled={syncingPets}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${syncingPets ? 'animate-spin' : ''}`} />
                  {syncingPets ? "Syncing..." : "Sync with Go High Level"}
                </Button>
                <Sheet open={isAddingPet} onOpenChange={setIsAddingPet}>
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
                      <PetForm onSubmit={handleAddPet} />
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
        
        {userRole === "veterinary" && <DashboardStats />}
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {userRole === "owner" ? "My Pets" : "Recent Patients"}
        </h2>
        
        {pets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No pets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} showQR={userRole === "veterinary"} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
