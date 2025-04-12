
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
    
    // Check if this user is in the admin_users table
    if (data.user) {
      // Cast the id to the correct type for the query
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select()
        .eq('id', data.user.id as any) // Use type assertion to bypass TypeScript error
        .single();
      
      if (adminError || !adminData) {
        console.error('Not an admin user:', adminError);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in checkAdminCredentials:', error);
    return false;
  }
};
