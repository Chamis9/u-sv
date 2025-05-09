
import { Language } from '../../types';

export interface AboutUsTranslations {
  title: string;
  content: string[];
}

export const aboutUsTranslations = {
  lv: {
    title: "Par mums",
    content: [
      "netieku.es ir platforma, kurā lietotāji var droši pārdot un iegādāties biļetes no citiem lietotājiem.",
      "Mūsu platforma ļauj tās lietotājiem pārdot un iegādāties biļetes no citiem lietotājiem. Lai nodrošinātu drošību, tikai verificēti lietotāji var veikt darījumus mūsu platformā.",
      "Mēs balstāmies uz trim galvenajām vērtībām: godīgums, drošība un klientu apmierinātība. Mēs garantējam 100% drošas transakcijas."
    ]
  },
  en: {
    title: "About Us",
    content: [
      "netieku.es is a platform where users can safely sell and purchase tickets from other users.",
      "Our platform allows its users to sell and purchase tickets from other users. To ensure security, only verified users can perform transactions on our platform.",
      "We are based on three core values: honesty, security, and customer satisfaction. We guarantee 100% secure transactions."
    ]
  },
  ru: {
    title: "О нас",
    content: [
      "netieku.es - это платформа, где пользователи могут безопасно продавать и покупать билеты у других пользователей.",
      "Наша платформа позволяет пользователям продавать и покупать билеты у других пользователей. Для обеспечения безопасности только проверенные пользователи могут совершать транзакции на нашей платформе.",
      "Мы основываемся на трех основных ценностях: честность, безопасность и удовлетворенность клиентов. Мы гарантируем 100% безопасные транзакции."
    ]
  }
};
