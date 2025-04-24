import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/features/language";
import { useSubscribeForm } from "@/hooks/useSubscribeForm";

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

  const texts = getTranslations(currentLanguage.code);

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
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-transparent p-0 subscribe-form"
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
      >
        {isLoading ? texts.sending : texts.button}
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
