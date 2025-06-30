
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from './RegisterForm';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 500);
  };

  const handleRegister = (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'patient' | 'medical_staff';
  }) => {
    const success = register(userData);
    if (success) {
      setShowRegister(false);
    }
  };

  const fillCredentials = (user: 'admin' | 'cliente') => {
    if (user === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (user === 'cliente') {
      setUsername('cliente');
      setPassword('cliente123');
    }
  };

  if (showRegister) {
    return (
      <RegisterForm 
        onBackToLogin={() => setShowRegister(false)}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4 px-6">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-blue-900">
              Sistema Hospitalario
            </CardTitle>
            <CardDescription className="text-blue-600 text-sm lg:text-base">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900 text-sm font-medium">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500 h-10 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900 text-sm font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-500 h-10 text-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm lg:text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-3">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="font-medium text-blue-700 hover:text-blue-800 underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
            
            {/* Credenciales de prueba */}
            <div className="space-y-3">
              <div className="border-t border-blue-100 pt-3">
                <p className="text-xs text-blue-700 font-medium text-center mb-2">
                  Credenciales de prueba:
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials('admin')}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-auto py-2 flex flex-col items-center justify-center"
                >
                  <span className="text-sm mb-0.5">🏥</span>
                  <span className="font-medium text-xs leading-tight">Panel Administrador/Médico</span>
                  <span className="text-xs opacity-75 leading-tight">admin / admin123</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillCredentials('cliente')}
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 h-auto py-2 flex flex-col items-center justify-center"
                >
                  <span className="text-sm mb-0.5">👤</span>
                  <span className="font-medium text-xs leading-tight">Panel Paciente</span>
                  <span className="text-xs opacity-75 leading-tight">cliente / cliente123</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
