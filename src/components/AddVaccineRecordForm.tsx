
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VaccineRecord } from '@/lib/models/types';

const formSchema = z.object({
  vaccineName: z.string().min(1, 'Vaccine name is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  lotNumber: z.string().min(1, 'Lot number is required'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  veterinarian: z.string().min(1, 'Veterinarian name is required'),
  nextDueDate: z.string().min(1, 'Next due date is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddVaccineRecordFormProps {
  petId: string;
  onSubmit: (record: VaccineRecord) => void;
}

const AddVaccineRecordForm: React.FC<AddVaccineRecordFormProps> = ({ petId, onSubmit }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vaccineName: '',
      manufacturer: '',
      lotNumber: '',
      expirationDate: '',
      veterinarian: '',
      nextDueDate: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    const vaccineRecord: VaccineRecord = {
      id: `vr${Date.now().toString()}`,
      date: new Date().toISOString().split('T')[0],
      ...values,
    };

    onSubmit(vaccineRecord);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vaccineName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vaccine Name</FormLabel>
              <FormControl>
                <Input placeholder="Rabies, DHPP, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Manufacturer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lotNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lot Number</FormLabel>
                <FormControl>
                  <Input placeholder="Lot number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiration Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextDueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="veterinarian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veterinarian</FormLabel>
              <FormControl>
                <Input placeholder="Administering veterinarian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit">Add Vaccination Record</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddVaccineRecordForm;
