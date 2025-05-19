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
import { Textarea } from "@/components/ui/textarea";
import { MedicalRecord } from "@/lib/models/types";

interface AddMedicalRecordFormProps {
  petId: string;
  onSubmit: (data: MedicalRecord) => void;
}

const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({ petId, onSubmit }) => {
  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      treatment: "",
      medication: "",
      veterinarian: "",
      followUp: "",
    },
  });

  const handleSubmit = (data: any) => {
    // Create a new medical record with a generated ID
    const newRecord: MedicalRecord = {
      ...data,
      id: `mr${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    };
    
    onSubmit(newRecord);
    form.reset();
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

        <div className="flex justify-end pt-4">
          <Button type="submit">Add Medical Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMedicalRecordForm;
