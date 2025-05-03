
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
import { UserTicket } from '@/hooks/tickets';
import { UserTickets } from './components/UserTickets';

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

  // Filter tickets based on search query and date range
  const filteredTickets = filterTickets(allCategoryTickets);

  // Dummy function to satisfy type checking - this will be replaced by the container
  const dummyOnPurchase = (ticket: UserTicket) => {
    console.log("Dummy purchase function called, will be replaced by container", ticket);
  };

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
        {filteredEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {currentLanguage.code === 'lv' ? 'Pasākumi' : 'Events'}
            </h2>
            <EventsGrid 
              events={filteredEvents}
              availableTickets={[]} 
              isLoading={isLoading}
              onPurchase={dummyOnPurchase} 
            />
          </div>
        )}
        
        <UserTickets
          availableTickets={filteredTickets}
          onPurchase={dummyOnPurchase}
        />
      </EventTicketPurchaseContainer>
    </EventsPageLayout>
  );
}
