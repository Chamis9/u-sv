
import React from 'react';
import { useLanguage } from '@/features/language';
import { UserTicket } from '@/hooks/tickets';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { TicketTableRow } from './TicketTableRow';
import { openTicketDialog } from '../../hooks/useTicketDialog';

interface TicketsTableProps {
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  isLoading: boolean;
  ticketType: "added" | "purchased";
}

export function TicketsTable({ 
  tickets, 
  onDelete, 
  onView, 
  onEdit, 
  isLoading, 
  ticketType 
}: TicketsTableProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Nosaukums", "Title")}</TableHead>
          <TableHead>{t("Cena", "Price")}</TableHead>
          <TableHead className="hidden md:table-cell">{t("Datums", "Date")}</TableHead>
          <TableHead className="hidden md:table-cell">{t("Biļešu skaits", "Quantity")}</TableHead>
          <TableHead>{t("Statuss", "Status")}</TableHead>
          <TableHead className="text-right">{t("Darbības", "Actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TicketTableRow
            key={ticket.id}
            ticket={ticket}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isLoading}
            ticketType={ticketType}
            t={t}
          />
        ))}
      </TableBody>
    </Table>
  );
}
