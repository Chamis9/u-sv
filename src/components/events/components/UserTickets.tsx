
import React, { useState } from 'react';
import { useLanguage } from "@/features/language";
import { Button } from "@/components/ui/button";
import { Ticket, Calendar, MapPin, Clock, Tag, Eye } from "lucide-react";
import { UserTicket } from "@/hooks/tickets";
import { formatDate, formatPrice } from "@/utils/formatters";
import { TicketPreviewDialog } from "./TicketPreviewDialog";

interface UserTicketsProps {
  availableTickets: UserTicket[];
  onPurchase: (ticket: UserTicket) => void;
}

export const UserTickets: React.FC<UserTicketsProps> = ({ availableTickets, onPurchase }) => {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
  };

  if (availableTickets.length === 0) {
    return (
      <div className="mt-8 text-center py-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium">
          {t("Nav pieejamu biļešu no lietotājiem", "No user submitted tickets available")}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t("Šim pasākumam pašlaik nav pārdošanā biļetes no lietotājiem", "There are no user tickets for sale for this event at the moment")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {t("Pieejamās biļetes", "Available tickets")}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Ticket color band */}
            <div className="h-2 bg-green-500"></div>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 truncate">{ticket.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {ticket.event_date 
                      ? formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')
                      : formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
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
                  onClick={() => handleViewTicket(ticket)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {t("Skatīt", "View")}
                </Button>
                
                <Button
                  variant="orange"
                  size="sm"
                  onClick={() => onPurchase(ticket)}
                  className="flex-1"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {t("Pirkt biļeti", "Buy ticket")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Ticket Preview Dialog */}
      <TicketPreviewDialog
        ticket={selectedTicket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
