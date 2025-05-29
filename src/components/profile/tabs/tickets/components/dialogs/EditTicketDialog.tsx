
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { AddTicketForm } from "../../AddTicketForm";
import { UserTicket, AddTicketData } from "@/hooks/tickets";
import { useTicketRefresh } from "../../hooks/useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
        <DialogHeader className="relative">
          <DialogTitle>
            {t("Rediģēt biļeti", "Edit ticket")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            onClick={handleClose}
          >
            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="sr-only">Close</span>
          </Button>
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
