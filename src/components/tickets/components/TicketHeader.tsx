
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react"; 
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/features/language";
import { Ticket } from "@/hooks/tickets";

interface TicketHeaderProps {
  ticket: Ticket;
  eventTitle?: string;
}

export function TicketHeader({ ticket, eventTitle }: TicketHeaderProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <CardTitle className="flex justify-between">
        <span>{eventTitle || t('Biļete', 'Ticket')}</span>
        <span className="text-orange-500">€{ticket.price.toFixed(2)}</span>
      </CardTitle>
      {(ticket as any).events && (
        <CardDescription className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          {formatDate((ticket as any).events.start_date)}
        </CardDescription>
      )}
    </>
  );
}
