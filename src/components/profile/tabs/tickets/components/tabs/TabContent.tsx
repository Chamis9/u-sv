
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { UserTicket } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { useDevice } from "@/hooks/useDevice";
import { TicketsContent } from "../TicketsContent";
import { TicketsList } from "../ticket-list";

interface TabContentProps {
  value: string;
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
  const { isMobile } = useDevice();
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <TabsContent value={value} className="pt-4">
      {isMobile ? (
        <TicketsContent
          tickets={tickets}
          isLoading={isLoading}
          onDelete={onDelete}
          onEdit={onEdit}
          ticketType={ticketType}
        />
      ) : (
        <TicketsList
          tickets={tickets}
          onDelete={onDelete}
          onView={onView}
          onEdit={onEdit}
          isLoading={isLoading}
          ticketType={ticketType}
        />
      )}
    </TabsContent>
  );
}
