
import { useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { useQueryClient } from "@tanstack/react-query";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshSession } = useAuth();
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const lastRefreshTime = useRef<number>(0);
  const refreshInProgressRef = useRef<boolean>(false);

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const refreshTickets = useCallback(async () => {
    // Prevent concurrent refreshes
    if (refreshInProgressRef.current) {
      console.log("Refresh already in progress, skipping");
      return false;
    }

    // Throttle refreshes - don't allow more than one refresh every 5 seconds
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) {
      console.log("Refresh throttled - too frequent calls");
      return false;
    }

    if (!isAuthenticated || !userId) {
      console.log("Cannot refresh tickets: user not authenticated or missing userId");
      return false;
    }

    try {
      refreshInProgressRef.current = true;
      setIsRefreshing(true);
      lastRefreshTime.current = now;
      
      console.log("Refreshing authentication session...");
      await refreshSession();

      // Check authentication status after refresh
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        console.error("Authentication error after refresh:", authError);
        toast({
          title: t("Autentifikācijas kļūda", "Authentication error"),
          description: t("Lūdzu, pieslēdzieties vēlreiz", "Please log in again"),
          variant: "destructive"
        });
        return false;
      }

      const authUserId = authData.user.id;
      console.log("Authentication confirmed, user ID:", authUserId);
      
      // Invalidate and refetch in a single operation
      await queryClient.invalidateQueries({ 
        queryKey: ['user-tickets', authUserId]
      });
      
      console.log("Tickets refreshed successfully for user:", authUserId);
      return true;
    } catch (error) {
      console.error("Error during ticket refresh:", error);
      return false;
    } finally {
      setIsRefreshing(false);
      refreshInProgressRef.current = false;
    }
  }, [isAuthenticated, userId, refreshSession, queryClient, t]);

  return {
    refreshTickets,
    isRefreshing
  };
}
