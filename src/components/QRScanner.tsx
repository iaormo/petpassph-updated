
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getPetByQRCode } from '@/lib/utils/petUtils';
import QrReader from 'react-qr-scanner';

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleScan = (data: { text: string } | null) => {
    if (data) {
      console.log('Scanned QR code:', data.text);
      
      const pet = getPetByQRCode(data.text);
      
      if (pet) {
        toast({
          title: "QR Code Scanned",
          description: `Found pet: ${pet.name}`,
        });
        
        // Navigate to the pet details page
        navigate(`/pet/${pet.id}`);
        
        // Stop scanning
        setScanning(false);
      } else {
        toast({
          title: "Unknown QR Code",
          description: "No pet found with this QR code.",
          variant: "destructive"
        });
      }
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scanner error:', err);
    setError(err.toString());
    toast({
      title: "Scanner Error",
      description: "There was an error with the QR scanner. Please check camera permissions.",
      variant: "destructive"
    });
  };

  const toggleScanning = () => {
    setScanning(!scanning);
    setError(null);
  };
  
  return (
    <Card className="max-w-md w-full">
      {scanning ? (
        <>
          <CardContent className="p-0">
            <div className="relative">
              <QrReader
                delay={300}
                className="w-full h-full"
                constraints={{
                  video: { facingMode: 'environment' }
                }}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute inset-0 border-2 border-primary pointer-events-none" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            {error && (
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Scanner error. Check permissions.</span>
              </div>
            )}
            <Button variant="outline" onClick={toggleScanning}>Stop Scanning</Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent className="p-6 flex flex-col items-center justify-center h-64">
            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">QR Code Scanner</h3>
            <p className="text-center text-muted-foreground text-sm mb-4">
              Click below to activate the camera and scan a pet's QR code
            </p>
          </CardContent>
          <CardFooter className="flex justify-center p-4">
            <Button onClick={toggleScanning}>Start Scanning</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default QRScanner;
