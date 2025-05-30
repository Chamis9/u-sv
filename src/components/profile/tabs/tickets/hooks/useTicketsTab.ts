
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

  // Define translation function with all four languages
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };

  // Setup ticket operations (delete, update, etc.) - create fallback function for 2-param components
  const twoParamT = (lv: string, en: string) => t(lv, en, lv, en);

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
    t: twoParamT
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
