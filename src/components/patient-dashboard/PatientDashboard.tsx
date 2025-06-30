
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Calendar, History, Plus } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import PatientAppointments from './PatientAppointments';
import AppointmentBooking from './AppointmentBooking';

const PatientDashboard: React.FC = () => {
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState('appointments');

  const menuItems = [
    {
      id: 'appointments',
      title: 'Mis Citas',
      icon: Calendar,
      onClick: () => setActiveSection('appointments'),
      isActive: activeSection === 'appointments',
    },
    {
      id: 'booking',
      title: 'Solicitar Cita',
      icon: Plus,
      onClick: () => setActiveSection('booking'),
      isActive: activeSection === 'booking',
    },
    {
      id: 'history',
      title: 'Historial',
      icon: History,
      onClick: () => setActiveSection('history'),
      isActive: activeSection === 'history',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return <PatientAppointments />;
      case 'booking':
        return <AppointmentBooking />;
      case 'history':
        return <PatientAppointments showHistory={true} />;
      default:
        return <PatientAppointments />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <AppSidebar menuItems={menuItems} title="Panel de Paciente" />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header with sidebar trigger */}
          <header className="bg-white shadow-sm border-b border-blue-100 p-3 lg:p-4 xl:p-6 shrink-0">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <SidebarTrigger className="lg:hidden shrink-0 h-9 w-9" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-blue-900 truncate">
                  Bienvenido/a, {session?.name}
                </h1>
                <p className="text-blue-600 mt-1 text-sm lg:text-base hidden sm:block">
                  Panel de paciente - Gestiona tus citas médicas
                </p>
                <p className="text-blue-600 mt-1 text-xs sm:hidden">
                  Panel de paciente
                </p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-3 lg:p-4 xl:p-6 overflow-auto">
            <div className="max-w-full h-full">
              <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PatientDashboard;
