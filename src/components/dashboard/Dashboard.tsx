
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Stethoscope, Settings, BarChart3, Shield, FileText, Printer } from 'lucide-react';
import ReportsAndPermissions from '@/components/admin/ReportsAndPermissions';

const Dashboard: React.FC = () => {
  const { session, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'reports'>('dashboard');

  const adminActions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar pacientes y personal médico',
      icon: Users,
      color: 'bg-blue-500',
      action: () => console.log('Gestión de usuarios'),
    },
    {
      title: 'Citas Médicas',
      description: 'Ver y gestionar todas las citas',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => console.log('Citas médicas'),
    },
    {
      title: 'Especialidades',
      description: 'Configurar especialidades médicas',
      icon: Stethoscope,
      color: 'bg-purple-500',
      action: () => console.log('Especialidades'),
    },
    {
      title: 'Reportes y Permisos',
      description: 'Crear y gestionar reportes médicos y permisos',
      icon: FileText,
      color: 'bg-red-500',
      action: () => setActiveView('reports'),
    },
    {
      title: 'Estadísticas',
      description: 'Ver reportes y métricas del hospital',
      icon: BarChart3,
      color: 'bg-orange-500',
      action: () => console.log('Estadísticas'),
    },
    {
      title: 'Configuración',
      description: 'Configuración general del sistema',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => console.log('Configuración'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Panel de Administración</h1>
                <p className="text-blue-600">Bienvenido/a, {session?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {activeView === 'reports' && (
                <Button 
                  onClick={() => setActiveView('dashboard')} 
                  variant="outline" 
                  className="text-blue-600"
                >
                  Volver al Dashboard
                </Button>
              )}
              <Button onClick={logout} variant="outline" className="text-blue-600">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Acciones Administrativas</h2>
              <p className="text-blue-600">Gestiona todos los aspectos del sistema hospitalario</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-blue-900">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-600">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Estadísticas Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-900">0</div>
                    <p className="text-sm text-blue-600">Pacientes Registrados</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-900">0</div>
                    <p className="text-sm text-green-600">Personal Médico</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-purple-900">0</div>
                    <p className="text-sm text-purple-600">Citas Hoy</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-orange-900">0</div>
                    <p className="text-sm text-orange-600">Especialidades</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <ReportsAndPermissions />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
