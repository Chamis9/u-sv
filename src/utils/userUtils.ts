
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';

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
          status: user.status || 'active'
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
          (typeof authUser.banned === 'boolean' ? authUser.banned : 
           (authUser.user_metadata && typeof authUser.user_metadata.banned === 'boolean') ? 
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
          status: isBanned ? 'inactive' : 'active'
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
    user.id.toLowerCase().includes(lowerSearchTerm)
  );
};

export const downloadUsersCSV = (users: User[], language: { code: string }) => {
  // Generate CSV headers
  const headers = ['ID', 'Email', 'Role', 'Status', 'Created At', 'Last Sign In'];
  
  // Generate CSV rows
  const rows = users.map(user => [
    user.id,
    user.email || '',
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
