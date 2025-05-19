
export interface Pet {
  id: string;
  name: string;
  species: "Dog" | "Cat" | "Bird" | "Other";
  breed: string;
  age: number;
  weight: number;
  ownerName: string;
  ownerContact: string;
  lastVisit: string;
  medicalRecords: MedicalRecord[];
  qrCode: string;
  profileImg: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  description: string;
  treatment: string;
  medication: string;
  veterinarian: string;
  followUp?: string;
}

export const mockPets: Pet[] = [
  {
    id: "p001",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: 5,
    weight: 70,
    ownerName: "John Smith",
    ownerContact: "(555) 123-4567",
    lastVisit: "2023-05-10",
    profileImg: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=200&auto=format&fit=crop",
    medicalRecords: [
      {
        id: "mr001",
        date: "2023-05-10",
        description: "Annual checkup",
        treatment: "Vaccines updated",
        medication: "Heartworm preventative prescribed",
        veterinarian: "Dr. Wilson",
        followUp: "Next year"
      },
      {
        id: "mr002",
        date: "2022-11-15",
        description: "Ear infection",
        treatment: "Cleaned and medication applied",
        medication: "Antibiotics for 10 days",
        veterinarian: "Dr. Martinez"
      }
    ],
    qrCode: "p001"
  },
  {
    id: "p002",
    name: "Bella",
    species: "Cat",
    breed: "Siamese",
    age: 3,
    weight: 10,
    ownerName: "Sarah Johnson",
    ownerContact: "(555) 234-5678",
    lastVisit: "2023-04-22",
    profileImg: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop",
    medicalRecords: [
      {
        id: "mr003",
        date: "2023-04-22",
        description: "Dental cleaning",
        treatment: "Full dental cleaning and examination",
        medication: "None",
        veterinarian: "Dr. Wilson"
      }
    ],
    qrCode: "p002"
  },
  {
    id: "p003",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: 2,
    weight: 25,
    ownerName: "Michael Brown",
    ownerContact: "(555) 345-6789",
    lastVisit: "2023-05-15",
    profileImg: "https://images.unsplash.com/photo-1561495376-dc9c7c5b8726?q=80&w=200&auto=format&fit=crop",
    medicalRecords: [
      {
        id: "mr004",
        date: "2023-05-15",
        description: "Limping on right front paw",
        treatment: "X-ray taken, minor sprain diagnosed",
        medication: "Anti-inflammatory for 7 days",
        veterinarian: "Dr. Martinez",
        followUp: "1 week if not improved"
      }
    ],
    qrCode: "p003"
  },
  {
    id: "p004",
    name: "Luna",
    species: "Cat",
    breed: "Maine Coon",
    age: 1,
    weight: 12,
    ownerName: "Emily Davis",
    ownerContact: "(555) 456-7890",
    lastVisit: "2023-05-02",
    profileImg: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=200&auto=format&fit=crop",
    medicalRecords: [
      {
        id: "mr005",
        date: "2023-05-02",
        description: "Kitten checkup",
        treatment: "Vaccines given",
        medication: "Deworming treatment",
        veterinarian: "Dr. Wilson",
        followUp: "3 months"
      }
    ],
    qrCode: "p004"
  },
  {
    id: "p005",
    name: "Cooper",
    species: "Dog",
    breed: "Labrador Retriever",
    age: 7,
    weight: 85,
    ownerName: "David Wilson",
    ownerContact: "(555) 567-8901",
    lastVisit: "2023-03-20",
    profileImg: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=200&auto=format&fit=crop",
    medicalRecords: [
      {
        id: "mr006",
        date: "2023-03-20",
        description: "Senior wellness check",
        treatment: "Blood work, joint examination",
        medication: "Joint supplement prescribed",
        veterinarian: "Dr. Martinez"
      }
    ],
    qrCode: "p005"
  }
];

// Mock credentials for demo purposes
export const mockCredentials = {
  username: "demo@vetclinic.com",
  password: "password123"
};

// Dashboard statistics
export const dashboardStats = {
  appointmentsToday: 12,
  newPatientsThisWeek: 5,
  pendingForms: 3,
  totalPets: 158,
  recentActivityLog: [
    { id: "a1", time: "9:30 AM", action: "Dr. Wilson checked in patient Max" },
    { id: "a2", time: "10:15 AM", action: "New patient registration: Luna (Maine Coon)" },
    { id: "a3", time: "11:00 AM", action: "Prescription refill approved for Cooper" },
    { id: "a4", time: "1:45 PM", action: "Bella completed dental cleaning procedure" }
  ]
};

// Helper function to find a pet by ID
export const getPetById = (id: string) => {
  return mockPets.find(pet => pet.id === id);
};

// Helper function to find a pet by QR code
export const getPetByQRCode = (qrCode: string) => {
  return mockPets.find(pet => pet.qrCode === qrCode);
};
