
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { AddTicketForm } from "../../AddTicketForm";
import { useTicketRefresh } from "../../hooks/useTicketRefresh";
import { useAuth } from "@/contexts/AuthContext";

interface AddTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function AddTicketDialog({ open, onOpenChange, onClose }: AddTicketDialogProps) {
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-xl">
            {t("Pievienot biļeti", "Add ticket")}
          </DialogTitle>
        </DialogHeader>
        <AddTicketForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
