
import { useQuery } from "@tanstack/react-query";
import { categoryEvents, categoryTitles } from "@/utils/eventData";
import { Event } from "@/hooks/useEvents";
import { supabase } from "@/integrations/supabase/client";
import { UserTicket } from "@/hooks/tickets";

interface FilterOptions {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  venueId?: string;
  searchQuery?: string;
}

export const useFilteredEvents = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['filtered-events', filters],
    queryFn: async (): Promise<{events: Event[], availableTickets: Record<string, UserTicket[]>}> => {
      // Get all events from mock data
      let allEvents = Object.values(categoryEvents).flat();
      
      // Apply category filter
      if (filters.category) {
        allEvents = categoryEvents[filters.category] || [];
      }

      // Apply date filters
      if (filters.startDate) {
        const startDateStr = filters.startDate.toISOString().split('T')[0];
        allEvents = allEvents.filter(event => event.date >= startDateStr);
      }
      
      if (filters.endDate) {
        const endDateStr = filters.endDate.toISOString().split('T')[0];
        allEvents = allEvents.filter(event => event.date <= endDateStr);
      }

      // Apply venue filter
      if (filters.venueId) {
        allEvents = allEvents.filter(event => event.location.includes(filters.venueId));
      }

      // Apply text search on title and description
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        allEvents = allEvents.filter(event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query)
        );
      }

      // Transform to match Event interface
      const transformedEvents = allEvents.map(event => ({
        id: String(event.id),
        title: event.title,
        description: event.description,
        category: getCategoryName(event.location),
        category_id: getCategoryId(event.location),
        start_date: event.date + 'T' + event.time,
        end_date: null,
        price_range: event.price,
        venue_id: null,
        image_url: null,
        status: 'published'
      }));
      
      // Fetch all available tickets from Supabase
      const { data: ticketsData, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', 'available');
        
      if (error) {
        console.error('Error fetching available tickets:', error);
        return { events: transformedEvents, availableTickets: {} };
      }
      
      // Format tickets to match UserTicket interface
      const availableTickets = ticketsData.map(ticket => ({
        id: ticket.id,
        title: ticket.description || "Ticket",
        description: ticket.description,
        category: ticket.category_id || "",  // We'll map this to category name in the UI
        price: ticket.price,
        event_id: ticket.event_id,
        status: ticket.status,
        file_path: ticket.file_path,
        created_at: ticket.created_at,
        seller_id: ticket.seller_id,
        buyer_id: ticket.buyer_id,
        owner_id: ticket.owner_id
      }));
      
      // Group tickets by category
      const ticketsByCategory: Record<string, UserTicket[]> = {};
      
      availableTickets.forEach(ticket => {
        const categoryId = ticket.category;
        if (!ticketsByCategory[categoryId]) {
          ticketsByCategory[categoryId] = [];
        }
        ticketsByCategory[categoryId].push(ticket);
      });

      return { 
        events: transformedEvents, 
        availableTickets: ticketsByCategory 
      };
    }
  });
};

// Helper function to get a category name from a venue/location
function getCategoryName(location: string): string {
  // Map venues to categories as a simple approach
  if (location.includes('teātris') || location.includes('JRT')) {
    return categoryTitles.theatre.en;
  } else if (location.includes('Arēna') || location.includes('stadions')) {
    return categoryTitles.sports.en;
  } else if (location.includes('koncertzāle') || location.includes('Ģilde')) {
    return categoryTitles.concerts.en;
  } else {
    return 'Other';
  }
}

// Helper function to get a category ID from a venue/location
function getCategoryId(location: string): string {
  // Map venues to category IDs
  if (location.includes('teātris') || location.includes('JRT')) {
    return 'theatre';
  } else if (location.includes('Arēna') || location.includes('stadions')) {
    return 'sports';
  } else if (location.includes('koncertzāle') || location.includes('Ģilde')) {
    return 'concerts';
  } else {
    return 'other';
  }
}
