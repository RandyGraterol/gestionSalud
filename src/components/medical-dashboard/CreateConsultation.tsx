
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, saveToLocalStorage, getFromLocalStorage } from '@/services/localStorage';
import { User } from '@/types';
import { MedicalConsultation, VitalSigns } from '@/types/medical';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserIcon, Stethoscope, Heart, Thermometer } from 'lucide-react';

const CreateConsultation: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [currentIllness, setCurrentIllness] = useState('');
  const [physicalExamination, setPhysicalExamination] = useState('');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    bloodPressure: '',
    heartRate: 0,
    temperature: 0,
    respiratoryRate: 0,
    weight: 0,
    height: 0,
    oxygenSaturation: 0
  });
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log('CreateConsultation: Loading patients...');
    try {
      const allUsers = getUsers();
      const patientList = allUsers.filter(user => user.role === 'patient');
      console.log('CreateConsultation: Found patients:', patientList);
      setPatients(patientList);
    } catch (error) {
      console.error('CreateConsultation: Error loading patients:', error);
      toast({
        title: "Error",
        description: "Error al cargar la lista de pacientes",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleVitalSignChange = (field: keyof VitalSigns, value: string | number) => {
    setVitalSigns(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('CreateConsultation: Submitting form...');
    
    if (!selectedPatientId || !chiefComplaint || !currentIllness) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      const consultation: MedicalConsultation = {
        id: Date.now().toString(),
        patientId: selectedPatientId,
        medicalStaffId: session?.userId || '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('es-ES', { hour12: false }),
        chiefComplaint,
        currentIllness,
        vitalSigns,
        physicalExamination,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingConsultations = getFromLocalStorage('medicalConsultations') || [];
      saveToLocalStorage('medicalConsultations', [...existingConsultations, consultation]);

      console.log('CreateConsultation: Consultation saved successfully');
      toast({
        title: "Consulta creada",
        description: "La consulta médica ha sido registrada exitosamente"
      });

      // Reset form
      setSelectedPatientId('');
      setChiefComplaint('');
      setCurrentIllness('');
      setPhysicalExamination('');
      setVitalSigns({
        bloodPressure: '',
        heartRate: 0,
        temperature: 0,
        respiratoryRate: 0,
        weight: 0,
        height: 0,
        oxygenSaturation: 0
      });
    } catch (error) {
      console.error('CreateConsultation: Error saving consultation:', error);
      toast({
        title: "Error",
        description: "Error al guardar la consulta",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setSelectedPatientId('');
    setChiefComplaint('');
    setCurrentIllness('');
    setPhysicalExamination('');
    setVitalSigns({
      bloodPressure: '',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
      weight: 0,
      height: 0,
      oxygenSaturation: 0
    });
  };

  if (!session) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: No hay sesión activa</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <Stethoscope className="h-6 w-6 mr-2" />
          Nueva Consulta Médica
        </h2>
        <p className="text-blue-600">Registra una nueva consulta médica</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <UserIcon className="h-5 w-5 mr-2" />
              Información del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Paciente *</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} - {patient.email}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-patients" disabled>
                        No hay pacientes disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Motivo de Consulta y Enfermedad Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chiefComplaint">Motivo de Consulta *</Label>
              <Textarea
                id="chiefComplaint"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe el motivo principal de la consulta..."
                className="min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="currentIllness">Enfermedad Actual *</Label>
              <Textarea
                id="currentIllness"
                value={currentIllness}
                onChange={(e) => setCurrentIllness(e.target.value)}
                placeholder="Describe la enfermedad actual del paciente..."
                className="min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Heart className="h-5 w-5 mr-2" />
              Signos Vitales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodPressure">Presión Arterial</Label>
                <Input
                  id="bloodPressure"
                  value={vitalSigns.bloodPressure}
                  onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label htmlFor="heartRate">Frecuencia Cardíaca (lpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={vitalSigns.heartRate || ''}
                  onChange={(e) => handleVitalSignChange('heartRate', parseInt(e.target.value) || 0)}
                  placeholder="72"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={vitalSigns.temperature || ''}
                  onChange={(e) => handleVitalSignChange('temperature', parseFloat(e.target.value) || 0)}
                  placeholder="36.5"
                />
              </div>
              <div>
                <Label htmlFor="respiratoryRate">Frecuencia Respiratoria (rpm)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={vitalSigns.respiratoryRate || ''}
                  onChange={(e) => handleVitalSignChange('respiratoryRate', parseInt(e.target.value) || 0)}
                  placeholder="16"
                />
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={vitalSigns.weight || ''}
                  onChange={(e) => handleVitalSignChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="70"
                />
              </div>
              <div>
                <Label htmlFor="height">Talla (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={vitalSigns.height || ''}
                  onChange={(e) => handleVitalSignChange('height', parseInt(e.target.value) || 0)}
                  placeholder="170"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Examen Físico</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="physicalExamination">Hallazgos del Examen Físico</Label>
              <Textarea
                id="physicalExamination"
                value={physicalExamination}
                onChange={(e) => setPhysicalExamination(e.target.value)}
                placeholder="Describe los hallazgos del examen físico..."
                className="min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Guardar Consulta
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateConsultation;
