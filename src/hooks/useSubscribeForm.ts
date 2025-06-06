import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const useSubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const location = useLocation();

  // Get language from URL path
  const getLanguageFromUrl = (): string => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const langCode = pathSegments[0];
    
    // Check if the first segment is a valid language code
    if (['lv', 'en', 'ee', 'lt'].includes(langCode)) {
      return langCode;
    }
    
    // Fallback to current language context
    return currentLanguage.code;
  };

  const validateEmail = (emailToValidate: string): boolean => {
    if (!emailToValidate || !EMAIL_REGEX.test(emailToValidate)) {
      setFormError(getTranslations(currentLanguage.code).invalidEmail);
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    try {
      const now = Date.now();
      const lastSubmit = sessionStorage.getItem('lastEmailSubmit');
      
      if (lastSubmit && now - parseInt(lastSubmit) < 1000 * 30) { // Reduced from 60s to 30s
        setFormError(getTranslations(currentLanguage.code).rateLimit);
        return;
      }
      
      sessionStorage.setItem('lastEmailSubmit', now.toString());
    } catch (error) {
      console.error("Error with session storage:", error);
    }
    
    if (!validateEmail(email)) return;
    
    setIsLoading(true);
    
    try {
      const language = getLanguageFromUrl();
      
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          email: email.toLowerCase().trim(),
          language: language
        }]);
      
      if (error) {
        if (error.code === '23505') { // Unique violation error code
          setFormError(getTranslations(currentLanguage.code).emailExists);
          return;
        }
        throw error;
      }
      
      saveEmailToLocalStorage(email);
      setEmail("");

      const texts = getTranslations(currentLanguage.code);
      toast({
        title: texts.successTitle,
        description: texts.successMessage,
      });
    } catch (error) {
      console.error("Failed to subscribe:", error);
      const texts = getTranslations(currentLanguage.code);
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
    setEmail,
    isLoading,
    formError,
    setFormError,
    handleSubmit
  };
};

const saveEmailToLocalStorage = (emailToSave: string) => {
  if (!emailToSave || emailToSave.trim() === '') return;
  
  try {
    if (!EMAIL_REGEX.test(emailToSave)) return;
    
    const existingEmails = localStorage.getItem('globalPreviousEmails');
    const emailList = existingEmails ? JSON.parse(existingEmails) : [];
    
    const updatedEmails = [...new Set([emailToSave, ...emailList])].slice(0, 10);
    
    localStorage.setItem('globalPreviousEmails', JSON.stringify(updatedEmails));
  } catch (error) {
    console.error("Error saving email to localStorage:", error);
  }
};

const getTranslations = (langCode: string) => {
  const translations = {
    lv: {
      placeholder: "E-pasta adrese",
      button: "Pieteikties",
      sending: "Sūta...",
      successTitle: "Paldies par pieteikšanos!",
      successMessage: "Mēs jūs informēsim par visiem jaunumiem.",
      errorTitle: "Kļūda!",
      errorMessage: "Neizdevās saglabāt e-pasta adresi. Lūdzu, mēģiniet vēlreiz.",
      previousEmails: "Iepriekš izmantotie e-pasti",
      selectEmail: "Izvēlies e-pastu...",
      invalidEmail: "Lūdzu, ievadiet derīgu e-pasta adresi",
      rateLimit: "Lūdzu, uzgaidiet 30 sekundes pirms nākamā mēģinājuma.",
      emailExists: "Šis e-pasts jau ir reģistrēts mūsu jaunumu saņemšanai."
    },
    en: {
      placeholder: "Email address",
      button: "Subscribe",
      sending: "Sending...",
      successTitle: "Thank you for subscribing!",
      successMessage: "We will keep you updated with all the news.",
      errorTitle: "Error!",
      errorMessage: "Failed to save email address. Please try again.",
      previousEmails: "Previously used emails",
      selectEmail: "Select email...",
      invalidEmail: "Please enter a valid email address",
      rateLimit: "Please wait 30 seconds before trying again.",
      emailExists: "This email is already subscribed to our newsletter."
    },
    ee: {
      placeholder: "E-posti aadress",
      button: "Telli",
      sending: "Saatmine...",
      successTitle: "Täname tellimise eest!",
      successMessage: "Hoiame teid kõigi uudistega kursis.",
      errorTitle: "Viga!",
      errorMessage: "E-posti aadressi salvestamine ebaõnnestus. Palun proovi uuesti.",
      previousEmails: "Varem kasutatud e-postiaadressid",
      selectEmail: "Vali e-post...",
      invalidEmail: "Palun sisestage kehtiv e-posti aadress",
      rateLimit: "Palun oodake 30 sekundit enne järgmist katset.",
      emailExists: "See e-posti aadress on juba meie uudiskirja tellinud."
    },
    lt: {
      placeholder: "El. pašto adresas",
      button: "Prenumeruoti",
      sending: "Siunčiama...",
      successTitle: "Ačiū, kad užsiprenumeravote!",
      successMessage: "Mes jus informuosime apie visas naujienas.",
      errorTitle: "Klaida!",
      errorMessage: "Nepavyko išsaugoti el. pašto adreso. Bandykite dar kartą.",
      previousEmails: "Anksčiau naudoti el. paštai",
      selectEmail: "Pasirinkite el. paštą...",
      invalidEmail: "Įveskite galiojantį el. pašto adresą",
      rateLimit: "Palaukite 30 sekundžių prieš bandant dar kartą.",
      emailExists: "Šis el. paštas jau yra užsiprenumeravęs mūsų naujienlaiškį."
    }
  };

  return translations[langCode as keyof typeof translations] || translations.en;
};
