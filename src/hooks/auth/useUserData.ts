
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);

  // Function to fetch user data from the database
  const fetchUserData = useCallback(async (email: string) => {
    try {
      console.log("Fetching user data for:", email);
      
      const { data: userData, error } = await supabase
        .from('registered_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user data:", error);
        return;
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
        // create the user record in the database
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user) {
          console.log("Creating user record in database for authenticated user:", authUser.user.email);
          
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
