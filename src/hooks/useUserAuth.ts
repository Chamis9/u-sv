
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
          
          // If signed in, make sure to update user data after a short delay
          if (event === 'SIGNED_IN' && session) {
            setTimeout(() => {
              console.log('Updating user data after sign in');
              // Any additional operations can happen here
            }, 0);
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
      console.log('Starting login process for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      console.log('Login successful, user data:', data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting registration process for:', email);
      setIsLoading(true);
      
      // Clean format for user metadata
      const userMetadata = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null,
      };
      
      // Simplified options without email redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
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
      
      console.log('Registration successful, user data:', data);
      
      // Auto login after registration if no email confirmation is required
      if (data.user && !data.user.confirmed_at && !data.user.email_confirmed_at) {
        console.log('User registered but email not confirmed yet.');
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process');
      await supabase.auth.signOut();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuth, isLoading, user, login, register, logout };
}
