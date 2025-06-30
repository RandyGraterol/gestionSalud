
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { session, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-900">Sistema Médico</h1>
          </div>
          
          {session && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{session.name}</span>
                <span className="text-sm text-blue-500 capitalize">({session.role})</span>
              </div>
              
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
