
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface RegisterFormProps {
  onBackToLogin: () => void;
  onRegister: (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'patient' | 'medical_staff';
  }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: 'patient' as 'patient' | 'medical_staff'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      onRegister({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
      setIsLoading(false);
    }, 500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLogin}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1" />
            </div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
              Registro
            </CardTitle>
            <CardDescription className="text-blue-600 text-sm lg:text-base">
              Crea tu cuenta en el sistema médico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-blue-900 text-sm font-medium">
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-blue-900 text-sm font-medium">
                    Tipo de Usuario
                  </Label>
                  <Select value={formData.role} onValueChange={(value: 'patient' | 'medical_staff') => handleInputChange('role', value)}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Paciente</SelectItem>
                      <SelectItem value="medical_staff">Personal Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-900 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-900 text-sm font-medium">
                  Usuario
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-900 text-sm font-medium">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
                  />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-900 text-sm font-medium">
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 sm:h-10 text-sm lg:text-base mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </form>
            
            <div className="text-center pt-2">
              <p className="text-sm text-blue-600">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={onBackToLogin}
                  className="font-medium text-blue-700 hover:text-blue-800 underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
