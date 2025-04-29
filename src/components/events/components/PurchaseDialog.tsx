
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
  const t = (lv: string, en: string) => currentLanguage.code === 'lv' ? lv : en;

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Biļetes pirkšana", "Purchase Ticket")}</DialogTitle>
          <DialogDescription>
            {t("Vai vēlaties iegādāties šo biļeti?", "Do you want to purchase this ticket?")}
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
            {t("Atcelt", "Cancel")}
          </Button>
          <Button 
            variant="orange" 
            onClick={() => ticket && onPurchaseConfirm(ticket)}
          >
            {t("Apstiprināt pirkumu", "Confirm Purchase")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
