
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { MedicalRecord } from "@/lib/models/types";
import { FileImage, Upload } from "lucide-react";

interface AddMedicalRecordFormProps {
  petId: string;
  onSubmit: (data: MedicalRecord) => void;
}

const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({ petId, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      treatment: "",
      medication: "",
      veterinarian: "",
      followUp: "",
      imageUrl: "",
    },
  });

  const handleSubmit = (data: any) => {
    // Create a new medical record with a generated ID
    const newRecord: MedicalRecord = {
      ...data,
      id: `mr${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      imageUrl: imagePreview || data.imageUrl,
    };
    
    onSubmit(newRecord);
    form.reset();
    setImagePreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the visit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about the treatment provided" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="medication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication</FormLabel>
                <FormControl>
                  <Input placeholder="Prescribed medication" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="veterinarian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veterinarian</FormLabel>
                <FormControl>
                  <Input placeholder="Attending veterinarian" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="followUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Follow-up (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any follow-up instructions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <FormLabel>Upload Results (X-ray, Lab report, etc.)</FormLabel>
          <div className="flex flex-col items-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-md">
            <label htmlFor="imageUpload" className="cursor-pointer">
              {imagePreview ? (
                <div className="relative w-full h-40 mb-2">
                  <img src={imagePreview} alt="Preview" className="object-contain w-full h-full" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground py-4">
                  <FileImage className="h-10 w-10 mb-2" />
                  <span className="text-sm">Click to upload an image</span>
                </div>
              )}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => document.getElementById('imageUpload')?.click()}
            >
              <Upload className="h-4 w-4 mr-1" /> Upload Image
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit">Add Medical Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMedicalRecordForm;
