import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, userType: 'player' | 'rink') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthState().catch((error) => {
      console.error('Failed to check auth state:', error);
    });
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: Check for stored authentication token
      // For now, simulate checking auth state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in production, fetch from secure storage or API
      const mockUser: User = {
        id: 'user-1',
        name: 'Alex Chen',
        email: 'alex@example.com',
        role: 'player',
        createdAt: '2025-01-01',
      };
      
      // Uncomment to simulate logged in user
      // setUser(mockUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual login logic with Supabase
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login response
      const mockUser: User = {
        id: 'user-1',
        name: email.includes('rink') || email.includes('admin') ? 'John Smith' : 'Alex Chen',
        email: email,
        role: email.includes('rink') || email.includes('admin') ? 'rink_owner' : 'player',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      
      // Auto-redirect based on role
      setTimeout(() => {
        if (mockUser.role === 'rink_owner' || mockUser.role === 'rink_admin') {
          router.push('/rink-dashboard');
        } else {
          router.push('/(tabs)');
        }
      }, 100);
    } catch (error) {
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, userType: 'player' | 'rink') => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual registration logic with Supabase
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration response
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: userType === 'player' 
          ? `${userData.firstName} ${userData.lastName}`
          : `${userData.ownerFirstName} ${userData.ownerLastName}`,
        email: userData.email,
        role: userType === 'player' ? 'player' : 'rink_owner',
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Implement actual logout logic
      // Clear tokens, etc.
      
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}