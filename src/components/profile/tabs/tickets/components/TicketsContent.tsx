
import React, { useState } from "react";
import { UserTicket } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Ticket } from "lucide-react";
import { VisualTicket } from "./visual-ticket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TicketDetailDialog } from "./ticket-list/TicketDetailDialog";
import { TicketPreviewDialog } from "@/components/events/components/TicketPreviewDialog";

interface TicketsContentProps {
  tickets: UserTicket[];
  isLoading: boolean;
  onDelete: (ticketId: string) => void;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  loadingDelete?: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsContent({ 
  tickets, 
  isLoading, 
  onDelete, 
  onView,
  onEdit,
  loadingDelete = false,
  ticketType
}: TicketsContentProps) {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  // Enhanced view handler to open the preview
  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
    onView(ticket);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Alert className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <Ticket className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <AlertTitle className="text-gray-900 dark:text-gray-100">{ticketType === "added" 
          ? t("Nav pievienotu biļešu", "No added tickets") 
          : t("Nav iegādātu biļešu", "No purchased tickets")}
        </AlertTitle>
        <AlertDescription className="text-gray-600 dark:text-gray-300">
          {ticketType === "added" 
            ? t("Jūsu pievienotās biļetes parādīsies šeit", "Your added tickets will appear here") 
            : t("Jūsu iegādātās biļetes parādīsies šeit", "Your purchased tickets will appear here")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-4 max-w-full">
        {tickets.map((ticket) => (
          <VisualTicket
            key={ticket.id}
            ticket={ticket}
            onView={handleViewTicket}
            onEdit={onEdit}
            onDelete={!loadingDelete ? onDelete : undefined}
            ticketType={ticketType}
          />
        ))}
      </div>

      {/* Ticket Details Dialog */}
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
