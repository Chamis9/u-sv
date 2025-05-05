
import React from 'react';
import { UserTicket } from '@/hooks/tickets/types';
import { VisualTicket } from './visual-ticket';

interface TicketsGridProps {
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  ticketType: "added" | "purchased";
}

export function TicketsGrid({ tickets, onDelete, onView, onEdit, ticketType }: TicketsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tickets.map((ticket) => (
        <VisualTicket 
          key={ticket.id}
          ticket={ticket}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          ticketType={ticketType}
        />
      ))}
    </div>
  );
}
