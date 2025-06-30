
export type UserRole = 'admin' | 'patient' | 'medical_staff';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  identificationNumber: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalStaff {
  id: string;
  identificationNumber: string;
  name: string;
  email: string;
  phone: string;
  specialtyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkSchedule {
  id: string;
  medicalStaffId: string;
  workShiftId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  medicalStaffId: string;
  specialtyId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  emailSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

// Re-export medical types
export * from './medical';
