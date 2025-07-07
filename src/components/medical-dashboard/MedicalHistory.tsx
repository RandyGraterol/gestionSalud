
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, saveToLocalStorage, getFromLocalStorage } from '@/services/localStorage';
import { User } from '@/types';
import { MedicalHistory } from '@/types/medical';
import { FileText, Users, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MedicalHistoryComponent: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [existingHistory, setExistingHistory] = useState<MedicalHistory | null>(null);
  
  // Datos del Paciente
  const [apellidos, setApellidos] = useState('');
  const [nombres, setNombres] = useState('');
  const [edad, setEdad] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [ocupacion, setOcupacion] = useState('');
  const [procedencia, setProcedencia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaAdmision, setFechaAdmision] = useState('');
  const [servicio, setServicio] = useState('');
  const [selloHorario, setSelloHorario] = useState('');
  const [cedula, setCedula] = useState('');
  const [historiaClinicaNo, setHistoriaClinicaNo] = useState('');

  // Información Médica
  const [motivoAdmision, setMotivoAdmision] = useState('');
  const [enfermedadActual, setEnfermedadActual] = useState('');
  const [diagnosticoAdmision, setDiagnosticoAdmision] = useState('');
  const [intervencionTratamiento, setIntervencionTratamiento] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [diagnosticoAnatomopatologico, setDiagnosticoAnatomopatologico] = useState('');
  const [autopsia, setAutopsia] = useState('');

  // Datos de Salida
  const [salidaCuracion, setSalidaCuracion] = useState(false);
  const [salidaMejoria, setSalidaMejoria] = useState(false);
  const [salidaMuerte, setSalidaMuerte] = useState(false);
  const [salidaAutopsia, setSalidaAutopsia] = useState(false);
  const [salidaOtrasCausas, setSalidaOtrasCausas] = useState(false);
  const [diagnosticoClinicoFinal, setDiagnosticoClinicoFinal] = useState('');

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
          // Load all fields from existing history
          const historyData = JSON.parse(patientHistory.personalHistory || '{}');
          setApellidos(historyData.apellidos || '');
          setNombres(historyData.nombres || '');
          setEdad(historyData.edad || '');
          setFechaNacimiento(historyData.fechaNacimiento || '');
          setNacionalidad(historyData.nacionalidad || '');
          setEstadoCivil(historyData.estadoCivil || '');
          setOcupacion(historyData.ocupacion || '');
          setProcedencia(historyData.procedencia || '');
          setTelefono(historyData.telefono || '');
          setParentesco(historyData.parentesco || '');
          setDireccion(historyData.direccion || '');
          setFechaAdmision(historyData.fechaAdmision || '');
          setServicio(historyData.servicio || '');
          setSelloHorario(historyData.selloHorario || '');
          setCedula(historyData.cedula || '');
          setMotivoAdmision(historyData.motivoAdmision || '');
          setEnfermedadActual(historyData.enfermedadActual || '');
          setDiagnosticoAdmision(historyData.diagnosticoAdmision || '');
          setIntervencionTratamiento(historyData.intervencionTratamiento || '');
          setFechaSalida(historyData.fechaSalida || '');
          setDiagnosticoAnatomopatologico(historyData.diagnosticoAnatomopatologico || '');
          setAutopsia(historyData.autopsia || '');
          setSalidaCuracion(historyData.salidaCuracion || false);
          setSalidaMejoria(historyData.salidaMejoria || false);
          setSalidaMuerte(historyData.salidaMuerte || false);
          setSalidaAutopsia(historyData.salidaAutopsia || false);
          setSalidaOtrasCausas(historyData.salidaOtrasCausas || false);
          setDiagnosticoClinicoFinal(historyData.diagnosticoClinicoFinal || '');
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
    setApellidos('');
    setNombres('');
    setEdad('');
    setFechaNacimiento('');
    setNacionalidad('');
    setEstadoCivil('');
    setOcupacion('');
    setProcedencia('');
    setTelefono('');
    setParentesco('');
    setDireccion('');
    setFechaAdmision('');
    setServicio('');
    setSelloHorario('');
    setCedula('');
    setMotivoAdmision('');
    setEnfermedadActual('');
    setDiagnosticoAdmision('');
    setIntervencionTratamiento('');
    setFechaSalida('');
    setDiagnosticoAnatomopatologico('');
    setAutopsia('');
    setSalidaCuracion(false);
    setSalidaMejoria(false);
    setSalidaMuerte(false);
    setSalidaAutopsia(false);
    setSalidaOtrasCausas(false);
    setDiagnosticoClinicoFinal('');
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
      
      const clinicalData = {
        apellidos, nombres, edad, fechaNacimiento, nacionalidad, estadoCivil,
        ocupacion, procedencia, telefono, parentesco, direccion, fechaAdmision,
        servicio, selloHorario, cedula, motivoAdmision, enfermedadActual,
        diagnosticoAdmision, intervencionTratamiento, fechaSalida,
        diagnosticoAnatomopatologico, autopsia, salidaCuracion, salidaMejoria,
        salidaMuerte, salidaAutopsia, salidaOtrasCausas, diagnosticoClinicoFinal
      };

      if (existingHistory) {
        console.log('MedicalHistory: Updating existing history');
        const updatedHistories = histories.map(h => 
          h.id === existingHistory.id 
            ? {
                ...existingHistory,
                personalHistory: JSON.stringify(clinicalData),
                updatedAt: new Date().toISOString()
              }
            : h
        );
        saveToLocalStorage('medicalHistories', updatedHistories);
      } else {
        console.log('MedicalHistory: Creating new history');
        const newHistory: MedicalHistory = {
          id: Date.now().toString(),
          patientId: selectedPatientId,
          personalHistory: JSON.stringify(clinicalData),
          familyHistory: '',
          allergies: '',
          currentMedications: '',
          surgicalHistory: '',
          socialHistory: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveToLocalStorage('medicalHistories', [...histories, newHistory]);
        setExistingHistory(newHistory);
      }

      console.log('MedicalHistory: History saved successfully');
      toast({
        title: "Historia Clínica guardada",
        description: "La historia clínica ha sido actualizada exitosamente"
      });
    } catch (error) {
      console.error('MedicalHistory: Error saving history:', error);
      toast({
        title: "Error",
        description: "Error al guardar la historia clínica",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setSelectedPatientId('');
    clearForm();
    setExistingHistory(null);
  };

  if (!session) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: No hay sesión activa</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Historia Clínica
        </h2>
        <p className="text-blue-600">Hospital General "Dr. Jesús Ramírez Baiza"</p>
        <p className="text-blue-600">San Juan de los Morros, Estado Guárico</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Paciente */}
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
            {/* Encabezado de la Historia Clínica */}
            <Card className="border-2 border-blue-300">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-center text-blue-900 text-xl">
                  HISTORIA CLÍNICA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="apellidos" className="text-sm font-medium">Apellidos</Label>
                    <Input
                      id="apellidos"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nombres" className="text-sm font-medium">Nombres</Label>
                    <Input
                      id="nombres"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex-1 mr-2">
                      <Label htmlFor="historiaClinicaNo" className="text-sm font-medium">Historia N°</Label>
                      <Input
                        id="historiaClinicaNo"
                        value={historiaClinicaNo}
                        onChange={(e) => setHistoriaClinicaNo(e.target.value)}
                        className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label htmlFor="edad" className="text-sm font-medium">Edad</Label>
                    <Input
                      id="edad"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaNacimiento" className="text-sm font-medium">Fecha y Lugar de Nacimiento</Label>
                    <Input
                      id="fechaNacimiento"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cedula" className="text-sm font-medium">Cédula de Identidad N°</Label>
                    <Input
                      id="cedula"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fechaAdmision" className="text-sm font-medium">Fecha de Admisión</Label>
                    <Input
                      id="fechaAdmision"
                      type="date"
                      value={fechaAdmision}
                      onChange={(e) => setFechaAdmision(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="nacionalidad" className="text-sm font-medium">Nacionalidad</Label>
                    <Input
                      id="nacionalidad"
                      value={nacionalidad}
                      onChange={(e) => setNacionalidad(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estadoCivil" className="text-sm font-medium">Estado Civil</Label>
                    <Select value={estadoCivil} onValueChange={setEstadoCivil}>
                      <SelectTrigger className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soltero">Soltero/a</SelectItem>
                        <SelectItem value="casado">Casado/a</SelectItem>
                        <SelectItem value="divorciado">Divorciado/a</SelectItem>
                        <SelectItem value="viudo">Viudo/a</SelectItem>
                        <SelectItem value="union_libre">Unión Libre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="servicio" className="text-sm font-medium">Servicio</Label>
                    <Input
                      id="servicio"
                      value={servicio}
                      onChange={(e) => setServicio(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="procedencia" className="text-sm font-medium">Procedencia por Estado</Label>
                    <Input
                      id="procedencia"
                      value={procedencia}
                      onChange={(e) => setProcedencia(e.target.value)}
                      className="border-b-2 border-l-0 border-r-0 border-t-0 rounded-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex-1 mr-2">
                      <Label className="text-sm font-medium">Sello Horario</Label>
                      <div className="border-2 border-gray-300 h-20 p-2 text-center text-sm text-gray-500">
                        PLACA DE IDENTIFICACIÓN
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Médica */}
            <Card className="border-2 border-blue-300">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium block mb-2">
                      Aviso: A ser admitido, el paciente debe firmar la autorización que aparece al dorso de la Hoja.
                    </Label>
                    <div className="bg-gray-50 p-2 text-sm">
                      <strong>MOTIVO DE ADMISIÓN:</strong>
                    </div>
                    <Textarea
                      value={motivoAdmision}
                      onChange={(e) => setMotivoAdmision(e.target.value)}
                      placeholder="Describir el motivo de admisión..."
                      className="min-h-16 border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <div className="bg-gray-50 p-2 text-sm mb-2">
                      <strong>ENFERMEDAD ACTUAL:</strong> Hacer relato cronológico y completo de las dolencias, 
                      indicando fecha de comienzo, duración y tratamiento. Use una hoja de ésta.
                    </div>
                    <Textarea
                      value={enfermedadActual}
                      onChange={(e) => setEnfermedadActual(e.target.value)}
                      placeholder="Relato cronológico de la enfermedad actual..."
                      className="min-h-32 border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <div className="bg-gray-50 p-2 text-sm mb-2">
                      <strong>DIAGNÓSTICO DE ADMISIÓN:</strong>
                    </div>
                    <Textarea
                      value={diagnosticoAdmision}
                      onChange={(e) => setDiagnosticoAdmision(e.target.value)}
                      placeholder="Diagnóstico inicial..."
                      className="min-h-16 border-2 border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Firma del Médico de Admisión</Label>
                      <div className="border-b-2 border-gray-300 h-8"></div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Firma del Jefe del Servicio</Label>
                      <div className="border-b-2 border-gray-300 h-8"></div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 p-2 text-sm mb-2 flex items-center space-x-8">
                      <strong>SALIDA POR:</strong>
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={salidaCuracion}
                            onChange={(e) => setSalidaCuracion(e.target.checked)}
                            className="mr-1"
                          />
                          CURACIÓN
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={salidaMejoria}
                            onChange={(e) => setSalidaMejoria(e.target.checked)}
                            className="mr-1"
                          />
                          MEJORÍA
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={salidaMuerte}
                            onChange={(e) => setSalidaMuerte(e.target.checked)}
                            className="mr-1"
                          />
                          MUERTE
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={salidaAutopsia}
                            onChange={(e) => setSalidaAutopsia(e.target.checked)}
                            className="mr-1"
                          />
                          AUTOPSIA PEDIDA
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={salidaOtrasCausas}
                            onChange={(e) => setSalidaOtrasCausas(e.target.checked)}
                            className="mr-1"
                          />
                          OTRAS CAUSAS
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 text-sm mb-2">
                      <strong>DIAGNÓSTICO CLÍNICO FINAL:</strong>
                    </div>
                    <Textarea
                      value={diagnosticoClinicoFinal}
                      onChange={(e) => setDiagnosticoClinicoFinal(e.target.value)}
                      placeholder="Diagnóstico final del paciente..."
                      className="min-h-16 border-2 border-gray-300"
                    />
                  </div>

                  <div>
                    <div className="bg-gray-50 p-2 text-sm mb-2">
                      <strong>INTERVENCIÓN O TRATAMIENTO:</strong>
                    </div>
                    <Textarea
                      value={intervencionTratamiento}
                      onChange={(e) => setIntervencionTratamiento(e.target.value)}
                      placeholder="Describir intervenciones o tratamientos realizados..."
                      className="min-h-16 border-2 border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fechaSalida" className="text-sm font-medium">FECHA DE SALIDA</Label>
                      <Input
                        id="fechaSalida"
                        type="date"
                        value={fechaSalida}
                        onChange={(e) => setFechaSalida(e.target.value)}
                        className="border-2 border-gray-300"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">FIRMA DEL JEFE DEL DEPARTAMENTO</Label>
                      <div className="border-b-2 border-gray-300 h-8"></div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 p-2 text-sm mb-2">
                      <strong>DIAGNÓSTICO ANATOMO PATOLÓGICO:</strong> 
                      <span className="ml-4">BIOPSIA: □</span>
                      <span className="ml-4">AUTOPSIA: □</span>
                    </div>
                    <Textarea
                      value={diagnosticoAnatomopatologico}
                      onChange={(e) => setDiagnosticoAnatomopatologico(e.target.value)}
                      placeholder="Diagnóstico anatomo patológico si aplica..."
                      className="min-h-16 border-2 border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {existingHistory ? 'Actualizar Historia Clínica' : 'Guardar Historia Clínica'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default MedicalHistoryComponent;
