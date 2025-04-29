
import React from "react";
import { UserTicket } from "@/hooks/tickets";
import { VisualTicket } from "./VisualTicket";
import { EmptyTicketState } from "./EmptyTicketState";
import { LoadingSpinner } from "@/components/profile/components/LoadingSpinner";

interface TicketsGridProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (ticketId: string) => void;
  loadingDelete: boolean;
  ticketType: "added" | "purchased";
  onViewTicket: (ticket: UserTicket) => void;
}

export function TicketsGrid({ 
  tickets, 
  isLoading, 
  onDelete, 
  loadingDelete,
  ticketType,
  onViewTicket
}: TicketsGridProps) {
  console.log(`Rendering TicketsGrid for ${ticketType} tickets:`, tickets);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (tickets.length === 0) {
    return <EmptyTicketState type={ticketType} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <VisualTicket 
          key={ticket.id}
          ticket={ticket} 
          onView={onViewTicket}
          onDelete={loadingDelete ? undefined : onDelete}
          ticketType={ticketType}
        />
      ))}
    </div>
  );
}
