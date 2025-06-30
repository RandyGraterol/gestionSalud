
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Appointment, Patient, MedicalStaff, Specialty } from '@/types';
import { getAppointments, saveAppointments, getPatients, getMedicalStaff, getSpecialties } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Calendar, User, Stethoscope } from 'lucide-react';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<MedicalStaff[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading appointments data...');
      
      const appointmentsData = getAppointments() || [];
      const patientsData = getPatients() || [];
      const staffData = getMedicalStaff() || [];
      const specialtiesData = getSpecialties() || [];
      
      console.log('Data loaded:', {
        appointments: appointmentsData.length,
        patients: patientsData.length,
        staff: staffData.length,
        specialties: specialtiesData.length
      });
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setStaff(staffData);
      setSpecialties(specialtiesData);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
      toast({
        title: "Error",
        description: "Error al cargar los datos de citas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    try {
      const currentAppointments = getAppointments() || [];
      const updatedAppointments = currentAppointments.map(a => 
        a.id === appointmentId 
          ? { ...a, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
          : a
      );
      saveAppointments(updatedAppointments);
      loadData();
      toast({
        title: "Cita cancelada",
        description: "La cita se ha cancelado correctamente",
      });
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast({
        title: "Error",
        description: "Error al cancelar la cita",
        variant: "destructive",
      });
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente no encontrado';
  };

  const getStaffName = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember ? staffMember.name : 'Personal no encontrado';
  };

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : 'Especialidad no encontrada';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterSpecialty !== 'all' && appointment.specialtyId !== filterSpecialty) {
      return false;
    }
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Cargando citas médicas...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadData} className="bg-blue-600 hover:bg-blue-700">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Gestión de Citas
              </CardTitle>
              <CardDescription>Consulta y administra las citas médicas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Filtrar por especialidad:</label>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Filtrar por estado:</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="scheduled">Programadas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                    <TableCell>{getStaffName(appointment.medicalStaffId)}</TableCell>
                    <TableCell>{getSpecialtyName(appointment.specialtyId)}</TableCell>
                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-blue-600">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <p className="text-lg font-medium mb-2">No se encontraron citas</p>
              <p>
                {appointments.length === 0 
                  ? 'No hay citas médicas registradas en el sistema'
                  : 'No se encontraron citas con los filtros seleccionados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentList;
