
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, User, Clock, Phone } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { session, logout } = useAuth();

  const patientActions = [
    {
      title: 'Mis Citas',
      description: 'Ver y gestionar mis citas médicas',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Solicitar Cita',
      description: 'Agendar una nueva cita médica',
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'Mi Historial',
      description: 'Ver mi historial médico',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Mi Perfil',
      description: 'Actualizar información personal',
      icon: User,
      color: 'bg-orange-500',
    },
  ];

  const upcomingAppointments = [
    {
      date: '15 Jul 2024',
      time: '10:00 AM',
      doctor: 'Dr. Juan Pérez',
      specialty: 'Cardiología',
      status: 'Confirmada'
    },
    {
      date: '22 Jul 2024',
      time: '2:30 PM',
      doctor: 'Dra. Ana García',
      specialty: 'Neurología',
      status: 'Pendiente'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-green-900">Portal del Paciente</h1>
                <p className="text-green-600">Bienvenido/a, {session?.name}</p>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="text-green-600">
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
              <h2 className="text-xl font-semibold text-green-900 mb-2">Acciones Disponibles</h2>
              <p className="text-green-600">Gestiona tu atención médica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patientActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-green-900">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-green-600">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-900 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Próximas Citas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium text-green-900">
                        {appointment.date} - {appointment.time}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'Confirmada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="text-sm text-green-700">{appointment.doctor}</div>
                    <div className="text-xs text-green-600">{appointment.specialty}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-green-900 flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contacto de Emergencia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-green-900 font-medium">Hospital Central</div>
                  <div className="text-green-700">📞 (01) 234-5678</div>
                  <div className="text-green-700">🚨 Emergencias: 911</div>
                  <div className="text-green-700">📧 info@hospital.com</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
