
import React from 'react';
import { useLanguage } from '@/features/language';
import { UserTicket } from '@/hooks/useUserTickets';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatPrice } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

interface TicketsListProps {
  tickets: UserTicket[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function TicketsList({ tickets, onDelete, isLoading }: TicketsListProps) {
  const { currentLanguage } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">{t("Pieejama", "Available")}</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500">{t("Pārdota", "Sold")}</Badge>;
      case 'expired':
        return <Badge variant="outline">{t("Beigusies", "Expired")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Pasākums", "Event")}</TableHead>
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
              <TableCell className="hidden md:table-cell">{formatDate(ticket.created_at)}</TableCell>
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
                        // Handle download logic
                        window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${ticket.file_path}`, '_blank');
                      }}
                      title={t("Lejupielādēt", "Download")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {ticket.status === 'available' && (
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
                <h3 className="font-semibold">{t("Pasākums", "Event")}</h3>
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
                <p>{formatDate(selectedTicket.created_at)}</p>
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
