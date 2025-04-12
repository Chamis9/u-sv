
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: User | null;
  session: Session | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  user: null,
  session: null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuthStatus = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        setSession(session);
      } catch (error) {
        console.error('Auth status check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        setSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        description: "You have successfully logged out",
      });
      
      // Use window.logout which is defined in App.tsx
      if (window.logout) {
        window.logout();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        user,
        session,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
