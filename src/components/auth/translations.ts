
import { Language } from "@/features/language/types";

export const getLoginTranslations = (code: string) => {
  const t = {
    lv: {
      title: "Pieslēgties",
      email: "E-pasta adrese",
      password: "Parole",
      login: "Pieslēgties",
      forgotPassword: "Aizmirsu paroli",
      loginLoading: "Pieslēdzas...",
      invalidCredentials: "Nepareizs e-pasts vai parole",
      resetPasswordSent: "Paroles atjaunošanas saite nosūtīta uz jūsu e-pastu",
    },
    en: {
      title: "Login",
      email: "Email address",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot password",
      loginLoading: "Logging in...",
      invalidCredentials: "Invalid email or password",
      resetPasswordSent: "Password reset link has been sent to your email",
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
    },
  };

  return t[code as keyof typeof t] || t.en;
};
