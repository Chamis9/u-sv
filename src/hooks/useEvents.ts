
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { categoryEvents, categoryTitles } from '@/utils/eventData';

// Mock API call using eventData
const fetchEvents = async (category?: string) => {
  // In a real application, this would be a call to a backend API
  // For now, we'll use the mock data from eventData.ts
  const events = category ? categoryEvents[category] || [] : [];
  
  // Map the events to include the category and category_id
  return events.map(event => ({
    ...event,
    category: category || '',
    category_id: category || '',
    start_date: event.date // Make sure start_date exists for compatibility
  }));
};

export const useEvents = (category?: string) => {
  return useQuery({
    queryKey: ['events', category],
    queryFn: () => fetchEvents(category),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!category
  });
};
