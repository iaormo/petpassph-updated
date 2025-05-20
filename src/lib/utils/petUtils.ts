
import { mockPets } from "../data/mockPets";
import { Pet, MedicalRecord, VaccineRecord, Note } from "../models/types";

// Helper function to find a pet by ID
export const getPetById = (id: string): Pet | undefined => {
  return mockPets.find(pet => pet.id === id);
};

// Helper function to find a pet by QR code
export const getPetByQRCode = (qrCode: string): Pet | undefined => {
  return mockPets.find(pet => pet.qrCode === qrCode);
};

// Helper function to update a pet
export const updatePet = (updatedPet: Pet): boolean => {
  const index = mockPets.findIndex(pet => pet.id === updatedPet.id);
  if (index !== -1) {
    mockPets[index] = updatedPet;
    return true;
  }
  return false;
};

// Helper function to add a medical record to a pet
export const addMedicalRecord = (petId: string, record: MedicalRecord): boolean => {
  const pet = getPetById(petId);
  if (pet) {
    pet.medicalRecords.unshift(record); // Add to the beginning of the array
    return true;
  }
  return false;
};

// Helper function to add a vaccine record to a pet
export const addVaccineRecord = (petId: string, record: VaccineRecord): boolean => {
  const pet = getPetById(petId);
  if (pet) {
    pet.vaccineRecords.unshift(record); // Add to the beginning of the array
    return true;
  }
  return false;
};

// Helper function to add a note to a pet
export const addNote = (petId: string, note: Note): boolean => {
  const pet = getPetById(petId);
  if (pet) {
    pet.notes.unshift(note); // Add to the beginning of the array
    return true;
  }
  return false;
};

// Helper function to add a new pet
export const addPet = (newPet: Pet): Pet => {
  // Generate a new ID if one is not provided
  if (!newPet.id) {
    newPet.id = `p${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
  }
  
  // Generate a QR code if one is not provided
  if (!newPet.qrCode) {
    newPet.qrCode = newPet.id;
  }

  // Initialize empty arrays for records if not provided
  if (!newPet.medicalRecords) newPet.medicalRecords = [];
  if (!newPet.vaccineRecords) newPet.vaccineRecords = [];
  if (!newPet.notes) newPet.notes = [];
  
  // Add the pet to the mockPets array
  mockPets.unshift(newPet); // Add to the beginning of the array
  return newPet;
};

// Helper function to generate a unique QR code
export const generateQRCode = (): string => {
  return `p${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
};

// Helper function to get pets by owner
export const getPetsByOwner = (ownerIds: string[]): Pet[] => {
  return mockPets.filter(pet => ownerIds.includes(pet.id));
};
