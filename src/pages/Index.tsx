
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';
import PatientDashboard from '@/components/patient-dashboard/PatientDashboard';
import MedicalDashboard from '@/components/medical-dashboard/MedicalDashboard';

const Index: React.FC = () => {
  const { isAuthenticated, session } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Route to appropriate dashboard based on user role
  switch (session?.role) {
    case 'admin':
      return <Dashboard />;
    case 'patient':
      return <PatientDashboard />;
    case 'medical_staff':
      return <MedicalDashboard />;
    default:
      return <LoginForm />;
  }
};

export default Index;
