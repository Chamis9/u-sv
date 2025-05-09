
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthActions } from './auth/useAuthActions';

export function useUserAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { login: authLogin, register: authRegister, logout: authLogout } = useAuthActions();

  // Check for authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setIsAuth(!!data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email || 'No session');
          setIsAuth(!!session);
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  return { 
    isAuth, 
    isLoading, 
    user, 
    login: authLogin, 
    register: authRegister, 
    logout: authLogout 
  };
}
