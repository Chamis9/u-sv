
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const refreshTickets = () => {
    console.log("Refreshing tickets for user:", userId);
    if (!isAuthenticated) {
      console.log("User not authenticated, cannot refresh tickets");
      toast({
        title: t("Nav pieslēgts", "Not logged in"),
        description: t("Lai redzētu biļetes, lūdzu pieslēdzieties", "Please log in to see tickets"),
        variant: "destructive"
      });
      return;
    }
    
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
      toast({
        title: t("Biļetes atjaunotas", "Tickets refreshed"),
        description: t("Biļešu saraksts ir atjaunots", "Ticket list has been updated")
      });
    }
  };
  
  return { refreshTickets };
}
