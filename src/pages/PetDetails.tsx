
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Pet } from '@/lib/models/types';
import { getPetById } from '@/lib/utils/petUtils';
import PetHeader from '@/components/pet-details/PetHeader';
import PetInfoCard from '@/components/pet-details/PetInfoCard';
import QRCodeCard from '@/components/pet-details/QRCodeCard';
import PetDetailsTabs from '@/components/pet-details/PetDetailsTabs';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
      return;
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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Pet header with name, edit button, etc */}
        <PetHeader 
          pet={pet} 
          setPet={setPet} 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
        />

        {/* Pet information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PetInfoCard pet={pet} />
          <QRCodeCard qrCode={pet.qrCode} />
        </div>

        {/* Tabs for medical history, vaccines, notes */}
        <PetDetailsTabs pet={pet} />
      </div>
    </Layout>
  );
};

export default PetDetails;
