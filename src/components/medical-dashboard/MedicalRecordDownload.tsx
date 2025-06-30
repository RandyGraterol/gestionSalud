
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getUsers, getFromLocalStorage } from '@/services/localStorage';
import { User } from '@/types';
import { MedicalHistory } from '@/types/medical';
import { Download, FileText, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const MedicalRecordDownload: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const allUsers = getUsers();
      const patientList = allUsers.filter(user => user.role === 'patient');
      setPatients(patientList);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Error",
        description: "Error al cargar la lista de pacientes",
        variant: "destructive"
      });
    }
  }, [toast]);

  const getPatientData = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const histories: MedicalHistory[] = getFromLocalStorage('medicalHistories') || [];
    const patientHistory = histories.find(h => h.patientId === patientId);
    
    return { patient, patientHistory };
  };

  const generatePDF = async () => {
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Selecciona un paciente",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { patient, patientHistory } = getPatientData(selectedPatientId);
      const hospitalConfig = getFromLocalStorage('hospitalConfiguration') || {};
      
      const pdf = new jsPDF();
      
      // Header
      pdf.setFontSize(20);
      pdf.text(hospitalConfig.name || 'Sistema Hospitalario', 20, 30);
      
      pdf.setFontSize(16);
      pdf.text('Historia Clínica', 20, 50);
      
      // Patient info
      pdf.setFontSize(12);
      pdf.text(`Paciente: ${patient?.name || 'N/A'}`, 20, 70);
      pdf.text(`Email: ${patient?.email || 'N/A'}`, 20, 80);
      pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 90);
      
      let yPosition = 110;
      
      if (patientHistory) {
        // Antecedentes Personales
        if (patientHistory.personalHistory) {
          pdf.setFontSize(14);
          pdf.text('Antecedentes Personales:', 20, yPosition);
          yPosition += 10;
          pdf.setFontSize(10);
          const personalLines = pdf.splitTextToSize(patientHistory.personalHistory, 170);
          pdf.text(personalLines, 20, yPosition);
          yPosition += personalLines.length * 5 + 10;
        }
        
        // Antecedentes Familiares
        if (patientHistory.familyHistory) {
          pdf.setFontSize(14);
          pdf.text('Antecedentes Familiares:', 20, yPosition);
          yPosition += 10;
          pdf.setFontSize(10);
          const familyLines = pdf.splitTextToSize(patientHistory.familyHistory, 170);
          pdf.text(familyLines, 20, yPosition);
          yPosition += familyLines.length * 5 + 10;
        }
        
        // Alergias
        if (patientHistory.allergies) {
          pdf.setFontSize(14);
          pdf.text('Alergias:', 20, yPosition);
          yPosition += 10;
          pdf.setFontSize(10);
          const allergyLines = pdf.splitTextToSize(patientHistory.allergies, 170);
          pdf.text(allergyLines, 20, yPosition);
          yPosition += allergyLines.length * 5 + 10;
        }
      }
      
      pdf.save(`historia-clinica-${patient?.name || 'paciente'}.pdf`);
      
      toast({
        title: "PDF generado",
        description: "La historia clínica se ha descargado en formato PDF"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Error al generar el archivo PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExcel = () => {
    if (!selectedPatientId) {
      toast({
        title: "Error",
        description: "Selecciona un paciente",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { patient, patientHistory } = getPatientData(selectedPatientId);
      
      const data = [
        ['HISTORIA CLÍNICA'],
        [''],
        ['Información del Paciente'],
        ['Nombre', patient?.name || 'N/A'],
        ['Email', patient?.email || 'N/A'],
        ['Fecha de generación', new Date().toLocaleDateString()],
        [''],
        ['Antecedentes Médicos'],
        ['Antecedentes Personales', patientHistory?.personalHistory || 'N/A'],
        ['Antecedentes Familiares', patientHistory?.familyHistory || 'N/A'],
        ['Alergias', patientHistory?.allergies || 'N/A'],
        ['Medicamentos Actuales', patientHistory?.currentMedications || 'N/A'],
        ['Antecedentes Quirúrgicos', patientHistory?.surgicalHistory || 'N/A'],
        ['Antecedentes Sociales', patientHistory?.socialHistory || 'N/A']
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Historia Clínica');
      
      XLSX.writeFile(wb, `historia-clinica-${patient?.name || 'paciente'}.xlsx`);
      
      toast({
        title: "Excel generado",
        description: "La historia clínica se ha descargado en formato Excel"
      });
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast({
        title: "Error",
        description: "Error al generar el archivo Excel",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <Download className="h-6 w-6 mr-2" />
          Descargar Historia Clínica
        </h2>
        <p className="text-blue-600">Genera y descarga historias clínicas en formato PDF o Excel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Seleccionar Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
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

          {selectedPatientId && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-red-600 hover:bg-red-700 flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Descargar PDF'}
              </Button>
              
              <Button
                onClick={generateExcel}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Descargar Excel'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordDownload;
