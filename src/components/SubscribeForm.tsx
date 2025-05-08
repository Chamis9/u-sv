
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

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 w-full max-w-md bg-transparent p-0 subscribe-form"
    >
      <div className="relative flex-grow">
        <Input
          type="email"
          placeholder={texts.placeholder}
          value={email}
          onChange={handleEmailChange}
          autoComplete="email"
          required
          aria-invalid={formError ? "true" : "false"}
          className="flex-grow h-12 text-base bg-ticket-bg/30 border-ticket-text/20 text-ticket-text placeholder:text-ticket-text/50 focus-visible:ring-ticket-accent focus-visible:border-ticket-accent" 
        />
        
        {formError && (
          <div className="text-red-500 text-sm mt-1">{formError}</div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="bg-ticket-accent hover:bg-ticket-accent/80 text-ticket-bg h-12 text-lg px-6 font-semibold" 
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
