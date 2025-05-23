
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { UserTicket } from '@/hooks/tickets/types';

interface TicketActionsProps {
  ticket: UserTicket;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
    <>
      <div className="text-lg sm:text-xl font-bold text-primary mb-1">
        {formatPrice(ticket.price)}
      </div>
      
      {/* Always show quantity and price per unit, even for single tickets */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
        {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="orange"
          size="sm"
          onClick={onView}
          className="flex-1 text-xs px-2 h-8 text-white"
        >
          <Eye className="h-3 w-3 mr-1" />
          {t("Skatīt", "View")}
        </Button>
        
        {ticket.file_path && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
            }}
            className="flex-1 text-xs px-2 h-8 text-gray-800 dark:text-white"
          >
            <Download className="h-3 w-3 mr-1" />
            {t("Lejupielādēt", "Download")}
          </Button>
        )}
        
        {ticketType === "added" && ticket.status === 'available' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 text-xs px-2 h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Pencil className="h-3 w-3 mr-1" />
            {t("Rediģēt", "Edit")}
          </Button>
        )}
        
        {ticketType === "added" && ticket.status === 'available' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex-1 text-xs px-2 h-8"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("Dzēst", "Delete")}
          </Button>
        )}
      </div>
    </>
  );
}
