
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/DashboardStats';
import PetCard from '@/components/PetCard';
import { mockPets, Pet } from '@/lib/mockData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import PetForm from '@/components/PetForm';
import { toast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [pets, setPets] = useState(mockPets);
  const [isAddingPet, setIsAddingPet] = useState(false);

  const handleAddPet = (newPet: Pet) => {
    setPets([newPet, ...pets]);
    setIsAddingPet(false);
    toast({
      title: "Pet Added",
      description: `${newPet.name} has been added successfully.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Vet Clinic Dashboard</h1>
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
        </div>
        
        <DashboardStats />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Patients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
