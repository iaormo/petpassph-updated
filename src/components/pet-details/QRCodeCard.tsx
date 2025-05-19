
import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QRCodeCardProps {
  qrCode: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCode }) => {
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
      <Button variant="outline" className="w-full">Print QR Code</Button>
    </Card>
  );
};

export default QRCodeCard;
