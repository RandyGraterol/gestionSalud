
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Printer, FileText, Shield, Calendar, User } from 'lucide-react';
import { getMedicalRecords, getPermissions, getPatients, getMedicalStaff, saveMedicalRecord, savePermission, MedicalRecord, Permission } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';

const ReportsAndPermissions: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [medicalStaff, setMedicalStaff] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'permissions'>('reports');
  const { toast } = useToast();

  // Form states
  const [reportForm, setReportForm] = useState({
    patientId: '',
    medicalStaffId: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const [permissionForm, setPermissionForm] = useState({
    patientId: '',
    medicalStaffId: '',
    type: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('localStorageChange', handleStorageChange);
    return () => window.removeEventListener('localStorageChange', handleStorageChange);
  }, []);

  const loadData = () => {
    setMedicalRecords(getMedicalRecords());
    setPermissions(getPermissions());
    setPatients(getPatients());
    setMedicalStaff(getMedicalStaff());
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportForm.patientId || !reportForm.medicalStaffId || !reportForm.diagnosis) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientId: reportForm.patientId,
      medicalStaffId: reportForm.medicalStaffId,
      date: new Date().toISOString(),
      diagnosis: reportForm.diagnosis,
      treatment: reportForm.treatment,
      notes: reportForm.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMedicalRecord(newRecord);
    setReportForm({
      patientId: '',
      medicalStaffId: '',
      diagnosis: '',
      treatment: '',
      notes: ''
    });

    toast({
      title: "Reporte creado",
      description: "El reporte médico ha sido creado exitosamente",
    });
  };

  const handleCreatePermission = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!permissionForm.patientId || !permissionForm.medicalStaffId || !permissionForm.type) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const newPermission: Permission = {
      id: Date.now().toString(),
      patientId: permissionForm.patientId,
      medicalStaffId: permissionForm.medicalStaffId,
      type: permissionForm.type,
      description: permissionForm.description,
      startDate: permissionForm.startDate,
      endDate: permissionForm.endDate,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savePermission(newPermission);
    setPermissionForm({
      patientId: '',
      medicalStaffId: '',
      type: '',
      description: '',
      startDate: '',
      endDate: ''
    });

    toast({
      title: "Permiso creado",
      description: "El permiso médico ha sido creado exitosamente",
    });
  };

  const printReport = (record: MedicalRecord) => {
    const patient = patients.find(p => p.id === record.patientId);
    const doctor = medicalStaff.find(s => s.id === record.medicalStaffId);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reporte Médico</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .info { margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>REPORTE MÉDICO</h1>
              <p>Sistema Hospitalario</p>
            </div>
            <div class="info">
              <div class="section">
                <span class="label">Paciente:</span> ${patient?.name || 'N/A'}
              </div>
              <div class="section">
                <span class="label">Médico:</span> ${doctor?.name || 'N/A'}
              </div>
              <div class="section">
                <span class="label">Fecha:</span> ${new Date(record.date).toLocaleDateString()}
              </div>
              <div class="section">
                <span class="label">Diagnóstico:</span> ${record.diagnosis}
              </div>
              <div class="section">
                <span class="label">Tratamiento:</span> ${record.treatment}
              </div>
              <div class="section">
                <span class="label">Notas:</span> ${record.notes}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printPermission = (permission: Permission) => {
    const patient = patients.find(p => p.id === permission.patientId);
    const doctor = medicalStaff.find(s => s.id === permission.medicalStaffId);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Permiso Médico</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .info { margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PERMISO MÉDICO</h1>
              <p>Sistema Hospitalario</p>
            </div>
            <div class="info">
              <div class="section">
                <span class="label">Paciente:</span> ${patient?.name || 'N/A'}
              </div>
              <div class="section">
                <span class="label">Médico:</span> ${doctor?.name || 'N/A'}
              </div>
              <div class="section">
                <span class="label">Tipo:</span> ${permission.type}
              </div>
              <div class="section">
                <span class="label">Descripción:</span> ${permission.description}
              </div>
              <div class="section">
                <span class="label">Fecha Inicio:</span> ${new Date(permission.startDate).toLocaleDateString()}
              </div>
              <div class="section">
                <span class="label">Fecha Fin:</span> ${new Date(permission.endDate).toLocaleDateString()}
              </div>
              <div class="section">
                <span class="label">Estado:</span> ${permission.status}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          <FileText className="inline w-4 h-4 mr-2" />
          Reportes Médicos
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`pb-2 px-4 ${activeTab === 'permissions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          <Shield className="inline w-4 h-4 mr-2" />
          Permisos Médicos
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Crear Reporte Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateReport} className="space-y-4">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select value={reportForm.patientId} onValueChange={(value) => setReportForm({...reportForm, patientId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Médico</Label>
                  <Select value={reportForm.medicalStaffId} onValueChange={(value) => setReportForm({...reportForm, medicalStaffId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar médico" />
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

                <div className="space-y-2">
                  <Label>Diagnóstico</Label>
                  <Input
                    value={reportForm.diagnosis}
                    onChange={(e) => setReportForm({...reportForm, diagnosis: e.target.value})}
                    placeholder="Diagnóstico médico"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tratamiento</Label>
                  <Input
                    value={reportForm.treatment}
                    onChange={(e) => setReportForm({...reportForm, treatment: e.target.value})}
                    placeholder="Tratamiento prescrito"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea
                    value={reportForm.notes}
                    onChange={(e) => setReportForm({...reportForm, notes: e.target.value})}
                    placeholder="Notas adicionales"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Crear Reporte
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Reportes Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {medicalRecords.map((record) => {
                  const patient = patients.find(p => p.id === record.patientId);
                  const doctor = medicalStaff.find(s => s.id === record.medicalStaffId);
                  
                  return (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-semibold">{patient?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{doctor?.name || 'N/A'}</p>
                          <p className="text-sm">{record.diagnosis}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printReport(record)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Permission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Crear Permiso Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePermission} className="space-y-4">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select value={permissionForm.patientId} onValueChange={(value) => setPermissionForm({...permissionForm, patientId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Médico</Label>
                  <Select value={permissionForm.medicalStaffId} onValueChange={(value) => setPermissionForm({...permissionForm, medicalStaffId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar médico" />
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

                <div className="space-y-2">
                  <Label>Tipo de Permiso</Label>
                  <Select value={permissionForm.type} onValueChange={(value) => setPermissionForm({...permissionForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incapacidad_laboral">Incapacidad Laboral</SelectItem>
                      <SelectItem value="reposo_medico">Reposo Médico</SelectItem>
                      <SelectItem value="permiso_especial">Permiso Especial</SelectItem>
                      <SelectItem value="certificado_medico">Certificado Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={permissionForm.description}
                    onChange={(e) => setPermissionForm({...permissionForm, description: e.target.value})}
                    placeholder="Descripción del permiso"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Inicio</Label>
                    <Input
                      type="date"
                      value={permissionForm.startDate}
                      onChange={(e) => setPermissionForm({...permissionForm, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Fin</Label>
                    <Input
                      type="date"
                      value={permissionForm.endDate}
                      onChange={(e) => setPermissionForm({...permissionForm, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Crear Permiso
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Permissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Permisos Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {permissions.map((permission) => {
                  const patient = patients.find(p => p.id === permission.patientId);
                  const doctor = medicalStaff.find(s => s.id === permission.medicalStaffId);
                  
                  return (
                    <div key={permission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-semibold">{patient?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{doctor?.name || 'N/A'}</p>
                          <p className="text-sm">{permission.type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(permission.startDate).toLocaleDateString()} - {new Date(permission.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printPermission(permission)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsAndPermissions;
