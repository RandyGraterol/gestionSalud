
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Patient } from '@/types';
import { getPatients, savePatients } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    identificationNumber: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setPatients(getPatients());
  };

  const resetForm = () => {
    setFormData({
      identificationNumber: '',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
    });
    setEditingPatient(null);
  };

  const checkDuplicateId = (identificationNumber: string, excludeId?: string): boolean => {
    return patients.some(p => 
      p.identificationNumber === identificationNumber && p.id !== excludeId
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkDuplicateId(formData.identificationNumber, editingPatient?.id)) {
      toast({
        title: "Error",
        description: "Ya existe un paciente con este número de identificación",
        variant: "destructive",
      });
      return;
    }

    const currentPatients = getPatients();
    
    if (editingPatient) {
      const updatedPatients = currentPatients.map(p => 
        p.id === editingPatient.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      );
      savePatients(updatedPatients);
      toast({
        title: "Paciente actualizado",
        description: "Los datos del paciente se han actualizado correctamente",
      });
    } else {
      const newPatient: Patient = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      savePatients([...currentPatients, newPatient]);
      toast({
        title: "Paciente agregado",
        description: "El paciente se ha agregado correctamente",
      });
    }
    
    loadPatients();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      identificationNumber: patient.identificationNumber,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (patientId: string) => {
    const currentPatients = getPatients();
    const updatedPatients = currentPatients.filter(p => p.id !== patientId);
    savePatients(updatedPatients);
    loadPatients();
    toast({
      title: "Paciente eliminado",
      description: "El paciente se ha eliminado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-900">Gestión de Pacientes</CardTitle>
              <CardDescription>Administra los pacientes del sistema</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-blue-900">
                    {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPatient ? 'Modifica los datos del paciente' : 'Ingresa los datos del nuevo paciente'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identificationNumber">Número de Identificación</Label>
                    <Input
                      id="identificationNumber"
                      value={formData.identificationNumber}
                      onChange={(e) => setFormData({...formData, identificationNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingPatient ? 'Actualizar' : 'Agregar'} Paciente
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
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.identificationNumber}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(patient)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(patient.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
