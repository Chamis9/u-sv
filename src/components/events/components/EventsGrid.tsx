
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { UserTicket } from "@/hooks/tickets";
import { format } from 'date-fns';
import { lv, enUS } from 'date-fns/locale';
import { Event } from "@/hooks/useEvents";

interface EventsGridProps {
  events: Event[];
  availableTickets: UserTicket[];
  isLoading: boolean;
  onPurchase: (ticket: UserTicket) => void;
}

export const EventsGrid: React.FC<EventsGridProps> = ({ 
  events, 
  availableTickets, 
  isLoading,
  onPurchase 
}) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  const locale = currentLanguage.code === 'lv' ? lv : enUS;

  // Group tickets by event ID for easier access
  const ticketsByEvent = availableTickets.reduce((acc, ticket) => {
    const eventId = ticket.event_id || '';
    if (!acc[eventId]) acc[eventId] = [];
    acc[eventId].push(ticket);
    return acc;
  }, {} as Record<string, UserTicket[]>);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Show message if both events and tickets are empty
  if (events.length === 0 && availableTickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {t('Šajā kategorijā nav pasākumu vai biļešu', 'No events or tickets in this category')}
        </p>
      </div>
    );
  }

  // If we don't have events but have standalone tickets
  const standAloneTickets = availableTickets.filter(ticket => !ticket.event_id || !events.some(event => String(event.id) === ticket.event_id));
  
  return (
    <div className="space-y-12">
      {/* Events with tickets */}
      {events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            // Convert event ID to string for comparison with ticket event_id
            const eventId = String(event.id);
            const eventTickets = ticketsByEvent[eventId] || [];
            const lowestPrice = eventTickets.length > 0 
              ? Math.min(...eventTickets.map(t => Number(t.price))) 
              : 0;
            const highestPrice = eventTickets.length > 0 
              ? Math.max(...eventTickets.map(t => Number(t.price))) 
              : 0;
            
            // Format price range
            let priceDisplay = '';
            if (eventTickets.length > 0) {
              if (lowestPrice === highestPrice) {
                priceDisplay = `${lowestPrice} €`;
              } else {
                priceDisplay = `${lowestPrice} - ${highestPrice} €`;
              }
            }

            // Format date
            let formattedDate = '';
            try {
              formattedDate = format(new Date(event.start_date), 'dd.MM.yyyy', { locale });
            } catch (e) {
              formattedDate = event.start_date;
            }

            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm mb-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formattedDate}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                  {eventTickets.length > 0 ? (
                    <div className="text-lg font-bold">
                      {priceDisplay}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {t('Nav pieejamu biļešu', 'No tickets available')}
                    </div>
                  )}
                  
                  <Link to={`/events/${event.category}/${event.id}`}>
                    <Button className="whitespace-nowrap" variant="ghost">
                      <Ticket className="h-4 w-4 mr-1" />
                      {t('Biļetes', 'Tickets')}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Standalone tickets section */}
      {standAloneTickets.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            {t('Pieejamās biļetes', 'Available Tickets')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {standAloneTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{ticket.title}</h3>
                  {ticket.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {ticket.description}
                    </p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {ticket.price} €
                  </div>
                  
                  <Button 
                    onClick={() => onPurchase(ticket)} 
                    className="whitespace-nowrap" 
                    variant="orange"
                  >
                    <Ticket className="h-4 w-4 mr-1" />
                    {t('Pirkt biļeti', 'Buy ticket')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
