
import React from "react";
import { Ticket } from "@/hooks/tickets/types";
import { useLanguage } from "@/features/language";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UseMutationResult } from "@tanstack/react-query";

interface ListedTicketsTableProps {
  tickets: Ticket[];
  deleteTicket: UseMutationResult<void, Error, string>;
}

export const ListedTicketsTable: React.FC<ListedTicketsTableProps> = ({ tickets, deleteTicket }) => {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'sold':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return t('Aktīva', 'Active');
      case 'sold':
        return t('Pārdota', 'Sold');
      case 'cancelled':
        return t('Atcelta', 'Cancelled');
      default:
        return status;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Notikums", "Event")}</TableHead>
          <TableHead>{t("Cena", "Price")}</TableHead>
          <TableHead>{t("Datums", "Date")}</TableHead>
          <TableHead>{t("Statuss", "Status")}</TableHead>
          <TableHead>{t("Darbības", "Actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="font-medium">
              Event ID: {ticket.event_id.substring(0, 8)}...
            </TableCell>
            <TableCell>€{ticket.price.toFixed(2)}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</TableCell>
            <TableCell>
              <Badge className={getStatusBadgeColor(ticket.status)} variant="outline">
                {getStatusText(ticket.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {ticket.status === 'available' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t("Dzēst", "Delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Vai tiešām vēlaties dzēst šo biļeti?", "Are you sure you want to delete this ticket?")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("Šī darbība nevar tikt atcelta. Biļete tiks neatgriezeniski dzēsta no sistēmas.", 
                          "This action cannot be undone. The ticket will be permanently deleted from the system.")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Atcelt", "Cancel")}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTicket.mutate(ticket.id)}>
                        {t("Dzēst", "Delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
