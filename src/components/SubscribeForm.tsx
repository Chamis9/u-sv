import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/features/language";
import { supabase } from "@/integrations/supabase/client";

// Global storage key for all previously used emails across the app
const GLOBAL_EMAILS_STORAGE_KEY = 'globalPreviousEmails';

// Regular expression for email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();
  const { translations, currentLanguage } = useLanguage();

  // Added translations for the subscription form based on language
  const subscribeTexts = {
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
      rateLimit: "Pārāk daudz mēģinājumu. Lūdzu, mēģiniet vēlāk."
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
      rateLimit: "Too many attempts. Please try again later."
    },
    ru: {
      placeholder: "Электронная почта",
      button: "Подписаться",
      sending: "Отправка...",
      successTitle: "Спасибо за подписку!",
      successMessage: "Мы будем держать вас в курсе всех новостей.",
      errorTitle: "Ошибка!",
      errorMessage: "Не удалось сохранить адрес электронной почты. Пожалуйста, попробуйте еще раз.",
      previousEmails: "Ранее использованные адреса",
      selectEmail: "Выберите адрес...",
      invalidEmail: "Пожалуйста, введите действительный адрес электронной почты",
      rateLimit: "Слишком много попыток. Пожалуйста, попробуйте позже."
    }
  };

  const texts = subscribeTexts[currentLanguage.code];

  // Load previously used emails from localStorage on component mount
  useEffect(() => {
    try {
      const savedEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
      if (savedEmails) {
        setPreviousEmails(JSON.parse(savedEmails));
      }
    } catch (error) {
      console.error("Error loading saved emails:", error);
      // If there's an error with localStorage, just continue without the saved emails
    }
  }, []);

  // Save email to localStorage and update previousEmails state
  const saveEmailToLocalStorage = (emailToSave: string) => {
    if (!emailToSave || emailToSave.trim() === '') return;
    
    try {
      // Sanitize the email - only use validated emails that match the regex
      if (!EMAIL_REGEX.test(emailToSave)) return;
      
      // Get any existing emails from global storage
      const existingEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
      const emailList = existingEmails ? JSON.parse(existingEmails) : [];
      
      // Create a new array with the new email at the beginning and remove duplicates
      const updatedEmails = [...new Set([emailToSave, ...emailList])].slice(0, 10); // Keep only last 10 unique emails
      
      // Save to global storage
      localStorage.setItem(GLOBAL_EMAILS_STORAGE_KEY, JSON.stringify(updatedEmails));
      
      // Update state
      setPreviousEmails(updatedEmails);
    } catch (error) {
      console.error("Error saving email to localStorage:", error);
      // Continue without saving to localStorage - not critical
    }
  };

  const validateEmail = (emailToValidate: string): boolean => {
    if (!emailToValidate || !EMAIL_REGEX.test(emailToValidate)) {
      setFormError(texts.invalidEmail);
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Rate limiting check - use session storage for this
    try {
      const now = Date.now();
      const lastSubmit = sessionStorage.getItem('lastEmailSubmit');
      
      if (lastSubmit && now - parseInt(lastSubmit) < 1000 * 60) { // 1 minute limit
        setFormError(texts.rateLimit);
        return;
      }
      
      // Update last submit time
      sessionStorage.setItem('lastEmailSubmit', now.toString());
    } catch (error) {
      // If sessionStorage fails, continue anyway
      console.error("Error with session storage:", error);
    }
    
    // Validate email format
    if (!validateEmail(email)) return;
    
    setIsLoading(true);
    
    try {
      // Use the subscriberUtils method instead of direct Supabase call
      const { success, error } = await addSubscriber(email.toLowerCase().trim());
      
      if (!success) {
        throw new Error(error || 'Failed to subscribe');
      }
      
      // Save email to localStorage for future autocomplete
      saveEmailToLocalStorage(email);
      
      setEmail("");
      toast({
        title: texts.successTitle,
        description: texts.successMessage,
      });
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast({
        title: texts.errorTitle,
        description: texts.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowDropdown(e.target.value.length > 0);
    // Clear error when user starts typing again
    if (formError) setFormError("");
  };

  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowDropdown(false);
    // Validate selected email
    validateEmail(selectedEmail);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-transparent p-0"
    >
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder={texts.placeholder}
          value={email}
          onChange={handleEmailChange}
          onFocus={() => previousEmails.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          required
          aria-invalid={formError ? "true" : "false"}
          className="flex-grow h-12 text-base font-playfair placeholder-orange-500/70 bg-white border-orange-300/50" 
        />
        
        {formError && (
          <div className="text-red-500 text-sm mt-1">{formError}</div>
        )}
        
        {showDropdown && previousEmails.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-orange-200/50">
            <div className="py-1 text-sm text-orange-700 font-playfair">
              {previousEmails.map((prevEmail, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-orange-100/50 cursor-pointer"
                  onClick={() => handleEmailSelect(prevEmail)}
                  role="option"
                  aria-selected={prevEmail === email}
                >
                  {prevEmail}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg px-6 font-semibold font-playfair" 
        aria-busy={isLoading}
      >
        {isLoading ? texts.sending : texts.button}
      </Button>
    </form>
  );
}
