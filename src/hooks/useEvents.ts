
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { categoryEvents, categoryTitles } from '@/utils/eventData';

// Define and export Event type interface
export interface Event {
  id: string | number;
  title: string;
  description?: string;
  category: string;
  category_id: string;
  start_date: string;
  end_date?: string | null;
  price_range?: string | [number, number];
  venue_id?: string | null;
  image_url?: string | null;
  status?: string;
  location?: string;
}

// Mock API call using eventData
const fetchEvents = async (category?: string) => {
  // In a real application, this would be a call to a backend API
  // For now, we'll use the mock data from eventData.ts
  let events = category ? categoryEvents[category] || [] : [];
  
  // Remove mock events for sports category
  if (category === 'sports') {
    events = [];
  }
  
  // Map the events to include the category and category_id
  return events.map(event => ({
    ...event,
    category: category || '',
    category_id: category || '',
    start_date: event.date + 'T' + event.time, // Make sure start_date exists for compatibility
    status: 'published'
  })) as Event[];
};

export const useEvents = (category?: string) => {
  return useQuery({
    queryKey: ['events', category],
    queryFn: () => fetchEvents(category),
    staleTime: 1000 * 60, // 1 minute
    enabled: category === undefined || !!category
  });
};
