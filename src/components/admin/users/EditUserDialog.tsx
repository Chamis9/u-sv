
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { updateUser } from "@/utils/userUtils";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ user, open, onClose, onUserUpdated }: EditUserDialogProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [name, setName] = useState<string | null>(user?.name || null);
  const [phone, setPhone] = useState<string | null>(user?.phone || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Update state when user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || null);
      setPhone(user.phone || null);
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    console.log("Attempting to update user:", user.id, "with name:", name, "and phone:", phone);
    
    const updatedUser = {
      ...user,
      name,
      phone
    };
    
    const { success, error } = await updateUser(updatedUser);
    
    setIsSubmitting(false);
    
    if (success) {
      console.log("User successfully updated in Supabase");
      toast({
        description: t('Lietotājs veiksmīgi atjaunināts', 'User successfully updated')
      });
      onUserUpdated(updatedUser);
      onClose();
    } else {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: error || t('Neizdevās atjaunināt lietotāju', 'Failed to update user')
      });
    }
  };
  
  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('Rediģēt lietotāju', 'Edit User')}</DialogTitle>
            <DialogDescription>
              {t('Mainiet lietotāja informāciju', 'Make changes to user information')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('E-pasts', 'Email')}
              </Label>
              <Input
                id="email"
                value={user.email || ''}
                className="col-span-3"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('Vārds', 'Name')}
              </Label>
              <Input
                id="name"
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder={t('Ievadiet vārdu', 'Enter name')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                {t('Tālrunis', 'Phone')}
              </Label>
              <Input
                id="phone"
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
                placeholder={t('Ievadiet tālruni', 'Enter phone')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              {t('Atcelt', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 
                t('Saglabā...', 'Saving...') : 
                t('Saglabāt izmaiņas', 'Save changes')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
