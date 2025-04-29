
import { UserTicket } from "@/hooks/tickets";
import { supabase } from "@/integrations/supabase/client";

export const useEventTickets = async (eventId?: string) => {
  if (!eventId) {
    return { data: [], error: new Error("No event ID provided") };
  }

  try {
    // Query the consolidated tickets table with a filter for event_id
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select('*, categories(name)')
      .eq('status', 'available')
      .eq('event_id', eventId);
    
    if (error) {
      console.error(`Error fetching tickets for event:`, error);
      return { data: [], error: error };
    }
    
    // Transform to UserTicket format
    const tickets: UserTicket[] = (ticketsData || []).map((ticket: any) => ({
      id: String(ticket.id),
      title: ticket.title || ticket.description || "Ticket",
      description: ticket.description || undefined,
      category: ticket.category_name || ticket.categories?.name || 'Other',
      price: ticket.price,
      event_id: ticket.event_id,
      status: 'available',
      file_path: ticket.file_path,
      created_at: ticket.created_at,
      seller_id: ticket.seller_id,
      buyer_id: ticket.buyer_id,
      owner_id: ticket.owner_id,
      event_date: ticket.event_date || null,
      venue: ticket.venue || null
    }));
    
    return { data: tickets, error: null };
  } catch (err) {
    console.error("Error in useEventTickets:", err);
    return { data: [], error: err instanceof Error ? err : new Error("Unknown error") };
  }
};
