
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { UserTicket } from '@/hooks/tickets/types';
import { TicketsContent } from '../TicketsContent';
import { TicketsList } from '../ticket-list/TicketsList';

interface TabContentProps {
  value: "added" | "purchased";
  tickets: UserTicket[];
  onDelete: (ticketId: string) => void;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  isLoading: boolean;
  ticketType: "added" | "purchased";
}

export function TabContent({ 
  value, 
  tickets, 
  onDelete, 
  onView, 
  onEdit, 
  isLoading,
  ticketType
}: TabContentProps) {
  return (
    <TabsContent value={value} className="mt-2 p-0">
      <div className="w-full">
        {value === "added" ? (
          <TicketsList 
            tickets={tickets}
            isLoading={isLoading}
            onDelete={onDelete}
            onView={onView}
            onEdit={onEdit}
            ticketType={ticketType}
          />
        ) : (
          <TicketsContent 
            tickets={tickets}
            isLoading={isLoading}
            onDelete={onDelete}
            onView={onView}
            onEdit={onEdit}
            ticketType={ticketType}
          />
        )}
      </div>
    </TabsContent>
  );
}
