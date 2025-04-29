
import { useQueryClient } from "@tanstack/react-query";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";

interface UseTicketOperationsProps {
  userId: string;
  deleteTicket: (ticketId: string) => Promise<boolean>;
  updateTicket: (ticketId: string, data: Partial<AddTicketData>) => Promise<{
    success: boolean;
    ticket?: UserTicket;
    error?: string;
  }>;
}

export function useTicketOperations({
  userId,
  deleteTicket,
  updateTicket
}: UseTicketOperationsProps) {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm(t(
      "Vai tiešām vēlaties dzēst šo biļeti?", 
      "Are you sure you want to delete this ticket?"
    ))) {
      const success = await deleteTicket(ticketId);
      
      if (success) {
        toast({
          title: t("Biļete dzēsta", "Ticket deleted"),
          description: t(
            "Biļete ir veiksmīgi dzēsta", 
            "The ticket has been successfully deleted"
          )
        });
        
        // Refresh tickets list
        queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: t(
            "Neizdevās dzēst biļeti. Lūdzu mēģiniet vēlreiz.", 
            "Failed to delete the ticket. Please try again."
          ),
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateTicket = async (ticketId: string, data: Partial<AddTicketData>) => {
    try {
      const { success, ticket, error } = await updateTicket(ticketId, data);
      
      if (success && ticket) {
        toast({
          title: t("Biļete atjaunināta", "Ticket updated"),
          description: t(
            "Biļetes informācija ir veiksmīgi atjaunināta", 
            "Ticket information has been successfully updated"
          )
        });
        
        // Refresh tickets list
        queryClient.invalidateQueries({ queryKey: ['user-tickets', userId] });
        return { success: true };
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: error || t(
            "Neizdevās atjaunināt biļeti. Lūdzu mēģiniet vēlreiz.", 
            "Failed to update the ticket. Please try again."
          ),
          variant: "destructive"
        });
        return { success: false, error };
      }
    } catch (err: any) {
      toast({
        title: t("Kļūda", "Error"),
        description: err.message || t(
          "Neizdevās atjaunināt biļeti. Lūdzu mēģiniet vēlreiz.", 
          "Failed to update the ticket. Please try again."
        ),
        variant: "destructive"
      });
      return { success: false, error: err.message };
    }
  };
  
  return {
    handleDeleteTicket,
    handleUpdateTicket,
    t
  };
}
