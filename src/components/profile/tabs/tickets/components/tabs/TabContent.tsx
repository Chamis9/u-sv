
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { TicketsList } from "../../components/ticket-list/TicketsList";
import { UserTicket } from "@/hooks/tickets";

interface TabContentProps {
  value: string;
  tickets: UserTicket[];
  onDelete: (id: string) => void;
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
    <TabsContent value={value}>
      <TicketsList
        tickets={tickets}
        onDelete={onDelete}
        onView={onView}
        onEdit={onEdit}
        isLoading={isLoading}
        ticketType={ticketType}
      />
    </TabsContent>
  );
}
