
import { User, Session, Patient, MedicalStaff, Specialty, WorkShift, WorkSchedule, Appointment } from '@/types';

const USERS_KEY = 'medical_system_users';
const SESSION_KEY = 'medical_system_session';

// Obtener todos los usuarios
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Guardar un nuevo usuario
export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Actualizar un usuario existente
export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === updatedUser.id);
  if (userIndex >= 0) {
    users[userIndex] = updatedUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Obtener usuario por username
export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.username === username);
};

// Obtener usuario por email
export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

// Verificar credenciales de login
export const verifyCredentials = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// Guardar sesión
export const saveSession = (session: Session): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

// Obtener sesión actual
export const getSession = (): Session | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

// Limpiar sesión
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Verificar si un usuario existe por email
export const userExistsByEmail = (email: string): boolean => {
  const users = getUsers();
  return users.some(u => u.email === email);
};

// Verificar si un usuario existe por username
export const userExistsByUsername = (username: string): boolean => {
  const users = getUsers();
  return users.some(u => u.username === username);
};

// Generic localStorage functions with event listeners for synchronization
export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch custom event for synchronization
  window.dispatchEvent(new CustomEvent('localStorageChange', { 
    detail: { key, data } 
  }));
};

export const getFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Patients functions
export const getPatients = (): Patient[] => {
  return getFromLocalStorage('patients') || [];
};

export const savePatients = (patients: Patient[]): void => {
  saveToLocalStorage('patients', patients);
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  const existingIndex = patients.findIndex(p => p.id === patient.id);
  if (existingIndex >= 0) {
    patients[existingIndex] = patient;
  } else {
    patients.push(patient);
  }
  savePatients(patients);
};

// Medical Staff functions
export const getMedicalStaff = (): MedicalStaff[] => {
  return getFromLocalStorage('medicalStaff') || [];
};

export const saveMedicalStaff = (staff: MedicalStaff[]): void => {
  saveToLocalStorage('medicalStaff', staff);
};

export const saveMedicalStaffMember = (staffMember: MedicalStaff): void => {
  const staff = getMedicalStaff();
  const existingIndex = staff.findIndex(s => s.id === staffMember.id);
  if (existingIndex >= 0) {
    staff[existingIndex] = staffMember;
  } else {
    staff.push(staffMember);
  }
  saveMedicalStaff(staff);
};

// Specialties functions
export const getSpecialties = (): Specialty[] => {
  return getFromLocalStorage('specialties') || [];
};

export const saveSpecialties = (specialties: Specialty[]): void => {
  saveToLocalStorage('specialties', specialties);
};

export const saveSpecialty = (specialty: Specialty): void => {
  const specialties = getSpecialties();
  const existingIndex = specialties.findIndex(s => s.id === specialty.id);
  if (existingIndex >= 0) {
    specialties[existingIndex] = specialty;
  } else {
    specialties.push(specialty);
  }
  saveSpecialties(specialties);
};

// Work Shifts functions
export const getWorkShifts = (): WorkShift[] => {
  return getFromLocalStorage('workShifts') || [];
};

export const saveWorkShifts = (shifts: WorkShift[]): void => {
  saveToLocalStorage('workShifts', shifts);
};

export const saveWorkShift = (shift: WorkShift): void => {
  const shifts = getWorkShifts();
  const existingIndex = shifts.findIndex(s => s.id === shift.id);
  if (existingIndex >= 0) {
    shifts[existingIndex] = shift;
  } else {
    shifts.push(shift);
  }
  saveWorkShifts(shifts);
};

// Work Schedules functions
export const getWorkSchedules = (): WorkSchedule[] => {
  return getFromLocalStorage('workSchedules') || [];
};

export const saveWorkSchedules = (schedules: WorkSchedule[]): void => {
  saveToLocalStorage('workSchedules', schedules);
};

export const saveWorkSchedule = (schedule: WorkSchedule): void => {
  const schedules = getWorkSchedules();
  const existingIndex = schedules.findIndex(s => s.id === schedule.id);
  if (existingIndex >= 0) {
    schedules[existingIndex] = schedule;
  } else {
    schedules.push(schedule);
  }
  saveWorkSchedules(schedules);
};

// Appointments functions
export const getAppointments = (): Appointment[] => {
  return getFromLocalStorage('appointments') || [];
};

export const saveAppointments = (appointments: Appointment[]): void => {
  saveToLocalStorage('appointments', appointments);
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  const existingIndex = appointments.findIndex(a => a.id === appointment.id);
  if (existingIndex >= 0) {
    appointments[existingIndex] = appointment;
  } else {
    appointments.push(appointment);
  }
  saveAppointments(appointments);
};

// Medical Records functions
export interface MedicalRecord {
  id: string;
  patientId: string;
  medicalStaffId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const getMedicalRecords = (): MedicalRecord[] => {
  return getFromLocalStorage('medicalRecords') || [];
};

export const saveMedicalRecords = (records: MedicalRecord[]): void => {
  saveToLocalStorage('medicalRecords', records);
};

export const saveMedicalRecord = (record: MedicalRecord): void => {
  const records = getMedicalRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  saveMedicalRecords(records);
};

// Permissions functions
export interface Permission {
  id: string;
  patientId: string;
  medicalStaffId: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const getPermissions = (): Permission[] => {
  return getFromLocalStorage('permissions') || [];
};

export const savePermissions = (permissions: Permission[]): void => {
  saveToLocalStorage('permissions', permissions);
};

export const savePermission = (permission: Permission): void => {
  const permissions = getPermissions();
  const existingIndex = permissions.findIndex(p => p.id === permission.id);
  if (existingIndex >= 0) {
    permissions[existingIndex] = permission;
  } else {
    permissions.push(permission);
  }
  savePermissions(permissions);
};
