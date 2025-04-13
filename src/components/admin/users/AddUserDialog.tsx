
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/utils/user/userOperations";
import { User } from "@/types/users";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ open, onClose, onUserAdded }: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('E-pasta adrese ir obligāta', 'Email address is required')
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, data, error } = await createUser({
        name,
        email,
        phone,
        status: 'active'
      });
      
      if (success && data) {
        onUserAdded(data);
        toast({
          description: t('Lietotājs veiksmīgi pievienots', 'User successfully added')
        });
        onClose();
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
      } else {
        console.error("Error creating user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās pievienot lietotāju', 'Failed to add user')
        });
      }
    } catch (err) {
      console.error("Unexpected error creating user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās pievienot lietotāju', 'Failed to add user')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Pievienot jaunu lietotāju', 'Add New User')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('Vārds', 'Name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Ievadiet lietotāja vārdu', 'Enter user name')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">{t('E-pasts', 'Email')} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('Ievadiet e-pasta adresi', 'Enter email address')}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">{t('Telefons', 'Phone')}</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('Ievadiet telefona numuru', 'Enter phone number')}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('Atcelt', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('Pievieno...', 'Adding...') : t('Pievienot', 'Add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
