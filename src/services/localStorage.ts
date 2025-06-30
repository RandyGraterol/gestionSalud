import { User, Patient, MedicalStaff, Specialty, WorkShift, WorkSchedule, Appointment, Session } from '@/types';

const STORAGE_KEYS = {
  USERS: 'medical_system_users',
  PATIENTS: 'medical_system_patients',
  MEDICAL_STAFF: 'medical_system_medical_staff',
  SPECIALTIES: 'medical_system_specialties',
  WORK_SHIFTS: 'medical_system_work_shifts',
  WORK_SCHEDULES: 'medical_system_work_schedules',
  APPOINTMENTS: 'medical_system_appointments',
  SESSION: 'medical_system_session',
};

// Generic localStorage functions
export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key: string): any => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Initialize default data
const initializeDefaultData = () => {
  // Default users
  const defaultUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Dr. María González',
      email: 'admin@hospital.com',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'cliente',
      password: 'cliente123',
      role: 'patient',
      name: 'Juan Carlos Pérez',
      email: 'cliente@email.com',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'medico',
      password: 'medico123',
      role: 'medical_staff',
      name: 'Dr. Ana Rodríguez',
      email: 'medico@hospital.com',
      createdAt: new Date().toISOString(),
    },
  ];

  // Default specialties
  const defaultSpecialties: Specialty[] = [
    {
      id: '1',
      name: 'Cardiología',
      description: 'Especialidad médica que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Pediatría',
      description: 'Especialidad médica que estudia al niño y sus enfermedades',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Dermatología',
      description: 'Especialidad médica que se encarga del estudio de la piel y sus enfermedades',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Default patients
  const defaultPatients: Patient[] = [
    {
      id: '1',
      identificationNumber: '12345678A',
      name: 'Juan Carlos Pérez',
      email: 'cliente@email.com',
      phone: '+34 666 123 456',
      dateOfBirth: '1985-03-15',
      address: 'Calle Mayor 123, Madrid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Default medical staff
  const defaultMedicalStaff: MedicalStaff[] = [
    {
      id: '1',
      identificationNumber: '87654321B',
      name: 'Dr. Ana Rodríguez',
      email: 'medico@hospital.com',
      phone: '+34 666 789 012',
      specialtyId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Default work shifts
  const defaultWorkShifts: WorkShift[] = [
    {
      id: '1',
      name: 'Turno Mañana',
      startTime: '08:00',
      endTime: '15:00',
      description: 'Turno de mañana para consultas regulares',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Turno Tarde',
      startTime: '15:00',
      endTime: '22:00',
      description: 'Turno de tarde para consultas y urgencias',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Initialize data if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SPECIALTIES)) {
    localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(defaultSpecialties));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_STAFF)) {
    localStorage.setItem(STORAGE_KEYS.MEDICAL_STAFF, JSON.stringify(defaultMedicalStaff));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORK_SHIFTS)) {
    localStorage.setItem(STORAGE_KEYS.WORK_SHIFTS, JSON.stringify(defaultWorkShifts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORK_SCHEDULES)) {
    localStorage.setItem(STORAGE_KEYS.WORK_SCHEDULES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
  }
};

// Initialize default data on load
initializeDefaultData();

// Users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Patients
export const getPatients = (): Patient[] => {
  const patients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return patients ? JSON.parse(patients) : [];
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  const existingIndex = patients.findIndex(p => p.id === patient.id);
  
  if (existingIndex >= 0) {
    patients[existingIndex] = patient;
  } else {
    patients.push(patient);
  }
  
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const savePatients = (patients: Patient[]): void => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const deletePatient = (patientId: string): void => {
  const patients = getPatients().filter(p => p.id !== patientId);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

// Medical Staff
export const getMedicalStaff = (): MedicalStaff[] => {
  const staff = localStorage.getItem(STORAGE_KEYS.MEDICAL_STAFF);
  return staff ? JSON.parse(staff) : [];
};

export const saveMedicalStaff = (staff: MedicalStaff[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEDICAL_STAFF, JSON.stringify(staff));
};

export const deleteMedicalStaff = (staffId: string): void => {
  const staff = getMedicalStaff().filter(s => s.id !== staffId);
  localStorage.setItem(STORAGE_KEYS.MEDICAL_STAFF, JSON.stringify(staff));
};

// Specialties
export const getSpecialties = (): Specialty[] => {
  const specialties = localStorage.getItem(STORAGE_KEYS.SPECIALTIES);
  return specialties ? JSON.parse(specialties) : [];
};

export const saveSpecialty = (specialty: Specialty): void => {
  const specialties = getSpecialties();
  const existingIndex = specialties.findIndex(s => s.id === specialty.id);
  
  if (existingIndex >= 0) {
    specialties[existingIndex] = specialty;
  } else {
    specialties.push(specialty);
  }
  
  localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties));
};

export const saveSpecialties = (specialties: Specialty[]): void => {
  localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties));
};

export const deleteSpecialty = (specialtyId: string): void => {
  const specialties = getSpecialties().filter(s => s.id !== specialtyId);
  localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties));
};

// Work Shifts
export const getWorkShifts = (): WorkShift[] => {
  const shifts = localStorage.getItem(STORAGE_KEYS.WORK_SHIFTS);
  return shifts ? JSON.parse(shifts) : [];
};

export const saveWorkShift = (shift: WorkShift): void => {
  const shifts = getWorkShifts();
  const existingIndex = shifts.findIndex(s => s.id === shift.id);
  
  if (existingIndex >= 0) {
    shifts[existingIndex] = shift;
  } else {
    shifts.push(shift);
  }
  
  localStorage.setItem(STORAGE_KEYS.WORK_SHIFTS, JSON.stringify(shifts));
};

export const saveWorkShifts = (shifts: WorkShift[]): void => {
  localStorage.setItem(STORAGE_KEYS.WORK_SHIFTS, JSON.stringify(shifts));
};

export const deleteWorkShift = (shiftId: string): void => {
  const shifts = getWorkShifts().filter(s => s.id !== shiftId);
  localStorage.setItem(STORAGE_KEYS.WORK_SHIFTS, JSON.stringify(shifts));
};

// Work Schedules
export const getWorkSchedules = (): WorkSchedule[] => {
  const schedules = localStorage.getItem(STORAGE_KEYS.WORK_SCHEDULES);
  return schedules ? JSON.parse(schedules) : [];
};

export const saveWorkSchedule = (schedule: WorkSchedule): void => {
  const schedules = getWorkSchedules();
  const existingIndex = schedules.findIndex(s => s.id === schedule.id);
  
  if (existingIndex >= 0) {
    schedules[existingIndex] = schedule;
  } else {
    schedules.push(schedule);
  }
  
  localStorage.setItem(STORAGE_KEYS.WORK_SCHEDULES, JSON.stringify(schedules));
};

export const saveWorkSchedules = (schedules: WorkSchedule[]): void => {
  localStorage.setItem(STORAGE_KEYS.WORK_SCHEDULES, JSON.stringify(schedules));
};

export const deleteWorkSchedule = (scheduleId: string): void => {
  const schedules = getWorkSchedules().filter(s => s.id !== scheduleId);
  localStorage.setItem(STORAGE_KEYS.WORK_SCHEDULES, JSON.stringify(schedules));
};

// Appointments
export const getAppointments = (): Appointment[] => {
  const appointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return appointments ? JSON.parse(appointments) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  const existingIndex = appointments.findIndex(a => a.id === appointment.id);
  
  if (existingIndex >= 0) {
    appointments[existingIndex] = appointment;
  } else {
    appointments.push(appointment);
  }
  
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const saveAppointments = (appointments: Appointment[]): void => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const deleteAppointment = (appointmentId: string): void => {
  const appointments = getAppointments().filter(a => a.id !== appointmentId);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

// Session management
export const getSession = (): Session | null => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
};

export const saveSession = (session: Session): void => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Utility functions
export const checkAppointmentExists = (date: string, time: string, medicalStaffId: string): boolean => {
  const appointments = getAppointments();
  return appointments.some(appointment => 
    appointment.date === date && 
    appointment.time === time && 
    appointment.medicalStaffId === medicalStaffId &&
    appointment.status !== 'cancelled'
  );
};

export const sendEmailNotification = (patientEmail: string, appointmentDetails: any): boolean => {
  // Simulate email sending
  console.log(`Sending email to ${patientEmail}:`, appointmentDetails);
  return true;
};
