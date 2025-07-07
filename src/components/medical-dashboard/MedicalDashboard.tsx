
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Calendar, FileText, Users, ClipboardList, Activity } from 'lucide-react';

const MedicalDashboard: React.FC = () => {
  const { session, logout } = useAuth();

  const medicalActions = [
    {
      title: 'Citas del Día',
      description: 'Ver agenda de citas programadas',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Crear Consulta',
      description: 'Registrar nueva consulta médica',
      icon: ClipboardList,
      color: 'bg-green-500',
    },
    {
      title: 'Historial Médico',
      description: 'Consultar historiales de pacientes',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Mis Pacientes',
      description: 'Gestionar pacientes asignados',
      icon: Users,
      color: 'bg-orange-500',
    },
    {
      title: 'Exámenes',
      description: 'Revisar resultados de exámenes',
      icon: Activity,
      color: 'bg-red-500',
    },
    {
      title: 'Reportes',
      description: 'Generar reportes médicos',
      icon: FileText,
      color: 'bg-indigo-500',
    },
  ];

  const todayAppointments = [
    {
      time: '09:00',
      patient: 'María González',
      type: 'Consulta General',
      status: 'Pendiente'
    },
    {
      time: '10:30',
      patient: 'Carlos Rodríguez',
      type: 'Control',
      status: 'En Curso'
    },
    {
      time: '11:00',
      patient: 'Ana Martínez',
      type: 'Primera Vez',
      status: 'Pendiente'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-purple-900">Portal Médico</h1>
                <p className="text-purple-600">Bienvenido/a, {session?.name}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="text-purple-600">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-2">Herramientas Médicas</h2>
              <p className="text-purple-600">Gestiona tu práctica médica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-sm text-purple-900">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs text-purple-600">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-900 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Agenda de Hoy</span>
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayAppointments.map((appointment, index) => (
                  <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-medium text-purple-900">
                        {appointment.time}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'En Curso'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm text-purple-800 font-medium">{appointment.patient}</div>
                    <div className="text-xs text-purple-600">{appointment.type}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-purple-900">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-600">Pacientes Hoy</span>
                  <span className="text-sm font-medium text-purple-900">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-600">Consultas Mes</span>
                  <span className="text-sm font-medium text-purple-900">145</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-600">Pacientes Activos</span>
                  <span className="text-sm font-medium text-purple-900">89</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;
