
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Appointment {
  id: string;
  pet_id: string;
  owner_email: string;
  appointment_date: string;
  duration: number;
  status: string;
  notes: string | null;
  ghl_appointment_id: string | null;
  petName?: string;
}

interface AppointmentsCalendarProps {
  isVeterinary?: boolean;
  ownerEmail?: string;
  onSelectAppointment?: (appointment: Appointment) => void;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ 
  isVeterinary = false, 
  ownerEmail,
  onSelectAppointment 
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  
  // Fetch appointments from the database
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*');
      
      // Filter by owner email if not veterinary
      if (!isVeterinary && ownerEmail) {
        query = query.eq('owner_email', ownerEmail);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Fetch pet data for each appointment
        const appointmentsWithPetData = await Promise.all(data.map(async (appointment) => {
          // In a real app, we would fetch from the database
          // Here we'll use the mock data
          const petName = `Pet ${appointment.pet_id.slice(0, 4)}`; // Mock pet name
          return { ...appointment, petName };
        }));

        setAppointments(appointmentsWithPetData);
        
        // Extract dates for the calendar highlighting
        const dates = appointmentsWithPetData.map(apt => 
          new Date(apt.appointment_date)
        );
        setAppointmentDates(dates);
      }
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: `Failed to fetch appointments: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter appointments for the selected date
  useEffect(() => {
    if (date && appointments.length > 0) {
      const filtered = appointments.filter(appointment => 
        isSameDay(new Date(appointment.appointment_date), date)
      );
      setSelectedDayAppointments(filtered);
    } else {
      setSelectedDayAppointments([]);
    }
  }, [date, appointments]);
  
  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, [isVeterinary, ownerEmail]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow md:col-span-1">
        <h3 className="font-semibold mb-3">Calendar</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md"
          modifiers={{
            booked: appointmentDates,
          }}
          modifiersStyles={{
            booked: { fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)' }
          }}
        />
      </div>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{format(date, 'PPPP')}</CardTitle>
          <CardDescription>
            {selectedDayAppointments.length === 0 
              ? "No appointments scheduled" 
              : `${selectedDayAppointments.length} appointment(s) scheduled`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedDayAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No appointments for this day
            </p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {selectedDayAppointments
                  .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
                  .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-3 border rounded-md cursor-pointer hover:bg-slate-50"
                      onClick={() => onSelectAppointment && onSelectAppointment(appointment)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {appointment.petName || `Pet ID: ${appointment.pet_id}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(appointment.appointment_date), 'h:mm a')}
                            {" • "}
                            {appointment.duration} min
                          </p>
                          {isVeterinary && (
                            <p className="text-sm text-muted-foreground">
                              Owner: {appointment.owner_email}
                            </p>
                          )}
                        </div>
                        <Badge variant={appointment.status === 'scheduled' ? 'outline' : 'default'}>
                          {appointment.status}
                        </Badge>
                      </div>
                      {appointment.notes && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsCalendar;
