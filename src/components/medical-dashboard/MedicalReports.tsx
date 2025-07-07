
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, User, Clock, Printer } from 'lucide-react';
import { getUsers, getFromLocalStorage } from '@/services/localStorage';
import { User as UserType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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

const MedicalReports: React.FC = () => {
  const [permissions, setPermissions] = useState<MedicalPermission[]>([]);
  const [patients, setPatients] = useState<UserType[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<MedicalPermission[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPermissions();
  }, [permissions, selectedPatient, selectedType, dateFrom, dateTo]);

  const loadData = () => {
    try {
      const allPermissions = getFromLocalStorage('medicalPermissions') as MedicalPermission[] || [];
      const allUsers = getUsers();
      
      setPermissions(allPermissions);
      setPatients(allUsers.filter(u => u.role === 'patient'));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive",
      });
    }
  };

  const filterPermissions = () => {
    let filtered = [...permissions];

    if (selectedPatient) {
      filtered = filtered.filter(p => p.patientId === selectedPatient);
    }

    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }

    if (dateFrom) {
      filtered = filtered.filter(p => new Date(p.startDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(p => new Date(p.endDate) <= new Date(dateTo));
    }

    setFilteredPermissions(filtered);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Paciente no encontrado';
  };

  const getDoctorName = (doctorId: string) => {
    const allUsers = getUsers();
    const doctor = allUsers.find(u => u.id === doctorId || u.username === doctorId);
    return doctor ? doctor.name : 'Doctor no encontrado';
  };

  const generatePDF = async (permission: MedicalPermission) => {
    setIsGenerating(true);
    try {
      const hospitalConfig = getFromLocalStorage('hospitalConfiguration') || {};
      const patient = patients.find(p => p.id === permission.patientId);
      const doctorName = getDoctorName(permission.doctorId);
      
      const pdf = new jsPDF();
      
      // Header del hospital
      pdf.setFontSize(18);
      pdf.text(hospitalConfig.name || 'Sistema Hospitalario', 20, 25);
      
      // Título del documento
      pdf.setFontSize(16);
      const titleText = permission.type === 'reposo' ? 'CONSTANCIA DE REPOSO MÉDICO' : 'CONSTANCIA DE PERMISO MÉDICO';
      pdf.text(titleText, 20, 45);
      
      // Información del paciente
      pdf.setFontSize(12);
      pdf.text('INFORMACIÓN DEL PACIENTE:', 20, 65);
      pdf.setFontSize(11);
      pdf.text(`Nombre: ${patient?.name || 'N/A'}`, 20, 75);
      pdf.text(`Email: ${patient?.email || 'N/A'}`, 20, 85);
      
      // Información del médico
      pdf.setFontSize(12);
      pdf.text('MÉDICO TRATANTE:', 20, 105);
      pdf.setFontSize(11);
      pdf.text(`Dr(a): ${doctorName}`, 20, 115);
      
      // Información del reposo/permiso
      pdf.setFontSize(12);
      pdf.text('DETALLES DEL ' + (permission.type === 'reposo' ? 'REPOSO' : 'PERMISO') + ':', 20, 135);
      pdf.setFontSize(11);
      pdf.text(`Fecha de inicio: ${new Date(permission.startDate).toLocaleDateString('es-ES')}`, 20, 145);
      pdf.text(`Fecha de fin: ${new Date(permission.endDate).toLocaleDateString('es-ES')}`, 20, 155);
      pdf.text(`Duración: ${permission.days} días`, 20, 165);
      
      // Diagnóstico
      pdf.setFontSize(12);
      pdf.text('DIAGNÓSTICO:', 20, 185);
      pdf.setFontSize(10);
      const diagnosisLines = pdf.splitTextToSize(permission.diagnosis, 170);
      pdf.text(diagnosisLines, 20, 195);
      
      let yPosition = 195 + (diagnosisLines.length * 5) + 10;
      
      // Motivo
      pdf.setFontSize(12);
      pdf.text('MOTIVO:', 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(10);
      const reasonLines = pdf.splitTextToSize(permission.reason, 170);
      pdf.text(reasonLines, 20, yPosition);
      yPosition += reasonLines.length * 5 + 10;
      
      // Restricciones si las hay
      if (permission.restrictions) {
        pdf.setFontSize(12);
        pdf.text('RESTRICCIONES:', 20, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        const restrictionLines = pdf.splitTextToSize(permission.restrictions, 170);
        pdf.text(restrictionLines, 20, yPosition);
        yPosition += restrictionLines.length * 5 + 20;
      } else {
        yPosition += 20;
      }
      
      // Firma
      pdf.setFontSize(11);
      pdf.text('_________________________', 120, yPosition + 20);
      pdf.text(`Dr(a): ${doctorName}`, 120, yPosition + 30);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 120, yPosition + 40);
      
      // Footer
      pdf.setFontSize(8);
      pdf.text('Este documento es válido únicamente con la firma del médico tratante', 20, 280);
      
      const fileName = `${permission.type}-${patient?.name || 'paciente'}-${permission.startDate}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "PDF generado",
        description: `El reporte de ${permission.type} se ha descargado correctamente`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Error al generar el archivo PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkPDF = async () => {
    if (filteredPermissions.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay permisos que coincidan con los filtros aplicados",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const hospitalConfig = getFromLocalStorage('hospitalConfiguration') || {};
      const pdf = new jsPDF();
      
      // Header del reporte
      pdf.setFontSize(18);
      pdf.text(hospitalConfig.name || 'Sistema Hospitalario', 20, 25);
      
      pdf.setFontSize(14);
      pdf.text('REPORTE DE PERMISOS Y REPOSOS MÉDICOS', 20, 40);
      
      pdf.setFontSize(10);
      pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 50);
      pdf.text(`Total de registros: ${filteredPermissions.length}`, 20, 60);
      
      let yPosition = 80;
      
      filteredPermissions.forEach((permission, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        const patient = patients.find(p => p.id === permission.patientId);
        const doctorName = getDoctorName(permission.doctorId);
        
        pdf.setFontSize(11);
        pdf.text(`${index + 1}. ${permission.type.toUpperCase()} - ${patient?.name || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(9);
        pdf.text(`   Fechas: ${new Date(permission.startDate).toLocaleDateString('es-ES')} - ${new Date(permission.endDate).toLocaleDateString('es-ES')} (${permission.days} días)`, 20, yPosition);
        yPosition += 6;
        pdf.text(`   Médico: ${doctorName}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`   Diagnóstico: ${permission.diagnosis.substring(0, 80)}${permission.diagnosis.length > 80 ? '...' : ''}`, 20, yPosition);
        yPosition += 10;
      });
      
      pdf.save(`reporte-permisos-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Reporte generado",
        description: "El reporte completo se ha descargado correctamente",
      });
    } catch (error) {
      console.error('Error generating bulk PDF:', error);
      toast({
        title: "Error",
        description: "Error al generar el reporte",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
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

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Reportes de Permisos y Reposos
        </h2>
        <p className="text-blue-600">
          Genera reportes en PDF de permisos médicos y reposos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Filtros de Búsqueda</CardTitle>
          <CardDescription>Filtra los permisos y reposos para generar reportes específicos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los pacientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los pacientes</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="reposo">Reposo Médico</SelectItem>
                  <SelectItem value="permiso">Permiso Médico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={generateBulkPDF}
              disabled={isGenerating || filteredPermissions.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generando...' : 'Generar Reporte Completo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Permisos y Reposos Encontrados</CardTitle>
          <CardDescription>
            {filteredPermissions.length} registro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredPermissions.map((permission) => (
              <div key={permission.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={permission.type === 'reposo' ? 'default' : 'secondary'}>
                        {permission.type === 'reposo' ? 'Reposo' : 'Permiso'}
                      </Badge>
                      {getStatusBadge(permission)}
                    </div>
                    <h3 className="font-semibold text-blue-900">
                      {getPatientName(permission.patientId)}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(permission.startDate)} - {formatDate(permission.endDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {permission.days} días
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Dr. {getDoctorName(permission.doctorId)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Diagnóstico:</strong> {permission.diagnosis}
                    </p>
                  </div>
                  <Button
                    onClick={() => generatePDF(permission)}
                    disabled={isGenerating}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredPermissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron permisos o reposos con los filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalReports;
