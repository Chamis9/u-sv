
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/auth/authUtils";
import { syncAuthUser } from "@/utils/syncAuthUser";

type LoginFn = (email: string, password: string) => Promise<boolean>;
type RegisterFn = (email: string, password: string, userData: any) => Promise<boolean>;
type LogoutFn = () => Promise<void>;
type RefreshUserDataFn = () => Promise<void>;
type RefreshSessionFn = () => Promise<void>;

export function useEnhancedAuthActions(
  userAuthLogin: LoginFn,
  userAuthRegister: RegisterFn,
  supabaseAuthLogout: LogoutFn,
  refreshUserData: RefreshUserDataFn,
  refreshSession: RefreshSessionFn,
  setIsAdmin: (value: boolean) => void
) {
  const [lastAvatarUpdate, setLastAvatarUpdate] = useState<number>(Date.now());

  // Enhanced logout function that clears auth state
  const enhancedLogout = useCallback(async () => {
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
      await supabaseAuthLogout();
      
      // Force set admin status to false
      setIsAdmin(false);
      
      // Force page refresh to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }, [supabaseAuthLogout, setIsAdmin]);

  // Enhanced login function to clean up state first
  const enhancedLogin = useCallback(async (email: string, password: string) => {
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
      const success = await userAuthLogin(email, password);
      
      // If login was successful, manually refresh session and user data
      if (success) {
        setTimeout(async () => {
          await refreshSession();
          await refreshUserData();
        }, 500);
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [userAuthLogin, refreshSession, refreshUserData]);

  // Enhanced register function to ensure user is created in database
  const enhancedRegister = useCallback(async (email: string, password: string, userData: any) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Use original register function
      const success = await userAuthRegister(email, password, userData);
      
      // If registration was successful, ensure the user is in registered_users table
      if (success) {
        try {
          // Get the current user
          const { data: authData } = await supabase.auth.getUser();
          
          if (authData?.user) {
            console.log("Registration successful, syncing user to registered_users table:", authData.user);
            
            // Use RPC function to bypass RLS and ensure user is created in registered_users
            const { data: syncedUser, error: syncError } = await supabase.rpc('create_user_profile', {
              user_id: authData.user.id,
              user_email: authData.user.email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone_number: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null
            });
            
            if (syncError) {
              console.error("Error syncing user to registered_users:", syncError);
            } else {
              console.log("User successfully synced to registered_users:", syncedUser);
            }
          }
          
          // Refresh session and user data
          setTimeout(async () => {
            await refreshSession();
            await refreshUserData();
          }, 500);
        } catch (err) {
          console.error("Error in post-registration process:", err);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, [userAuthRegister, refreshSession, refreshUserData]);

  // Override refreshUserData to update lastAvatarUpdate
  const enhancedRefreshUserData = useCallback(async () => {
    await refreshUserData();
    setLastAvatarUpdate(Date.now()); // Update timestamp when user data is refreshed
  }, [refreshUserData]);

  return {
    enhancedLogin,
    enhancedRegister,
    enhancedLogout,
    enhancedRefreshUserData,
    lastAvatarUpdate
  };
}
