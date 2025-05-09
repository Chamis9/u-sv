
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { UserTicket } from "@/hooks/tickets";
import { TicketsContent } from "../TicketsContent";
import { TicketsList } from "../ticket-list/TicketsList";

interface TabContentProps {
  value: "added" | "purchased";
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  onEdit?: (ticket: UserTicket) => void;
  onView: (ticket: UserTicket) => void;
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
  // Check screen size for responsive rendering
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return (
    <TabsContent value={value} className="space-y-4">
      {isLargeScreen ? (
        <TicketsList 
          tickets={tickets}
          onDelete={onDelete}
          onView={onView}
          onEdit={onEdit}
          isLoading={isLoading}
          ticketType={ticketType}
        />
      ) : (
        <TicketsContent
          tickets={tickets}
          isLoading={isLoading}
          onDelete={onDelete}
          onEdit={onEdit}
          ticketType={ticketType}
        />
      )}
    </TabsContent>
  );
}
