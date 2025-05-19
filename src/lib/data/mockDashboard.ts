
import { DashboardStatistics } from "../models/types";

// Dashboard statistics
export const dashboardStats: DashboardStatistics = {
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
