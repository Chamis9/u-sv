
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/auth/authUtils";
import { syncAuthUser } from "@/utils/syncAuthUser";

export function useAuthActions() {
  // Function for logging out
  const logout = useCallback(async () => {
    try {
      // Clean up auth state thoroughly
      cleanupAuthState();
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error("Error during global sign out:", error);
        // Continue even if this fails
      }
      
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }, []);

  // Function for login
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      
      // Clean up any existing auth state first
      cleanupAuthState();
      
      // Try global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      console.log('Login successful, user data:', data);
      
      // Check if user exists in registered_users table
      if (data.user) {
        setTimeout(async () => {
          await syncAuthUser(data.user);
        }, 100);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // Function for registration
  const register = useCallback(async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting registration process for:', email);
      
      // Clean up auth state before registering
      cleanupAuthState();
      
      // Clean format for user metadata
      const userMetadata = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phoneNumber ? `${userData.countryCode}${userData.phoneNumber}` : null,
      };
      
      // Register using Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
      
      console.log('Registration successful, user data:', data);
      
      // Manually ensure the user is added to registered_users table
      if (data.user) {
        try {
          console.log("Now syncing user with registered_users table");
          const syncResult = await syncAuthUser(data.user);
          console.log("Sync result:", syncResult);
        } catch (syncError) {
          console.error("Error syncing user to registered_users:", syncError);
          // Continue despite sync error; we'll try again on next login
        }
      }
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  return { login, register, logout };
}
