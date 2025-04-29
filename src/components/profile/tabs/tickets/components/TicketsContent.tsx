
import React from "react";
import { UserTicket } from "@/hooks/tickets";
import { TicketsList } from "../TicketsList";
import { EmptyTicketState } from "./EmptyTicketState";

interface TicketsContentProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (ticketId: string) => void;
  loadingDelete: boolean;
  ticketType: "listed" | "sold";
}

export function TicketsContent({ 
  tickets, 
  isLoading, 
  onDelete, 
  loadingDelete,
  ticketType 
}: TicketsContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return <EmptyTicketState type={ticketType} />;
  }
  
  return (
    <TicketsList 
      tickets={tickets} 
      onDelete={onDelete}
      isLoading={loadingDelete}
    />
  );
}
