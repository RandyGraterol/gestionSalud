
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Stethoscope, X, CheckCircle } from 'lucide-react';
import { getAppointments, saveAppointments, getMedicalStaff, getSpecialties, getUsers } from '@/services/localStorage';
import { Appointment, MedicalStaff, Specialty, User as UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PatientAppointmentsProps {
  showHistory?: boolean;
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ showHistory = false }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalStaff, setMedicalStaff] = useState<MedicalStaff[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [patients, setPatients] = useState<UserType[]>([]);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allAppointments = getAppointments();
    const patientUser = getUsers().find(u => u.id === session?.userId);
    const userPatients = getUsers().filter(u => u.role === 'patient');
    
    // Find patient appointments (could be multiple if user has patient role)
    const userAppointments = allAppointments.filter(app => {
      const patient = userPatients.find(p => p.id === app.patientId);
      return patient?.id === session?.userId;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = showHistory 
      ? userAppointments.filter(app => new Date(app.date) < today)
      : userAppointments.filter(app => new Date(app.date) >= today);

    setAppointments(filteredAppointments.sort((a, b) => 
      new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    ));
    setMedicalStaff(getMedicalStaff());
    setSpecialties(getSpecialties());
    setPatients(userPatients);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const allAppointments = getAppointments();
    const updatedAppointments = allAppointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
        : app
    );
    
    saveAppointments(updatedAppointments);
    loadData();
    
    toast({
      title: "Cita cancelada",
      description: "La cita ha sido cancelada correctamente",
    });
  };

  const getStaffName = (staffId: string) => {
    const staff = medicalStaff.find(s => s.id === staffId);
    return staff ? staff.name : 'Doctor no encontrado';
  };

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : 'Especialidad no encontrada';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Programada</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canCancelAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(appointment.date + ' ' + appointment.time);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return appointment.status === 'scheduled' && hoursDiff > 24; // Can cancel if more than 24 hours away
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {showHistory ? 'Historial de Citas' : 'Próximas Citas'}
        </h2>
        <p className="text-blue-600">
          {showHistory 
            ? 'Revisa tu historial de citas médicas pasadas'
            : 'Gestiona tus próximas citas médicas programadas'
          }
        </p>
      </div>

      {appointments.length === 0 ? (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              {showHistory ? 'No hay citas en el historial' : 'No tienes citas programadas'}
            </h3>
            <p className="text-blue-600">
              {showHistory 
                ? 'Aún no tienes citas médicas en tu historial.'
                : 'No tienes citas programadas próximamente. Puedes solicitar una nueva cita.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="bg-white shadow-md border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        {getStaffName(appointment.medicalStaffId)}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-blue-700">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        <span>{getSpecialtyName(appointment.specialtyId)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{appointment.time}</span>
                      </div>
                      
                      {appointment.emailSent && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">Email enviado</span>
                        </div>
                      )}
                    </div>
                    
                    {appointment.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!showHistory && canCancelAppointment(appointment) && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar Cita
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
