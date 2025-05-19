
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

// Mock credentials for demo purposes
export interface Credentials {
  username: string;
  password: string;
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
