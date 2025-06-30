
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { getWorkShifts, saveWorkShifts } from '@/services/localStorage';
import { WorkShift } from '@/types';
import { useToast } from '@/hooks/use-toast';

const WorkShiftList: React.FC = () => {
  const [shifts, setShifts] = useState<WorkShift[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    isActive: true
  });

  const { toast } = useToast();

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = () => {
    const loadedShifts = getWorkShifts();
    setShifts(loadedShifts);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      description: '',
      isActive: true
    });
    setEditingShift(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Error",
        description: "La hora de inicio debe ser anterior a la hora de fin",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    
    if (editingShift) {
      const updatedShift: WorkShift = {
        ...editingShift,
        ...formData,
        updatedAt: now
      };
      
      const updatedShifts = shifts.map(shift => 
        shift.id === editingShift.id ? updatedShift : shift
      );
      
      setShifts(updatedShifts);
      saveWorkShifts(updatedShifts);
      
      toast({
        title: "Éxito",
        description: "Turno actualizado correctamente",
      });
    } else {
      const newShift: WorkShift = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      
      const updatedShifts = [...shifts, newShift];
      setShifts(updatedShifts);
      saveWorkShifts(updatedShifts);
      
      toast({
        title: "Éxito",
        description: "Turno creado correctamente",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (shift: WorkShift) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      description: shift.description || '',
      isActive: shift.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedShifts = shifts.filter(shift => shift.id !== id);
    setShifts(updatedShifts);
    saveWorkShifts(updatedShifts);
    
    toast({
      title: "Éxito",
      description: "Turno eliminado correctamente",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Gestión de Turnos de Trabajo</h2>
          <p className="text-blue-600">Administra los turnos de trabajo del personal médico</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-900">
                {editingShift ? 'Editar Turno' : 'Nuevo Turno'}
              </DialogTitle>
              <DialogDescription>
                {editingShift ? 'Modifica los datos del turno' : 'Completa la información del nuevo turno'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-blue-900">Nombre del Turno *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-blue-200 focus:border-blue-500"
                  placeholder="Ej: Turno Mañana"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-blue-900">Hora Inicio *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime" className="text-blue-900">Hora Fin *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-blue-900">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="border-blue-200 focus:border-blue-500"
                  placeholder="Descripción del turno"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive" className="text-blue-900">Activo</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingShift ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Clock className="h-5 w-5 mr-2" />
            Turnos Registrados
          </CardTitle>
          <CardDescription className="text-blue-600">
            Lista de todos los turnos de trabajo configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-100">
                  <TableHead className="text-blue-900">Nombre</TableHead>
                  <TableHead className="text-blue-900">Horario</TableHead>
                  <TableHead className="text-blue-900">Descripción</TableHead>
                  <TableHead className="text-blue-900">Estado</TableHead>
                  <TableHead className="text-blue-900">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.id} className="border-blue-50 hover:bg-blue-50/50">
                    <TableCell className="font-medium text-blue-900">
                      {shift.name}
                    </TableCell>
                    <TableCell className="text-blue-700">
                      {shift.startTime} - {shift.endTime}
                    </TableCell>
                    <TableCell className="text-blue-700">
                      {shift.description || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        shift.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {shift.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(shift)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(shift.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {shifts.length === 0 && (
              <div className="text-center py-8 text-blue-600">
                No hay turnos registrados. Crea el primer turno haciendo clic en "Nuevo Turno".
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkShiftList;
