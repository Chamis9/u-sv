
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";

/**
 * Centralized user utilities to replace duplicated functionality across files
 */

// Check if user email exists in the database
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_email_exists', { check_email: email });
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if email exists:", error);
    return false;
  }
};

// Update user status (active/inactive)
export const toggleUserStatus = async (user: User): Promise<{success: boolean, error?: string}> => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('registered_users')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Update user data
export const updateUser = async (user: User): Promise<{success: boolean, error?: string}> => {
  try {
    const { error } = await supabase
      .from('registered_users')
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<{success: boolean, error?: string}> => {
  try {
    const { error } = await supabase
      .from('registered_users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Format user data for display
export const formatUserData = (userData: any): User => ({
  id: userData.id,
  email: userData.email,
  first_name: userData.first_name,
  last_name: userData.last_name,
  phone: userData.phone,
  created_at: userData.created_at,
  updated_at: userData.updated_at,
  last_sign_in_at: userData.last_sign_in_at,
  role: 'user',
  status: userData.status || 'active',
  avatar_url: userData.avatar_url
});

// Download user data as CSV
export const downloadUsersCSV = (users: User[], currentLanguage: { code: string }) => {
  if (!users || users.length === 0) {
    throw new Error('No users to download');
  }

  const isLv = currentLanguage.code === 'lv';
  const headers = [
    isLv ? 'ID' : 'ID',
    isLv ? 'E-pasts' : 'Email',
    isLv ? 'Vārds' : 'First Name',
    isLv ? 'Uzvārds' : 'Last Name',
    isLv ? 'Tālrunis' : 'Phone',
    isLv ? 'Statuss' : 'Status',
    isLv ? 'Izveidots' : 'Created At'
  ].join(',');

  const rows = users.map(user => {
    const formattedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : '';
    return `"${user.id}","${user.email || ''}","${user.first_name || ''}","${user.last_name || ''}","${user.phone || ''}","${user.status || 'active'}","${formattedDate}"`;
  }).join('\n');

  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const filename = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;

  return { blob, filename };
};

// Helper function to download a blob as a file
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
