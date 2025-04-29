
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";
import { useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { UserCircle } from "lucide-react";
import { useLanguage } from "@/features/language";
import { useAuth } from "@/contexts/AuthContext";
import { UserHoverCard } from "./auth/user-menu/UserHoverCard";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./auth/forms/LoginForm";
import { RegistrationForm } from "./auth/forms/RegistrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Header() {
  const navigationLinks = getNavigationLinks();
  const { currentLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [keepHoverOpen, setKeepHoverOpen] = useState(false);

  const t = (lvText: string, enText: string, ruText?: string) => {
    if (currentLanguage.code === 'lv') return lvText;
    if (currentLanguage.code === 'ru') return ruText || enText;
    return enText;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const translations = {
    login: t("Ieiet", "Login", "Войти"),
    loginLoading: t("Ieeja...", "Logging in...", "Вход..."),
    register: t("Reģistrēties", "Register", "Регистрация"),
    registrationLoading: t("Reģistrējas...", "Registering...", "Регистрация..."),
    registrationSuccessful: t(
      "Reģistrācija veiksmīga! Gaidiet apstiprinājumu no administratora.",
      "Registration successful! Please wait for admin confirmation.",
      "Регистрация успешна! Пожалуйста, дождитесь подтверждения от администратора."
    ),
    registrationError: t(
      "Kļūda reģistrācijas laikā. Lūdzu, mēģiniet vēlreiz.",
      "Error during registration. Please try again.",
      "Ошибка при регистрации. Пожалуйста, попробуйте снова."
    ),
    invalidCredentials: t(
      "Nepareizs e-pasts vai parole.",
      "Invalid email or password.",
      "Неверный адрес электронной почты или пароль."
    ),
    email: t("E-pasta adrese", "Email address", "Электронная почта"),
    password: t("Parole", "Password", "Пароль"),
    confirmPassword: t("Apstiprināt paroli", "Confirm password", "Подтвердить пароль"),
    firstName: t("Vārds", "First name", "Имя"),
    lastName: t("Uzvārds", "Last name", "Фамилия"),
    phoneNumber: t("Tālrunis", "Phone number", "Номер телефона"),
    optional: t("(neobligāti)", "(optional)", "(необязательно)"),
    countryCode: t("Valsts kods", "Country code", "Код страны"),
    forgotPassword: t("Aizmirsu paroli", "Forgot password", "Забыл пароль"),
    resetPasswordSent: t(
      "Paroles atjaunošanas saite nosūtīta uz jūsu e-pastu.",
      "Password reset link sent to your email.",
      "Ссылка для сброса пароля отправлена на вашу почту."
    ),
    passwordsDoNotMatch: t(
      "Paroles nesakrīt",
      "Passwords do not match",
      "Пароли не совпадают"
    ),
    passwordRequirements: t(
      "Parolei jābūt vismaz 6 simboliem",
      "Password must be at least 6 characters",
      "Пароль должен содержать не менее 6 символов"
    ),
    emailRateLimitExceeded: t(
      "E-pasta sūtīšanas limits ir pārsniegts. Lūdzu, mēģiniet vēlāk.",
      "Email rate limit exceeded. Please try again later.",
      "Превышен лимит отправки электронной почты. Пожалуйста, попробуйте позже."
    ),
    genericError: t(
      "Kļūda reģistrācijas laikā. Lūdzu, mēģiniet vēlreiz.",
      "Registration error. Please try again.",
      "Ошибка при регистрации. Пожалуйста, попробуйте снова."
    ),
    terms: t(
      "Es piekrītu lietošanas noteikumiem",
      "I agree to the terms and conditions",
      "Я согласен с правилами и условиями"
    ),
    languageCode: currentLanguage.code,
    manualConfirmation: t(
      "Reģistrācija veiksmīga! Gaidiet apstiprinājumu no administratora.",
      "Registration successful! Please wait for admin confirmation.",
      "Регистрация успешна! Пожалуйста, дождитесь подтверждения от администратора."
    ),
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu links={navigationLinks} />
          <Logo />
        </div>
        
        <Navigation />
        
        <div className="flex items-center gap-2 md:gap-4 text-white">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <UserHoverCard 
              user={user}
              onLogout={handleLogout}
              onLinkClick={() => {}}
            />
          ) : (
            <HoverCard open={keepHoverOpen}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-orange-400 transition-colors hover:bg-transparent"
                  onClick={() => setKeepHoverOpen(true)}
                >
                  <UserCircle size={20} className="hover:text-orange-400" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 p-0 overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.stopPropagation();
                  }
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  setKeepHoverOpen(true);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setKeepHoverOpen(true);
                }}
                onInteractOutside={(e) => {
                  if (e.target instanceof Element) {
                    const isAutofillOption = e.target.closest('[role="option"]') || 
                                            e.target.closest('[role="listbox"]') ||
                                            e.target.closest('.autofill-suggestion') ||
                                            e.target.closest('.dropdown-option');
                    if (!isAutofillOption) {
                      setKeepHoverOpen(false);
                    } else {
                      e.preventDefault();
                    }
                  } else {
                    setKeepHoverOpen(false);
                  }
                }}
              >
                <Tabs 
                  defaultValue={activeTab} 
                  className="w-full" 
                  onValueChange={setActiveTab}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("Ienākt", "Login", "Войти")}</TabsTrigger>
                    <TabsTrigger value="register">{t("Reģistrēties", "Register", "Регистрация")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="p-4">
                    <LoginForm 
                      translations={translations} 
                      onClose={() => setKeepHoverOpen(false)} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="register" className="p-4">
                    <RegistrationForm 
                      translations={translations}
                      onClose={() => setKeepHoverOpen(false)}
                    />
                  </TabsContent>
                </Tabs>
              </HoverCardContent>
            </HoverCard>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
