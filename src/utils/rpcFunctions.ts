
// This file defines the types for RPC functions available in Supabase
// The actual implementations are in the database

export interface GetUserByEmailResult {
  id: string;
  auth_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  status: 'active' | 'inactive';
  avatar_url: string | null;
}

export interface GetUserByIdResult {
  id: string;
  auth_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  status: 'active' | 'inactive';
  avatar_url: string | null;
}

export interface GetUserByAuthIdResult {
  id: string;
  auth_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  status: 'active' | 'inactive';
  avatar_url: string | null;
}

export interface UpdateUserProfileParams {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
}

export interface UpdateUserAvatarParams {
  user_id: string;
  new_avatar_url: string;
}
