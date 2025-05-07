
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const queryClient = useQueryClient();
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const refreshTickets = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      console.log("Cannot refresh tickets: user not authenticated or missing user ID");
      return false;
    }
    
    console.log(`Refreshing tickets for user: ${userId}`);
    
    try {
      // Invalidate and immediately refetch
      await queryClient.invalidateQueries({ 
        queryKey: ['user-tickets', userId]
      });
      
      // Force refetch
      await queryClient.refetchQueries({ 
        queryKey: ['user-tickets', userId],
        exact: true
      });
      
      console.log("Tickets refreshed successfully");
      
      // Show a success toast
      toast({
        title: t("Biļetes atsvaidzinātas", "Tickets refreshed"),
        description: t("Biļešu saraksts ir atjaunināts", "Ticket list has been updated"),
      });
      
      return true;
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      
      // Show an error toast
      toast({
        title: t("Kļūda", "Error"),
        description: t("Neizdevās atsvaidzināt biļetes", "Failed to refresh tickets"),
        variant: "destructive"
      });
      
      return false;
    }
  }, [userId, isAuthenticated, queryClient, t]);
  
  return { refreshTickets };
}
