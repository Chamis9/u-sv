
import React, { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserDeleted: (userId: string) => void;
}

export function DeleteUserDialog({ user, open, onClose, onUserDeleted }: DeleteUserDialogProps) {
  const { currentLanguage } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  if (!user) return null;
  
  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    console.log("Attempting to delete user:", user.id);
    
    onUserDeleted(user.id);
    setIsDeleting(false);
    onClose();
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Dzēst lietotāju', 'Delete User')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              'Vai tiešām vēlaties dzēst šo lietotāju? Šī darbība nevar tikt atcelta.',
              'Are you sure you want to delete this user? This action cannot be undone.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t('Atcelt', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? 
              t('Dzēš...', 'Deleting...') : 
              t('Dzēst', 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
