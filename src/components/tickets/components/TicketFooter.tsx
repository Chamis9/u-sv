
import React from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/language";
import { Ticket } from "@/hooks/tickets";

interface TicketFooterProps {
  ticket: Ticket;
  onDelete?: () => void;
}

export function TicketFooter({ ticket, onDelete }: TicketFooterProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  const handleDeleteTicket = async () => {
    if (window.confirm(t('Vai tiešām vēlaties dzēst šo biļeti?', 'Are you sure you want to delete this ticket?'))) {
      if (onDelete) onDelete();
    }
  };

  return (
    <>
      <div className="text-xs text-muted-foreground">
        {t('Pievienota:', 'Added:')} {formatDate(ticket.created_at)}
      </div>
      <div>
        {onDelete && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteTicket}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('Dzēst', 'Delete')}
          </Button>
        )}
      </div>
    </>
  );
}
