
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Specialty } from '@/types';
import { getSpecialties, saveSpecialties } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Plus, User, Stethoscope, Calendar } from 'lucide-react';

const SpecialtyList: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading specialties...');
      const data = getSpecialties();
      console.log('Specialties loaded:', data);
      
      if (!data) {
        console.log('No specialties data found, initializing empty array');
        setSpecialties([]);
      } else {
        setSpecialties(data);
      }
    } catch (err) {
      console.error('Error loading specialties:', err);
      setError('Error al cargar las especialidades');
      toast({
        title: "Error",
        description: "Error al cargar las especialidades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingSpecialty(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name.trim() || !formData.description.trim()) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos",
          variant: "destructive",
        });
        return;
      }

      const currentSpecialties = getSpecialties() || [];
      
      if (editingSpecialty) {
        const updatedSpecialties = currentSpecialties.map(s => 
          s.id === editingSpecialty.id 
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        );
        saveSpecialties(updatedSpecialties);
        toast({
          title: "Especialidad actualizada",
          description: "La especialidad se ha actualizado correctamente",
        });
      } else {
        const newSpecialty: Specialty = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveSpecialties([...currentSpecialties, newSpecialty]);
        toast({
          title: "Especialidad agregada",
          description: "La especialidad se ha agregado correctamente",
        });
      }
      
      loadSpecialties();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving specialty:', err);
      toast({
        title: "Error",
        description: "Error al guardar la especialidad",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (specialty: Specialty) => {
    try {
      setEditingSpecialty(specialty);
      setFormData({
        name: specialty.name,
        description: specialty.description,
      });
      setIsDialogOpen(true);
    } catch (err) {
      console.error('Error editing specialty:', err);
      toast({
        title: "Error",
        description: "Error al editar la especialidad",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (specialtyId: string) => {
    try {
      const currentSpecialties = getSpecialties() || [];
      const updatedSpecialties = currentSpecialties.filter(s => s.id !== specialtyId);
      saveSpecialties(updatedSpecialties);
      loadSpecialties();
      toast({
        title: "Especialidad eliminada",
        description: "La especialidad se ha eliminado correctamente",
      });
    } catch (err) {
      console.error('Error deleting specialty:', err);
      toast({
        title: "Error",
        description: "Error al eliminar la especialidad",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Cargando especialidades...</p>
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
            <Button onClick={loadSpecialties} className="bg-blue-600 hover:bg-blue-700">
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
                <Stethoscope className="h-5 w-5 mr-2" />
                Gestión de Especialidades
              </CardTitle>
              <CardDescription>Administra las especialidades médicas del sistema</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Especialidad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-blue-900">
                    {editingSpecialty ? 'Editar Especialidad' : 'Nueva Especialidad'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSpecialty ? 'Modifica los datos de la especialidad' : 'Ingresa los datos de la nueva especialidad'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Especialidad</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Ej: Cardiología, Neurología..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      placeholder="Describe la especialidad médica..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    {editingSpecialty ? 'Actualizar' : 'Agregar'} Especialidad
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {specialties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialties.map((specialty) => (
                  <TableRow key={specialty.id}>
                    <TableCell className="font-medium">{specialty.name}</TableCell>
                    <TableCell>{specialty.description}</TableCell>
                    <TableCell>{new Date(specialty.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(specialty)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(specialty.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-blue-600">
              <Stethoscope className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <p className="text-lg font-medium mb-2">No hay especialidades registradas</p>
              <p className="mb-4">Comienza agregando la primera especialidad médica</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Especialidad
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialtyList;
