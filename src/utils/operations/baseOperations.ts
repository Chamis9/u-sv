
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';

export interface OperationResult {
  success: boolean;
  error?: string;
}

export async function updateUserBase<T extends User>(
  user: T, 
  tableName: string, 
  updateFields: Record<string, any>
): Promise<OperationResult> {
  try {
    console.log(`Updating user in ${tableName}:`, user.id);
    
    const { error } = await supabase
      .from(tableName)
      .update({
        ...updateFields,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error(`Error updating user in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error(`Unexpected error in update${tableName}:`, err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}

export async function deleteUserBase(
  userId: string, 
  tableName: string
): Promise<OperationResult> {
  try {
    console.log(`Deleting user from ${tableName}:`, userId);
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error(`Error deleting user from ${tableName}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error(`Unexpected error in delete${tableName}:`, err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}
