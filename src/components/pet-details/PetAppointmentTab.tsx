
import React from 'react';
import AppointmentBooking from '../AppointmentBooking';

interface PetAppointmentTabProps {
  petId: string;
  petName: string;
  ownerName: string;
  ownerEmail: string;
}

const PetAppointmentTab: React.FC<PetAppointmentTabProps> = ({ 
  petId, 
  petName, 
  ownerName, 
  ownerEmail 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <AppointmentBooking 
        petId={petId}
        petName={petName}
        ownerName={ownerName}
        ownerEmail={ownerEmail || ''}
      />
    </div>
  );
};

export default PetAppointmentTab;
