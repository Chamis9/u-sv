
import { supabase } from '@/integrations/supabase/client';

/**
 * Synchronizes the authenticated user with the registered_users table
 * @param authUser The authenticated user from Supabase Auth
 */
export async function syncAuthUser(authUser: any) {
  if (!authUser || !authUser.email) return null;
  
  try {
    // Check if user already exists in registered_users
    const { data: existingUser, error: checkError } = await supabase
      .from('registered_users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking if user exists:', checkError);
      return null;
    }
    
    if (existingUser) {
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
      // User doesn't exist, create new record
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
        console.error('Error creating new user:', insertError);
        return null;
      }
      
      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return null;
  }
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
