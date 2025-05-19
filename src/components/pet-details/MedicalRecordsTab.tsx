
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddMedicalRecordForm from '@/components/AddMedicalRecordForm';
import { PlusCircle, FileImage } from 'lucide-react';
import { Pet, MedicalRecord } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';
import { addMedicalRecord } from '@/lib/utils/petUtils';

interface MedicalRecordsTabProps {
  pet: Pet;
  setPet?: React.Dispatch<React.SetStateAction<Pet | null>>;
}

const MedicalRecordsTab: React.FC<MedicalRecordsTabProps> = ({ pet, setPet }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddMedicalRecord = (record: MedicalRecord) => {
    // Add the medical record to the pet
    const success = addMedicalRecord(pet.id, record);
    
    if (success && setPet) {
      // Force a re-render by updating the pet state with a new reference
      setPet({...pet});
    }
    
    setIsDialogOpen(false);
    toast({
      title: "Record Added",
      description: "Medical record has been added to the pet's file.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>Complete medical history for {pet.name}</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
              <DialogDescription>
                Add a new medical record for {pet.name}. Fill in all the required fields.
              </DialogDescription>
            </DialogHeader>
            <AddMedicalRecordForm petId={pet.id} onSubmit={handleAddMedicalRecord} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pet.medicalRecords.length > 0 ? (
            pet.medicalRecords.map(record => (
              <MedicalRecordCard key={record.id} record={record} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No medical records found. Add a record to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">{record.description}</h4>
        <span className="text-sm text-muted-foreground">
          {new Date(record.date).toLocaleDateString()}
        </span>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Treatment</dt>
          <dd className="mt-1">{record.treatment}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Medication</dt>
          <dd className="mt-1">{record.medication}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Veterinarian</dt>
          <dd className="mt-1">{record.veterinarian}</dd>
        </div>
        {record.followUp && (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Follow-up</dt>
            <dd className="mt-1">{record.followUp}</dd>
          </div>
        )}
        {record.imageUrl && (
          <div className="sm:col-span-2 mt-2">
            <dt className="text-muted-foreground flex items-center gap-1">
              <FileImage className="h-4 w-4" /> Results
            </dt>
            <dd className="mt-1">
              <a href={record.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                View Image
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default MedicalRecordsTab;
