
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTicketForm } from "../../AddTicketForm";
import { useLanguage } from "@/features/language";
import { UserTicket, AddTicketData } from "@/hooks/tickets";

interface EditTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  currentTicket: UserTicket | null;
  onUpdate: (ticketId: string, data: Partial<AddTicketData>) => Promise<{ success: boolean; error?: string }>;
}

export function EditTicketDialog({ 
  open, 
  onOpenChange, 
  onClose, 
  currentTicket,
  onUpdate
}: EditTicketDialogProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("Rediģēt biļeti", "Edit Ticket")}</DialogTitle>
        </DialogHeader>
        {currentTicket && (
          <AddTicketForm 
            onClose={onClose}
            isEditing={true}
            ticketToEdit={currentTicket}
            onUpdate={onUpdate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
