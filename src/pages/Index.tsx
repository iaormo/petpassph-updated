
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (isAuth) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tl from-vet-light to-white p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>PetCare Veterinary Clinic CRM</p>
          <p>© 2025 PetCare Clinic Systems</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
