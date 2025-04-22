
import { Language } from "@/features/language/types";

export const getLoginTranslations = (code: string) => {
  const t = {
    lv: {
      title: "Pieslēgties",
      email: "E-pasta adrese",
      password: "Parole",
      login: "Ienākt",
      register: "Reģistrēties",
      forgotPassword: "Aizmirsu paroli",
      loginLoading: "Pieslēdzas...",
      invalidCredentials: "Nepareizs e-pasts vai parole",
      resetPasswordSent: "Paroles atjaunošanas saite nosūtīta uz jūsu e-pastu",
      loginDescription: "Izvēlieties sev ērtāko autentifikācijas veidu",
      loginError: "Radās kļūda pieslēdzoties. Lūdzu mēģiniet vēlreiz.",
      orContinueWith: "vai turpini ar",
    },
    en: {
      title: "Login",
      email: "Email address",
      password: "Password",
      login: "Login",
      register: "Register",
      forgotPassword: "Forgot password",
      loginLoading: "Logging in...",
      invalidCredentials: "Invalid email or password",
      resetPasswordSent: "Password reset link has been sent to your email",
      loginDescription: "Choose your preferred authentication method",
      loginError: "An error occurred while logging in. Please try again.",
      orContinueWith: "or continue with",
    },
    ru: {
      title: "Войти",
      email: "Электронная почта",
      password: "Пароль",
      login: "Войти",
      forgotPassword: "Забыли пароль",
      loginLoading: "Вход...",
      invalidCredentials: "Неверный email или пароль",
      resetPasswordSent: "Ссылка для сброса пароля отправлена на ваш email",
      loginDescription: "Пожалуйста, введите ваш email и пароль для входа",
    },
  };

  return t[code as keyof typeof t] || t.en;
};
