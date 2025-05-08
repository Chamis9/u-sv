
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { User } from "@/types/users";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  lastAvatarUpdate: number;
  refreshSession: () => Promise<void>; // Added refreshSession method
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUserData: async () => {},
  lastAvatarUpdate: Date.now(),
  refreshSession: async () => {}, // Added refreshSession method
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();
  const userAuth = useUserAuth();
  // Add state for lastAvatarUpdate
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  
  // Add refreshSession function to refresh auth session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
      } else {
        console.log("Session refreshed successfully");
        // After refreshing, also fetch the latest user data
        await supabaseAuth.refreshUserData();
      }
    } catch (err) {
      console.error("Exception refreshing session:", err);
    }
  };

  // Add an effect to refresh the session periodically
  useEffect(() => {
    // Refresh the session every 15 minutes
    const interval = setInterval(() => {
      refreshSession();
    }, 1000 * 60 * 15); // 15 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Combine both auth implementations
  const auth = {
    ...supabaseAuth,
    login: userAuth.login,
    register: userAuth.register,
    isAuthLoading: supabaseAuth.isAuthLoading || userAuth.isLoading,
    isAuthenticated: supabaseAuth.isAuthenticated || userAuth.isAuth,
    lastAvatarUpdate,
    refreshSession, // Add the refreshSession method
    // Override refreshUserData to update lastAvatarUpdate
    refreshUserData: async () => {
      await supabaseAuth.refreshUserData();
      setLastAvatarUpdate(Date.now()); // Update timestamp when user data is refreshed
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
