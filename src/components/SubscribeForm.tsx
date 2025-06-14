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

  // Get translations for the current language
  const getSubscribeTranslations = () => {
    const translations = {
      lv: {
        placeholder: "E-pasta adrese",
        button: "Pieteikties",
        sending: "Sūta..."
      },
      en: {
        placeholder: "Email address",
        button: "Subscribe",
        sending: "Sending..."
      },
      ee: {
        placeholder: "E-posti aadress",
        button: "Telli",
        sending: "Saatmine..."
      },
      lt: {
        placeholder: "El. pašto adresas",
        button: "Prenumeruoti",
        sending: "Siunčiama..."
      }
    };

    return translations[currentLanguage.code as keyof typeof translations] || translations.en;
  };

  const texts = getSubscribeTranslations();

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
          className="flex-grow h-12 text-base bg-ticket-bg/30 border-2 border-ticket-accent text-ticket-text placeholder:text-ticket-text/50 focus-visible:ring-ticket-accent focus-visible:border-ticket-accent" 
        />
        
        {formError && (
          <div className="text-ticket-accent text-sm mt-1 font-medium">{formError}</div>
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
