
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@/types';
import { getSession, saveSession, clearSession, getUsers, saveUser } from '@/services/localStorage';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'patient' | 'medical_staff';
  }) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedSession = getSession();
    if (savedSession) {
      setSession(savedSession);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Credenciales predefinidas - Solo admin y paciente
    const predefinedUsers = [
      { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador del Sistema Hospitalario' },
      { username: 'cliente', password: 'cliente123', role: 'patient', name: 'Juan Pérez' }
    ];

    // Verificar usuarios predefinidos
    let user = predefinedUsers.find(u => u.username === username && u.password === password);
    
    // Si no es un usuario predefinido, verificar usuarios registrados
    if (!user) {
      const registeredUsers = getUsers();
      const registeredUser = registeredUsers.find(u => u.username === username && u.password === password);
      
      if (registeredUser) {
        user = {
          username: registeredUser.username,
          password: registeredUser.password,
          role: registeredUser.role,
          name: registeredUser.name
        };
      }
    }
    
    if (user) {
      const newSession: Session = {
        userId: user.username,
        role: user.role as 'admin' | 'patient' | 'medical_staff',
        name: user.name,
        createdAt: new Date().toISOString(),
      };
      
      setSession(newSession);
      saveSession(newSession);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido/a, ${user.name}`,
      });
      
      return true;
    }
    
    toast({
      title: "Error de autenticación",
      description: "Usuario o contraseña incorrectos",
      variant: "destructive",
    });
    
    return false;
  };

  const register = (userData: {
    username: string;
    password: string;
    name: string;
    email: string;
    role: 'patient' | 'medical_staff';
  }): boolean => {
    const existingUsers = getUsers();
    
    // Verificar si el usuario ya existe
    const userExists = existingUsers.some(user => 
      user.username === userData.username || user.email === userData.email
    );

    if (userExists) {
      toast({
        title: "Error de registro",
        description: "El usuario o email ya existe",
        variant: "destructive",
      });
      return false;
    }

    // Crear nuevo usuario (solo pacientes pueden registrarse)
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      role: 'patient', // Forzar rol de paciente para nuevos registros
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    toast({
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
    });

    return true;
  };

  const logout = () => {
    setSession(null);
    clearSession();
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        login, 
        logout, 
        register,
        isAuthenticated: !!session 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
