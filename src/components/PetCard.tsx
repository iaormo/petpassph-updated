
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { Pet } from '@/lib/mockData';

interface PetCardProps {
  pet: Pet;
  showQR?: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ pet, showQR = true }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square w-full overflow-hidden">
        <img 
          src={pet.profileImg} 
          alt={`${pet.name} - ${pet.breed}`}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.breed}</p>
          </div>
          {showQR && (
            <div className="bg-white p-1 rounded-md border">
              <QRCodeCanvas 
                value={pet.qrCode} 
                size={64} 
                includeMargin={true}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
              />
            </div>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age:</span>
            <span>{pet.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight:</span>
            <span>{pet.weight} lbs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner:</span>
            <span>{pet.ownerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Visit:</span>
            <span>{new Date(pet.lastVisit).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button asChild className="w-full">
          <Link to={`/pet/${pet.id}`}>View Records</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
