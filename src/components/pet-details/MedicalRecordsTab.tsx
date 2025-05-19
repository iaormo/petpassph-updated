
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddMedicalRecordForm from '@/components/AddMedicalRecordForm';
import { PlusCircle } from 'lucide-react';
import { Pet, MedicalRecord } from '@/lib/models/types';
import { toast } from '@/hooks/use-toast';

interface MedicalRecordsTabProps {
  pet: Pet;
}

const MedicalRecordsTab: React.FC<MedicalRecordsTabProps> = ({ pet }) => {
  const handleAddMedicalRecord = () => {
    // In a real app, this would save to database
    // For now, just show a success message
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
        <Dialog>
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
          {pet.medicalRecords.map(record => (
            <MedicalRecordCard key={record.id} record={record} />
          ))}
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
      </dl>
    </div>
  );
};

export default MedicalRecordsTab;
