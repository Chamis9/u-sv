
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { User } from "@/types/users";
import { supabase } from "@/integrations/supabase/client";
import { setUserRoleAfterLogin, getCurrentUserRole } from "@/utils/authHelpers";

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail: string | null;
  user: User | null;
  userRole: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  lastAvatarUpdate: number;
  refreshSession: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAuthLoading: true,
  userEmail: null,
  user: null,
  userRole: 'user',
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUserData: async () => {},
  lastAvatarUpdate: Date.now(),
  refreshSession: async () => {}, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();
  const userAuth = useUserAuth();
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  const [userRole, setUserRole] = useState<string>(getCurrentUserRole());
  
  // Add effect to check user role when auth state changes
  useEffect(() => {
    if (supabaseAuth.isAuthenticated) {
      const checkRole = async () => {
        const role = await setUserRoleAfterLogin();
        setUserRole(role || 'user');
      };
      checkRole();
    } else {
      setUserRole('user');
    }
  }, [supabaseAuth.isAuthenticated]);

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
        
        // Also check role again
        const role = await setUserRoleAfterLogin();
        setUserRole(role || 'user');
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

  // Custom logout function that clears user role
  const customLogout = async () => {
    localStorage.removeItem('user_role');
    setUserRole('user');
    return supabaseAuth.logout();
  };

  // Combine both auth implementations
  const auth = {
    ...supabaseAuth,
    login: userAuth.login,
    register: userAuth.register,
    isAuthLoading: supabaseAuth.isAuthLoading || userAuth.isLoading,
    isAuthenticated: supabaseAuth.isAuthenticated || userAuth.isAuth,
    lastAvatarUpdate,
    userRole,
    refreshSession, 
    logout: customLogout,
    // Override refreshUserData to update lastAvatarUpdate
    refreshUserData: async () => {
      await supabaseAuth.refreshUserData();
      setLastAvatarUpdate(Date.now()); // Update timestamp when user data is refreshed
      
      // Also check role again
      const role = await setUserRoleAfterLogin();
      setUserRole(role || 'user');
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
