
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@/types';
import { 
  getSession, 
  saveSession, 
  clearSession, 
  getUsers, 
  saveUser, 
  verifyCredentials,
  getUserByEmail,
  userExistsByEmail,
  userExistsByUsername
} from '@/services/localStorage';
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
    role: 'admin' | 'patient' | 'medical_staff';
  }) => boolean;
  resetPassword: (email: string, newPassword: string) => boolean;
  verifyUserExists: (email: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Recuperar sesión guardada
    const savedSession = getSession();
    if (savedSession) {
      setSession(savedSession);
    }

    // Listen for localStorage changes for synchronization
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'medical_system_session') {
        const newSession = getSession();
        setSession(newSession);
      }
    };

    window.addEventListener('localStorageChange', handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('localStorageChange', handleStorageChange as EventListener);
    };
  }, []);

  const verifyUserExists = (email: string): boolean => {
    return userExistsByEmail(email);
  };

  const resetPassword = (email: string, newPassword: string): boolean => {
    const user = getUserByEmail(email);
    
    if (user) {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex >= 0) {
        users[userIndex].password = newPassword;
        localStorage.setItem('medical_system_users', JSON.stringify(users));
        
        toast({
          title: "Contraseña restablecida",
          description: "Tu contraseña ha sido actualizada correctamente",
        });
        
        return true;
      }
    }

    toast({
      title: "Error",
      description: "No se encontró un usuario con ese email",
      variant: "destructive",
    });
    
    return false;
  };

  const login = (username: string, password: string): boolean => {
    const user = verifyCredentials(username, password);
    
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
    role: 'admin' | 'patient' | 'medical_staff';
  }): boolean => {
    // Verificar si el usuario ya existe
    if (userExistsByUsername(userData.username)) {
      toast({
        title: "Error de registro",
        description: "El nombre de usuario ya está en uso",
        variant: "destructive",
      });
      return false;
    }

    if (userExistsByEmail(userData.email)) {
      toast({
        title: "Error de registro",
        description: "El email ya está registrado",
        variant: "destructive",
      });
      return false;
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      role: userData.role,
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
        resetPassword,
        verifyUserExists,
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
