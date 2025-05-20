
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
import { PlusCircle } from 'lucide-react';
import { addPet, getPetsByOwner } from '@/lib/utils/petUtils';
import { mockCredentials } from '@/lib/data/mockAuth';

const Dashboard = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [userRole, setUserRole] = useState<"veterinary" | "owner">("veterinary");
  const [dashboardTitle, setDashboardTitle] = useState("Vet Clinic Dashboard");

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
    
    setIsAddingPet(false);
    toast({
      title: "Pet Added",
      description: `${addedPet.name} has been added successfully.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{dashboardTitle}</h1>
          {userRole === "veterinary" && (
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
          )}
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
