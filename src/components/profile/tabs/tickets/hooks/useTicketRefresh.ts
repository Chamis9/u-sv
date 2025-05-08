
import { useCallback } from "react";
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
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const refreshTickets = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("Cannot refresh tickets: user not authenticated");
      return false;
    }
    
    console.log(`Starting ticket refresh process...`);
    
    try {
      // Always verify auth session first
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
      console.log(`Using authenticated user ID for refresh: ${authUserId}`);
      
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
    }
  }, [isAuthenticated, queryClient, t]);
  
  return { refreshTickets };
}
