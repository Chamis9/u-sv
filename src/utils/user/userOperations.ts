
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';
import { toast } from '@/hooks/use-toast';

export const updateUser = async (user: User): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Updating user in Supabase:", user);
    
    const { error } = await supabase
      .from('registered_users')
      .update({
        name: user.name,
        phone: user.phone,
        status: user.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error("Error updating user:", error);
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
    console.log("Deleting user from Supabase:", userId);
    
    const { error } = await supabase
      .from('registered_users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error("Error deleting user:", error);
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

export const toggleUserStatus = async (user: User): Promise<{ success: boolean; error?: string }> => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    console.log(`Changing user status to ${newStatus}:`, user.id);
    
    const { error } = await supabase
      .from('registered_users')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in toggleUserStatus:", err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
};
