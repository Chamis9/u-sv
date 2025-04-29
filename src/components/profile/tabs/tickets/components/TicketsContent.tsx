
import React from "react";
import { UserTicket } from "@/hooks/tickets";
import { TicketsList } from "../TicketsList";
import { EmptyTicketState } from "./EmptyTicketState";
import { LoadingSpinner } from "@/components/profile/components/LoadingSpinner";

interface TicketsContentProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (ticketId: string) => void;
  loadingDelete: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsContent({ 
  tickets, 
  isLoading, 
  onDelete, 
  loadingDelete,
  ticketType 
}: TicketsContentProps) {
  // Add debug logging
  console.log(`Rendering TicketsContent for ${ticketType} tickets:`, tickets);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (tickets.length === 0) {
    return <EmptyTicketState type={ticketType} />;
  }
  
  return (
    <TicketsList 
      tickets={tickets} 
      onDelete={onDelete}
      isLoading={loadingDelete}
      ticketType={ticketType}
    />
  );
}
