
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { setUserRoleAfterLogin } from '@/utils/authHelpers';

export function useUserAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setIsAuth(!!data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          // Check and set user role after login
          await setUserRoleAfterLogin();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          setIsAuth(!!session);
          setUser(session?.user || null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            // Check and set user role after sign in
            await setUserRoleAfterLogin();
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('user_role');
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      if (data.user) {
        // Check and set user role after login
        await setUserRoleAfterLogin();
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting registration process for:', email);
      
      // Default role is user for all new registrations
      const roleData = { ...userData, role: 'user' };
      
      // Simplified options without email redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: roleData.firstName,
            last_name: roleData.lastName,
            phone: roleData.phoneNumber ? `${roleData.countryCode}${roleData.phoneNumber}` : null,
            role: roleData.role // Store role in user metadata
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      // Set default role in localStorage
      localStorage.setItem('user_role', roleData.role || 'user');
      
      console.log('Registration successful, user data:', data);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear role before logout
      localStorage.removeItem('user_role');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuth, isLoading, user, login, register, logout };
}
