
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Users, Calendar, Settings, Clock, CalendarDays, Stethoscope, FileText, ClipboardList, TestTube, History, Download, Building, TrendingUp } from 'lucide-react';
import AppSidebar from '@/components/layout/AppSidebar';
import PatientList from '@/components/patients/PatientList';
import StaffList from '@/components/staff/StaffList';
import AppointmentList from '@/components/appointments/AppointmentList';
import SpecialtyList from '@/components/specialties/SpecialtyList';
import WorkShiftList from '@/components/shifts/WorkShiftList';
import WorkScheduleList from '@/components/schedules/WorkScheduleList';
import CreateConsultation from '@/components/medical-dashboard/CreateConsultation';
import MedicalHistory from '@/components/medical-dashboard/MedicalHistory';
import MedicalExams from '@/components/medical-dashboard/MedicalExams';
import MedicalPermissions from '@/components/medical-dashboard/MedicalPermissions';
import MedicalAppointments from '@/components/medical-dashboard/MedicalAppointments';
import MedicalRecordDownload from '@/components/medical-dashboard/MedicalRecordDownload';
import HospitalSettings from '@/components/settings/HospitalSettings';
import HospitalStatistics from '@/components/statistics/HospitalStatistics';

const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState('patients');

  // Only admin should see the full admin dashboard
  if (session?.role !== 'admin') {
    return null;
  }

  const menuItems = [
    // Gestión General
    {
      id: 'patients',
      title: 'Pacientes',
      icon: Users,
      onClick: () => setActiveSection('patients'),
      isActive: activeSection === 'patients',
    },
    {
      id: 'staff',
      title: 'Personal Médico',
      icon: Stethoscope,
      onClick: () => setActiveSection('staff'),
      isActive: activeSection === 'staff',
    },
    {
      id: 'appointments',
      title: 'Citas',
      icon: Calendar,
      onClick: () => setActiveSection('appointments'),
      isActive: activeSection === 'appointments',
    },
    {
      id: 'specialties',
      title: 'Especialidades',
      icon: Settings,
      onClick: () => setActiveSection('specialties'),
      isActive: activeSection === 'specialties',
    },
    {
      id: 'shifts',
      title: 'Turnos de Trabajo',
      icon: Clock,
      onClick: () => setActiveSection('shifts'),
      isActive: activeSection === 'shifts',
    },
    {
      id: 'schedules',
      title: 'Horarios',
      icon: CalendarDays,
      onClick: () => setActiveSection('schedules'),
      isActive: activeSection === 'schedules',
    },
    // Módulos Médicos
    {
      id: 'consultations',
      title: 'Crear Consulta',
      icon: FileText,
      onClick: () => setActiveSection('consultations'),
      isActive: activeSection === 'consultations',
    },
    {
      id: 'medical-history',
      title: 'Historial Médico',
      icon: History,
      onClick: () => setActiveSection('medical-history'),
      isActive: activeSection === 'medical-history',
    },
    {
      id: 'medical-exams',
      title: 'Exámenes Médicos',
      icon: TestTube,
      onClick: () => setActiveSection('medical-exams'),
      isActive: activeSection === 'medical-exams',
    },
    {
      id: 'medical-permissions',
      title: 'Permisos y Reposos',
      icon: ClipboardList,
      onClick: () => setActiveSection('medical-permissions'),
      isActive: activeSection === 'medical-permissions',
    },
    {
      id: 'medical-appointments',
      title: 'Citas Médicas',
      icon: Stethoscope,
      onClick: () => setActiveSection('medical-appointments'),
      isActive: activeSection === 'medical-appointments',
    },
    {
      id: 'download-records',
      title: 'Descargar Historias',
      icon: Download,
      onClick: () => setActiveSection('download-records'),
      isActive: activeSection === 'download-records',
    },
    // Configuración y Estadísticas
    {
      id: 'statistics',
      title: 'Estadísticas',
      icon: TrendingUp,
      onClick: () => setActiveSection('statistics'),
      isActive: activeSection === 'statistics',
    },
    {
      id: 'hospital-settings',
      title: 'Configuración',
      icon: Building,
      onClick: () => setActiveSection('hospital-settings'),
      isActive: activeSection === 'hospital-settings',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      // Módulos de Gestión General
      case 'patients':
        return <PatientList />;
      case 'staff':
        return <StaffList />;
      case 'appointments':
        return <AppointmentList />;
      case 'specialties':
        return <SpecialtyList />;
      case 'shifts':
        return <WorkShiftList />;
      case 'schedules':
        return <WorkScheduleList />;
      // Módulos Médicos
      case 'consultations':
        return <CreateConsultation />;
      case 'medical-history':
        return <MedicalHistory />;
      case 'medical-exams':
        return <MedicalExams />;
      case 'medical-permissions':
        return <MedicalPermissions />;
      case 'medical-appointments':
        return <MedicalAppointments />;
      case 'download-records':
        return <MedicalRecordDownload />;
      // Configuración y Estadísticas
      case 'statistics':
        return <HospitalStatistics />;
      case 'hospital-settings':
        return <HospitalSettings />;
      default:
        return <PatientList />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <AppSidebar menuItems={menuItems} title="Panel de Administración" />
        
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
                  Sistema de gestión hospitalaria - Panel de administración completo
                </p>
                <p className="text-blue-600 mt-1 text-xs sm:hidden">
                  Panel de administración
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

export default Dashboard;
