
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalRecordsTab from './MedicalRecordsTab';
import VaccineRecordsTab from './VaccineRecordsTab';
import NotesTab from './NotesTab';
import { Pet } from '@/lib/models/types';

interface PetDetailsTabsProps {
  pet: Pet;
  setPet?: React.Dispatch<React.SetStateAction<Pet | null>>;
  userRole: "veterinary" | "owner";
}

const PetDetailsTabs: React.FC<PetDetailsTabsProps> = ({ pet, setPet, userRole }) => {
  return (
    <Tabs defaultValue="medical" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="medical">Medical History</TabsTrigger>
        <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="medical">
        <MedicalRecordsTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
      <TabsContent value="vaccines">
        <VaccineRecordsTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
    </Tabs>
  );
};

export default PetDetailsTabs;
