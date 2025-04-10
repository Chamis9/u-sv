import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Global storage key for all previously used emails across the app
const GLOBAL_EMAILS_STORAGE_KEY = 'globalPreviousEmails';

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previousEmails, setPreviousEmails] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
      selectEmail: "Izvēlies e-pastu..."
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
      selectEmail: "Select email..."
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
      selectEmail: "Выберите адрес..."
    }
  };

  const texts = subscribeTexts[currentLanguage.code];

  // Load previously used emails from localStorage on component mount
  useEffect(() => {
    const savedEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
    if (savedEmails) {
      setPreviousEmails(JSON.parse(savedEmails));
    }
  }, []);

  // Save email to localStorage and update previousEmails state
  const saveEmailToLocalStorage = (emailToSave: string) => {
    if (!emailToSave || emailToSave.trim() === '') return;
    
    // Get any existing emails from global storage
    const existingEmails = localStorage.getItem(GLOBAL_EMAILS_STORAGE_KEY);
    const emailList = existingEmails ? JSON.parse(existingEmails) : [];
    
    // Create a new array with the new email at the beginning and remove duplicates
    const updatedEmails = [...new Set([emailToSave, ...emailList])].slice(0, 10); // Keep only last 10 unique emails
    
    // Save to global storage
    localStorage.setItem(GLOBAL_EMAILS_STORAGE_KEY, JSON.stringify(updatedEmails));
    
    // Update state
    setPreviousEmails(updatedEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save email to Supabase
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
      
      if (error) {
        console.error("Error saving email:", error);
        throw error;
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
  };

  const handleEmailSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowDropdown(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-soft-orange/20 p-6 rounded-xl shadow-sm border border-orange-200/50"
    >
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder={texts.placeholder}
          value={email}
          onChange={handleEmailChange}
          onFocus={() => previousEmails.length > 0 && setShowDropdown(true)}
          required
          className="flex-grow h-12 text-base font-playfair placeholder-orange-500/70 bg-white/80 border-orange-300/50" 
        />
        
        {showDropdown && previousEmails.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white/90 shadow-lg rounded-md border border-orange-200/50">
            <div className="py-1 text-sm text-orange-700 font-playfair">
              {previousEmails.map((prevEmail, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-orange-100/50 cursor-pointer"
                  onClick={() => handleEmailSelect(prevEmail)}
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
      >
        {isLoading ? texts.sending : texts.button}
      </Button>
    </form>
  );
}
