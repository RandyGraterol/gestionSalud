import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveToLocalStorage, getFromLocalStorage } from '@/services/localStorage';
import { MedicalExam, MedicalConsultation } from '@/types/medical';
import { FileSearch, Plus, Calendar } from 'lucide-react';

const MedicalExams: React.FC = () => {
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([]);
  const [exams, setExams] = useState<MedicalExam[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState('');
  const [examType, setExamType] = useState('');
  const [examName, setExamName] = useState('');
  const [results, setResults] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [examDate, setExamDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const examTypes = [
    'Laboratorio',
    'Imagenología',
    'Electrocardiograma',
    'Endoscopía',
    'Biopsia',
    'Función Pulmonar',
    'Otros'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allConsultations: MedicalConsultation[] = getFromLocalStorage('medicalConsultations') || [];
    const allExams: MedicalExam[] = getFromLocalStorage('medicalExams') || [];
    setConsultations(allConsultations);
    setExams(allExams);
  };

  const clearForm = () => {
    setSelectedConsultationId('');
    setExamType('');
    setExamName('');
    setResults('');
    setInterpretation('');
    setExamDate('');
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConsultationId || !examType || !examName || !examDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newExam: MedicalExam = {
      id: Date.now().toString(),
      consultationId: selectedConsultationId,
      examType,
      examName,
      results,
      interpretation,
      date: examDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedExams = [...exams, newExam];
    saveToLocalStorage('medicalExams', updatedExams);
    setExams(updatedExams);

    toast({
      title: "Examen registrado",
      description: "El examen médico ha sido registrado exitosamente"
    });

    clearForm();
  };

  const getConsultationInfo = (consultationId: string) => {
    const consultation = consultations.find(c => c.id === consultationId);
    return consultation;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center">
            <FileSearch className="h-6 w-6 mr-2" />
            Exámenes Médicos
          </h2>
          <p className="text-blue-600">Gestiona los exámenes y estudios complementarios</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Examen
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-blue-800">Registrar Nuevo Examen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consultation">Consulta *</Label>
                  <Select value={selectedConsultationId} onValueChange={setSelectedConsultationId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una consulta" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultations.map((consultation) => (
                        <SelectItem key={consultation.id} value={consultation.id}>
                          {formatDate(consultation.date)} - {consultation.chiefComplaint.substring(0, 50)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="examType">Tipo de Examen *</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="examName">Nombre del Examen *</Label>
                  <Input
                    id="examName"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="Ej: Hemograma completo, Radiografía de tórax..."
                  />
                </div>
                <div>
                  <Label htmlFor="examDate">Fecha del Examen *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="results">Resultados</Label>
                <Textarea
                  id="results"
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Describe los resultados del examen..."
                  className="min-h-24"
                />
              </div>

              <div>
                <Label htmlFor="interpretation">Interpretación</Label>
                <Textarea
                  id="interpretation"
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Interpretación clínica de los resultados..."
                  className="min-h-24"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={clearForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Guardar Examen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-900">Exámenes Registrados</h3>
        {exams.length === 0 ? (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center py-12">
              <FileSearch className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                No hay exámenes registrados
              </h3>
              <p className="text-blue-600">
                Comienza registrando un nuevo examen médico.
              </p>
            </CardContent>
          </Card>
        ) : (
          exams.map((exam) => {
            const consultation = getConsultationInfo(exam.consultationId);
            return (
              <Card key={exam.id} className="border-blue-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900">{exam.examName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-blue-600 mt-1">
                        <Badge variant="secondary">{exam.examType}</Badge>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(exam.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {consultation && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Consulta:</strong> {consultation.chiefComplaint}
                      </p>
                      <p className="text-sm text-blue-600">
                        Fecha: {formatDate(consultation.date)}
                      </p>
                    </div>
                  )}

                  {exam.results && (
                    <div className="mb-3">
                      <h5 className="font-medium text-blue-800 mb-2">Resultados:</h5>
                      <p className="text-blue-700 bg-blue-50 p-3 rounded">{exam.results}</p>
                    </div>
                  )}

                  {exam.interpretation && (
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Interpretación:</h5>
                      <p className="text-blue-700 bg-green-50 p-3 rounded">{exam.interpretation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MedicalExams;
