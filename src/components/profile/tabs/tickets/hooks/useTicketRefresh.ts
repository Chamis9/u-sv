
import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useTicketRefresh as useGlobalTicketRefresh } from "@/hooks/tickets/hooks/useTicketRefresh";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  const refreshAttemptedRef = useRef<boolean>(false);
  const { refreshTickets: globalRefreshTickets, isRefreshing } = useGlobalTicketRefresh({ 
    userId, 
    isAuthenticated 
  });
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const refreshTickets = useCallback(async () => {
    // Only allow one refresh per component mount
    if (refreshAttemptedRef.current) {
      console.log("Refresh already attempted for this component instance");
      return false;
    }
    
    if (!isAuthenticated) {
      console.log("Cannot refresh tickets: user not authenticated");
      return false;
    }
    
    try {
      refreshAttemptedRef.current = true;
      const result = await globalRefreshTickets();
      
      if (result) {
        // Optional success toast - uncomment if you want to show success messages
        // toast({
        //   title: t("Biļetes atjaunotas", "Tickets refreshed"),
        //   description: t("Biļešu saraksts ir atjaunināts", "Ticket list has been updated"),
        // });
      }
      
      return result;
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      
      toast({
        title: t("Kļūda", "Error"),
        description: t("Neizdevās atjaunot biļetes", "Failed to refresh tickets"),
        variant: "destructive"
      });
      
      return false;
    }
  }, [isAuthenticated, globalRefreshTickets, t]);
  
  // Reset the refresh attempt ref when userId changes
  useCallback(() => {
    refreshAttemptedRef.current = false;
  }, [userId]);
  
  return { refreshTickets, isRefreshing };
}
