
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ticket } from "@/types/tickets";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/users";

interface TicketPreviewDialogProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketPreviewDialog({ ticket, isOpen, onClose }: TicketPreviewDialogProps) {
  const { currentLanguage } = useLanguage();
  const [sellerName, setSellerName] = useState<string>("");
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (ticket?.seller_id) {
        try {
          // Use RPC function instead of direct query to work around type issues
          // Or you can handle fetching user data another way
          const { data, error } = await supabase
            .rpc('get_user_by_id', { user_id: ticket.seller_id });
            
          if (error) {
            console.error("Error fetching seller details:", error);
            return;
          }
          
          if (data) {
            setSellerName(`${data.first_name || ''} ${data.last_name || ''}`);
          }
        } catch (error) {
          console.error("Error in seller details fetch:", error);
        }
      }
    };
    
    if (isOpen && ticket) {
      fetchSellerDetails();
    }
  }, [isOpen, ticket]);

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {ticket.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Event details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">{t('Notikuma detaļas', 'Event Details')}</h3>
              <div className="mt-2 space-y-2">
                {ticket.category_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Kategorija', 'Category')}:</span>
                    <span>{ticket.category_name}</span>
                  </div>
                )}
                {ticket.event_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Datums', 'Date')}:</span>
                    <span>{new Date(ticket.event_date).toLocaleDateString()}</span>
                  </div>
                )}
                {ticket.event_time && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Laiks', 'Time')}:</span>
                    <span>{ticket.event_time}</span>
                  </div>
                )}
                {ticket.venue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Vieta', 'Venue')}:</span>
                    <span>{ticket.venue}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">{t('Biļetes informācija', 'Ticket Information')}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('Statuss', 'Status')}:</span>
                  <Badge variant={ticket.status === 'available' ? 'default' : 'secondary'}>
                    {ticket.status === 'available' ? t('Pieejama', 'Available') : t('Pārdota', 'Sold')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('Cena', 'Price')}:</span>
                  <span>{formatCurrency(ticket.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('Daudzums', 'Quantity')}:</span>
                  <span>{ticket.quantity}</span>
                </div>
                {sellerName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('Pārdevējs', 'Seller')}:</span>
                    <span>{sellerName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Description */}
          {ticket.description && (
            <div>
              <h3 className="text-lg font-medium">{t('Apraksts', 'Description')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ticket.description}</p>
            </div>
          )}
          
          {/* Seat information */}
          {ticket.seat_info && Object.keys(ticket.seat_info).length > 0 && (
            <div>
              <h3 className="text-lg font-medium">{t('Sēdvietas informācija', 'Seat Information')}</h3>
              <div className="mt-2 space-y-1">
                {Object.entries(ticket.seat_info).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
