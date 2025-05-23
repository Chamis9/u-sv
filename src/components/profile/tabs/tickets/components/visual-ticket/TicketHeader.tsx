
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";

interface TicketHeaderProps {
  ticket: UserTicket;
  currentLanguageCode: string;
}

export function TicketHeader({ ticket, currentLanguageCode }: TicketHeaderProps) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 dark:text-gray-100 break-words">{ticket.title}</h3>
      {ticket.description && (
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2 break-words">
          {ticket.description}
        </p>
      )}
    </div>
  );
}
