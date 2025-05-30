
import React, { useState } from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Ticket as TicketIcon } from "lucide-react";
import { useLanguage } from "@/features/language";
import { TicketPreviewDialog } from "@/components/events/components/TicketPreviewDialog";
import { TicketHeader } from "./TicketHeader";
import { TicketDetails } from "./TicketDetails";
import { TicketActions } from "./TicketActions";

interface VisualTicketProps {
  ticket: UserTicket;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  onDelete?: (id: string) => void;
  ticketType: "added" | "purchased";
}

export function VisualTicket({ ticket, onView, onEdit, onDelete, ticketType }: VisualTicketProps) {
  const { currentLanguage } = useLanguage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const t = (lvText: string, enText: string, ltText: string, eeText: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lvText;
      case 'en': return enText;
      case 'lt': return ltText;
      case 'et':
      case 'ee': return eeText;
      default: return lvText;
    }
  };
  
  const handleViewClick = () => {
    setIsPreviewOpen(true);
    onView(ticket);
  };
  
  const handleDeleteClick = () => {
    if (onDelete) {
      console.log("Delete button clicked for ticket:", ticket.id);
      onDelete(ticket.id);
    }
  };
  
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(ticket);
    }
  };
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
        {/* Ticket header with color band */}
        <div className={`h-2 ${ticket.status === 'sold' ? "bg-blue-500" : ticket.status === 'available' ? "bg-orange-500" : "bg-orange-500"}`}></div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-auto">
            <TicketHeader 
              ticket={ticket} 
              currentLanguageCode={currentLanguage.code}
            />
            
            <div className="ml-4 mt-1">
              <TicketIcon className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
          </div>
          
          <TicketDetails 
            ticket={ticket}
            t={t}
          />
          
          <div className="mt-auto">
            <TicketActions
              ticket={ticket}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              ticketType={ticketType}
              t={t}
            />
          </div>
        </div>
      </div>
      
      {/* Ticket Preview Dialog */}
      <TicketPreviewDialog
        ticket={ticket}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
