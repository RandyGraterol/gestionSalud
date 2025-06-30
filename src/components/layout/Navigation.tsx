
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Settings, Clock, CalendarDays } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'staff', label: 'Personal Médico', icon: Users },
    { id: 'appointments', label: 'Citas', icon: Calendar },
    { id: 'specialties', label: 'Especialidades', icon: Settings },
    { id: 'shifts', label: 'Turnos de Trabajo', icon: Clock },
    { id: 'schedules', label: 'Horarios', icon: CalendarDays },
  ];

  return (
    <nav className="bg-white shadow-sm border-r border-blue-100 w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Menú Principal</h2>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-sm ${
                  activeSection === item.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
