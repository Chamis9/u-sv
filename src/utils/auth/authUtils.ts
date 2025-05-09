
import { supabase } from "@/integrations/supabase/client";

// Helper function to clean up auth state
export const cleanupAuthState = () => {
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

// Function to check admin status
export const checkAdminStatus = async (userEmail: string | null): Promise<boolean> => {
  try {
    if (!userEmail) return false;
    
    // Check if user is in admin_user table
    const { data: adminData, error } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    const isUserAdmin = !!adminData;
    console.log('Admin status check:', isUserAdmin, adminData);
    
    // Store admin status in localStorage for persistence
    if (isUserAdmin) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', userEmail);
    } else {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
    }
    
    return isUserAdmin;
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    return false;
  }
};

// Function to refresh session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
      return false;
    } else {
      console.log("Session refreshed successfully");
      return true;
    }
  } catch (err) {
    console.error("Exception refreshing session:", err);
    return false;
  }
};
