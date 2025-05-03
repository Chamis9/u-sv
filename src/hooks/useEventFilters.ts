
import { useState } from 'react';
import { Event } from '@/hooks/useEvents';

export const useEventFilters = (events?: Event[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Filter events based on search query and dates
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
  }) || [];

  // Helper function to filter tickets with the search query
  const filterTickets = (tickets: any[]) => {
    return tickets.filter(ticket => {
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
