
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";
import { CreateUserProfileParams, CreateUserProfileResult } from "@/utils/rpcFunctions";

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);

  // Function to fetch user data from the database
  const fetchUserData = useCallback(async (email: string) => {
    try {
      console.log("Fetching user data for:", email);
      
      // First try getting user via RPC function that bypasses RLS
      let userData = null;
      let fetchError = null;
      
      try {
        const { data: rpcUser, error: rpcError } = await supabase.rpc(
          'get_user_by_email',
          { user_email: email }
        );
        
        if (!rpcError && rpcUser) {
          userData = rpcUser;
          console.log("User data fetched via RPC:", userData);
        } else {
          fetchError = rpcError;
        }
      } catch (rpcErr) {
        console.log("RPC method not available, using standard query");
      }
      
      // Fallback to standard query if RPC fails
      if (!userData) {
        const { data: standardUser, error: standardError } = await supabase
          .from('registered_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        if (standardError) {
          console.error("Error fetching user data:", standardError);
          fetchError = standardError;
        } else {
          userData = standardUser;
        }
      }
      
      if (userData) {
        console.log("User data fetched successfully:", userData);
        
        setUser({
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          last_sign_in_at: userData.last_sign_in_at,
          role: 'user',
          status: userData.status as 'active' | 'inactive',
          avatar_url: userData.avatar_url
        });
      } else {
        console.warn("No user data found for:", email);
        
        // If no user data is found in the registered_users table but we have an authenticated session,
        // attempt to create the user record in the database
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user) {
          console.log("Creating user record in database for authenticated user:", authUser.user.email);
          
          try {
            // Try using the RPC function first (most reliable) with proper typing
            const params: CreateUserProfileParams = {
              user_id: authUser.user.id,
              user_email: authUser.user.email || '',
              first_name: authUser.user.user_metadata?.first_name || null,
              last_name: authUser.user.user_metadata?.last_name || null,
              phone_number: authUser.user.user_metadata?.phone || null
            };
            
            const { data, error: rpcError } = await supabase.rpc<CreateUserProfileResult>(
              'create_user_profile',
              params
            );
            
            if (!rpcError && data) {
              console.log("User record created successfully via RPC:", data);
              
              // Create new user object from the RPC result
              if (data) {
                // Cast to the correct type - the server response will match our CreateUserProfileResult type
                const userRecord = data as unknown as CreateUserProfileResult;
                
                setUser({
                  id: userRecord.id,
                  email: userRecord.email,
                  first_name: userRecord.first_name,
                  last_name: userRecord.last_name,
                  phone: userRecord.phone,
                  created_at: userRecord.created_at,
                  updated_at: userRecord.updated_at,
                  last_sign_in_at: userRecord.last_sign_in_at,
                  role: 'user',
                  status: userRecord.status as 'active' | 'inactive',
                  avatar_url: userRecord.avatar_url
                });
                return;
              }
            }
          } catch (rpcErr) {
            console.warn("RPC method not available:", rpcErr);
          }
          
          // Fallback to direct insert (might fail due to RLS)
          const newUserData = {
            auth_user_id: authUser.user.id,
            email: authUser.user.email,
            first_name: authUser.user.user_metadata?.first_name || null,
            last_name: authUser.user.user_metadata?.last_name || null,
            phone: authUser.user.user_metadata?.phone || null,
            last_sign_in_at: new Date().toISOString()
          };
          
          const { data: insertedUser, error: insertError } = await supabase
            .from('registered_users')
            .insert([newUserData])
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating user record:", insertError);
          } else if (insertedUser) {
            console.log("User record created successfully:", insertedUser);
            
            setUser({
              id: insertedUser.id,
              email: insertedUser.email,
              first_name: insertedUser.first_name,
              last_name: insertedUser.last_name,
              phone: insertedUser.phone,
              created_at: insertedUser.created_at,
              updated_at: insertedUser.updated_at,
              last_sign_in_at: insertedUser.last_sign_in_at,
              role: 'user',
              status: insertedUser.status as 'active' | 'inactive',
              avatar_url: insertedUser.avatar_url
            });
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  // Function to refresh user data
  const refreshUserData = useCallback(async (email: string | null) => {
    if (email) {
      await fetchUserData(email);
    }
  }, [fetchUserData]);

  return { user, setUser, fetchUserData, refreshUserData };
}
