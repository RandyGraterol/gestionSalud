
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MedicalStaff, Specialty } from '@/types';
import { getMedicalStaff, saveMedicalStaff, getSpecialties } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';

const StaffList: React.FC = () => {
  const [staff, setStaff] = useState<MedicalStaff[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<MedicalStaff | null>(null);
  const [formData, setFormData] = useState({
    identificationNumber: '',
    name: '',
    email: '',
    phone: '',
    specialtyId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStaff(getMedicalStaff());
    setSpecialties(getSpecialties());
  };

  const resetForm = () => {
    setFormData({
      identificationNumber: '',
      name: '',
      email: '',
      phone: '',
      specialtyId: '',
    });
    setEditingStaff(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentStaff = getMedicalStaff();
    
    if (editingStaff) {
      const updatedStaff = currentStaff.map(s => 
        s.id === editingStaff.id 
          ? { ...s, ...formData, updatedAt: new Date().toISOString() }
          : s
      );
      saveMedicalStaff(updatedStaff);
      toast({
        title: "Personal médico actualizado",
        description: "Los datos se han actualizado correctamente",
      });
    } else {
      const newStaff: MedicalStaff = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveMedicalStaff([...currentStaff, newStaff]);
      toast({
        title: "Personal médico agregado",
        description: "El personal médico se ha agregado correctamente",
      });
    }
    
    loadData();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (staffMember: MedicalStaff) => {
    setEditingStaff(staffMember);
    setFormData({
      identificationNumber: staffMember.identificationNumber,
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      specialtyId: staffMember.specialtyId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (staffId: string) => {
    const currentStaff = getMedicalStaff();
    const updatedStaff = currentStaff.filter(s => s.id !== staffId);
    saveMedicalStaff(updatedStaff);
    loadData();
    toast({
      title: "Personal médico eliminado",
      description: "El personal médico se ha eliminado correctamente",
    });
  };

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : 'Sin especialidad';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-900">Gestión de Personal Médico</CardTitle>
              <CardDescription>Administra el personal médico del sistema</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Personal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-blue-900">
                    {editingStaff ? 'Editar Personal Médico' : 'Nuevo Personal Médico'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStaff ? 'Modifica los datos del personal' : 'Ingresa los datos del nuevo personal'}
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
                    <Label htmlFor="specialty">Especialidad</Label>
                    <Select value={formData.specialtyId} onValueChange={(value) => setFormData({...formData, specialtyId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.id}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingStaff ? 'Actualizar' : 'Agregar'} Personal
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
                <TableHead>Especialidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>{staffMember.identificationNumber}</TableCell>
                  <TableCell>{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{getSpecialtyName(staffMember.specialtyId)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(staffMember)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(staffMember.id)}
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

export default StaffList;
