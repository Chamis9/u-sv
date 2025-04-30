
import React from "react";
import { useLanguage } from "@/features/language";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteTicketDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteTicketDialog({ 
  open, 
  onCancel, 
  onConfirm, 
  isDeleting 
}: DeleteTicketDialogProps) {
  const { currentLanguage } = useLanguage();
  
  const t = (lvText: string, enText: string) => 
    currentLanguage.code === 'lv' ? lvText : enText;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("Vai tiešām vēlaties dzēst šo biļeti?", "Delete this ticket?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Šī darbība ir neatgriezeniska. Biļete tiks neatgriezeniski izdzēsta.", 
              "This action cannot be undone. This ticket will be permanently deleted."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("Atcelt", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 
              t("Dzēšana...", "Deleting...") : 
              t("Dzēst", "Delete")
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
