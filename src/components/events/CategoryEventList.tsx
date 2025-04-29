
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from "@/features/language";
import { useEvents } from '@/hooks/useEvents';
import { getCategoryDisplayName, getCategoryIdFromUrl } from './utils/categoryUtils';
import { CategoryHeader } from './components/CategoryHeader';
import { EventsGrid } from './components/EventsGrid';
import { useCategoryTickets } from '@/hooks/useCategoryTickets';
import { useEventFilters } from '@/hooks/useEventFilters';
import { EventSearchFilter } from './components/EventSearchFilter';
import { EventTicketPurchaseContainer } from './components/EventTicketPurchaseContainer';
import { EventsPageLayout } from './components/EventsPageLayout';
import { UserTicket } from '@/hooks/tickets';

export function CategoryEventList() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const categoryId = categorySlug ? getCategoryIdFromUrl(categorySlug) : undefined;
  const { data: events, isLoading, error } = useEvents(categoryId);
  const { currentLanguage } = useLanguage();
  
  const {
    allCategoryTickets,
    isLoading: ticketsLoading,
    error: ticketsError,
    removeTicketFromState
  } = useCategoryTickets(categorySlug);

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

  // Dummy function to satisfy type checking - this will be replaced by the container
  const dummyOnPurchase = (ticket: UserTicket) => {};

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
  const categoryDisplayName = categorySlug ? getCategoryDisplayName(categorySlug, currentLanguage.code) : '';

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
          onPurchase={dummyOnPurchase} // This will be overridden by EventTicketPurchaseContainer
        />
      </EventTicketPurchaseContainer>
    </EventsPageLayout>
  );
}
