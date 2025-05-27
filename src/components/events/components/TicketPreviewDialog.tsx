
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserTicket } from "@/hooks/tickets";
import { useLanguage } from "@/features/language";
import { Calendar, MapPin, Clock, Tag, Ticket, User } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface TicketPreviewDialogProps {
  ticket: UserTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (ticket: UserTicket) => void;
}

export const TicketPreviewDialog: React.FC<TicketPreviewDialogProps> = ({
  ticket,
  isOpen,
  onClose,
  onPurchase
}) => {
  const { currentLanguage } = useLanguage();
  const [sellerName, setSellerName] = useState<string | null>(null);
  
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (ticket?.seller_id) {
        try {
          const { data, error } = await supabase
            .from('registered_users')
            .select('first_name, last_name')
            .eq('id', ticket.seller_id)
            .single();
          
          if (error) {
            console.error("Error fetching seller info:", error);
            return;
          }
          
          if (data) {
            setSellerName(`${data.first_name} ${data.last_name}`);
          }
        } catch (error) {
          console.error("Error in fetchSellerInfo:", error);
        }
      }
    };

    if (isOpen && ticket) {
      fetchSellerInfo();
    } else {
      setSellerName(null);
    }
  }, [ticket, isOpen]);

  if (!ticket) return null;

  const handlePurchase = () => {
    if (onPurchase && ticket) {
      onPurchase(ticket);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('Biļetes informācija', 'Ticket Information')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {ticket.title}
            </h3>
            
            {ticket.description && (
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                {ticket.description}
              </p>
            )}
            
            <div className="grid gap-3">
              {ticket.event_date && (
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span>
                    {formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                  </span>
                </div>
              )}
              
              {ticket.event_time && (
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span>{ticket.event_time}</span>
                </div>
              )}
              
              {ticket.venue && (
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="break-words">{ticket.venue}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <span className="break-words">{ticket.category}</span>
              </div>
              
              {sellerName && (
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span>{t('Pārdevējs', 'Seller')}: {sellerName}</span>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('Cena', 'Price')}:</span>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(ticket.price)}</div>
                </div>
                <Ticket className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket") : t("biļetes", "tickets")} × {formatPrice(ticket.price_per_unit || ticket.price)}
              </div>
            </div>
            
            {onPurchase && (
              <div className="flex justify-end mt-4">
                <Button 
                  variant="orange" 
                  onClick={handlePurchase}
                  className="flex items-center text-white"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {t('Pirkt biļeti', 'Buy ticket')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
