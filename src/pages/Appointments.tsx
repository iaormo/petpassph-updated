
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { mockCredentials } from '@/lib/data/mockAuth';
import AppointmentsCalendar from '@/components/AppointmentsCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [userRole, setUserRole] = useState<"veterinary" | "owner">("veterinary");
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
      return;
    }
    
    // Get user role and email from localStorage
    const username = localStorage.getItem('username');
    const user = mockCredentials.find(cred => cred.username === username);
    
    if (user) {
      setUserRole(user.role);
      setOwnerEmail(username || ''); // In a real app, you'd store the email
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Appointments</h1>
        </div>
        
        <AppointmentsCalendar 
          isVeterinary={userRole === "veterinary"} 
          ownerEmail={userRole === "owner" ? ownerEmail : undefined}
          onSelectAppointment={setSelectedAppointment}
        />
        
        {/* Appointment details dialog */}
        <Dialog 
          open={!!selectedAppointment} 
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pet:</p>
                    <p>{selectedAppointment.petName || `Pet ID: ${selectedAppointment.pet_id}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date:</p>
                    <p>{new Date(selectedAppointment.appointment_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time:</p>
                    <p>{new Date(selectedAppointment.appointment_date).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration:</p>
                    <p>{selectedAppointment.duration} minutes</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Owner Email:</p>
                    <p>{selectedAppointment.owner_email}</p>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Notes:</p>
                      <p>{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  {userRole === "veterinary" && (
                    <Button variant="outline" onClick={() => navigate(`/pet/${selectedAppointment.pet_id}`)}>
                      View Pet Profile
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appointments;
