
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "../../AddTicketForm";
import { useLanguage } from "@/features/language";

interface AddTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function AddTicketDialog({ open, onOpenChange, onClose }: AddTicketDialogProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Pievienot biļeti", "Add Ticket")}</DialogTitle>
        </DialogHeader>
        <AddTicketForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
