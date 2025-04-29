
import React from "react";
import { useLanguage } from "@/features/language";
import { Ticket } from "@/hooks/tickets";

interface TicketDetailsProps {
  ticket: Ticket;
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (!ticket.seat_info && !ticket.description) {
    return null;
  }

  return (
    <>
      {ticket.seat_info && (
        <div className="mb-2">
          <strong>{t('Sēdvieta:', 'Seat:')}</strong> {ticket.seat_info}
        </div>
      )}
      {ticket.description && (
        <div>
          <strong>{t('Apraksts:', 'Description:')}</strong> {ticket.description}
        </div>
      )}
    </>
  );
}
