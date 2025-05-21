
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalRecordsTab from './MedicalRecordsTab';
import VaccineRecordsTab from './VaccineRecordsTab';
import NotesTab from './NotesTab';
import PetAppointmentTab from './PetAppointmentTab';
import { Pet } from '@/lib/models/types';

interface PetDetailsTabsProps {
  pet: Pet;
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>;
  userRole: "veterinary" | "owner";
}

const PetDetailsTabs: React.FC<PetDetailsTabsProps> = ({ pet, setPet, userRole }) => {
  return (
    <Tabs defaultValue="medical" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="medical">Medical Records</TabsTrigger>
        <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="appointment">Appointments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="medical" className="space-y-4">
        <MedicalRecordsTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
      
      <TabsContent value="vaccines" className="space-y-4">
        <VaccineRecordsTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
      
      <TabsContent value="notes" className="space-y-4">
        <NotesTab pet={pet} setPet={setPet} userRole={userRole} />
      </TabsContent>
      
      <TabsContent value="appointment" className="space-y-4">
        <PetAppointmentTab
          petId={pet.id}
          petName={pet.name}
          ownerName={pet.ownerName}
          ownerEmail={pet.ownerEmail || ''}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PetDetailsTabs;
