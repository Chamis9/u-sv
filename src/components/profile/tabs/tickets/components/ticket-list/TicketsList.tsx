
import React from 'react';
import { UserTicket } from '@/hooks/tickets';
import { TicketsTable } from './TicketsTable';
import { TicketDetailDialog } from './TicketDetailDialog';
import { useTicketDialog } from '../../hooks/useTicketDialog';

interface TicketsListProps {
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  isLoading: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsList({ 
  tickets, 
  onDelete, 
  onView, 
  onEdit, 
  isLoading, 
  ticketType 
}: TicketsListProps) {
  const { selectedTicket, setSelectedTicket } = useTicketDialog();
  
  return (
    <>
      <TicketsTable 
        tickets={tickets}
        onDelete={onDelete}
        onView={onView}
        onEdit={onEdit}
        isLoading={isLoading}
        ticketType={ticketType}
      />
      
      <TicketDetailDialog 
        selectedTicket={selectedTicket} 
        setSelectedTicket={setSelectedTicket}
        onEdit={onEdit}
        ticketType={ticketType}
      />
    </>
  );
}
