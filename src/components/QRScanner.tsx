
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getPetByQRCode } from '@/lib/mockData';

interface ScanResult {
  text: string;
}

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [delay, setDelay] = useState(300);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScan = (data: ScanResult | null) => {
    if (data && data.text) {
      setResult(data.text);
      setScanning(false);
      
      // Check if the QR code corresponds to a pet
      const pet = getPetByQRCode(data.text);
      
      if (pet) {
        toast({
          title: "Pet found!",
          description: `Loading record for ${pet.name}`,
        });
        
        // Navigate to pet details page
        navigate(`/pet/${pet.id}`);
      } else {
        toast({
          title: "Invalid QR Code",
          description: "No pet record found for this QR code.",
          variant: "destructive",
        });
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast({
      title: "Camera Error",
      description: "Please check camera permissions and try again.",
      variant: "destructive",
    });
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      setScanning(false);
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-center">Scan Pet QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scanning ? (
          <>
            <div className="relative rounded-lg overflow-hidden aspect-square">
              <QrReader
                delay={delay}
                style={{ width: '100%' }}
                onError={handleError}
                onScan={handleScan}
                constraints={{
                  audio: false,
                  video: { facingMode }
                }}
              />
              <div className="absolute inset-0 border-2 border-vet-blue/50 rounded-lg pointer-events-none"></div>
            </div>
            <div className="flex justify-center space-x-2">
              <Button 
                onClick={() => setScanning(false)}
                variant="outline" 
                className="w-full"
              >
                Cancel
              </Button>
              <Button 
                onClick={toggleCamera}
                className="w-full"
              >
                {facingMode === 'user' ? 'Use Back Camera' : 'Use Front Camera'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {result && (
              <div className="p-4 bg-muted rounded-md w-full">
                <p className="text-sm font-medium">Last Scan Result:</p>
                <p className="text-sm truncate">{result}</p>
              </div>
            )}
            <div className="h-64 w-full flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-lg">
              <div className="text-center px-4">
                <p className="text-muted-foreground mb-2">Ready to scan a pet's QR code</p>
                <Button 
                  onClick={() => setScanning(true)}
                  className="vet-gradient hover:opacity-90 transition-opacity"
                >
                  Start Scanning
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Position the QR code within the camera frame to scan</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRScanner;
