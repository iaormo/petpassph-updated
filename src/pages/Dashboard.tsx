
import React from 'react';
import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import PetList from '@/components/dashboard/PetList';
import AddPetButton from '@/components/dashboard/AddPetButton';
import SyncButton from '@/components/dashboard/SyncButton';
import { usePets } from '@/hooks/usePets';

const Dashboard: React.FC = () => {
  const {
    pets,
    userRole,
    dashboardTitle,
    isAddingPet,
    setIsAddingPet,
    handleAddPet,
    handleSyncAllPets,
    syncingPets
  } = usePets();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{dashboardTitle}</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            {userRole === "veterinary" && (
              <>
                <SyncButton onSync={handleSyncAllPets} isSyncing={syncingPets} />
                <AddPetButton 
                  isOpen={isAddingPet} 
                  setIsOpen={setIsAddingPet} 
                  onAddPet={handleAddPet} 
                />
              </>
            )}
          </div>
        </div>
        
        {userRole === "veterinary" && <DashboardStats />}
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">
          {userRole === "owner" ? "My Pets" : "Recent Patients"}
        </h2>
        
        <PetList pets={pets} userRole={userRole} />
      </div>
    </Layout>
  );
};

export default Dashboard;
