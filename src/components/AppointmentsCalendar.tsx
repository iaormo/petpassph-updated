
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import AppointmentCalendarView from '@/components/appointments/AppointmentCalendarView';
import AppointmentList from '@/components/appointments/AppointmentList';
import { useAppointments } from '@/hooks/useAppointments';

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
  const { 
    date, 
    setDate, 
    appointmentDates,
    selectedDayAppointments,
    loading
  } = useAppointments(isVeterinary, ownerEmail);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AppointmentCalendarView
        date={date}
        onDateChange={(newDate) => newDate && setDate(newDate)}
        appointmentDates={appointmentDates}
      />
      
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
          <AppointmentList 
            appointments={selectedDayAppointments}
            loading={loading}
            onSelectAppointment={onSelectAppointment}
            isVeterinary={isVeterinary}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsCalendar;
