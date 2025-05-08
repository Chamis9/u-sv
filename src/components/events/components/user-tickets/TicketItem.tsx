
import React from 'react';
import { UserTicket } from "@/hooks/tickets";
import { formatDate, formatPrice } from "@/utils/formatters";
import { Calendar, MapPin, Clock, Tag, Ticket, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketItemProps {
  ticket: UserTicket;
  onView: (ticket: UserTicket) => void;
  onPurchase: (ticket: UserTicket) => void;
  onDelete?: (ticketId: string) => void;
  isAuthenticated: boolean;
  userId?: string | null;
  currentLanguageCode: string;
  t: (lv: string, en: string) => string;
  isDeleting: boolean;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticket,
  onView,
  onPurchase,
  onDelete,
  isAuthenticated,
  userId,
  currentLanguageCode,
  t,
  isDeleting
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-ticket-accent shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Ticket color band */}
      <div className="h-2 bg-ticket-accent"></div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-gray-100">{ticket.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              {ticket.event_date 
                ? formatDate(ticket.event_date, currentLanguageCode === 'lv' ? 'lv-LV' : 'en-US')
                : formatDate(ticket.created_at, currentLanguageCode === 'lv' ? 'lv-LV' : 'en-US')}
              {ticket.event_time && (
                <span className="ml-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {ticket.event_time}
                </span>
              )}
            </div>
            
            {ticket.venue && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {ticket.venue}
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{ticket.category}</span>
            </div>
            
            <div className="text-xl font-bold text-primary">
              {formatPrice(ticket.price)}
            </div>
            
            {/* Always show quantity and price per unit, even for single tickets */}
            <div className="text-sm text-muted-foreground mt-1">
              {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
            </div>
          </div>
          
          <div className="ml-4 mt-1">
            <Ticket className="h-10 w-10 text-muted-foreground opacity-20" />
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(ticket)}
            className="flex-1 text-gray-800 border-gray-400"
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("Skatīt", "View")}
          </Button>
          
          {/* Show Delete button if user is the owner of this ticket */}
          {isAuthenticated && userId === ticket.seller_id && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(ticket.id)}
              className="flex-1"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("Dzēst", "Delete")}
            </Button>
          )}
          
          {/* Don't show Buy button if user is the seller */}
          {(!isAuthenticated || userId !== ticket.seller_id) && (
            <Button
              variant="orange"
              size="sm"
              onClick={() => onPurchase(ticket)}
              className="flex-1"
            >
              <Ticket className="h-4 w-4 mr-2" />
              {t("Pirkt biļeti", "Buy ticket")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
