
import { useState } from 'react';
import { Event } from '@/hooks/useEvents';

export const useEventFilters = (events?: Event[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Filter events based on search query and dates, then sort by start_date
  const filteredEvents = events?.filter(event => {
    // Text search filter
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Date filter
    let matchesDateRange = true;
    if (startDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = eventDate >= startDate;
    }
    if (endDate) {
      const eventDate = new Date(event.start_date);
      matchesDateRange = matchesDateRange && eventDate <= endDate;
    }
    
    return matchesSearch && matchesDateRange;
  })
  // Sort events by start_date (ascending - earlier events first)
  .sort((a, b) => {
    // Ensure we have valid date strings before creating Date objects
    if (!a.start_date) return 1;
    if (!b.start_date) return -1;
    
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    
    // Check for invalid dates
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateA.getTime() - dateB.getTime();
  }) || [];

  // Helper function to filter tickets with the search query
  const filterTickets = (tickets: any[]) => {
    // Filter tickets first
    const filtered = tickets.filter(ticket => {
      // Apply text search
      const matchesSearch = searchQuery
        ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ticket.description && ticket.description.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Apply date filters if event_date is available
      let matchesDateRange = true;
      if (ticket.event_date && (startDate || endDate)) {
        const ticketDate = new Date(ticket.event_date);
        
        if (startDate) {
          matchesDateRange = ticketDate >= startDate;
        }
        
        if (endDate && matchesDateRange) {
          matchesDateRange = ticketDate <= endDate;
        }
      }
      
      return matchesSearch && matchesDateRange;
    });

    // Sort tickets by event_date if available (ascending - earlier events first)
    return filtered.sort((a, b) => {
      // Handle cases where event_date is missing
      if (!a.event_date && !b.event_date) return 0;
      if (!a.event_date) return 1; // Items without dates go to the end
      if (!b.event_date) return -1;
      
      const dateA = new Date(a.event_date);
      const dateB = new Date(b.event_date);
      
      // Check for invalid dates
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;
      
      return dateA.getTime() - dateB.getTime();
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    filteredEvents,
    filterTickets
  };
};
