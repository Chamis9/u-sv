
import { supabase } from "@/integrations/supabase/client";

// Check if the user is an admin by querying the admin_user table
export const checkAdminCredentials = async (email: string, password: string) => {
  try {
    console.log("Checking admin credentials for:", email);
    
    // Attempt to sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Authentication error:', authError);
      return false;
    }

    if (!authData.user) {
      console.error('No user found');
      return false;
    }

    // Check if the user is in the admin_user table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      await supabase.auth.signOut();
      return false;
    }

    if (!adminData) {
      console.error('User is not an admin');
      await supabase.auth.signOut();
      return false;
    }

    console.log('User authenticated as admin successfully');
    
    // If we get here, the user is authenticated and is an admin
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_role', 'admin');
    
    // Dispatch an event to update the admin count (for UI purposes)
    document.dispatchEvent(new CustomEvent('adminLoggedIn', { 
      detail: { email }
    }));
    
    return true;
  } catch (error) {
    console.error('Error in checkAdminCredentials:', error);
    return false;
  }
};

// Check if a user has a specific role
export const checkUserRole = async (userId: string): Promise<string> => {
  try {
    // First check if user is in admin_user table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (!adminError && adminData) {
      return 'admin';
    }
    
    // If not an admin, they're a regular user
    return 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return 'user'; // Default to regular user on error
  }
};

// This function is no longer needed since we're only using Supabase Auth
export const createAdminUser = async () => {
  console.log("Creating admin users is handled through Supabase Auth directly");
  return true;
};

// Check if admin setup is complete by checking if any admin users exist
export const setupAdminAccount = async () => {
  try {
    // Check if any admin users exist in the admin_user table
    const { data: adminUsers, error: checkError } = await supabase
      .from('admin_user')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('Error checking for admin users:', checkError);
      return false;
    }

    // If we have any admin users, setup is complete
    return adminUsers && adminUsers.length > 0;
  } catch (error) {
    console.error('Error in setupAdminAccount:', error);
    return false;
  }
};

// Helper to check if the current user is authenticated as admin
export const isAdminAuthenticated = () => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

// Helper to clear admin authentication
export const clearAdminAuthentication = () => {
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_role');
};

// Helper to check user's role after login
export const setUserRoleAfterLogin = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Check if the user is in admin_user table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_user')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();

    if (!adminError && adminData) {
      localStorage.setItem('user_role', 'admin');
      return 'admin';
    }

    // Default to regular user
    localStorage.setItem('user_role', 'user');
    return 'user';
  } catch (error) {
    console.error('Error in setUserRoleAfterLogin:', error);
    localStorage.setItem('user_role', 'user');
    return 'user';
  }
};

// Get the current user's role from localStorage
export const getCurrentUserRole = (): string => {
  return localStorage.getItem('user_role') || 'user';
};
