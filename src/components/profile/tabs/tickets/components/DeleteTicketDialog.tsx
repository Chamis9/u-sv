
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
import { Loader2 } from "lucide-react";

interface DeleteTicketDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<boolean>;
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
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onCancel();
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("Vai tiešām vēlaties dzēst šo biļeti?", "Are you sure you want to delete this ticket?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              "Šī darbība ir neatgriezeniska. Biļete tiks dzēsta pilnībā.",
              "This action cannot be undone. The ticket will be permanently deleted."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("Atcelt", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Dzēš...", "Deleting...")}
              </>
            ) : (
              t("Jā, dzēst", "Yes, delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
