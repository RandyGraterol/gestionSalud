
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'reset'>('login');
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
      setCurrentView('login');
    }
  };

  if (currentView === 'register') {
    return (
      <RegisterForm 
        onBackToLogin={() => setCurrentView('login')}
        onRegister={handleRegister}
      />
    );
  }

  if (currentView === 'reset') {
    return (
      <ResetPasswordForm 
        onBackToLogin={() => setCurrentView('login')}
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
              
              {/* Enlace para restablecer contraseña */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setCurrentView('reset')}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
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
                  onClick={() => setCurrentView('register')}
                  className="font-medium text-blue-700 hover:text-blue-800 underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
