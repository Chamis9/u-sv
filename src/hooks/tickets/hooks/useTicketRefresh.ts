
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useTicketRefresh({
  userId,
  isAuthenticated
}: {
  userId?: string;
  isAuthenticated: boolean;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshSession } = useAuth();

  const refreshTickets = async () => {
    if (!userId || !isAuthenticated) {
      console.log("Can't refresh tickets: User not authenticated");
      return false;
    }

    try {
      setIsRefreshing(true);
      console.log("Refreshing authentication session...");

      // First, refresh the auth session to ensure fresh tokens
      await refreshSession();

      console.log("Authentication session refreshed, fetching tickets...");

      // Check authentication status after refresh
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        console.error("Authentication error after refresh:", authError);
        toast({
          title: "Authentication Error",
          description: "Your session appears to be invalid. Please try logging in again.",
          variant: "destructive"
        });
        return false;
      }

      console.log("Authentication confirmed, user ID:", authData.user.id);
      return true;
    } catch (error) {
      console.error("Error during ticket refresh:", error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refreshTickets,
    isRefreshing
  };
}
