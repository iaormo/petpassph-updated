
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addMinutes, parse, parseISO } from 'date-fns';
import AppointmentList from '@/components/appointments/AppointmentList';
import { useAppointments } from '@/hooks/useAppointments';
import CalendlyStyleCalendar from './appointments/CalendlyStyleCalendar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import AppointmentBookingForm from './appointments/AppointmentBookingForm';
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
    loading,
    fetchAppointments
  } = useAppointments(isVeterinary, ownerEmail);
  
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Generate time slots from 9 AM to 5 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = parse('09:00', 'HH:mm', new Date());
    const endTime = parse('17:00', 'HH:mm', new Date());
    
    let currentTime = startTime;
    while (currentTime <= endTime) {
      const timeString = format(currentTime, 'HH:mm');
      
      // Check if this time slot is already booked
      const isBooked = selectedDayAppointments.some(app => {
        const appTime = new Date(app.appointment_date);
        const slotTime = parse(timeString, 'HH:mm', date);
        slotTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        
        // Check if the appointment time is within 30 minutes of this slot
        const appointmentEnd = addMinutes(appTime, app.duration);
        const slotStart = slotTime;
        const slotEnd = addMinutes(slotStart, 30);
        
        return (
          (appTime <= slotStart && appointmentEnd > slotStart) || // Appointment starts before slot and ends during/after
          (appTime >= slotStart && appTime < slotEnd) // Appointment starts during slot
        );
      });
      
      slots.push({
        time: format(currentTime, 'h:mm a'),
        available: !isBooked
      });
      
      // Add 30 minutes
      currentTime = addMinutes(currentTime, 30);
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsBookingOpen(true);
  };

  const closeBookingDialog = () => {
    setIsBookingOpen(false);
    setSelectedTime(null);
  };
  
  const handleAppointmentBooked = () => {
    closeBookingDialog();
    fetchAppointments();
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been scheduled successfully."
    });
  };
  
  return (
    <div>
      <CalendlyStyleCalendar 
        selectedDate={date}
        onDateChange={setDate}
        availableDates={appointmentDates.length > 0 ? appointmentDates : [new Date()]}
        timeSlots={timeSlots}
        onTimeSlotSelect={handleTimeSelect}
        selectedTime={selectedTime}
        hideTimeSlots={isVeterinary}
      />
      
      {isVeterinary && (
        <Card className="mt-6">
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
      )}
      
      {/* Appointment Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={closeBookingDialog}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              {selectedTime && <span>For {format(date, 'PPPP')} at {selectedTime}</span>}
            </DialogDescription>
          </DialogHeader>
          
          <AppointmentBookingForm 
            selectedDate={date}
            selectedTime={selectedTime || ''}
            ownerEmail={ownerEmail || ''}
            onAppointmentBooked={handleAppointmentBooked}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsCalendar;
