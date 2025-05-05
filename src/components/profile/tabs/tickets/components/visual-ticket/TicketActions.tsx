
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
    <div className="mt-4 flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="flex-1"
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
          className="flex-1"
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
          className="flex-1"
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
