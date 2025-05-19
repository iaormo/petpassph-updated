
import { mockPets } from "../data/mockPets";
import { Pet, MedicalRecord } from "../models/types";

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

// Helper function to add a new pet
export const addPet = (newPet: Pet): Pet => {
  mockPets.unshift(newPet); // Add to the beginning of the array
  return newPet;
};
