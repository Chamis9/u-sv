
import { useState, useEffect } from "react";
import { User } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { createMockUser } from "../utils/mockUserUtils";
import { GetUserByEmailResult } from "@/utils/rpcFunctions";

export function useProfileData() {
  const { isAuthenticated, isAuthLoading, userEmail } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only try to fetch user data if authenticated
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated && userEmail) {
          // Use RPC function to get user data
          const { data, error } = await supabase.rpc('get_user_by_email', {
            user_email: userEmail
          });
            
          if (error) {
            console.error("Error fetching user data:", error);
            setUser(createMockUser()); // Fallback to mock data
            return;
          }
          
          if (data) {
            const userData = data as GetUserByEmailResult;
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
            // Fallback to mock user if no data found
            setUser(createMockUser());
          }
        } else {
          // No need to set mock user here, we'll show login screen instead
          setUser(null);
        }
      } catch (error) {
        console.error("Error in profile data fetch:", error);
        if (isAuthenticated) {
          setUser(createMockUser()); // Only set mock user for authenticated users
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, isAuthLoading, userEmail]);

  return { user, setUser, isLoading };
}
