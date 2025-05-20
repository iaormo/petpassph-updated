
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Pet } from '@/lib/models/types';
import { getPetById } from '@/lib/utils/petUtils';
import PetHeader from '@/components/pet-details/PetHeader';
import PetInfoCard from '@/components/pet-details/PetInfoCard';
import QRCodeCard from '@/components/pet-details/QRCodeCard';
import PetDetailsTabs from '@/components/pet-details/PetDetailsTabs';
import { mockCredentials } from '@/lib/data/mockAuth';
import { toast } from '@/hooks/use-toast';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState<"veterinary" | "owner">("veterinary");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
      return;
    }

    // Get user role from localStorage
    const currentUsername = localStorage.getItem('username');
    const user = mockCredentials.find(cred => cred.username === currentUsername);
    
    if (user) {
      setUserRole(user.role);
      
      // If user is owner, check if they own this pet
      if (user.role === "owner") {
        if (user.petsOwned && id && user.petsOwned.includes(id)) {
          setAuthorized(true);
        } else {
          toast({
            title: "Access Denied",
            description: "You do not have permission to view this pet.",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }
      } else {
        // Veterinary staff has access to all pets
        setAuthorized(true);
      }
    }

    // Get pet data
    if (id) {
      const petData = getPetById(id);
      if (petData) {
        setPet(petData);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading || !pet) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse-gentle">Loading pet information...</div>
        </div>
      </Layout>
    );
  }

  if (!authorized) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">You do not have permission to view this pet.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Pet header with name, edit button, etc */}
        <PetHeader 
          pet={pet} 
          setPet={setPet} 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          userRole={userRole}
        />

        {/* Pet information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PetInfoCard pet={pet} />
          <QRCodeCard qrCode={pet.qrCode} petName={pet.name} />
        </div>

        {/* Tabs for medical history, vaccines, notes */}
        <PetDetailsTabs pet={pet} setPet={setPet} userRole={userRole} />
      </div>
    </Layout>
  );
};

export default PetDetails;
