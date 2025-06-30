import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Calendar, User, Clock } from 'lucide-react';
import { getUsers, getFromLocalStorage } from '@/services/localStorage';
import { User as UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MedicalPermission {
  id: string;
  patientId: string;
  doctorId: string;
  type: 'reposo' | 'permiso';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  diagnosis: string;
  restrictions?: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const MedicalPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<MedicalPermission[]>([]);
  const [patients, setPatients] = useState<UserType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    type: '' as 'reposo' | 'permiso' | '',
    startDate: '',
    endDate: '',
    days: '',
    reason: '',
    diagnosis: '',
    restrictions: ''
  });

  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      const allPermissions = getFromLocalStorage('medicalPermissions') as MedicalPermission[] || [];
      const allUsers = getUsers();
      
      setPermissions(allPermissions);
      setPatients(allUsers.filter(u => u.role === 'patient'));
    } catch (error) {
      console.error('Error loading permissions data:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos de permisos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePermissions = (updatedPermissions: MedicalPermission[]) => {
    try {
      localStorage.setItem('medicalPermissions', JSON.stringify(updatedPermissions));
    } catch (error) {
      console.error('Error saving permissions:', error);
      throw error;
    }
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.patientId || !formData.type || !formData.startDate || !formData.endDate || !formData.reason || !formData.diagnosis) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        toast({
          title: "Error",
          description: "La fecha de fin debe ser posterior a la fecha de inicio",
          variant: "destructive",
        });
        return;
      }

      const calculatedDays = calculateDays(formData.startDate, formData.endDate);
      
      const newPermission: MedicalPermission = {
        id: Date.now().toString(),
        patientId: formData.patientId,
        doctorId: session?.userId || '',
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: calculatedDays,
        reason: formData.reason,
        diagnosis: formData.diagnosis,
        restrictions: formData.restrictions || undefined,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPermissions = [...permissions, newPermission];
      savePermissions(updatedPermissions);
      setPermissions(updatedPermissions);

      toast({
        title: `${formData.type === 'reposo' ? 'Reposo' : 'Permiso'} generado`,
        description: `Se ha generado el ${formData.type} médico correctamente`,
      });

      // Reset form
      setFormData({
        patientId: '',
        type: '',
        startDate: '',
        endDate: '',
        days: '',
        reason: '',
        diagnosis: '',
        restrictions: ''
      });
      setIsDialogOpen(false);

    } catch (error) {
      console.error('Error creating permission:', error);
      toast({
        title: "Error",
        description: "Error al generar el permiso médico",
        variant: "destructive",
      });
    }
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente no encontrado';
  };

  const getStatusBadge = (permission: MedicalPermission) => {
    const today = new Date();
    const endDate = new Date(permission.endDate);
    
    if (permission.status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
    } else if (endDate < today) {
      return <Badge className="bg-gray-100 text-gray-800">Expirado</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Cargando permisos médicos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Permisos y Reposos Médicos</h2>
        <p className="text-blue-600">
          Genera y gestiona permisos médicos y reposos para pacientes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-900">Gestión de Permisos</CardTitle>
              <CardDescription>Administra los permisos y reposos médicos</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Permiso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-blue-900">Generar Permiso Médico</DialogTitle>
                  <DialogDescription>
                    Complete los datos para generar un permiso o reposo médico
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Paciente *</Label>
                      <Select value={formData.patientId} onValueChange={(value) => setFormData({...formData, patientId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo *</Label>
                      <Select value={formData.type} onValueChange={(value: 'reposo' | 'permiso') => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reposo">Reposo Médico</SelectItem>
                          <SelectItem value="permiso">Permiso Médico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de Inicio *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de Fin *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnóstico *</Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      placeholder="Diagnóstico médico del paciente"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Motivo del permiso o reposo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="restrictions">Restricciones (Opcional)</Label>
                    <Textarea
                      id="restrictions"
                      value={formData.restrictions}
                      onChange={(e) => setFormData({...formData, restrictions: e.target.value})}
                      placeholder="Restricciones o indicaciones especiales"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Permiso
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Diagnóstico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{getPatientName(permission.patientId)}</TableCell>
                  <TableCell>
                    <Badge variant={permission.type === 'reposo' ? 'default' : 'secondary'}>
                      {permission.type === 'reposo' ? 'Reposo' : 'Permiso'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(permission.startDate)}</TableCell>
                  <TableCell>{formatDate(permission.endDate)}</TableCell>
                  <TableCell>{permission.days} días</TableCell>
                  <TableCell>{getStatusBadge(permission)}</TableCell>
                  <TableCell className="max-w-xs truncate">{permission.diagnosis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {permissions.length === 0 && (
            <div className="text-center py-8 text-blue-600">
              No hay permisos médicos registrados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalPermissions;
