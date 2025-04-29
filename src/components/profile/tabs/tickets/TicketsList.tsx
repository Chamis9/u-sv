
import React, { useState, useEffect } from 'react';
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
import { formatPrice, formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TicketsListProps {
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  ticketType: "added" | "purchased";
}

// Use a globally accessible state for the selected ticket
let globalSelectedTicket: UserTicket | null = null;
let setGlobalSelectedTicket: ((ticket: UserTicket | null) => void) | null = null;

export function TicketsList({ tickets, onDelete, isLoading, ticketType }: TicketsListProps) {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  
  // Save references to the state setter for external components to use
  useEffect(() => {
    setGlobalSelectedTicket = setSelectedTicket;
    return () => {
      setGlobalSelectedTicket = null;
    };
  }, []);
  
  // Update local state when global state changes
  useEffect(() => {
    if (globalSelectedTicket && globalSelectedTicket !== selectedTicket) {
      setSelectedTicket(globalSelectedTicket);
      globalSelectedTicket = null;
    }
  }, [selectedTicket]);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Nosaukums", "Title")}</TableHead>
            <TableHead>{t("Cena", "Price")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("Datums", "Date")}</TableHead>
            <TableHead>{t("Statuss", "Status")}</TableHead>
            <TableHead className="text-right">{t("Darbības", "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                {ticket.title}
              </TableCell>
              <TableCell>{formatPrice(ticket.price)}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(ticket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
              </TableCell>
              <TableCell>{getStatusBadge(ticket.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedTicket(ticket)}
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
          ))}
        </TableBody>
      </Table>
      
      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Biļetes informācija", "Ticket Information")}</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{t("Nosaukums", "Title")}</h3>
                <p>{selectedTicket.title}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">{t("Kategorija", "Category")}</h3>
                <p>{selectedTicket.category}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">{t("Cena", "Price")}</h3>
                <p>{formatPrice(selectedTicket.price)}</p>
              </div>
              
              {selectedTicket.description && (
                <div>
                  <h3 className="font-semibold">{t("Apraksts", "Description")}</h3>
                  <p>{selectedTicket.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold">{t("Statuss", "Status")}</h3>
                <div>{getStatusBadge(selectedTicket.status)}</div>
              </div>
              
              <div>
                <h3 className="font-semibold">{t("Pievienota", "Added")}</h3>
                <p>{formatDate(selectedTicket.created_at, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}</p>
              </div>
              
              {selectedTicket.file_path && (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${selectedTicket.file_path}`, '_blank');
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("Lejupielādēt biļeti", "Download Ticket")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Expose a function to open the dialog from other components
export function openTicketDialog(ticket: UserTicket) {
  globalSelectedTicket = ticket;
  if (setGlobalSelectedTicket) {
    setGlobalSelectedTicket(ticket);
  }
}
