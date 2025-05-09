
import { supabase } from '@/integrations/supabase/client';
import { CreateUserProfileParams, CreateUserProfileResult } from '@/utils/rpcFunctions';

/**
 * Synchronizes the authenticated user with the registered_users table
 * @param authUser The authenticated user from Supabase Auth
 */
export async function syncAuthUser(authUser: any) {
  if (!authUser || !authUser.email) return null;
  
  try {
    console.log("Attempting to sync user in registered_users:", authUser.email);
    
    // First try the RPC function for direct database access (requires SQL function setup)
    try {
      const params: CreateUserProfileParams = {
        user_id: authUser.id,
        user_email: authUser.email,
        first_name: authUser.user_metadata?.first_name || null,
        last_name: authUser.user_metadata?.last_name || null,
        phone_number: authUser.user_metadata?.phone || null
      };
      
      const { data, error: rpcError } = await supabase.rpc<CreateUserProfileResult>(
        'create_user_profile', 
        params
      );
      
      if (!rpcError) {
        console.log("User synced with RPC function:", data);
        return data;
      } else {
        console.log("RPC function failed, will try edge function:", rpcError);
      }
    } catch (rpcErr) {
      console.error("RPC method not available:", rpcErr);
    }
    
    // Check if user already exists in registered_users
    const { data: existingUser, error: checkError } = await supabase
      .from('registered_users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking if user exists:', checkError);
    } else if (existingUser) {
      console.log("User already exists in registered_users:", existingUser);
      
      // User exists, update last sign in time
      const { data: updatedUser, error: updateError } = await supabase
        .from('registered_users')
        .update({ 
          last_sign_in_at: new Date().toISOString(),
          auth_user_id: authUser.id // Ensure auth_user_id is up to date
        })
        .eq('email', authUser.email)
        .select()
        .single();
        
      if (updateError) {
        console.error('Error updating user last sign in:', updateError);
      }
      
      return updatedUser || existingUser;
    } else {
      // User doesn't exist, call edge function to create user (bypassing RLS)
      console.log("User does not exist in registered_users, creating...");
      
      try {
        const response = await fetch(`${window.location.origin}/api/createUserProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: authUser.id,
            user_email: authUser.email,
            first_name: authUser.user_metadata?.first_name || null,
            last_name: authUser.user_metadata?.last_name || null,
            phone_number: authUser.user_metadata?.phone || null
          })
        });
        
        const result = await response.json();
        
        if (result.error) {
          console.error("Error from edge function:", result.error);
          return null;
        }
        
        console.log("User created via edge function:", result.data);
        return result.data;
      } catch (edgeFnError) {
        console.error("Error calling edge function:", edgeFnError);
        
        // Fallback: Try direct insert (might fail due to RLS)
        console.log("Attempting direct insert as fallback...");
        
        const newUserData = {
          auth_user_id: authUser.id,
          email: authUser.email,
          first_name: authUser.user_metadata?.first_name || null,
          last_name: authUser.user_metadata?.last_name || null,
          phone: authUser.user_metadata?.phone || null,
          last_sign_in_at: new Date().toISOString()
        };
        
        const { data: newUser, error: insertError } = await supabase
          .from('registered_users')
          .insert([newUserData])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error in direct fallback insert:', insertError);
          return null;
        }
        
        return newUser;
      }
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
  
  return null;
}

/**
 * Updates the user's profile in the registered_users table
 * @param userId The ID of the user in the registered_users table
 * @param userData The updated user data
 */
export async function updateUserProfile(userId: string, userData: any) {
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}
