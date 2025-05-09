
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
  refreshSession: () => Promise<void>;
  isAdmin: boolean; // Add isAdmin property
  checkAdminStatus: () => Promise<boolean>; // Add a function to check admin status
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
  refreshSession: async () => {},
  isAdmin: false, // Initialize isAdmin
  checkAdminStatus: async () => false, // Initialize checkAdminStatus
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();
  const userAuth = useUserAuth();
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check admin status on mount and when authentication changes
  useEffect(() => {
    if (supabaseAuth.isAuthenticated) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [supabaseAuth.isAuthenticated, supabaseAuth.userEmail]);
  
  // Function to check admin status
  const checkAdminStatus = async () => {
    try {
      if (!supabaseAuth.userEmail) return false;
      
      // Check if user is in admin_user table
      const { data: adminData, error } = await supabase
        .from('admin_user')
        .select('*')
        .eq('email', supabaseAuth.userEmail)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      }
      
      const isUserAdmin = !!adminData;
      setIsAdmin(isUserAdmin);
      
      // Store admin status in localStorage for persistence
      if (isUserAdmin) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_email', supabaseAuth.userEmail);
      } else {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_email');
      }
      
      return isUserAdmin;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
      return false;
    }
  };

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
        // Check admin status after refreshing
        await checkAdminStatus();
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
    refreshSession,
    isAdmin, // Add isAdmin to the context
    checkAdminStatus, // Add checkAdminStatus to the context
    // Override refreshUserData to update lastAvatarUpdate
    refreshUserData: async () => {
      await supabaseAuth.refreshUserData();
      await checkAdminStatus(); // Also check admin status when refreshing user data
      setLastAvatarUpdate(Date.now()); // Update timestamp when user data is refreshed
    }
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
