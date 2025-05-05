
import React from 'react';
import { UserTicket } from '@/hooks/tickets';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2, Pencil } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { formatPrice, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface TicketTableRowProps {
  ticket: UserTicket;
  onView: (ticket: UserTicket) => void;
  onEdit?: (ticket: UserTicket) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  ticketType: "added" | "purchased";
  t: (lvText: string, enText: string) => string;
}

export function TicketTableRow({
  ticket,
  onView,
  onEdit,
  onDelete,
  isLoading,
  ticketType,
  t
}: TicketTableRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return <Badge className="bg-blue-500">{t("Pārdota", "Sold")}</Badge>;
      case 'available':
        return <Badge className="bg-green-500">{t("Aktīva", "Active")}</Badge>;
      case 'expired':
        return <Badge className="bg-orange-500">{t("Beigusies", "Expired")}</Badge>;
      default:
        return <Badge className="bg-gray-500">{t("Nezināms", "Unknown")}</Badge>;
    }
  };
  
  return (
    <TableRow key={ticket.id}>
      <TableCell className="font-medium">
        {ticket.title}
      </TableCell>
      <TableCell>{formatPrice(ticket.price)}</TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(ticket.created_at, t('lv-LV', 'en-US'))}
      </TableCell>
      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(ticket)}
            title={t("Skatīt", "View")}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {ticket.file_path && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
              }}
              title={t("Lejupielādēt", "Download")}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          
          {ticketType === "added" && ticket.status === 'available' && onEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(ticket)}
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-800"
              title={t("Rediģēt", "Edit")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          
          {ticketType === "added" && ticket.status === 'available' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(ticket.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isLoading}
              title={t("Dzēst", "Delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
