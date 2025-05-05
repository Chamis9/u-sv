
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface TicketHeaderProps {
  ticket: UserTicket;
  currentLanguageCode: string;
}

export function TicketHeader({ ticket, currentLanguageCode }: TicketHeaderProps) {
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr;
  };

  return (
    <div className="flex-1">
      <h3 className="font-semibold text-lg mb-1 truncate">{ticket.title}</h3>
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        <Calendar className="h-4 w-4 mr-1" />
        {ticket.event_date 
          ? formatDate(ticket.event_date, currentLanguageCode === 'lv' ? 'lv-LV' : 'en-US')
          : formatDate(ticket.created_at, currentLanguageCode === 'lv' ? 'lv-LV' : 'en-US')}
        {ticket.event_time && (
          <span className="ml-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(ticket.event_time)}
          </span>
        )}
      </div>
      
      {ticket.venue && (
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {ticket.venue}
        </div>
      )}
    </div>
  );
}
