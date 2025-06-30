
export interface MedicalConsultation {
  id: string;
  patientId: string;
  medicalStaffId: string;
  appointmentId?: string;
  date: string;
  time: string;
  chiefComplaint: string; // Motivo de consulta
  currentIllness: string; // Enfermedad actual
  vitalSigns: VitalSigns;
  physicalExamination: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  weight: number;
  height: number;
  oxygenSaturation?: number;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  personalHistory: string;
  familyHistory: string;
  allergies: string;
  currentMedications: string;
  surgicalHistory: string;
  socialHistory: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalExam {
  id: string;
  consultationId: string;
  examType: string;
  examName: string;
  results: string;
  interpretation: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Diagnosis {
  id: string;
  consultationId: string;
  diagnosisType: 'principal' | 'secondary' | 'differential';
  icdCode?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParaclinicalService {
  id: string;
  consultationId: string;
  serviceType: string;
  serviceName: string;
  indication: string;
  urgency: 'routine' | 'urgent' | 'stat';
  status: 'requested' | 'completed' | 'cancelled';
  results?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  consultationId: string;
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions: string;
  treatmentType: 'medication' | 'procedure' | 'therapy' | 'recommendation';
  createdAt: string;
  updatedAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  consultationId: string;
  reportType: 'consultation' | 'discharge' | 'referral' | 'medical_certificate';
  title: string;
  content: string;
  generatedBy: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
