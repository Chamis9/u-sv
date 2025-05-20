
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/types/users";
import { useUserTickets, UserTicket, AddTicketData } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketOperations } from "./useTicketOperations";
import { supabase } from "@/integrations/supabase/client";

export function useTicketsTab(user: User) {
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const authCheckedRef = useRef(false);
  
  // State for managing tickets and UI
  const [addedTickets, setAddedTickets] = useState<UserTicket[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [currentEditTicket, setCurrentEditTicket] = useState<UserTicket | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Get authenticated user ID from session - only runs once when authenticated
  useEffect(() => {
    const fetchAuthUserId = async () => {
      if (isAuthenticated && !authCheckedRef.current) {
        authCheckedRef.current = true; // Mark as checked to prevent infinite loop
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session && session.session) {
            setAuthUserId(session.session.user.id);
            console.log("Set authenticated user ID:", session.session.user.id);
          }
        } catch (err) {
          console.error("Failed to get auth user ID:", err);
        }
      }
    };
    
    fetchAuthUserId();
  }, [isAuthenticated]);

  // Use the authenticated user ID for ticket operations
  const { tickets, isLoading, refreshTickets, updateTicket } = useUserTickets(authUserId || undefined);

  // Define translation function
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  // Setup ticket operations (delete, update, etc.)
  const {
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    refreshTickets: refreshTicketsFromOperations
  } = useTicketOperations({
    onTicketsChanged: refreshTickets,
    t
  });
  
  // Sort tickets into added and purchased categories
  useEffect(() => {
    // Skip if not authenticated or tickets not loaded
    if (!isAuthenticated || !tickets) {
      return;
    }
    
    const filterTickets = () => {
      const added: UserTicket[] = [];
      const purchased: UserTicket[] = [];
      
      if (!tickets || !authUserId) {
        return { added, purchased };
      }
      
      tickets.forEach(ticket => {
        if (ticket.seller_id === authUserId) {
          added.push(ticket);
        } else if (ticket.buyer_id === authUserId) {
          purchased.push(ticket);
        }
      });
      
      // Sort tickets by creation date (newest first)
      return {
        added: added.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        purchased: purchased.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      };
    };
    
    const { added, purchased } = filterTickets();
    setAddedTickets(added);
    setPurchasedTickets(purchased);
  }, [tickets, authUserId, isAuthenticated]);

  // Force refresh tickets on initial load - only runs when authUserId changes
  useEffect(() => {
    if (isAuthenticated && authUserId) {
      console.log("Initial tickets load for authenticated user:", authUserId);
      
      // Verify auth session before initial load
      const checkSessionAndRefresh = async () => {
        try {
          const { data: session, error: sessionError } = await supabase.auth.getSession();
          if (!sessionError && session.session) {
            refreshTickets();
          }
        } catch (err) {
          console.error("Session check error:", err);
        }
      };
      
      checkSessionAndRefresh();
    }
  }, [isAuthenticated, authUserId, refreshTickets]);

  return {
    addedTickets,
    purchasedTickets,
    isLoading: isLoading || loading,
    loading,
    addTicketOpen,
    setAddTicketOpen,
    openDeleteConfirmation,
    confirmDelete,
    cancelDelete,
    ticketToDelete,
    isDeleting,
    handleUpdateTicket,
    refreshTickets,
    editTicketOpen,
    setEditTicketOpen,
    currentEditTicket,
    setCurrentEditTicket,
    t,
    isAuthenticated,
    authUserId
  };
}
