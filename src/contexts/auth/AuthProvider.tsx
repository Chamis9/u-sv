
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useUserAuth } from "@/hooks/useUserAuth";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { cleanupAuthState, checkAdminStatus as checkUserAdminStatus, refreshSession as refreshAuthSession } from "@/utils/auth/authUtils";

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
    const result = await checkUserAdminStatus(supabaseAuth.userEmail);
    setIsAdmin(result);
    return result;
  };

  // Add refreshSession function to refresh auth session
  const refreshSession = async () => {
    try {
      const success = await refreshAuthSession();
      if (success) {
        // After refreshing, also fetch the latest user data
        await supabaseAuth.refreshUserData();
        // Check admin status after refreshing
        await checkAdminStatus();
      }
    } catch (err) {
      console.error("Exception in refreshSession:", err);
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

  // Override refreshUserData to update lastAvatarUpdate
  const enhancedRefreshUserData = async () => {
    await supabaseAuth.refreshUserData();
    await checkAdminStatus(); // Also check admin status when refreshing user data
    setLastAvatarUpdate(Date.now()); // Update timestamp when user data is refreshed
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
    refreshUserData: enhancedRefreshUserData
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
