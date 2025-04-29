
import React from "react";
import { UserTicket } from "@/hooks/tickets";
import { TicketsList } from "../TicketsList";
import { EmptyTicketState } from "./EmptyTicketState";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/profile/components/LoadingSpinner";

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
    />
  );
}
