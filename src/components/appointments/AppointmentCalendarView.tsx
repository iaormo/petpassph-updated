
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface AppointmentCalendarViewProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  appointmentDates: Date[];
}

const AppointmentCalendarView: React.FC<AppointmentCalendarViewProps> = ({ 
  date, 
  onDateChange, 
  appointmentDates 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow md:col-span-1">
      <h3 className="font-semibold mb-3">Calendar</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && onDateChange(newDate)}
        className="rounded-md"
        modifiers={{
          booked: appointmentDates,
        }}
        modifiersStyles={{
          booked: { fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)' }
        }}
      />
    </div>
  );
};

export default AppointmentCalendarView;
