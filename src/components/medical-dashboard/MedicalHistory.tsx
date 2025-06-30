
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, saveToLocalStorage, getFromLocalStorage } from '@/services/localStorage';
import { User } from '@/types';
import { MedicalHistory } from '@/types/medical';
import { FileText, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MedicalHistoryComponent: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [existingHistory, setExistingHistory] = useState<MedicalHistory | null>(null);
  const [personalHistory, setPersonalHistory] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [surgicalHistory, setSurgicalHistory] = useState('');
  const [socialHistory, setSocialHistory] = useState('');
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    console.log('MedicalHistory: Loading patients...');
    try {
      const allUsers = getUsers();
      const patientList = allUsers.filter(user => user.role === 'patient');
      console.log('MedicalHistory: Found patients:', patientList);
      setPatients(patientList);
    } catch (error) {
      console.error('MedicalHistory: Error loading patients:', error);
      toast({
        title: "Error",
        description: "Error al cargar la lista de pacientes",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    if (selectedPatientId) {
      console.log('MedicalHistory: Loading history for patient:', selectedPatientId);
      try {
        const histories: MedicalHistory[] = getFromLocalStorage('medicalHistories') || [];
        const patientHistory = histories.find(h => h.patientId === selectedPatientId);
        
        if (patientHistory) {
          console.log('MedicalHistory: Found existing history:', patientHistory);
          setExistingHistory(patientHistory);
          setPersonalHistory(patientHistory.personalHistory || '');
          setFamilyHistory(patientHistory.familyHistory || '');
          setAllergies(patientHistory.allergies || '');
          setCurrentMedications(patientHistory.currentMedications || '');
          setSurgicalHistory(patientHistory.surgicalHistory || '');
          setSocialHistory(patientHistory.socialHistory || '');
        } else {
          console.log('MedicalHistory: No existing history found, clearing form');
          setExistingHistory(null);
          clearForm();
        }
      } catch (error) {
        console.error('MedicalHistory: Error loading patient history:', error);
        toast({
          title: "Error",
          description: "Error al cargar los antecedentes del paciente",
          variant: "destructive"
        });
      }
    }
  }, [selectedPatientId, toast]);

  const clearForm = () => {
    setPersonalHistory('');
    setFamilyHistory('');
    setAllergies('');
    setCurrentMedications('');
    setSurgicalHistory('');
    setSocialHistory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('MedicalHistory: Submitting form...');
    
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un paciente",
        variant: "destructive"
      });
      return;
    }

    if (!session) {
      toast({
        title: "Error",
        description: "No hay sesión activa",
        variant: "destructive"
      });
      return;
    }

    try {
      const histories: MedicalHistory[] = getFromLocalStorage('medicalHistories') || [];
      
      if (existingHistory) {
        console.log('MedicalHistory: Updating existing history');
        // Update existing history
        const updatedHistories = histories.map(h => 
          h.id === existingHistory.id 
            ? {
                ...existingHistory,
                personalHistory,
                familyHistory,
                allergies,
                currentMedications,
                surgicalHistory,
                socialHistory,
                updatedAt: new Date().toISOString()
              }
            : h
        );
        saveToLocalStorage('medicalHistories', updatedHistories);
      } else {
        console.log('MedicalHistory: Creating new history');
        // Create new history
        const newHistory: MedicalHistory = {
          id: Date.now().toString(),
          patientId: selectedPatientId,
          personalHistory,
          familyHistory,
          allergies,
          currentMedications,
          surgicalHistory,
          socialHistory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveToLocalStorage('medicalHistories', [...histories, newHistory]);
        setExistingHistory(newHistory);
      }

      console.log('MedicalHistory: History saved successfully');
      toast({
        title: "Antecedentes guardados",
        description: "Los antecedentes médicos han sido actualizados exitosamente"
      });
    } catch (error) {
      console.error('MedicalHistory: Error saving history:', error);
      toast({
        title: "Error",
        description: "Error al guardar los antecedentes médicos",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setSelectedPatientId('');
    clearForm();
    setExistingHistory(null);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : '';
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
          <FileText className="h-6 w-6 mr-2" />
          Antecedentes Médicos
        </h2>
        <p className="text-blue-600">Gestiona los antecedentes médicos de los pacientes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Seleccionar Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="patient">Paciente</Label>
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
          </CardContent>
        </Card>

        {selectedPatientId && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Antecedentes Personales</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="personalHistory">Antecedentes Patológicos Personales</Label>
                  <Textarea
                    id="personalHistory"
                    value={personalHistory}
                    onChange={(e) => setPersonalHistory(e.target.value)}
                    placeholder="Enfermedades previas, hospitalizaciones, etc..."
                    className="min-h-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Users className="h-5 w-5 mr-2" />
                  Antecedentes Familiares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="familyHistory">Antecedentes Patológicos Familiares</Label>
                  <Textarea
                    id="familyHistory"
                    value={familyHistory}
                    onChange={(e) => setFamilyHistory(e.target.value)}
                    placeholder="Enfermedades hereditarias, patologías familiares..."
                    className="min-h-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alergias y Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="Alergias conocidas a medicamentos, alimentos, etc..."
                    className="min-h-24"
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">Medicamentos Actuales</Label>
                  <Textarea
                    id="currentMedications"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    placeholder="Medicamentos que está tomando actualmente..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Otros Antecedentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="surgicalHistory">Antecedentes Quirúrgicos</Label>
                  <Textarea
                    id="surgicalHistory"
                    value={surgicalHistory}
                    onChange={(e) => setSurgicalHistory(e.target.value)}
                    placeholder="Cirugías previas, procedimientos quirúrgicos..."
                    className="min-h-24"
                  />
                </div>
                <div>
                  <Label htmlFor="socialHistory">Antecedentes Sociales</Label>
                  <Textarea
                    id="socialHistory"
                    value={socialHistory}
                    onChange={(e) => setSocialHistory(e.target.value)}
                    placeholder="Hábitos: tabaquismo, alcoholismo, drogas, ocupación..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {existingHistory ? 'Actualizar Antecedentes' : 'Guardar Antecedentes'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MedicalHistoryComponent;
