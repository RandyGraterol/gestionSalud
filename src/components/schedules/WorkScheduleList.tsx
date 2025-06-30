
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { getWorkSchedules, saveWorkSchedules, getMedicalStaff, getWorkShifts } from '@/services/localStorage';
import { WorkSchedule, MedicalStaff, WorkShift } from '@/types';
import { useToast } from '@/hooks/use-toast';

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];

const WorkScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [medicalStaff, setMedicalStaff] = useState<MedicalStaff[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null);
  const [formData, setFormData] = useState({
    medicalStaffId: '',
    workShiftId: '',
    dayOfWeek: 1,
    isActive: true
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSchedules(getWorkSchedules());
    setMedicalStaff(getMedicalStaff());
    setWorkShifts(getWorkShifts());
  };

  const resetForm = () => {
    setFormData({
      medicalStaffId: '',
      workShiftId: '',
      dayOfWeek: 1,
      isActive: true
    });
    setEditingSchedule(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicalStaffId || !formData.workShiftId) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    // Check if schedule already exists for this staff member on this day
    const existingSchedule = schedules.find(s => 
      s.medicalStaffId === formData.medicalStaffId && 
      s.dayOfWeek === formData.dayOfWeek &&
      s.id !== editingSchedule?.id
    );

    if (existingSchedule) {
      toast({
        title: "Error",
        description: "Ya existe un horario para este día y personal médico",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    
    if (editingSchedule) {
      const updatedSchedule: WorkSchedule = {
        ...editingSchedule,
        ...formData,
        updatedAt: now
      };
      
      const updatedSchedules = schedules.map(schedule => 
        schedule.id === editingSchedule.id ? updatedSchedule : schedule
      );
      
      setSchedules(updatedSchedules);
      saveWorkSchedules(updatedSchedules);
      
      toast({
        title: "Éxito",
        description: "Horario actualizado correctamente",
      });
    } else {
      const newSchedule: WorkSchedule = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      
      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);
      saveWorkSchedules(updatedSchedules);
      
      toast({
        title: "Éxito",
        description: "Horario creado correctamente",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (schedule: WorkSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      medicalStaffId: schedule.medicalStaffId,
      workShiftId: schedule.workShiftId,
      dayOfWeek: schedule.dayOfWeek,
      isActive: schedule.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
    setSchedules(updatedSchedules);
    saveWorkSchedules(updatedSchedules);
    
    toast({
      title: "Éxito",
      description: "Horario eliminado correctamente",
    });
  };

  const getStaffName = (staffId: string) => {
    const staff = medicalStaff.find(s => s.id === staffId);
    return staff ? staff.name : 'Personal no encontrado';
  };

  const getShiftName = (shiftId: string) => {
    const shift = workShifts.find(s => s.id === shiftId);
    return shift ? `${shift.name} (${shift.startTime} - ${shift.endTime})` : 'Turno no encontrado';
  };

  const getDayName = (dayOfWeek: number) => {
    const day = daysOfWeek.find(d => d.value === dayOfWeek);
    return day ? day.label : 'Día no válido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Gestión de Horarios de Trabajo</h2>
          <p className="text-blue-600">Asigna horarios de trabajo al personal médico</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-900">
                {editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule ? 'Modifica la asignación de horario' : 'Asigna un horario de trabajo'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="medicalStaffId" className="text-blue-900">Personal Médico *</Label>
                <Select 
                  value={formData.medicalStaffId} 
                  onValueChange={(value) => setFormData({...formData, medicalStaffId: value})}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-500">
                    <SelectValue placeholder="Selecciona el personal médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workShiftId" className="text-blue-900">Turno de Trabajo *</Label>
                <Select 
                  value={formData.workShiftId} 
                  onValueChange={(value) => setFormData({...formData, workShiftId: value})}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-500">
                    <SelectValue placeholder="Selecciona el turno" />
                  </SelectTrigger>
                  <SelectContent>
                    {workShifts.filter(shift => shift.isActive).map((shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dayOfWeek" className="text-blue-900">Día de la Semana *</Label>
                <Select 
                  value={formData.dayOfWeek.toString()} 
                  onValueChange={(value) => setFormData({...formData, dayOfWeek: parseInt(value)})}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-500">
                    <SelectValue placeholder="Selecciona el día" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {editingSchedule ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Calendar className="h-5 w-5 mr-2" />
            Horarios Asignados
          </CardTitle>
          <CardDescription className="text-blue-600">
            Lista de horarios de trabajo asignados al personal médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-100">
                  <TableHead className="text-blue-900">Personal Médico</TableHead>
                  <TableHead className="text-blue-900">Día</TableHead>
                  <TableHead className="text-blue-900">Turno</TableHead>
                  <TableHead className="text-blue-900">Estado</TableHead>
                  <TableHead className="text-blue-900">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id} className="border-blue-50 hover:bg-blue-50/50">
                    <TableCell className="font-medium text-blue-900">
                      {getStaffName(schedule.medicalStaffId)}
                    </TableCell>
                    <TableCell className="text-blue-700">
                      {getDayName(schedule.dayOfWeek)}
                    </TableCell>
                    <TableCell className="text-blue-700">
                      {getShiftName(schedule.workShiftId)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        schedule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {schedule.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(schedule)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(schedule.id)}
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
            
            {schedules.length === 0 && (
              <div className="text-center py-8 text-blue-600">
                No hay horarios asignados. Crea el primer horario haciendo clic en "Nuevo Horario".
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkScheduleList;
