
import React, { useState, useEffect } from "react";
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
import { updateUser } from "@/utils/user/userOperations";
import { useToast } from "@/hooks/use-toast";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";
import { extractPhoneComponents, formatPhoneNumber } from "@/utils/phoneUtils";
import { supabase } from "@/integrations/supabase/client";

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
  const [countryCode, setCountryCode] = useState("+371");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{phone?: string}>({});
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  // Update state when user changes or dialog opens/closes
  useEffect(() => {
    if (user && open) {
      setName(user.name || null);
      
      const { countryCode: extractedCode, phoneNumber: extractedNumber } = 
        extractPhoneComponents(user.phone || null);
      
      setCountryCode(extractedCode);
      setPhoneNumber(extractedNumber);
      setErrors({});
    }
  }, [user, open]);
  
  // Check if phone already exists (except for the current user)
  const checkPhoneExists = async (fullPhone: string, userId: string): Promise<boolean> => {
    if (!fullPhone) return false;
    
    try {
      const { data, error } = await supabase
        .from('registered_users')
        .select('phone, id')
        .eq('phone', fullPhone)
        .neq('id', userId)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (err) {
      console.error("Error checking phone:", err);
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Reset errors
    setErrors({});
    
    setIsSubmitting(true);
    
    try {
      // Format phone number if provided
      let formattedPhone = null;
      if (phoneNumber.trim()) {
        formattedPhone = formatPhoneNumber(countryCode, phoneNumber);
        
        // Check if phone already exists (for another user)
        if (formattedPhone !== user.phone) {
          const phoneExists = await checkPhoneExists(formattedPhone, user.id);
          if (phoneExists) {
            setErrors({phone: t('Šis telefons jau ir reģistrēts', 'This phone is already registered')});
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      const updatedUser = {
        ...user,
        name,
        phone: formattedPhone,
        updated_at: new Date().toISOString()
      };
      
      const { success, error } = await updateUser(updatedUser);
      
      if (success) {
        onUserUpdated(updatedUser);
        toast({
          description: t('Lietotājs veiksmīgi atjaunināts', 'User successfully updated')
        });
      } else {
        console.error("Error updating user:", error);
        toast({
          variant: "destructive",
          title: t('Kļūda', 'Error'),
          description: error || t('Neizdevās atjaunināt lietotāju', 'Failed to update user')
        });
      }
    } catch (err) {
      console.error("Unexpected error updating user:", err);
      toast({
        variant: "destructive",
        title: t('Kļūda', 'Error'),
        description: t('Neizdevās atjaunināt lietotāju', 'Failed to update user')
      });
    } finally {
      setIsSubmitting(false);
      onClose();
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
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="phone" className="text-right mt-2">
                {t('Tālrunis', 'Phone')}
              </Label>
              <div className="col-span-3">
                <PhoneInputWithCountry
                  label=""
                  countryCode={countryCode}
                  phoneNumber={phoneNumber}
                  onCountryCodeChange={setCountryCode}
                  onPhoneNumberChange={setPhoneNumber}
                  error={errors.phone}
                />
              </div>
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
