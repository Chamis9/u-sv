
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";

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
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{ticket.category}</span>
        </div>
        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
          {getStatusText(ticket.status)}
        </Badge>
      </div>
      
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {formatPrice(ticket.price)}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
      </div>
    </>
  );
}
