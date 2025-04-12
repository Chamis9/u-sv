
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/features/language";
import { addSubscriber } from "@/utils/subscriberUtils";
import { validateEmail, saveEmailToLocalStorage } from "@/utils/emailUtils";
import { useRateLimiting } from "@/hooks/useRateLimiting";
import { useEmailDropdown } from "@/hooks/useEmailDropdown";
import { subscribeFormTranslations, SubscribeFormTexts } from "@/features/language/translations/features/subscribeForm";

export function useSubscribeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  
  // Use our custom hooks
  const {
    email,
    setEmail,
    previousEmails,
    setPreviousEmails,
    showDropdown,
    setShowDropdown,
    handleEmailChange,
    handleEmailSelect
  } = useEmailDropdown();
  
  const { formError, setFormError, checkRateLimit } = useRateLimiting();
  
  // Get translations for the current language
  const texts = subscribeFormTranslations[currentLanguage.code as keyof typeof subscribeFormTranslations] as SubscribeFormTexts;
  
  // Email validation function that also sets form error
  const validateEmailWithFeedback = (emailToValidate: string): boolean => {
    if (!validateEmail(emailToValidate)) {
      setFormError(texts.invalidEmail);
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Rate limiting check
    if (!checkRateLimit(texts.rateLimit)) return;
    
    // Validate email format
    if (!validateEmailWithFeedback(email)) return;
    
    setIsLoading(true);
    
    try {
      // Use the subscriberUtils method
      const { success, error } = await addSubscriber(email.toLowerCase().trim());
      
      if (!success) {
        console.error("Subscription failed with error:", error);
        throw new Error(error || 'Failed to subscribe');
      }
      
      // Save email to localStorage and update state
      const updatedEmails = saveEmailToLocalStorage(email);
      if (updatedEmails.length > 0) {
        setPreviousEmails(updatedEmails);
      }
      
      setEmail("");
      toast({
        title: texts.successTitle,
        description: texts.successMessage,
      });
    } catch (error: any) {
      console.error("Failed to subscribe:", error);
      // Set the form error so it shows directly on the form
      setFormError(texts.errorMessage);
      
      toast({
        title: texts.errorTitle,
        description: texts.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    isLoading,
    previousEmails,
    showDropdown,
    formError,
    texts,
    handleSubmit,
    handleEmailChange,
    handleEmailSelect,
    setShowDropdown
  };
}
