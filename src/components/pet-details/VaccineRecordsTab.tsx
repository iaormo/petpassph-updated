
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Plus } from 'lucide-react';
import { Pet, VaccineRecord } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';
import { addVaccineRecord } from '@/lib/utils/petUtils';
import AddVaccineRecordForm from '@/components/AddVaccineRecordForm';

interface VaccineRecordsTabProps {
  pet: Pet;
  setPet?: React.Dispatch<React.SetStateAction<Pet | null>>;
  userRole: "veterinary" | "owner";
}

const VaccineRecordsTab: React.FC<VaccineRecordsTabProps> = ({ pet, setPet, userRole }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddVaccineRecord = (record: VaccineRecord) => {
    // Add the vaccine record to the pet
    const success = addVaccineRecord(pet.id, record);
    
    if (success && setPet) {
      // Force a re-render by updating the pet state with a new reference
      setPet({...pet});
    }
    
    setIsDialogOpen(false);
    toast({
      title: "Vaccine Record Added",
      description: "Vaccination record has been added to the pet's file.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Vaccination Records</CardTitle>
          <CardDescription>Complete vaccination history for {pet.name}</CardDescription>
        </div>
        {userRole === "veterinary" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-auto" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add Vaccine Record</DialogTitle>
                <DialogDescription>
                  Add a new vaccination record for {pet.name}. Fill in all the required fields.
                </DialogDescription>
              </DialogHeader>
              <AddVaccineRecordForm petId={pet.id} onSubmit={handleAddVaccineRecord} />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pet.vaccineRecords.length > 0 ? (
            pet.vaccineRecords.map(record => (
              <VaccineRecordCard key={record.id} record={record} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No vaccination records found. {userRole === "veterinary" ? "Add a vaccine record to get started." : ""}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface VaccineRecordCardProps {
  record: VaccineRecord;
}

const VaccineRecordCard: React.FC<VaccineRecordCardProps> = ({ record }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium flex items-center">
          <Plus className="mr-2 h-4 w-4" /> {/* Replaced Vaccine icon with Plus */}
          {record.vaccineName}
        </h4>
        <span className="text-sm text-muted-foreground">
          {new Date(record.date).toLocaleDateString()}
        </span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Manufacturer</dt>
          <dd className="mt-1">{record.manufacturer}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Lot Number</dt>
          <dd className="mt-1">{record.lotNumber}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Expiration Date</dt>
          <dd className="mt-1">{new Date(record.expirationDate).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Veterinarian</dt>
          <dd className="mt-1">{record.veterinarian}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Next Due Date</dt>
          <dd className="mt-1">{new Date(record.nextDueDate).toLocaleDateString()}</dd>
        </div>
      </dl>
    </div>
  );
};

export default VaccineRecordsTab;
