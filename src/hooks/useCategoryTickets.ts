
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryIdFromName } from '@/components/events/utils/categoryUtils';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/features/language";
import { deleteTicketMutation } from './tickets/mutations/deleteTicketMutation';

export const useCategoryTickets = (category?: string) => {
  const [allCategoryTickets, setAllCategoryTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();

  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  useEffect(() => {
    const fetchAvailableTickets = async () => {
      try {
        setIsLoading(true);
        
        if (!category) {
          setAllCategoryTickets([]);
          setIsLoading(false);
          return;
        }
        
        // Convert URL parameter to standard category ID
        const normalizedCategoryId = getCategoryIdFromName(category);
        
        // Query using the normalized category ID or name
        const { data: ticketsData, error: fetchError } = await supabase
          .from('tickets')
          .select('*, categories(name)')
          .eq('status', 'available')
          .eq('category_name', normalizedCategoryId);
        
        if (fetchError) {
          throw fetchError;
        }
        
        console.log(`Fetched ${ticketsData?.length || 0} tickets for category "${normalizedCategoryId}"`);
        
        // Transform the data to match UserTicket type
        const formattedTickets: UserTicket[] = ((ticketsData || []) as any[]).map((ticket: any) => {
          return {
            id: String(ticket.id),
            title: ticket.title || ticket.description || "Ticket",
            description: ticket.description || "",
            category: ticket.category_name || ticket.categories?.name || 'Other',
            price: ticket.price,
            event_id: ticket.event_id || null,
            status: 'available',
            file_path: ticket.file_path || undefined,
            created_at: ticket.created_at,
            seller_id: ticket.seller_id || undefined,
            buyer_id: ticket.buyer_id || undefined,
            owner_id: ticket.owner_id,
            event_date: ticket.event_date || null,
            venue: ticket.venue || null,
            quantity: ticket.quantity || 1,
            price_per_unit: ticket.price_per_unit || ticket.price || 0,
            event_time: ticket.event_time || null
          };
        });
        
        setAllCategoryTickets(formattedTickets);
      } catch (err) {
        console.error('Error fetching available tickets:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch tickets'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableTickets();
  }, [category]);

  // Function to update state after ticket deletion
  const removeTicketFromState = async (ticketId: string) => {
    console.log("Attempting to remove ticket from state:", ticketId);
    
    if (isAuthenticated && user?.id) {
      try {
        // Find the ticket in our local state
        const ticketToDelete = allCategoryTickets.find(ticket => ticket.id === ticketId);
        
        // Check if the user is the seller of this ticket
        if (!ticketToDelete || ticketToDelete.seller_id !== user.id) {
          console.error("User is not authorized to delete this ticket or ticket not found");
          toast({
            title: t("Kļūda", "Error"),
            description: t("Nav tiesību dzēst šo biļeti", "You are not authorized to delete this ticket"),
            variant: "destructive"
          });
          return;
        }
        
        // Delete the ticket using the updated direct mutation function
        const success = await deleteTicketMutation(ticketId, user.id);
        
        if (success) {
          // If deletion was successful, update the local state
          setAllCategoryTickets(prev => prev.filter(t => t.id !== ticketId));
          console.log("Successfully deleted ticket:", ticketId);
          
          toast({
            title: t("Biļete dzēsta", "Ticket deleted"),
            description: t("Biļete ir veiksmīgi dzēsta", "The ticket has been successfully deleted")
          });
        } else {
          console.error("Failed to delete ticket from database");
          toast({
            title: t("Kļūda", "Error"),
            description: t("Neizdevās dzēst biļeti", "Failed to delete the ticket"),
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error in removeTicketFromState:", err);
        toast({
          title: t("Kļūda", "Error"),
          description: t("Neizdevās dzēst biļeti", "Failed to delete the ticket"),
          variant: "destructive"
        });
      }
    } else {
      console.error("User not authenticated, cannot delete ticket");
      toast({
        title: t("Nav pieslēgts", "Not logged in"),
        description: t("Lai dzēstu biļeti, lūdzu pieslēdzieties", "Please log in to delete a ticket"),
        variant: "destructive"
      });
    }
  };

  return {
    allCategoryTickets,
    isLoading,
    error,
    removeTicketFromState
  };
};
