
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { verifyUserExists, resetPassword } = useAuth();

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.password = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      if (verifyUserExists(email)) {
        setStep('password');
      } else {
        setErrors({ email: 'No se encontró un usuario registrado con ese email' });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const success = resetPassword(email, newPassword);
      if (success) {
        setTimeout(() => {
          onBackToLogin();
        }, 1500);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
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
            <CardTitle className="text-xl sm:text-2xl font-bold text-blue-900">
              Restablecer Contraseña
            </CardTitle>
            <CardDescription className="text-blue-600 text-sm">
              {step === 'email' 
                ? 'Ingresa tu email registrado para continuar'
                : 'Crea tu nueva contraseña'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900 text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-blue-200 focus:border-blue-500 h-10 text-sm pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verificando...' : 'Continuar'}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-blue-600">
                    ¿Recordaste tu contraseña?{' '}
                    <button
                      type="button"
                      onClick={onBackToLogin}
                      className="font-medium text-blue-700 hover:text-blue-800 underline"
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-blue-900 text-sm font-medium">
                    Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="border-blue-200 focus:border-blue-500 h-10 text-sm pl-10"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-900 text-sm font-medium">
                    Confirmar Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repite la nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="border-blue-200 focus:border-blue-500 h-10 text-sm pl-10"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? 'Actualizando...' : 'Restablecer Contraseña'}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                  >
                    Volver al paso anterior
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-blue-100 pt-4 mt-6">
              <p className="text-xs text-blue-600 text-center">
                Para restablecer tu contraseña necesitas tener una cuenta registrada en el sistema
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
