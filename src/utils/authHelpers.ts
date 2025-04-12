
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
    // For a demo, we'll just check if the credentials match our hardcoded admin
    if (email === 'admin@netieku.es' && password === 'raivis2025!') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in checkAdminCredentials:', error);
    return false;
  }
};
