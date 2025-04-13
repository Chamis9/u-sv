import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';
import { toast } from '@/hooks/use-toast';

export const fetchUsers = async () => {
  try {
    console.log("Fetching users from Supabase...");
    
    // First, fetch from registered_users table
    const { data: registeredUsersData, error: registeredUsersError } = await supabase
      .from('registered_users')
      .select('*');
      
    if (registeredUsersError) {
      console.error("Error fetching registered users:", registeredUsersError);
      throw registeredUsersError;
    }
    
    // Additionally, try to get user data from the auth API if available
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.warn("Could not fetch auth users (may require admin rights):", authError);
      
      // If we can't get auth users, just return the registered_users data
      return { 
        data: registeredUsersData?.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          updated_at: user.updated_at,
          role: 'user',
          status: (user.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive'
        })) || [], 
        error: null 
      };
    }
    
    // Combine data from both sources if available
    const users = authData?.users || [];
    
    return { 
      data: registeredUsersData.map(registeredUser => {
        const authUser = users.find(u => u.email === registeredUser.email);
        
        // Check if user is banned or has a banned property in the metadata
        const isBanned = 
          authUser && 
          ((authUser.user_metadata && typeof authUser.user_metadata.banned === 'boolean') ? 
            authUser.user_metadata.banned : false);
            
        return {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          phone: registeredUser.phone,
          created_at: registeredUser.created_at,
          last_sign_in_at: authUser?.last_sign_in_at,
          updated_at: registeredUser.updated_at,
          role: 'user',
          status: (isBanned || registeredUser.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive'
        };
      }), 
      error: null 
    };
  } catch (err) {
    console.error("Unexpected error in fetchUsers:", err);
    return { data: [], error: err instanceof Error ? err : new Error('Unknown error') };
  }
};

export const filterUsers = (users: User[], searchTerm: string): User[] => {
  if (!searchTerm.trim()) {
    return users;
  }
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return users.filter(user => 
    user.email?.toLowerCase().includes(lowerSearchTerm) ||
    user.id.toLowerCase().includes(lowerSearchTerm) ||
    user.name?.toLowerCase().includes(lowerSearchTerm) ||
    user.phone?.toLowerCase().includes(lowerSearchTerm)
  );
};

export const downloadUsersCSV = (users: User[], language: { code: string }) => {
  // Generate CSV headers
  const headers = ['ID', 'Email', 'Name', 'Phone', 'Role', 'Status', 'Created At', 'Last Sign In'];
  
  // Generate CSV rows
  const rows = users.map(user => [
    user.id,
    user.email || '',
    user.name || '',
    user.phone || '',
    user.role || '',
    user.status || '',
    new Date(user.created_at).toLocaleDateString(language.code === 'lv' ? 'lv-LV' : 'en-US'),
    user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString(language.code === 'lv' ? 'lv-LV' : 'en-US') : ''
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `users-${new Date().toISOString().split('T')[0]}.csv`;
  
  return { blob, filename };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Add functions for user management
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
