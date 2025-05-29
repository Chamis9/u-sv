
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { UserTicket } from "@/hooks/tickets";

interface PurchaseDialogProps {
  ticket: UserTicket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseConfirm: (ticket: UserTicket) => void;
}

export const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  ticket,
  isOpen,
  onOpenChange,
  onPurchaseConfirm
}) => {
  const { currentLanguage } = useLanguage();
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

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Biļetes pirkšana", "Purchase Ticket", "Bilieto pirkimas", "Pileti ostmine")}</DialogTitle>
          <DialogDescription>
            {t("Vai vēlaties iegādāties šo biļeti?", "Do you want to purchase this ticket?", "Ar norite įsigyti šį bilietą?", "Kas soovite seda piletit osta?")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium">{ticket.title}</h3>
          {ticket.description && (
            <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
          )}
          <p className="text-xl font-bold mt-2">{ticket.price} €</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t("Atcelt", "Cancel", "Atšaukti", "Tühista")}
          </Button>
          <Button 
            variant="orange" 
            onClick={() => ticket && onPurchaseConfirm(ticket)}
          >
            {t("Apstiprināt pirkumu", "Confirm Purchase", "Patvirtinti pirkimą", "Kinnita ost")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
