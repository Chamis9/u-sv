
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserTicket } from "@/hooks/tickets";
import { useTicketRefresh } from './useTicketRefresh';
import { useAuth } from "@/contexts/AuthContext";

interface UseTicketOperationsProps {
  onTicketsChanged?: () => void;
  t: (lvText: string, enText: string) => string;
}

export function useTicketOperations({ onTicketsChanged, t }: UseTicketOperationsProps) {
  const [isOperating, setIsOperating] = useState(false);
  const { toast } = useToast();
  const { user, refreshSession } = useAuth();
  const { refreshTickets } = useTicketRefresh({
    userId: user?.id,
    isAuthenticated: !!user
  });

  const performTicketOperation = async (
    operation: () => Promise<boolean>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!user) {
      toast({
        title: t("Kļūda", "Error"),
        description: t(
          "Lietotājs nav autorizēts", 
          "User is not authenticated"
        ),
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsOperating(true);
      
      // First refresh the session to ensure we have valid tokens
      await refreshSession();
      
      // Then perform the operation
      const success = await operation();
      
      if (success) {
        toast({
          title: t("Veiksmīgi!", "Success!"),
          description: successMessage
        });
        
        // Notify parent component to refresh tickets
        if (onTicketsChanged) {
          onTicketsChanged();
        }
        
        return true;
      } else {
        toast({
          title: t("Kļūda", "Error"),
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error during ticket operation:", error);
      toast({
        title: t("Kļūda", "Error"),
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsOperating(false);
    }
  };
  
  return {
    performTicketOperation,
    isOperating,
    refreshAuth: refreshSession,
    refreshTickets
  };
}
