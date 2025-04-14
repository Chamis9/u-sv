
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/utils/user/userOperations";
import { User } from "@/types/users";
import { PhoneInputWithCountry } from "./PhoneInputWithCountry";
import { supabase } from "@/integrations/supabase/client";
import { formatPhoneNumber } from "@/utils/phoneUtils";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ open, onClose, onUserAdded }: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+371");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{email?: string; phone?: string}>({});
  
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setErrors({});
    } else {
      setName("");
      setEmail("");
      setCountryCode("+371");
      setPhoneNumber("");
      setErrors({});
    }
  }, [open]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check if email already exists
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('registered_users')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };

  // Check if phone already exists
  const checkPhoneExists = async (fullPhone: string): Promise<boolean> => {
    if (!fullPhone) return false;
    
    try {
      const { data, error } = await supabase
        .from('registered_users')
        .select('phone')
        .eq('phone', fullPhone)
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
    
    // Reset errors
    setErrors({});
    
    // Validate form
    let isValid = true;
    const newErrors: {email?: string; phone?: string} = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = t('E-pasta adrese ir obligāta', 'Email address is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = t('Ievadiet derīgu e-pasta adresi', 'Enter a valid email address');
      isValid = false;
    }
    
    // Update errors state and stop if not valid
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setErrors({...newErrors, email: t('Šis e-pasts jau ir reģistrēts', 'This email is already registered')});
        setIsSubmitting(false);
        return;
      }
      
      // Format and check phone if provided
      let formattedPhone = "";
      if (phoneNumber.trim()) {
        formattedPhone = formatPhoneNumber(countryCode, phoneNumber);
        
        // Check if phone already exists
        const phoneExists = await checkPhoneExists(formattedPhone);
        if (phoneExists) {
          setErrors({...newErrors, phone: t('Šis telefons jau ir reģistrēts', 'This phone is already registered')});
          setIsSubmitting(false);
          return;
        }
      }
      
      // Create user
      const { success, data, error } = await createUser({
        name,
        email,
        phone: formattedPhone || null,
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
        setCountryCode("+371");
        setPhoneNumber("");
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
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          <PhoneInputWithCountry
            label={t('Telefons', 'Phone')}
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodeChange={setCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            error={errors.phone}
            placeholder={t('Ievadiet telefona numuru', 'Enter phone number')}
          />
          
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
