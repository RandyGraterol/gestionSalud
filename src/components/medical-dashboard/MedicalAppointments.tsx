
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Stethoscope, CheckCircle, FileText } from 'lucide-react';
import { getAppointments, saveAppointments, getUsers, getSpecialties, getMedicalStaff } from '@/services/localStorage';
import { Appointment, User as UserType, Specialty } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MedicalAppointmentsProps {
  showHistory?: boolean;
}

const MedicalAppointments: React.FC<MedicalAppointmentsProps> = ({ showHistory = false }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<UserType[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allAppointments = getAppointments();
    const medicalStaff = getMedicalStaff();
    
    // Find the medical staff record for this user
    const staffMember = medicalStaff.find(staff => {
      // Assuming medical staff are linked by user ID or some other identifier
      // For now, we'll use name matching as a simple approach
      return staff.name === session?.name;
    });

    if (!staffMember) {
      setAppointments([]);
      return;
    }

    // Filter appointments for this medical staff member
    const staffAppointments = allAppointments.filter(app => 
      app.medicalStaffId === staffMember.id
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = showHistory 
      ? staffAppointments.filter(app => new Date(app.date) < today)
      : staffAppointments.filter(app => new Date(app.date) >= today);

    setAppointments(filteredAppointments.sort((a, b) => 
      new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    ));
    
    setPatients(getUsers().filter(u => u.role === 'patient'));
    setSpecialties(getSpecialties());
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    const allAppointments = getAppointments();
    const updatedAppointments = allAppointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: 'completed' as const, updatedAt: new Date().toISOString() }
        : app
    );
    
    saveAppointments(updatedAppointments);
    loadData();
    
    toast({
      title: "Cita completada",
      description: "La cita ha sido marcada como completada",
    });
  };

  const handleAddNotes = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setIsNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedAppointment) return;

    const allAppointments = getAppointments();
    const updatedAppointments = allAppointments.map(app => 
      app.id === selectedAppointment.id 
        ? { ...app, notes, updatedAt: new Date().toISOString() }
        : app
    );
    
    saveAppointments(updatedAppointments);
    loadData();
    setIsNotesDialogOpen(false);
    setSelectedAppointment(null);
    setNotes('');
    
    toast({
      title: "Notas guardadas",
      description: "Las notas de la cita han sido actualizadas",
    });
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente no encontrado';
  };

  const getPatientEmail = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.email || '';
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {showHistory ? 'Historial de Citas' : 'Citas Programadas'}
        </h2>
        <p className="text-blue-600">
          {showHistory 
            ? 'Revisa tu historial de citas médicas pasadas'
            : 'Gestiona tus citas médicas programadas'
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
                : 'No tienes citas programadas próximamente.'
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
                        {getPatientName(appointment.patientId)}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-blue-700">
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
                    </div>

                    <div className="text-sm text-blue-600">
                      <strong>Email:</strong> {getPatientEmail(appointment.patientId)}
                    </div>
                    
                    {appointment.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!showHistory && appointment.status === 'scheduled' && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleAddNotes(appointment)}
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {appointment.notes ? 'Editar Notas' : 'Agregar Notas'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-blue-900">
                              Notas de la Cita
                            </DialogTitle>
                            <DialogDescription>
                              Agrega o edita las notas para la cita con {getPatientName(appointment.patientId)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Escribe las notas de la cita..."
                              className="min-h-32"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsNotesDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleSaveNotes}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Guardar Notas
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completar
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

export default MedicalAppointments;
