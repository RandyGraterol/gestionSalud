
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';
import PatientDashboard from '@/components/patient-dashboard/PatientDashboard';

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
      // Los usuarios de medical_staff ahora van al dashboard de admin
      return <Dashboard />;
    default:
      return <LoginForm />;
  }
};

export default Index;
