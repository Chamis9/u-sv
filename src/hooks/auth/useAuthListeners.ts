
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthListeners({
  setIsAuthenticated,
  setIsAuthLoading,
  setUserEmail,
  setUser,
  fetchUserData
}: {
  setIsAuthenticated: (value: boolean) => void;
  setIsAuthLoading: (value: boolean) => void;
  setUserEmail: (value: string | null) => void;
  setUser: (value: any) => void;
  fetchUserData: (email: string) => Promise<void>;
}) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsAuthLoading(true);
        
        // Set up auth state change listener first (before getting session)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            
            if (session && session.user) {
              setIsAuthenticated(true);
              setUserEmail(session.user.email);
              
              // Defer data fetching to prevent potential deadlocks
              if (session.user.email) {
                setTimeout(() => {
                  fetchUserData(session.user.email!);
                }, 0);
              }
            } else {
              setIsAuthenticated(false);
              setUserEmail(null);
              setUser(null);
            }
          }
        );
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;
        
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email);
          
          // Fetch user data if authenticated
          if (session.user.email) {
            await fetchUserData(session.user.email);
          }
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
          setUser(null);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setUserEmail(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    
    checkAuth();
  }, [setIsAuthenticated, setIsAuthLoading, setUserEmail, setUser, fetchUserData]);
}
