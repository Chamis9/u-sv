
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { User } from "@/types/users";
import { supabase } from "@/integrations/supabase/client";

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

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
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
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
  isAdmin: false,
  checkAdminStatus: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();
  const userAuth = useUserAuth();
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Check if admin status is stored in localStorage on initial load
  useEffect(() => {
    const storedAdminStatus = localStorage.getItem('admin_authenticated') === 'true';
    setIsAdmin(storedAdminStatus);
  }, []);
  
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
      console.log('Admin status check:', isUserAdmin, adminData);
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

  // Enhanced logout function that clears auth state
  const enhancedLogout = async () => {
    try {
      // Clean up auth state thoroughly
      cleanupAuthState();
      
      // Clear admin-specific localStorage items
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error("Error during global sign out:", error);
        // Continue even if this fails
      }
      
      // Use the original logout function as fallback
      await supabaseAuth.logout();
      
      // Force set admin status to false
      setIsAdmin(false);
      
      // Force page refresh to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  // Enhanced login function to clean up state first
  const enhancedLogin = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Use original login function
      const success = await userAuth.login(email, password);
      
      // If login was successful, manually refresh session and user data
      if (success) {
        setTimeout(async () => {
          await refreshSession();
          await supabaseAuth.refreshUserData();
        }, 500);
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Enhanced register function to ensure user is created in database
  const enhancedRegister = async (email: string, password: string, userData: any) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Use original register function
      const success = await userAuth.register(email, password, userData);
      
      // If registration was successful, manually check if user exists in registered_users
      if (success) {
        setTimeout(async () => {
          // Get the current user
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user?.email) {
            // Check if user exists in registered_users
            const { data: existingUser } = await supabase
              .from('registered_users')
              .select('*')
              .eq('email', authData.user.email)
              .maybeSingle();
              
            // If user doesn't exist in registered_users, create them
            if (!existingUser) {
              const registeredUserData = {
                auth_user_id: authData.user.id,
                email: authData.user.email,
                first_name: userData.firstName,
                last_name: userData.lastName,
                phone: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null,
                last_sign_in_at: new Date().toISOString()
              };
              
              await supabase
                .from('registered_users')
                .insert([registeredUserData]);
            }
          }
          
          // Refresh session and user data
          await refreshSession();
          await supabaseAuth.refreshUserData();
        }, 500);
      }
      
      return success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Combine both auth implementations with enhanced functions
  const auth = {
    ...supabaseAuth,
    login: enhancedLogin,
    register: enhancedRegister,
    isAuthLoading: supabaseAuth.isAuthLoading || userAuth.isLoading,
    isAuthenticated: supabaseAuth.isAuthenticated || userAuth.isAuth,
    lastAvatarUpdate,
    refreshSession,
    isAdmin,
    checkAdminStatus,
    // Override logout to also clear admin status
    logout: enhancedLogout,
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
