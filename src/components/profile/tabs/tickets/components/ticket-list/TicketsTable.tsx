
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
  
  // Create a 2-parameter translation function for TicketTableRow component
  const twoParamT = (lv: string, en: string) => t(lv, en, lv, en);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">
            {t("Nosaukums", "Title", "Pavadinimas", "Pealkiri")}
          </TableHead>
          <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">
            {t("Cena", "Price", "Kaina", "Hind")}
          </TableHead>
          <TableHead className="hidden md:table-cell text-gray-900 dark:text-gray-100 font-semibold">
            {t("Datums", "Date", "Data", "Kuupäev")}
          </TableHead>
          <TableHead className="hidden md:table-cell text-gray-900 dark:text-gray-100 font-semibold">
            {t("Biļešu skaits", "Quantity", "Kiekis", "Kogus")}
          </TableHead>
          <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">
            {t("Statuss", "Status", "Būsena", "Olek")}
          </TableHead>
          <TableHead className="text-right text-gray-900 dark:text-gray-100 font-semibold">
            {t("Darbības", "Actions", "Veiksmai", "Tegevused")}
          </TableHead>
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
            t={twoParamT}
          />
        ))}
      </TableBody>
    </Table>
  );
}
