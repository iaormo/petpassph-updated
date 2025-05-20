
// Type definitions for the application

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
  vaccineRecords: VaccineRecord[];
  notes: Note[];
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
  imageUrl?: string; // URL for uploaded images (X-rays, etc.)
}

export interface VaccineRecord {
  id: string;
  date: string;
  vaccineName: string;
  manufacturer: string;
  lotNumber: string;
  expirationDate: string;
  veterinarian: string;
  nextDueDate: string;
}

export interface Note {
  id: string;
  date: string;
  title: string;
  content: string;
  createdBy: string;
  isPrivate: boolean; // If true, only visible to veterinary staff
}

// Mock credentials for demo purposes
export interface Credentials {
  username: string;
  password: string;
  role: "veterinary" | "owner";
  petsOwned?: string[]; // IDs of pets owned by this user (for owner role)
}

// Dashboard statistics interface
export interface DashboardStatistics {
  appointmentsToday: number;
  newPatientsThisWeek: number;
  pendingForms: number;
  totalPets: number;
  recentActivityLog: ActivityLogItem[];
}

export interface ActivityLogItem {
  id: string;
  time: string;
  action: string;
}
