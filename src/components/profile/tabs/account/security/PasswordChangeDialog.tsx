
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordChangeForm } from "./PasswordChangeForm";

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  t: (lvText: string, enText: string) => string;
}

export function PasswordChangeDialog({ isOpen, onClose, t }: PasswordChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {t("Mainīt paroli", "Change Password")}
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            {t(
              "Ievadiet savu pašreizējo paroli un jauno paroli zemāk.",
              "Enter your current password and your new password below."
            )}
          </DialogDescription>
        </DialogHeader>
        
        <PasswordChangeForm 
          onSuccess={onClose}
          t={t}
        />
      </DialogContent>
    </Dialog>
  );
}
