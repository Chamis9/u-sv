
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
  t: (lvText: string, enText: string, ltText: string, eeText: string) => string;
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
        return <Badge className="bg-blue-500 text-white">{t("Pārdota", "Sold", "Parduotas", "Müüdud")}</Badge>;
      case 'available':
        return <Badge className="bg-green-500 text-white">{t("Aktīva", "Active", "Aktyvus", "Aktiivne")}</Badge>;
      case 'expired':
        return <Badge className="bg-orange-500 text-white">{t("Beigusies", "Expired", "Baigėsi", "Aegunud")}</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{t("Nezināms", "Unknown", "Nežinomas", "Teadmata")}</Badge>;
    }
  };
  
  // Function to get localized category name
  const getLocalizedCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'teātris':
      case 'theatre':
      case 'teatras':
      case 'teater':
        return t('Teātris', 'Theatre', 'Teatras', 'Teater');
      case 'koncerti':
      case 'concerts':
      case 'koncertai':
      case 'kontserdid':
        return t('Koncerti', 'Concerts', 'Koncertai', 'Kontserdid');
      case 'festivāli':
      case 'festivals':
      case 'festivaliai':
      case 'festivalid':
        return t('Festivāli', 'Festivals', 'Festivaliai', 'Festivalid');
      case 'sports':
      case 'sportas':
      case 'sport':
        return t('Sports', 'Sports', 'Sportas', 'Sport');
      case 'kino':
      case 'cinema':
      case 'kinas':
        return t('Kino', 'Cinema', 'Kinas', 'Kino');
      case 'bērniem':
      case 'for children':
      case 'vaikams':
      case 'lastele':
        return t('Bērniem', 'For Children', 'Vaikams', 'Lastele');
      case 'ceļojumi':
      case 'travel':
      case 'kelionės':
      case 'reisimine':
        return t('Ceļojumi', 'Travel', 'Kelionės', 'Reisimine');
      case 'dāvanu kartes':
      case 'gift cards':
      case 'dovanų kortelės':
      case 'kinkekaardid':
        return t('Dāvanu kartes', 'Gift Cards', 'Dovanų kortelės', 'Kinkekaardid');
      case 'citi pasākumi':
      case 'other events':
      case 'kiti renginiai':
      case 'muud üritused':
        return t('Citi pasākumi', 'Other Events', 'Kiti renginiai', 'Muud üritused');
      default:
        return categoryName;
    }
  };
  
  return (
    <TableRow key={ticket.id}>
      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
        {ticket.title}
        <div className="text-xs text-muted-foreground mt-1">
          {getLocalizedCategory(ticket.category)}
        </div>
      </TableCell>
      <TableCell className="text-gray-900 dark:text-gray-100 font-semibold">{formatPrice(ticket.price)}</TableCell>
      <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">
        {formatDate(ticket.created_at, t('lv-LV', 'en-US', 'lt-LT', 'et-EE'))}
      </TableCell>
      <TableCell className="hidden md:table-cell text-gray-700 dark:text-gray-300">
        {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket", "bilietas", "pilet") : t("biļetes", "tickets", "bilietai", "piletid")}
      </TableCell>
      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(ticket)}
            title={t("Skatīt", "View", "Žiūrėti", "Vaata")}
            className="border-gray-300 dark:border-gray-600"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
          
          {ticket.file_path && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
              }}
              title={t("Lejupielādēt", "Download", "Atsisiųsti", "Laadi alla")}
              className="border-gray-300 dark:border-gray-600"
            >
              <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>
          )}
          
          {ticketType === "added" && ticket.status === 'available' && onEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(ticket)}
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-800 border-blue-300 dark:border-blue-600"
              title={t("Rediģēt", "Edit", "Redaguoti", "Muuda")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          
          {ticketType === "added" && ticket.status === 'available' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(ticket.id)}
              className="text-red-600 hover:bg-red-50 hover:text-red-800 border-red-300 dark:border-red-600"
              disabled={isLoading}
              title={t("Dzēst", "Delete", "Ištrinti", "Kustuta")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
