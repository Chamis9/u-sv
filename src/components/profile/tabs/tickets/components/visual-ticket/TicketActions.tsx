
import React from "react";
import { UserTicket } from "@/hooks/tickets/types";
import { Button } from "@/components/ui/button";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";

interface TicketActionsProps {
  ticket: UserTicket;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  ticketType: "added" | "purchased";
  t: (lvText: string, enText: string, ltText: string, eeText: string) => string;
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
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="flex-1 text-xs px-2 h-8"
      >
        <Eye className="h-3 w-3 mr-1" />
        {t("Skatīt", "View", "Žiūrėti", "Vaata")}
      </Button>
      
      {ticket.file_path && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
          }}
          className="flex-1 text-xs px-2 h-8"
        >
          <Download className="h-3 w-3 mr-1" />
          {t("Lejupielādēt", "Download", "Atsisiųsti", "Laadi alla")}
        </Button>
      )}
      
      {ticketType === "added" && ticket.status === 'available' && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 text-xs px-2 h-8"
        >
          <Pencil className="h-3 w-3 mr-1" />
          {t("Rediģēt", "Edit", "Redaguoti", "Muuda")}
        </Button>
      )}
      
      {ticketType === "added" && ticket.status === 'available' && onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-xs px-2 h-8"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {t("Dzēst", "Delete", "Ištrinti", "Kustuta")}
        </Button>
      )}
    </div>
  );
}
