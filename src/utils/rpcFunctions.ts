
// This file defines the types of RPC functions expected to be available in Supabase
// The actual implementations are on the server side

// get_user_by_email function signature
export interface GetUserByEmailResult {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  status: string;
  avatar_url: string | null;
}

// get_user_by_id function signature
export interface GetUserByIdResult {
  id: string;
  first_name: string;
  last_name: string;
}

// update_user_avatar function signature
export interface UpdateUserAvatarParams {
  user_id: string;
  new_avatar_url: string;
}
