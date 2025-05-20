
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeCardProps {
  qrCode: string;
  petName: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode, petName }) => {
  
  const printQRCode = () => {
    // Create a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your pop-up blocker settings.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate QR code as data URL
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      printWindow.close();
      toast({
        title: "Error",
        description: "Could not find QR code canvas element.",
        variant: "destructive"
      });
      return;
    }
    
    const dataUrl = canvas.toDataURL('image/png');
    
    // Write content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code for ${petName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              margin: 0 auto;
              max-width: 500px;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .qr-image {
              width: 300px;
              height: 300px;
            }
            .pet-info {
              margin-top: 20px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Pet QR Code</h2>
            <img src="${dataUrl}" class="qr-image" alt="QR Code" />
            <div class="pet-info">
              <p><strong>Pet Name:</strong> ${petName}</p>
              <p><strong>ID:</strong> ${qrCode}</p>
              <p>Scan this code to access pet information</p>
            </div>
          </div>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print QR Code
            </button>
          </div>
        </body>
      </html>
    `);
    
    // Finalize the document
    printWindow.document.close();
    
    toast({
      title: "QR Code Ready",
      description: "A new window has opened with the QR code. Use the print button to print or save as PDF.",
    });
  };

  return (
    <Card className="flex flex-col items-center justify-center p-6">
      <div className="mb-4">
        <QRCodeCanvas 
          value={qrCode} 
          size={150} 
          includeMargin={true}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
        />
      </div>
      <p className="text-sm text-center text-muted-foreground mb-2">
        Pet ID: {qrCode}
      </p>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={printQRCode}
      >
        <Printer className="mr-2 h-4 w-4" />
        Print QR Code
      </Button>
    </Card>
  );
};

export default QRCodeCard;
