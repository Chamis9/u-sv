
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface TicketDetailsProps {
  ticket: UserTicket;
  t: (lvText: string, enText: string) => string;
}

export function TicketDetails({ ticket, t }: TicketDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold':
        return "bg-blue-500";
      case 'available':
        return "bg-green-500";
      case 'expired':
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'sold':
        return t("Pārdota", "Sold");
      case 'available':
        return t("Aktīva", "Active");
      case 'expired':
        return t("Beigusies", "Expired");
      default:
        return t("Nezināms", "Unknown");
    }
  };
  
  return (
    <div className="my-3">
      <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
        <div className="flex items-center mr-3 mb-1">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 text-gray-600 dark:text-gray-400" />
          {ticket.event_date 
            ? formatDate(ticket.event_date, 'lv-LV')
            : formatDate(ticket.created_at, 'lv-LV')}
        </div>
        
        {ticket.event_time && (
          <div className="flex items-center mb-1 ml-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 text-gray-600 dark:text-gray-400" />
            <span>{ticket.event_time}</span>
          </div>
        )}
      </div>
      
      {ticket.venue && (
        <div className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 text-gray-600 dark:text-gray-400" />
          <span className="break-words line-clamp-1">{ticket.venue}</span>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
        <div className="flex items-center">
          <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words max-w-[150px]">{ticket.category}</span>
        </div>
        
        <Badge className={`${getStatusColor(ticket.status)} text-xs whitespace-nowrap text-white`}>
          {getStatusText(ticket.status)}
        </Badge>
      </div>
    </div>
  );
}
