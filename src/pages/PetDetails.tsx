
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeCanvas } from 'qrcode.react';
import { getPetById, Pet } from '@/lib/mockData';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PetForm from '@/components/PetForm';
import AddMedicalRecordForm from '@/components/AddMedicalRecordForm';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
      return;
    }

    // Get pet data
    if (id) {
      const petData = getPetById(id);
      if (petData) {
        setPet(petData);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handlePetUpdate = (updatedPet: Pet) => {
    setPet(updatedPet);
    setIsEditing(false);
    toast({
      title: "Success!",
      description: "Pet information has been updated.",
    });
  };

  const handleAddMedicalRecord = () => {
    // In a real app, this would save to database
    // For now, just show a success message
    toast({
      title: "Record Added",
      description: "Medical record has been added to the pet's file.",
    });
  };

  if (loading || !pet) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse-gentle">Loading pet information...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src={pet.profileImg} 
                alt={pet.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <p className="text-muted-foreground">{pet.species} - {pet.breed}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/scanner">Back to Scanner</Link>
            </Button>
            <Sheet open={isEditing} onOpenChange={setIsEditing}>
              <SheetTrigger asChild>
                <Button>Edit Pet Info</Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit Pet Information</SheetTitle>
                  <SheetDescription>
                    Make changes to {pet.name}'s information here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6">
                  <PetForm pet={pet} onSubmit={handlePetUpdate} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex justify-between sm:block">
                  <dt className="text-muted-foreground">Age</dt>
                  <dd className="font-medium sm:mt-1">{pet.age} years</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium sm:mt-1">{pet.weight} lbs</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-muted-foreground">Owner Name</dt>
                  <dd className="font-medium sm:mt-1">{pet.ownerName}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-muted-foreground">Owner Contact</dt>
                  <dd className="font-medium sm:mt-1">{pet.ownerContact}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-muted-foreground">Last Visit</dt>
                  <dd className="font-medium sm:mt-1">{new Date(pet.lastVisit).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6">
            <div className="mb-4">
              <QRCodeCanvas 
                value={pet.qrCode} 
                size={150} 
                includeMargin={true}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
              />
            </div>
            <p className="text-sm text-center text-muted-foreground mb-2">
              Pet ID: {pet.qrCode}
            </p>
            <Button variant="outline" className="w-full">Print QR Code</Button>
          </Card>
        </div>

        <Tabs defaultValue="medical" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="vaccines">Vaccines</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="medical">
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
                    <div key={record.id} className="border rounded-md p-4">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vaccines">
            <Card>
              <CardHeader>
                <CardTitle>Vaccination Record</CardTitle>
                <CardDescription>Vaccination history for {pet.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Vaccination records are being migrated to the new system.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
                <CardDescription>Additional notes for {pet.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No clinical notes available for this pet.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PetDetails;
