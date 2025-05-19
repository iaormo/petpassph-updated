import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pet } from "@/lib/models/types";
import { Camera, RefreshCw } from "lucide-react";
import { generateQRCode } from "@/lib/utils/petUtils";
import { toast } from "@/hooks/use-toast";

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: Pet) => void;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onSubmit }) => {
  const isEditing = !!pet;
  
  const form = useForm({
    defaultValues: pet || {
      name: "",
      species: "Dog" as const,
      breed: "",
      age: 0,
      weight: 0,
      ownerName: "",
      ownerContact: "",
      lastVisit: new Date().toISOString().split("T")[0],
      qrCode: generateQRCode(),
      medicalRecords: [],
      profileImg: "",
      id: ""
    },
  });

  const handleSubmit = (data: any) => {
    // For a new pet, we'd generate an ID server-side
    // For now we're just mocking that behavior
    if (!isEditing) {
      data.id = data.qrCode || generateQRCode();
      data.medicalRecords = [];
    }

    // Handle the image submission
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // In a real app, we would upload this to a server
        // For now, we'll use the data URL directly
        data.profileImg = reader.result as string;
        onSubmit(data as Pet);
      };
      
      reader.readAsDataURL(file);
    } else {
      // No new image was selected, keep existing or use placeholder
      if (!data.profileImg) {
        data.profileImg = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=200&auto=format&fit=crop";
      }
      onSubmit(data as Pet);
    }
  };

  const regenerateQRCode = () => {
    const newQRCode = generateQRCode();
    form.setValue("qrCode", newQRCode);
    toast({
      title: "QR Code Generated",
      description: `New QR Code: ${newQRCode}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src={pet?.profileImg || "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=200&auto=format&fit=crop"} 
                  alt="Pet profile" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <label 
                htmlFor="profileImage" 
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload image</span>
              </label>
              <input 
                id="profileImage" 
                type="file" 
                accept="image/*"
                className="hidden" 
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter pet name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="species"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Species</FormLabel>
                  <FormControl>
                    <Input placeholder="Dog, Cat, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter breed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (years)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Age in years" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (lbs)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Weight in pounds" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number or email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastVisit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Visit Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qrCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QR Code</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="QR Code" {...field} readOnly />
                  </FormControl>
                  <Button type="button" variant="outline" onClick={regenerateQRCode}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {isEditing ? "Update Pet" : "Add Pet"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PetForm;
