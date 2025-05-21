
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parse } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Pet {
  id: string;
  name: string;
}

interface AppointmentBookingFormProps {
  selectedDate: Date;
  selectedTime: string; // Format: '9:00 AM'
  ownerEmail: string;
  onAppointmentBooked: () => void;
}

// Define the form schema
const formSchema = z.object({
  petId: z.string({
    required_error: "Please select a pet",
  }),
  duration: z.number().default(30),
  notes: z.string().optional(),
});

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  selectedDate,
  selectedTime,
  ownerEmail,
  onAppointmentBooked
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: '',
      duration: 30,
      notes: '',
    },
  });
  
  // Function to fetch the user's pets
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch from the database
        // For this example, we're using mock data
        import('@/lib/data/mockPets').then(({ mockPets }) => {
          const userPets = mockPets.filter(pet => pet.ownerEmail === ownerEmail);
          setPets(userPets.map(pet => ({ id: pet.id, name: pet.name })));
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };
    
    if (ownerEmail) {
      fetchPets();
    }
  }, [ownerEmail]);
  
  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const timeFormat = selectedTime.includes('AM') || selectedTime.includes('PM') 
        ? 'h:mm a' 
        : 'HH:mm';
      
      const [hours, minutes] = parse(selectedTime, timeFormat, new Date())
        .toTimeString()
        .split(':')
        .map(Number);
      
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Create the appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          pet_id: values.petId,
          owner_email: ownerEmail,
          appointment_date: appointmentDate.toISOString(),
          duration: values.duration,
          status: 'scheduled',
          notes: values.notes || null,
        });
      
      if (error) throw error;
      
      onAppointmentBooked();
      form.reset();
      
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Pet</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pets.length === 0 ? (
                        <SelectItem value="no-pets" disabled>
                          No pets found
                        </SelectItem>
                      ) : (
                        pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which pet needs the appointment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 minutes (standard)</SelectItem>
                      <SelectItem value="60">60 minutes (extended)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Standard appointments are 30 minutes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant information about your pet's condition"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Any special requirements or symptoms to note.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onAppointmentBooked}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || pets.length === 0}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AppointmentBookingForm;
