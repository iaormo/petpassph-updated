
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';

interface AppointmentDashboardProps {
  isVeterinary: boolean;
  ownerEmail?: string;
}

const AppointmentDashboard: React.FC<AppointmentDashboardProps> = ({ 
  isVeterinary, 
  ownerEmail 
}) => {
  const { 
    appointments, 
    loading, 
    selectedDayAppointments 
  } = useAppointments(isVeterinary, ownerEmail);

  // Status badges with appropriate colors
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Canceled</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {isVeterinary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.filter(apt => 
              new Date(apt.appointment_date).toDateString() === new Date().toDateString()
            ).length === 0 ? (
              <p className="text-muted-foreground">No appointments scheduled for today.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments
                    .filter(apt => new Date(apt.appointment_date).toDateString() === new Date().toDateString())
                    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(appointment.appointment_date), 'h:mm a')}
                          </div>
                        </TableCell>
                        <TableCell>{appointment.petName || `Pet ${appointment.pet_id.slice(0, 4)}`}</TableCell>
                        <TableCell>{appointment.owner_email}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isVeterinary ? "Recent Appointments" : "Your Appointments"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isVeterinary 
                  ? "No recent appointments found." 
                  : "You don't have any appointments scheduled."}
              </p>
              <Button className="mt-4">
                {isVeterinary ? "Add New Appointment" : "Book an Appointment"}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Pet</TableHead>
                  {isVeterinary && <TableHead>Owner</TableHead>}
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments
                  .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
                  .slice(0, 5) // Show only recent 5
                  .map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {format(new Date(appointment.appointment_date), 'h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>{appointment.petName || `Pet ${appointment.pet_id.slice(0, 4)}`}</TableCell>
                      {isVeterinary && <TableCell>{appointment.owner_email}</TableCell>}
                      <TableCell>{appointment.duration} mins</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" asChild>
              <Link to="/appointments">View All Appointments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentDashboard;
