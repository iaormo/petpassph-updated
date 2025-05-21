
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

interface AppointmentListProps {
  appointments: Appointment[];
  loading: boolean;
  onSelectAppointment?: (appointment: Appointment) => void;
  isVeterinary: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments,
  loading,
  onSelectAppointment,
  isVeterinary
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No appointments for this day
      </p>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {appointments
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
  );
};

export default AppointmentList;
