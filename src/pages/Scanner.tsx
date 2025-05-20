
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QRScanner from '@/components/QRScanner';
import { mockCredentials } from '@/lib/data/mockAuth';
import { toast } from '@/hooks/use-toast';

const Scanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/');
      return;
    }
    
    // Check if user role is veterinary
    const username = localStorage.getItem('username');
    const user = mockCredentials.find(cred => cred.username === username);
    
    if (!user || user.role !== 'veterinary') {
      // Redirect to dashboard if not veterinary staff
      toast({
        title: "Access Denied",
        description: "Only veterinary staff can access the QR scanner.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">QR Scanner</h1>
        </div>

        <div className="flex justify-center">
          <QRScanner />
        </div>

        <div className="max-w-md mx-auto bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">How to use:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Click "Start Scanning" to activate the camera</li>
            <li>Hold the QR code in front of the camera</li>
            <li>Once scanned, you'll be redirected to the pet's profile</li>
            <li>Make sure you've granted camera permissions</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Scanner;
