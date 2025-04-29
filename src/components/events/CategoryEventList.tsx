
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from "@/features/language";
import { useEvents } from '@/hooks/useEvents';
import { getCategoryDisplayName } from './utils/categoryUtils';
import { CategoryHeader } from './components/CategoryHeader';
import { EventsGrid } from './components/EventsGrid';
import { useCategoryTickets } from '@/hooks/useCategoryTickets';
import { useEventFilters } from '@/hooks/useEventFilters';
import { EventSearchFilter } from './components/EventSearchFilter';
import { EventTicketPurchaseContainer } from './components/EventTicketPurchaseContainer';
import { EventsPageLayout } from './components/EventsPageLayout';

export function CategoryEventList() {
  const { category } = useParams<{ category: string }>();
  const { data: events, isLoading, error } = useEvents(category);
  const { currentLanguage } = useLanguage();
  
  const {
    allCategoryTickets,
    isLoading: ticketsLoading,
    error: ticketsError,
    removeTicketFromState
  } = useCategoryTickets(category);

  const {
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredEvents,
    filterTickets
  } = useEventFilters(events);

  // Filter tickets based on search query
  const filteredTickets = filterTickets(allCategoryTickets);

  if (error) {
    return (
      <EventsPageLayout>
        <div className="text-center p-8">
          {currentLanguage.code === 'lv' ? 'Kļūda ielādējot datus' : 'Error loading data'}
        </div>
      </EventsPageLayout>
    );
  }

  // Determine category display name
  const categoryDisplayName = category ? getCategoryDisplayName(category, currentLanguage.code) : '';

  return (
    <EventsPageLayout 
      title={`${categoryDisplayName} | netieku.es`}
      description={`${categoryDisplayName} biļetes un pasākumi | netieku.es`}
    >
      <CategoryHeader categoryDisplayName={categoryDisplayName} />
      
      <EventSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      
      <EventTicketPurchaseContainer removeTicketFromState={removeTicketFromState}>
        <EventsGrid 
          events={filteredEvents}
          availableTickets={filteredTickets} 
          isLoading={isLoading || ticketsLoading}
        />
      </EventTicketPurchaseContainer>
    </EventsPageLayout>
  );
}
