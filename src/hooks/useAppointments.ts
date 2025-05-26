
import React, { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

export const useAppointments = (isVeterinary: boolean = false, ownerEmail?: string) => {
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

  return {
    date,
    setDate,
    appointments,
    selectedDayAppointments,
    loading,
    appointmentDates,
    fetchAppointments
  };
};
