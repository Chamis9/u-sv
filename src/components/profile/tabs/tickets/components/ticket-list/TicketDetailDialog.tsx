
import React from 'react';
import { UserTicket } from '@/hooks/tickets';
import { useLanguage } from '@/features/language';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Pencil } from 'lucide-react';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useDevice } from '@/hooks/useDevice';

interface TicketDetailDialogProps {
  selectedTicket: UserTicket | null;
  setSelectedTicket: (ticket: UserTicket | null) => void;
  onEdit?: (ticket: UserTicket) => void;
  ticketType: "added" | "purchased";
}

export function TicketDetailDialog({ 
  selectedTicket, 
  setSelectedTicket,
  onEdit,
  ticketType
}: TicketDetailDialogProps) {
  const { currentLanguage } = useLanguage();
  const { isMobile } = useDevice();
  
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

  const ticketContent = selectedTicket && (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">{t("Nosaukums", "Title")}</h3>
        <p className="break-words">{selectedTicket.title}</p>
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
          <p className="break-words">{selectedTicket.description}</p>
        </div>
      )}
      
      {selectedTicket.event_date && (
        <div>
          <h3 className="font-semibold">{t("Datums", "Date")}</h3>
          <p>{formatDate(selectedTicket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}</p>
        </div>
      )}
      
      {selectedTicket.venue && (
        <div>
          <h3 className="font-semibold">{t("Vieta", "Venue")}</h3>
          <p className="break-words">{selectedTicket.venue}</p>
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
      
      <div className="pt-2 flex flex-wrap gap-2">
        {selectedTicket.file_path && (
          <Button
            variant="secondary"
            onClick={() => {
              window.open(`https://bljjkzgswgeqswuuryvm.supabase.co/storage/v1/object/public/tickets/${selectedTicket.file_path}`, '_blank');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("Lejupielādēt biļeti", "Download Ticket")}
          </Button>
        )}
        
        {ticketType === "added" && selectedTicket.status === 'available' && onEdit && (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedTicket(null);
              onEdit(selectedTicket);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t("Rediģēt", "Edit")}
          </Button>
        )}
      </div>
    </div>
  );
  
  // Use Sheet on mobile, Dialog on larger screens
  if (isMobile) {
    return (
      <Sheet open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <SheetContent className="max-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("Biļetes informācija", "Ticket Information")}</SheetTitle>
          </SheetHeader>
          {ticketContent}
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Biļetes informācija", "Ticket Information")}</DialogTitle>
        </DialogHeader>
        {ticketContent}
      </DialogContent>
    </Dialog>
  );
}
