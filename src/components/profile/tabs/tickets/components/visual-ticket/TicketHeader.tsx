
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";

interface TicketHeaderProps {
  ticket: UserTicket;
  currentLanguageCode: string;
}

export function TicketHeader({ ticket, currentLanguageCode }: TicketHeaderProps) {
  return (
    <div className="flex-1">
      <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-gray-100">{ticket.title}</h3>
    </div>
  );
}
