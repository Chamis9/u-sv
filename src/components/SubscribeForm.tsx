
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";
import { useSubscribeForm } from "@/hooks/useSubscribeForm";
import { useState, useEffect } from "react";

export function SubscribeForm() {
  const { currentLanguage } = useLanguage();
  const { 
    email, 
    setEmail, 
    isLoading, 
    formError, 
    setFormError, 
    handleSubmit 
  } = useSubscribeForm();
  
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  useEffect(() => {
    // Reset submission attempt indicator when email changes
    if (submissionAttempted && email) {
      setSubmissionAttempted(false);
    }
  }, [email, submissionAttempted]);

  const onSubmit = async (e: React.FormEvent) => {
    setSubmissionAttempted(true);
    await handleSubmit(e);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formError) setFormError("");
  };

  const getPlaceholder = () => {
    switch (currentLanguage.code) {
      case 'lv':
        return "E-pasts";
      case 'ru':
        return "Электронная почта";
      default:
        return "Email";
    }
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-transparent p-0 subscribe-form"
      data-testid="subscribe-form"
    >
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder={getPlaceholder()}
          value={email}
          onChange={handleEmailChange}
          autoComplete="email"
          required
          aria-invalid={formError ? "true" : "false"}
          className="flex-grow h-12 text-base font-playfair placeholder-orange-500/70 bg-white dark:bg-gray-800 dark:text-white border-orange-300/50" 
          disabled={isLoading}
        />
        
        {formError && (
          <div className="text-red-500 text-sm mt-1">{formError}</div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg px-6 font-semibold font-playfair" 
        aria-busy={isLoading}
        data-testid="subscribe-button"
      >
        {isLoading ? getTranslations(currentLanguage.code).sending : getTranslations(currentLanguage.code).button}
      </Button>
    </form>
  );
}

const getTranslations = (langCode: string) => {
  const translations = {
    lv: {
      placeholder: "E-pasts",
      button: "Pieteikties",
      sending: "Sūta..."
    },
    en: {
      placeholder: "Email",
      button: "Subscribe",
      sending: "Sending..."
    },
    ru: {
      placeholder: "Электронная почта",
      button: "Подписаться",
      sending: "Отправка..."
    }
  };

  return translations[langCode as keyof typeof translations] || translations.en;
};
