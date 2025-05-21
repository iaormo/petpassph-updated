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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, addHours, isAfter, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentBookingProps {
  petId: string;
  petName: string;
  ownerName: string;
  ownerEmail: string;
}

// Define the form schema
const formSchema = z.object({
  appointmentDate: z.date({
    required_error: "Please select a date and time",
  }),
  appointmentTime: z.string({
    required_error: "Please select a time",
  }),
  duration: z.number().default(30),
  notes: z.string().optional(),
});

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  petId,
  petName,
  ownerName,
  ownerEmail,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<Date[]>([]);
  
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDate: undefined,
      appointmentTime: '',
      duration: 30,
      notes: '',
    },
  });
  
  // Get current date for validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const dateTime = new Date(values.appointmentDate);
      const [hours, minutes] = values.appointmentTime.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0, 0);
      
      // Create the appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          pet_id: petId,
          owner_email: ownerEmail,
          appointment_date: dateTime.toISOString(),
          duration: values.duration,
          status: 'scheduled',
          notes: values.notes || null,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Appointment Booked',
        description: `Your appointment for ${petName} on ${format(dateTime, 'PPP')} at ${format(dateTime, 'p')} has been scheduled.`,
      });
      
      // Reset form
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
  
  // Function to check if a date is disabled (weekend or past)
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    const isPastDate = date < today;
    const isWeekend = day === 0 || day === 6; // Sunday or Saturday
    
    return isPastDate || isWeekend;
  };
  
  // Function to check if a time slot is available
  const isTimeSlotAvailable = (time: string) => {
    const selectedDate = form.watch('appointmentDate');
    if (!selectedDate) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    // Check if it's in the past
    if (selectedDateTime < new Date()) return false;
    
    // Check if it overlaps with existing appointments
    return !existingAppointments.some(existingTime => {
      // Since we don't have actual duration info, assume each appointment is 30 min
      const appointmentEnd = new Date(existingTime);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);
      
      return isWithinInterval(selectedDateTime, {
        start: existingTime,
        end: appointmentEnd
      }) || isSameDay(existingTime, selectedDateTime) && 
             format(existingTime, 'HH:mm') === time;
    });
  };
  
  // Load existing appointments when date changes
  useEffect(() => {
    const selectedDate = form.watch('appointmentDate');
    if (!selectedDate) return;
    
    const fetchAppointments = async () => {
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const { data, error } = await supabase
          .from('appointments')
          .select('appointment_date')
          .gte('appointment_date', startOfDay.toISOString())
          .lte('appointment_date', endOfDay.toISOString());
          
        if (error) throw error;
        
        if (data) {
          setExistingAppointments(data.map(item => new Date(item.appointment_date)));
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    fetchAppointments();
  }, [form.watch('appointmentDate')]);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
      <div className="text-sm text-muted-foreground mb-6">
        <p>Pet: <strong>{petName}</strong></p>
        <p>Owner: <strong>{ownerName}</strong></p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select a weekday for your appointment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select
                  disabled={!form.watch('appointmentDate')}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem
                        key={time}
                        value={time}
                        disabled={!isTimeSlotAvailable(time)}
                      >
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Available appointment times.
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentBooking;
