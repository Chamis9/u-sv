
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { AddTicketForm } from "../../AddTicketForm";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useTicketRefresh } from "../../hooks/useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";

interface EditTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  currentTicket: UserTicket | null;
  onUpdate: (id: string, data: Partial<AddTicketData>) => Promise<{ success: boolean; ticket?: UserTicket; error?: string }>;
}

export function EditTicketDialog({ 
  open, 
  onOpenChange, 
  onClose, 
  currentTicket,
  onUpdate 
}: EditTicketDialogProps) {
  const { currentLanguage } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { refreshTickets } = useTicketRefresh({ 
    userId: user?.id, 
    isAuthenticated 
  });
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;
  
  const handleClose = () => {
    // Refresh tickets list when dialog closes
    refreshTickets();
    onClose();
  };
  
  if (!currentTicket) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {t("Rediģēt biļeti", "Edit ticket")}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <AddTicketForm 
          onClose={handleClose}
          isEditing={true}
          ticketToEdit={currentTicket}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}
