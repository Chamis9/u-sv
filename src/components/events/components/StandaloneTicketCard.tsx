
import React from 'react';
import { Calendar, Ticket } from "lucide-react";
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { UserTicket } from "@/hooks/tickets";
import { format } from 'date-fns';
import { lv, enUS } from 'date-fns/locale';
import { formatPrice } from "@/utils/formatters";

interface StandaloneTicketCardProps {
  ticket: UserTicket;
  onViewTicket: (ticket: UserTicket) => void;
  onPurchase: (ticket: UserTicket) => void;
}

export const StandaloneTicketCard: React.FC<StandaloneTicketCardProps> = ({
  ticket,
  onViewTicket,
  onPurchase
}) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage.code === 'lv' ? lv : enUS;
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 break-words">{ticket.title}</h3>
        {ticket.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {ticket.description}
          </p>
        )}
        {ticket.venue && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {t('Vieta', 'Venue')}: {ticket.venue}
          </div>
        )}
        {ticket.event_date && (
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            {format(new Date(ticket.event_date), 'dd.MM.yyyy', { locale })}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold">
            {formatPrice(ticket.price)}
          </div>
          <div className="text-sm text-gray-500">
            {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onViewTicket(ticket)} 
            className="whitespace-nowrap text-gray-800 border-gray-400" 
            variant="outline"
          >
            {t('Skatīt', 'View')}
          </Button>
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
    </div>
  );
};
