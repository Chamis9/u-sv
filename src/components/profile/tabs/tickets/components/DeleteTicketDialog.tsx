
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
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {t("Vai tiešām vēlaties dzēst šo biļeti?", "Delete this ticket?")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {t(
              "Šī darbība ir neatgriezeniska. Biļete tiks neatgriezeniski izdzēsta.", 
              "This action cannot be undone. This ticket will be permanently deleted."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="min-w-24"
          >
            {t("Atcelt", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-w-24 bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
