
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Calendar, 
  History, 
  Plus, 
  FileText, 
  TestTube, 
  Stethoscope, 
  Pill, 
  ClipboardList,
  FileBarChart 
} from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import MedicalAppointments from './MedicalAppointments';
import CreateConsultation from './CreateConsultation';
import MedicalHistoryComponent from './MedicalHistory';
import MedicalExams from './MedicalExams';

const MedicalDashboard: React.FC = () => {
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState('appointments');

  const menuItems = [
    {
      id: 'appointments',
      title: 'Citas de Hoy',
      icon: Calendar,
      onClick: () => setActiveSection('appointments'),
      isActive: activeSection === 'appointments',
    },
    {
      id: 'create-consultation',
      title: 'Nueva Consulta',
      icon: Plus,
      onClick: () => setActiveSection('create-consultation'),
      isActive: activeSection === 'create-consultation',
    },
    {
      id: 'medical-history',
      title: 'Antecedentes',
      icon: FileText,
      onClick: () => setActiveSection('medical-history'),
      isActive: activeSection === 'medical-history',
    },
    {
      id: 'exams',
      title: 'Exámenes',
      icon: TestTube,
      onClick: () => setActiveSection('exams'),
      isActive: activeSection === 'exams',
    },
    {
      id: 'diagnosis',
      title: 'Diagnósticos',
      icon: Stethoscope,
      onClick: () => setActiveSection('diagnosis'),
      isActive: activeSection === 'diagnosis',
    },
    {
      id: 'paraclinical',
      title: 'Servicios Paraclínicos',
      icon: ClipboardList,
      onClick: () => setActiveSection('paraclinical'),
      isActive: activeSection === 'paraclinical',
    },
    {
      id: 'treatment',
      title: 'Tratamientos',
      icon: Pill,
      onClick: () => setActiveSection('treatment'),
      isActive: activeSection === 'treatment',
    },
    {
      id: 'reports',
      title: 'Reportes',
      icon: FileBarChart,
      onClick: () => setActiveSection('reports'),
      isActive: activeSection === 'reports',
    },
    {
      id: 'history',
      title: 'Historial de Citas',
      icon: History,
      onClick: () => setActiveSection('history'),
      isActive: activeSection === 'history',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return <MedicalAppointments />;
      case 'create-consultation':
        return <CreateConsultation />;
      case 'medical-history':
        return <MedicalHistoryComponent />;
      case 'exams':
        return <MedicalExams />;
      case 'diagnosis':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Diagnósticos</h2>
            <p className="text-blue-600">Sección en desarrollo - Gestión de diagnósticos médicos</p>
          </div>
        );
      case 'paraclinical':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Servicios Paraclínicos</h2>
            <p className="text-blue-600">Sección en desarrollo - Gestión de servicios paraclínicos</p>
          </div>
        );
      case 'treatment':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Tratamientos</h2>
            <p className="text-blue-600">Sección en desarrollo - Gestión de tratamientos médicos</p>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Reportes de Historia Clínica</h2>
            <p className="text-blue-600">Sección en desarrollo - Generación de reportes médicos</p>
          </div>
        );
      case 'history':
        return <MedicalAppointments showHistory={true} />;
      default:
        return <MedicalAppointments />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <AppSidebar menuItems={menuItems} title="Panel Médico" />
        
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
                  Panel médico - Gestiona tus citas y pacientes
                </p>
                <p className="text-blue-600 mt-1 text-xs sm:hidden">
                  Panel médico
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

export default MedicalDashboard;
