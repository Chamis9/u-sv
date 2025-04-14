
import React, { useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useLanguage } from "@/features/language";
import { User } from "@/types/users";
import { updateUser } from "@/utils/user/userOperations";
import { useToast } from "@/hooks/use-toast";
import { extractPhoneComponents, formatPhoneNumber } from "@/utils/phoneUtils";
import { useEditUserForm } from "@/hooks/user/useEditUserForm";
import { EditUserForm } from "./EditUserForm";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ user, open, onClose, onUserUpdated }: EditUserDialogProps) {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    checkPhoneExists,
    t
  } = useEditUserForm(user, onUserUpdated, onClose);
  
  // Update form data when user changes or dialog opens/closes
  useEffect(() => {
    if (user && open) {
      const { countryCode: extractedCode, phoneNumber: extractedNumber } = 
        extractPhoneComponents(user.phone || null);
      
      setFormData({
        name: user.name || null,
        countryCode: extractedCode,
        phoneNumber: extractedNumber
      });
      setErrors({});
    }
  }, [user, open, setFormData, setErrors]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Reset errors
    setErrors({});
    
    const isValid = await validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Format phone number if provided
      let formattedPhone = null;
      if (formData.phoneNumber.trim()) {
        formattedPhone = formatPhoneNumber(formData.countryCode, formData.phoneNumber);
        
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
        name: formData.name,
        phone: formattedPhone,
        updated_at: new Date().toISOString()
      };
      
      const { success, error } = await updateUser(updatedUser);
      
      if (success) {
        onUserUpdated(updatedUser);
        toast({
          description: t('Lietotājs veiksmīgi atjaunināts', 'User successfully updated')
        });
        onClose();
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
    }
  };
  
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
        
        <EditUserForm
          user={user}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={onClose}
          onInputChange={handleInputChange}
          t={t}
        />
      </DialogContent>
    </Dialog>
  );
}
