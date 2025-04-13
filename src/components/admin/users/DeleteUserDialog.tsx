
import React, { useState, useCallback } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserDeleted: (userId: string) => void;
}

export function DeleteUserDialog({ user, open, onClose, onUserDeleted }: DeleteUserDialogProps) {
  const { currentLanguage } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Return early if user is null
  if (!user) return null;
  
  // Use useCallback to memoize the delete function
  const handleDelete = useCallback(async () => {
    if (!user) return;
    
    setIsDeleting(true);
    console.log("Attempting to delete user:", user.id);
    
    try {
      const { error } = await supabase
        .from('registered_users')
        .delete()
        .eq('id', user.id);
        
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: t('Neizdevās dzēst lietotāju', 'Failed to delete user')
        });
      } else {
        onUserDeleted(user.id);
        toast({
          description: t('Lietotājs veiksmīgi dzēsts', 'User successfully deleted')
        });
      }
    } catch (err) {
      console.error("Unexpected error in deleteUser:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās dzēst lietotāju', 'Failed to delete user')
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  }, [user, onUserDeleted, onClose, toast, t]);
  
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
