
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';

export const updateUser = async (user: User): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Updating admin user in Supabase:", user);
    
    const { error } = await supabase
      .from('admin_user')
      .update({
        email: user.email,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error("Error updating admin user:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateUser:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Deleting admin user from Supabase:", userId);
    
    const { error } = await supabase
      .from('admin_user')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error("Error deleting admin user:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in deleteUser:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
};
