
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Pet } from '@/lib/models/types';

interface GenerateLoginButtonProps {
  pet: Pet;
}

const GenerateLoginButton: React.FC<GenerateLoginButtonProps> = ({ pet }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateLogin = async () => {
    if (!pet.ownerEmail) {
      toast({
        title: "Missing Email",
        description: "Pet owner email is required to generate login credentials.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/functions/v1/generate-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerEmail: pet.ownerEmail,
          ownerName: pet.ownerName,
          petId: pet.id,
          petName: pet.name
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate login');
      }
      
      toast({
        title: "Login Generated",
        description: "Login details have been sent to the owner's email address.",
      });
    } catch (error: any) {
      console.error('Error generating login:', error);
      toast({
        title: "Failed to Generate Login",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleGenerateLogin} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Send className="h-4 w-4" />
      {loading ? "Sending..." : "Generate Login & Send Email"}
    </Button>
  );
};

export default GenerateLoginButton;
