
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "@/utils/user/userOperations";
import { User } from "@/types/users";
import { formatPhoneNumber } from "@/utils/phoneUtils";
import { AddUserForm } from "./AddUserForm";
import { useAddUserForm } from "@/hooks/user/useAddUserForm";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: (user: User) => void;
}

export function AddUserDialog({ open, onClose, onUserAdded }: AddUserDialogProps) {
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    resetForm,
    validateForm,
    checkEmailExists,
    checkPhoneExists,
    t
  } = useAddUserForm();
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      setErrors({});
    } else {
      resetForm();
    }
  }, [open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrors(prev => ({
          ...prev,
          email: t('Šis e-pasts jau ir reģistrēts', 'This email is already registered')
        }));
        setIsSubmitting(false);
        return;
      }
      
      // Format and check phone if provided
      let formattedPhone = null;
      if (formData.phoneNumber.trim()) {
        formattedPhone = formatPhoneNumber(formData.countryCode, formData.phoneNumber);
        
        // Check if phone already exists
        const phoneExists = await checkPhoneExists(formattedPhone);
        if (phoneExists) {
          setErrors(prev => ({
            ...prev,
            phone: t('Šis telefons jau ir reģistrēts', 'This phone is already registered')
          }));
          setIsSubmitting(false);
          return;
        }
      }
      
      const { success, data, error } = await createUser({
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        status: 'active'
      });
      
      if (success && data) {
        onUserAdded(data);
        toast({
          description: t('Lietotājs veiksmīgi pievienots', 'User successfully added')
        });
        onClose();
        resetForm();
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
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('Pievienot jaunu lietotāju', 'Add New User')}</DialogTitle>
        </DialogHeader>
        
        <AddUserForm
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
