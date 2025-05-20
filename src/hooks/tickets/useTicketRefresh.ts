
import { useCallback, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTime = useRef<number>(0);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const refreshTickets = useCallback(async () => {
    // Throttle refreshes - don't allow more than one refresh every 5 seconds
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) {
      console.log("Refresh throttled - too frequent calls");
      return false;
    }
    
    if (!isAuthenticated) {
      console.log("Cannot refresh tickets: user not authenticated");
      return false;
    }
    
    if (isRefreshing) {
      console.log("Refresh already in progress, skipping");
      return false;
    }
    
    setIsRefreshing(true);
    lastRefreshTime.current = now;
    
    try {
      // Verify the auth session is valid before refreshing
      const { data: session, error: sessionError } = await supabase.auth.getSession();
        
      if (sessionError || !session.session) {
        console.error("Authentication session error:", sessionError);
        toast({
          title: t("Autentifikācijas kļūda", "Authentication error"),
          description: t("Lūdzu, pieslēdzieties vēlreiz", "Please log in again"),
          variant: "destructive"
        });
        return false;
      }
      
      // Use the authenticated user ID from the session
      const authUserId = session.session.user.id;
      console.log(`Refreshing tickets for authenticated user ID: ${authUserId}`);
      
      // Invalidate and immediately refetch using authUserId
      await queryClient.invalidateQueries({ 
        queryKey: ['user-tickets', authUserId]
      });
      
      // Force refetch using authUserId
      await queryClient.refetchQueries({ 
        queryKey: ['user-tickets', authUserId],
        exact: true
      });
      
      console.log("Tickets refreshed successfully");
      
      // Show a success toast
      toast({
        title: t("Biļetes atjaunotas", "Tickets refreshed"),
        description: t("Biļešu saraksts ir atjaunināts", "Ticket list has been updated"),
      });
      
      return true;
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      
      // Show an error toast
      toast({
        title: t("Kļūda", "Error"),
        description: t("Neizdevās atjaunot biļetes", "Failed to refresh tickets"),
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isAuthenticated, queryClient, t, isRefreshing]);
  
  return { refreshTickets, isRefreshing };
}
