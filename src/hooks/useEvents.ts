
import { useQuery } from "@tanstack/react-query";
import { categoryEvents, categoryTitles } from "@/utils/eventData"; 

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string;
  start_date: string;
  end_date: string | null;
  price_range: any;
  venue_id: string | null;
  image_url: string | null;
  status: string | null;
  category_id: string; // Make this required to match database shape
}

export const useEvents = (category?: string) => {
  return useQuery({
    queryKey: ['events', category],
    queryFn: async (): Promise<Event[]> => {
      // Use mock data instead of Supabase query
      const categoryEventsData = category ? categoryEvents[category] || [] : 
        Object.values(categoryEvents).flat();
      
      // Transform the mock data to match the Event interface
      return categoryEventsData.map(event => ({
        id: String(event.id),
        title: event.title,
        description: event.description,
        category: getCategoryName(event.location), // Use location as a proxy for category
        category_id: getCategoryId(event.location), 
        start_date: event.date + 'T' + event.time,
        end_date: null,
        price_range: event.price,
        venue_id: null,
        image_url: null,
        status: 'published'
      }));
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
