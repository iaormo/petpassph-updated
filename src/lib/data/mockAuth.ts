
import { Credentials } from "../models/types";

// Mock credentials for demo purposes
export const mockCredentials: Credentials[] = [
  {
    username: "demo@vetclinic.com",
    password: "password123",
    role: "veterinary"
  },
  {
    username: "john@example.com",
    password: "owner123",
    role: "owner",
    petsOwned: ["p001"] // John owns Max (p001)
  },
  {
    username: "sarah@example.com",
    password: "owner123",
    role: "owner",
    petsOwned: ["p002"] // Sarah owns Bella (p002)
  }
];
