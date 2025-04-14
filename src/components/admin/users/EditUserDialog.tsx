
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { EditUserFormContainer } from "./EditUserFormContainer";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ 
  user, 
  open, 
  onClose, 
  onUserUpdated 
}: EditUserDialogProps) {
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Rediģēt lietotāju', 'Edit User')}</DialogTitle>
          <DialogDescription>
            {t('Mainiet lietotāja informāciju', 'Make changes to user information')}
          </DialogDescription>
        </DialogHeader>
        
        <EditUserFormContainer
          user={user}
          onUserUpdated={onUserUpdated}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
