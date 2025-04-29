
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";

export const useEventTickets = async (eventId?: string) => {
  if (!eventId) {
    return { data: [], error: new Error("No event ID provided") };
  }

  try {
    // Get available tickets that match this event
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'available')
      .eq('event_id', eventId);

    if (error) {
      console.error("Error fetching available tickets:", error);
      return { data: [], error };
    }

    // Transform to UserTicket format
    const formattedTickets: UserTicket[] = data.map(ticket => ({
      id: ticket.id,
      title: ticket.description || "Ticket",
      description: ticket.description,
      category: ticket.category_id || "",
      price: ticket.price,
      event_id: ticket.event_id,
      status: 'available' as const, // Type assertion to match UserTicket.status
      file_path: ticket.file_path,
      created_at: ticket.created_at,
      seller_id: ticket.seller_id,
      buyer_id: ticket.buyer_id,
      owner_id: ticket.owner_id
    }));

    return { data: formattedTickets, error: null };
  } catch (err) {
    console.error("Error in useEventTickets:", err);
    return { data: [], error: err instanceof Error ? err : new Error("Unknown error") };
  }
};
