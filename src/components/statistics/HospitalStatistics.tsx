
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { getUsers, getAppointments, getSpecialties, getFromLocalStorage } from '@/services/localStorage';
import { User, Appointment, Specialty } from '@/types';
import { MedicalConsultation } from '@/types/medical';
import { Calendar, Users, Stethoscope, TrendingUp } from 'lucide-react';

const HospitalStatistics: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allUsers = getUsers();
      setPatients(allUsers.filter(user => user.role === 'patient'));
      setAppointments(getAppointments());
      setSpecialties(getSpecialties());
      
      const savedConsultations = getFromLocalStorage('medicalConsultations') || [];
      setConsultations(savedConsultations);
    } catch (error) {
      console.error('Error loading statistics data:', error);
    }
  };

  // Estadísticas de citas por mes
  const getAppointmentsByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.date);
      const monthKey = months[date.getMonth()];
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return months.map(month => ({
      mes: month,
      citas: monthlyData[month] || 0
    }));
  };

  // Estadísticas de especialidades
  const getSpecialtyStats = () => {
    const specialtyCount: { [key: string]: number } = {};
    
    appointments.forEach(appointment => {
      const specialty = specialties.find(s => s.id === appointment.specialtyId);
      if (specialty) {
        specialtyCount[specialty.name] = (specialtyCount[specialty.name] || 0) + 1;
      }
    });

    return Object.entries(specialtyCount).map(([name, count]) => ({
      especialidad: name,
      cantidad: count
    }));
  };

  // Estadísticas de estado de citas
  const getAppointmentStatusStats = () => {
    const statusCount = {
      programadas: appointments.filter(a => a.status === 'scheduled').length,
      completadas: appointments.filter(a => a.status === 'completed').length,
      canceladas: appointments.filter(a => a.status === 'cancelled').length
    };

    return [
      { estado: 'Programadas', cantidad: statusCount.programadas, color: '#3B82F6' },
      { estado: 'Completadas', cantidad: statusCount.completadas, color: '#10B981' },
      { estado: 'Canceladas', cantidad: statusCount.canceladas, color: '#EF4444' }
    ];
  };

  const chartConfig = {
    citas: {
      label: "Citas",
      color: "#3B82F6",
    },
    cantidad: {
      label: "Cantidad",
      color: "#10B981",
    },
  };

  const appointmentsByMonth = getAppointmentsByMonth();
  const specialtyStats = getSpecialtyStats();
  const statusStats = getAppointmentStatusStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Estadísticas del Hospital
        </h2>
        <p className="text-blue-600">Análisis y métricas del sistema hospitalario</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Pacientes</p>
                <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Citas</p>
                <p className="text-2xl font-bold text-green-900">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Especialidades</p>
                <p className="text-2xl font-bold text-purple-900">{specialties.length}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Consultas</p>
                <p className="text-2xl font-bold text-orange-900">{consultations.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de citas por mes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={appointmentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="citas" fill="#3B82F6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de estado de citas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Estado de Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                  label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de especialidades */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-blue-800">Citas por Especialidad</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={specialtyStats} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="especialidad" type="category" width={120} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cantidad" fill="#10B981" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalStatistics;
