
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Event } from "@/hooks/useEvents";
import { UserTicket } from "@/hooks/tickets";
import { format } from 'date-fns';
import { lv, enUS } from 'date-fns/locale';
import { formatPrice } from "@/utils/formatters";

interface EventCardProps {
  event: Event;
  eventTickets: UserTicket[];
}

export const EventCard: React.FC<EventCardProps> = ({ event, eventTickets }) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage.code === 'lv' ? lv : enUS;
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
    }
  };
  
  // Calculate price range
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-auto">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 break-words">{event.title}</h3>
          <div className="flex items-center text-sm mb-2 text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            {formattedDate}
          </div>
          {event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        {eventTickets.length > 0 ? (
          <div className="text-lg font-bold">
            {priceDisplay}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            {t('Nav pieejamu biļešu', 'No tickets available', 'Nėra bilietų', 'Pileteid pole saadaval')}
          </div>
        )}
        
        <Link to={`/events/${event.category}/${event.id}`}>
          <Button className="whitespace-nowrap text-gray-800 border-gray-400" variant="outline">
            <Ticket className="h-4 w-4 mr-1" />
            {t('Biļetes', 'Tickets', 'Bilietai', 'Piletid')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
