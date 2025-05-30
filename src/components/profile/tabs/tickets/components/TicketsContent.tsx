
import React, { useState } from "react";
import { UserTicket } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
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

  // Enhanced view handler to open the preview
  const handleViewTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setIsPreviewOpen(true);
    onView(ticket);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Alert className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 my-6">
        <Ticket className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <AlertTitle className="text-gray-900 dark:text-gray-100 font-medium">{ticketType === "added" 
          ? t("Nav pievienotu biļešu", "No added tickets", "Nėra pridėtų bilietų", "Pole lisatud pileteid") 
          : t("Nav iegādātu biļešu", "No purchased tickets", "Nėra įsigytų bilietų", "Pole ostetud pileteid")}
        </AlertTitle>
        <AlertDescription className="text-gray-600 dark:text-gray-300">
          {ticketType === "added" 
            ? t("Jūsu pievienotās biļetes parādīsies šeit", "Your added tickets will appear here", "Jūsų pridėti bilietai atsiras čia", "Teie lisatud piletid kuvatakse siin") 
            : t("Jūsu iegādātās biļetes parādīsies šeit", "Your purchased tickets will appear here", "Jūsų įsigyti bilietai atsiras čia", "Teie ostetud piletid kuvatakse siin")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-4 p-2 max-w-full">
        {tickets.map((ticket) => (
          <VisualTicket
            key={ticket.id}
            ticket={ticket}
            onView={() => handleViewTicket(ticket)}
            onEdit={onEdit ? () => onEdit(ticket) : undefined}
            onDelete={!loadingDelete ? (id) => onDelete(id) : undefined}
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
