import { Pet } from "../models/types";

// Mock pet data for development and testing
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
    vaccineRecords: [
      {
        id: "vr001",
        date: "2023-05-10",
        vaccineName: "Rabies",
        manufacturer: "VetPharm",
        lotNumber: "RB456789",
        expirationDate: "2025-05-10",
        veterinarian: "Dr. Wilson",
        nextDueDate: "2024-05-10"
      },
      {
        id: "vr002",
        date: "2023-05-10",
        vaccineName: "DHPP",
        manufacturer: "PetVax",
        lotNumber: "DH123456",
        expirationDate: "2024-11-10",
        veterinarian: "Dr. Wilson",
        nextDueDate: "2024-05-10"
      }
    ],
    notes: [
      {
        id: "n001",
        date: "2023-05-10",
        title: "Friendly dog",
        content: "Max is a very friendly dog who loves treats. Always wags his tail during exams.",
        createdBy: "Dr. Wilson",
        isPrivate: false
      },
      {
        id: "n002",
        date: "2023-05-10",
        title: "Owner concerns",
        content: "Owner concerned about slight limping after long walks. Monitor on next visit.",
        createdBy: "Dr. Wilson",
        isPrivate: true
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
    vaccineRecords: [
      {
        id: "vr003",
        date: "2023-04-22",
        vaccineName: "FVRCP",
        manufacturer: "FeliVax",
        lotNumber: "FV789012",
        expirationDate: "2025-04-22",
        veterinarian: "Dr. Wilson",
        nextDueDate: "2024-04-22"
      }
    ],
    notes: [
      {
        id: "n003",
        date: "2023-04-22",
        title: "Sensitive to handling",
        content: "Bella becomes agitated when handled for too long. Keep examinations brief.",
        createdBy: "Dr. Wilson",
        isPrivate: false
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
    vaccineRecords: [
      {
        id: "vr004",
        date: "2023-05-15",
        vaccineName: "Rabies",
        manufacturer: "VetPharm",
        lotNumber: "RB567890",
        expirationDate: "2025-05-15",
        veterinarian: "Dr. Martinez",
        nextDueDate: "2024-05-15"
      }
    ],
    notes: [
      {
        id: "n004",
        date: "2023-05-15",
        title: "Energetic puppy",
        content: "Charlie is very energetic. Owner advised on proper exercise regimen.",
        createdBy: "Dr. Martinez",
        isPrivate: false
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
    vaccineRecords: [
      {
        id: "vr005",
        date: "2023-05-02",
        vaccineName: "FVRCP",
        manufacturer: "FeliVax",
        lotNumber: "FV123789",
        expirationDate: "2025-05-02",
        veterinarian: "Dr. Wilson",
        nextDueDate: "2023-08-02"
      }
    ],
    notes: [
      {
        id: "n005",
        date: "2023-05-02",
        title: "First time visit",
        content: "Luna was calm during her first visit. Owner given kitten care instructions.",
        createdBy: "Dr. Wilson",
        isPrivate: false
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
    vaccineRecords: [
      {
        id: "vr006",
        date: "2023-03-20",
        vaccineName: "Rabies",
        manufacturer: "VetPharm",
        lotNumber: "RB789012",
        expirationDate: "2025-03-20",
        veterinarian: "Dr. Martinez",
        nextDueDate: "2024-03-20"
      }
    ],
    notes: [
      {
        id: "n006",
        date: "2023-03-20",
        title: "Senior care",
        content: "Cooper showing signs of arthritis. Recommended lower impact exercise and weight management.",
        createdBy: "Dr. Martinez",
        isPrivate: false
      }
    ],
    qrCode: "p005"
  }
];
