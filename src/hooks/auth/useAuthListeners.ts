
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthListenersProps {
  setIsAuthenticated: (value: boolean) => void;
  setIsAuthLoading: (value: boolean) => void;
  setUserEmail: (value: string | null) => void;
  setUser: (value: any) => void;
  fetchUserData: (email: string | null) => Promise<void>;
}

export function useAuthListeners({
  setIsAuthenticated,
  setIsAuthLoading,
  setUserEmail,
  setUser,
  fetchUserData
}: AuthListenersProps) {
  useEffect(() => {
    console.log("Setting up auth listeners");
    setIsAuthLoading(true);
    
    // Check current session first
    const getCurrentSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsAuthLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          console.log("Found existing session:", sessionData.session.user.email);
          setIsAuthenticated(true);
          setUserEmail(sessionData.session.user.email);
          
          // Use setTimeout to avoid potential Supabase auth deadlocks
          setTimeout(async () => {
            try {
              await fetchUserData(sessionData.session?.user.email || null);
            } catch (error) {
              console.error('Error fetching user data:', error);
            } finally {
              setIsAuthLoading(false);
            }
          }, 0);
        } else {
          console.log("No session found");
          setIsAuthenticated(false);
          setUserEmail(null);
          setUser(null);
          setIsAuthLoading(false);
        }
      } catch (error) {
        console.error('Error in getCurrentSession:', error);
        setIsAuthLoading(false);
      }
    };
    
    getCurrentSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        setIsAuthenticated(true);
        setUserEmail(session.user.email);
        
        // Use setTimeout to avoid potential Supabase auth deadlocks
        setTimeout(async () => {
          try {
            await fetchUserData(session.user.email);
          } catch (error) {
            console.error('Error fetching user data on sign in:', error);
          }
        }, 0);
      } 
      else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAuthenticated(false);
        setUserEmail(null);
        setUser(null);
      }
    });
    
    return () => {
      console.log("Cleaning up auth listeners");
      authListener.subscription.unsubscribe();
    };
  }, [setIsAuthenticated, setIsAuthLoading, setUserEmail, setUser, fetchUserData]);
}
