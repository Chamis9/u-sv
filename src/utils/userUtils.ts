
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/users';

export const fetchUsers = async () => {
  try {
    console.log("Fetching users from Supabase...");
    
    const { data, error } = await supabase
      .from('admin_user')
      .select('*');
      
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    // Additionally, try to get user data from the auth API if available
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.warn("Could not fetch auth users (may require admin rights):", authError);
      
      // If we can't get auth users, just return the admin_user data we have
      return { 
        data: data?.map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: null,
          updated_at: null,
          role: 'admin',
          status: 'active'
        })) || [], 
        error: null 
      };
    }
    
    // Combine data from both sources if available
    const users = authData?.users || [];
    
    return { 
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        updated_at: user.updated_at,
        role: 'user',
        status: user.banned ? 'inactive' : 'active'
      })), 
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
