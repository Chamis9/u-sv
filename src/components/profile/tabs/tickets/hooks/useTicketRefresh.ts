
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UseTicketRefreshProps {
  userId?: string;
  isAuthenticated: boolean;
}

export function useTicketRefresh({ userId, isAuthenticated }: UseTicketRefreshProps) {
  const queryClient = useQueryClient();
  
  const refreshTickets = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      console.log("Cannot refresh tickets: user not authenticated or missing user ID");
      return;
    }
    
    console.log(`Refreshing tickets for user: ${userId}`);
    
    // Invalidate and immediately refetch
    await queryClient.invalidateQueries({ 
      queryKey: ['user-tickets', userId]
    });
    
    // Force refetch
    try {
      await queryClient.refetchQueries({ 
        queryKey: ['user-tickets', userId],
        exact: true
      });
      console.log("Tickets refreshed successfully");
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    }
  }, [userId, isAuthenticated, queryClient]);
  
  return { refreshTickets };
}
