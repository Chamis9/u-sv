
import React, { useState } from 'react';
import { UserTicket } from '@/hooks/tickets';
import { TicketsTable } from './TicketsTable';
import { TicketDetailDialog } from './TicketDetailDialog';
import { useTicketDialog } from '../../hooks/useTicketDialog';
import { TicketPreviewDialog } from '@/components/events/components/TicketPreviewDialog';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Enhanced view handler to open the preview
  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
    onView(ticket); // Call the original onView function
  };
  
  return (
    <>
      <TicketsTable 
        tickets={tickets}
        onDelete={onDelete}
        onView={handleViewTicket}
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
      
      {/* Ticket Preview Dialog */}
      <TicketPreviewDialog
        ticket={selectedTicket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
