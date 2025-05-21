
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentBookingProps {
  petId: string;
  petName: string;
  ownerName: string;
  ownerEmail: string;
  onBookingComplete?: () => void;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", 
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  petId, 
  petName, 
  ownerName, 
  ownerEmail,
  onBookingComplete 
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Parse the time slot and create the appointment date
      const [hoursStr, minutesStr] = timeSlot.replace(/\s(AM|PM)$/, '').split(':');
      const isPM = timeSlot.includes('PM');
      
      let hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Create the appointment in the database
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .insert({
          pet_id: petId,
          owner_email: ownerEmail,
          appointment_date: appointmentDate.toISOString(),
          duration: 30, // default duration 30 minutes
          notes,
        })
        .select();
      
      if (error) {
        throw new Error(`Error booking appointment: ${error.message}`);
      }
      
      // Sync the appointment with Go High Level
      await fetch('/api/functions/v1/go-high-level-sync/create-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appointmentData[0].id,
          petId,
          petName,
          ownerName,
          ownerEmail,
          appointmentDate: appointmentDate.toISOString(),
          duration: 30,
          notes
        }),
      });
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment has been scheduled for ${format(appointmentDate, 'PPP')} at ${timeSlot}.`,
      });
      
      // Reset form
      setDate(undefined);
      setTimeSlot(undefined);
      setNotes('');
      
      if (onBookingComplete) {
        onBookingComplete();
      }
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Book an Appointment</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Appointment Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today || date.getDay() === 0; // Disable past dates and Sundays
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Time Slot</label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time">
              {timeSlot ? (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{timeSlot}</span>
                </div>
              ) : (
                "Select time"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea
          placeholder="Any specific concerns or information for the vet..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading || !date || !timeSlot}>
        {loading ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
};

export default AppointmentBooking;
