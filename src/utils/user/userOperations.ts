
import type { User } from '@/types/users';
import { updateUserBase, deleteUserBase } from '../operations/baseOperations';
import { supabase } from '@/integrations/supabase/client';

export async function updateUser(user: User) {
  return updateUserBase(user, 'registered_users', {
    name: user.name,
    phone: user.phone,
    status: user.status
  });
}

export async function deleteUser(userId: string) {
  return deleteUserBase(userId, 'registered_users');
}

export async function toggleUserStatus(user: User) {
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  
  return updateUserBase(user, 'registered_users', {
    status: newStatus
  });
}

interface CreateUserParams {
  name?: string;
  email: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

export async function createUser(userData: CreateUserParams) {
  try {
    console.log(`Creating new user:`, userData);
    
    const newUser = {
      name: userData.name || null,
      email: userData.email,
      phone: userData.phone || null,
      status: userData.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('registered_users')
      .insert(newUser)
      .select('*')
      .single();
    
    if (error) {
      console.error(`Error creating user:`, error);
      return { 
        success: false, 
        error: error.message,
        data: null
      };
    }
    
    // Transform the response to match our User type
    const createdUser: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      status: data.status as 'active' | 'inactive',
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_sign_in_at: null,
      role: 'user'
    };
    
    return { 
      success: true, 
      data: createdUser,
      error: null
    };
  } catch (err) {
    console.error(`Unexpected error creating user:`, err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      data: null
    };
  }
}
