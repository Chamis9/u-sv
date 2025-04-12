
import { supabase } from "@/integrations/supabase/client";

export const createAdminUser = async () => {
  try {
    // In a real application, this would be a secure server-side operation
    // This is just a demo implementation
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@netieku.es',
      password: 'raivis2025!',
    });

    if (error) {
      console.error('Error creating admin account:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return false;
  }
};

export const checkAdminCredentials = async (email: string, password: string) => {
  try {
    // For a demo, we'll authenticate the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (error) {
      console.error('Authentication error:', error);
      return false;
    }
    
    // In a real app, you would check if the authenticated user has admin role
    // For this demo, we consider any successful authentication as admin access
    // if the email matches our admin email
    return email === 'admin@netieku.es';
  } catch (error) {
    console.error('Error in checkAdminCredentials:', error);
    return false;
  }
};
