
import { useState } from "react";
import { validateEmail, validatePhoneNumber } from "@/utils/phoneUtils";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/features/language";
import { formatPhoneNumber } from "@/utils/phoneUtils";
import type { User } from "@/types/users";

interface EditUserFormState {
  name: string | null;
  countryCode: string;
  phoneNumber: string;
}

interface EditUserFormErrors {
  phone?: string;
}

export const useEditUserForm = (user: User | null, onUserUpdated: (user: User) => void, onClose: () => void) => {
  const [formData, setFormData] = useState<EditUserFormState>({
    name: user?.name || null,
    countryCode: "+371",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<EditUserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentLanguage } = useLanguage();
  const t = (lvText: string, enText: string) => currentLanguage.code === 'lv' ? lvText : enText;
  
  const checkPhoneExists = async (fullPhone: string, userId: string): Promise<boolean> => {
    if (!fullPhone) return false;
    
    try {
      const { data, error } = await supabase
        .from('registered_users')
        .select('phone')
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
  
  const validateForm = async () => {
    const newErrors: EditUserFormErrors = {};
    let isValid = true;
    
    // Phone validation if provided
    if (formData.phoneNumber.trim()) {
      const cleanPhone = formData.phoneNumber.replace(/\s/g, '');
      if (!validatePhoneNumber(cleanPhone, formData.countryCode)) {
        newErrors.phone = t('Ievadiet derīgu telefona numuru', 'Enter a valid phone number');
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    checkPhoneExists,
    t
  };
};
