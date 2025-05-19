
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalRecordsTab from './MedicalRecordsTab';
import PlaceholderTab from './PlaceholderTab';
import { Pet } from '@/lib/models/types';

interface PetDetailsTabsProps {
  pet: Pet;
  setPet?: React.Dispatch<React.SetStateAction<Pet | null>>;
}

const PetDetailsTabs: React.FC<PetDetailsTabsProps> = ({ pet, setPet }) => {
  return (
    <Tabs defaultValue="medical" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="medical">Medical History</TabsTrigger>
        <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="medical">
        <MedicalRecordsTab pet={pet} setPet={setPet} />
      </TabsContent>
      <TabsContent value="vaccines">
        <PlaceholderTab 
          title="Vaccination Record" 
          description={`Vaccination history for ${pet.name}`}
          message="Vaccination records are being migrated to the new system." 
        />
      </TabsContent>
      <TabsContent value="notes">
        <PlaceholderTab 
          title="Clinical Notes" 
          description={`Additional notes for ${pet.name}`}
          message="No clinical notes available for this pet." 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PetDetailsTabs;
