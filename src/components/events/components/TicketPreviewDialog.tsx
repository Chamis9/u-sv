
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  
  const t = (lv: string, en: string, lt: string, ee: string) => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return en;
      case 'lt': return lt;
      case 'et':
      case 'ee': return ee;
      default: return lv;
    }
  };

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (ticket?.seller_id) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('registered_users')
            .select('first_name, last_name')
            .eq('id', ticket.seller_id)
            .maybeSingle();
          
          if (userData && !userError) {
            setSellerName(`${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Nezināms');
          } else {
            console.log("Seller not found, using fallback");
            setSellerName('Nezināms');
          }
        } catch (error) {
          console.log("Error in fetchSellerInfo:", error);
          setSellerName('Nezināms');
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
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('Biļetes informācija', 'Ticket Information', 'Bilieto informacija', 'Pileti informatsioon')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            {t('Detalizēta informācija par biļeti', 'Detailed ticket information', 'Detali bilieto informacija', 'Üksikasjalik pileti informatsioon')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white break-words mb-4">
              {ticket.title}
            </h3>
            
            {ticket.description && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md mb-4">
                <p className="text-sm text-gray-900 dark:text-white break-words">
                  <strong className="text-gray-700 dark:text-gray-200">{t('Apraksts', 'Description', 'Aprašymas', 'Kirjeldus')}:</strong>{' '}
                  {ticket.description}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {ticket.event_date && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    <strong className="text-gray-700 dark:text-gray-300">{t('Datums', 'Date', 'Data', 'Kuupäev')}:</strong>{' '}
                    {formatDate(ticket.event_date, currentLanguage.code === 'lv' ? 'lv-LV' : 'en-US')}
                  </span>
                </div>
              )}
              
              {ticket.event_time && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    <strong className="text-gray-700 dark:text-gray-300">{t('Laiks', 'Time', 'Laikas', 'Aeg')}:</strong>{' '}
                    {ticket.event_time}
                  </span>
                </div>
              )}
              
              {ticket.venue && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white break-words">
                    <strong className="text-gray-700 dark:text-gray-300">{t('Vieta', 'Venue', 'Vieta', 'Koht')}:</strong>{' '}
                    {ticket.venue}
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Tag className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white break-words">
                  <strong className="text-gray-700 dark:text-gray-300">{t('Kategorija', 'Category', 'Kategorija', 'Kategooria')}:</strong>{' '}
                  {ticket.category}
                </span>
              </div>
              
              {sellerName && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    <strong className="text-gray-700 dark:text-gray-300">{t('Pārdevējs', 'Seller', 'Pardavėjas', 'Müüja')}:</strong>{' '}
                    {sellerName}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('Cena', 'Price', 'Kaina', 'Hind')}:</span>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(ticket.price)}</div>
                </div>
                <Ticket className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
              
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                {ticket.quantity} {ticket.quantity === 1 ? t("biļete", "ticket", "bilietas", "pilet") : t("biļetes", "tickets", "bilietai", "piletid")} × {formatPrice(ticket.price_per_unit || ticket.price)}
              </div>
            </div>
            
            {onPurchase && (
              <div className="flex justify-end mt-6">
                <Button 
                  variant="orange" 
                  onClick={handlePurchase}
                  className="flex items-center text-white bg-orange-500 hover:bg-orange-600"
                >
                  <Ticket className="h-4 w-4 mr-2" />
                  {t('Pirkt biļeti', 'Buy ticket', 'Pirkti bilietą', 'Osta pilet')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
