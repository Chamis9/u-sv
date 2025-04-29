
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";
import { getCategoryTableName } from "@/components/profile/tabs/tickets/services/CategoryService";

export const useEventTickets = async (eventId?: string) => {
  if (!eventId) {
    return { data: [], error: new Error("No event ID provided") };
  }

  try {
    // List of all ticket tables to query
    const ticketTables = [
      'tickets_theatre', 'tickets_concerts', 'tickets_sports', 
      'tickets_festivals', 'tickets_cinema', 'tickets_children', 
      'tickets_travel', 'tickets_giftcards', 'tickets_other'
    ];
    
    let allTickets: UserTicket[] = [];
    
    // Query each table for tickets with this event ID
    for (const tableName of ticketTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*, categories(name)')
        .eq('status', 'available')
        .eq('event_id', eventId);
      
      if (error) {
        console.error(`Error fetching tickets from ${tableName}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        // Transform to UserTicket format
        const formattedTickets: UserTicket[] = data.map((ticket: any) => ({
          id: String(ticket.id),
          title: ticket.description || "Ticket",
          description: ticket.description || undefined,
          category: ticket.categories?.name || getCategoryNameFromTable(tableName),
          price: ticket.price,
          event_id: ticket.event_id,
          status: 'available' as const,
          file_path: ticket.file_path,
          created_at: ticket.created_at,
          seller_id: ticket.seller_id,
          buyer_id: ticket.buyer_id,
          owner_id: ticket.owner_id,
          event_date: ticket.event_date || null,
          venue: ticket.venue || null
        }));
        
        allTickets = [...allTickets, ...formattedTickets];
      }
    }
    
    return { data: allTickets, error: null };
  } catch (err) {
    console.error("Error in useEventTickets:", err);
    return { data: [], error: err instanceof Error ? err : new Error("Unknown error") };
  }
};

// Helper function to derive category name from table name
function getCategoryNameFromTable(tableName: string): string {
  const categoryMapping: Record<string, string> = {
    'tickets_theatre': 'Theatre',
    'tickets_concerts': 'Concerts',
    'tickets_sports': 'Sports',
    'tickets_festivals': 'Festivals',
    'tickets_cinema': 'Cinema',
    'tickets_children': 'Children',
    'tickets_travel': 'Travel',
    'tickets_giftcards': 'Gift Cards',
    'tickets_other': 'Other'
  };
  
  return categoryMapping[tableName] || 'Other';
}
