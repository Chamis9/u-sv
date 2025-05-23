
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Eye, Download, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketActionsProps {
  ticket: UserTicket;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  ticketType: "added" | "purchased";
  t: (lvText: string, enText: string) => string;
}

export function TicketActions({ 
  ticket, 
  onView, 
  onEdit, 
  onDelete, 
  ticketType, 
  t 
}: TicketActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="flex-1 text-ticket-accent border-ticket-accent hover:bg-ticket-accent/10 hover:text-ticket-accent"
      >
        <Eye className="h-4 w-4 mr-2" />
        {t("Skatīt", "View")}
      </Button>
      
      {ticket.file_path && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
          }}
          className="flex-1 text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("Lejupielādēt", "Download")}
        </Button>
      )}
      
      {ticketType === "added" && ticket.status === 'available' && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          <Pencil className="h-4 w-4 mr-2" />
          {t("Rediģēt", "Edit")}
        </Button>
      )}
      
      {ticketType === "added" && ticket.status === 'available' && onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1"
        >
          {t("Dzēst", "Delete")}
        </Button>
      )}
    </div>
  );
}
