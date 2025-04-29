
import React from 'react';
import { UserTicket } from '@/hooks/tickets/types';
import { Pencil } from 'lucide-react';
import { TicketsGrid } from './TicketsGrid';
import { TicketsList, openTicketDialog } from '../../tickets/TicketsList';
import { EmptyTicketState } from './EmptyTicketState';

interface TicketsContentProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit?: (ticket: UserTicket) => void;
  loadingDelete: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsContent({ 
  tickets, 
  isLoading, 
  onDelete, 
  onEdit,
  loadingDelete, 
  ticketType 
}: TicketsContentProps) {
  const handleView = (ticket: UserTicket) => {
    openTicketDialog(ticket);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (tickets.length === 0) {
    return <EmptyTicketState ticketType={ticketType} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <TicketsList 
          tickets={tickets} 
          onDelete={onDelete} 
          isLoading={loadingDelete} 
          ticketType={ticketType}
          onView={handleView}
          onEdit={onEdit}
        />
      </div>
      
      <div className="md:hidden">
        <TicketsGrid 
          tickets={tickets} 
          onDelete={onDelete} 
          onView={handleView}
          onEdit={onEdit}
          ticketType={ticketType} 
        />
      </div>
    </div>
  );
}
