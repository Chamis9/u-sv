
import React from "react";
import { UserTicket } from "@/hooks/tickets";
import { TicketItem } from "./TicketItem";

interface TicketGridProps {
  availableTickets: UserTicket[];
  onView: (ticket: UserTicket) => void;
  onPurchase: (ticket: UserTicket) => void;
  onDelete?: (ticketId: string) => void;
  isAuthenticated: boolean;
  userId?: string | null;
  currentLanguageCode: string;
  t: (lv: string, en: string, lt: string, ee: string) => string;
  isDeleting: boolean;
}

export const TicketGrid: React.FC<TicketGridProps> = ({
  availableTickets,
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {availableTickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          onView={() => onView(ticket)}
          onPurchase={onPurchase}
          onDelete={onDelete}
          isAuthenticated={isAuthenticated}
          userId={userId}
          currentLanguageCode={currentLanguageCode}
          t={t}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};
