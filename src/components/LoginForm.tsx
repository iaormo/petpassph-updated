
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dog, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockCredentials } from '@/lib/data/mockAuth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in mock data
    const user = mockCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('username', user.username);
      localStorage.setItem('userRole', user.role);
      
      const welcomeMessage = user.role === 'veterinary' 
        ? 'Welcome to PetCare Clinic CRM' 
        : 'Welcome to PetCare Owner Portal';
      
      toast({
        title: "Login successful",
        description: welcomeMessage,
      });
      
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-vet-blue">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="p-2 rounded-full bg-vet-light flex items-center justify-center mb-2">
          <Dog className="h-8 w-8 text-vet-blue" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">PetCare Clinic Portal</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
              id="username"
              type="email"
              placeholder="demo@vetclinic.com or john@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-vet-blue hover:underline">Forgot password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full vet-gradient hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-center space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Veterinary staff:</strong> demo@vetclinic.com / password123
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Pet owner:</strong> john@example.com / owner123
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
