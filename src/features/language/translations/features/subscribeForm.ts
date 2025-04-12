
export type SubscribeFormTexts = {
  placeholder: string;
  button: string;
  sending: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  previousEmails: string;
  selectEmail: string;
  invalidEmail: string;
  rateLimit: string;
};

export const subscribeFormTranslations = {
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
