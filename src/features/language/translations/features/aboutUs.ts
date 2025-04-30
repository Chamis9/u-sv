
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
      "Mūsu platforma ļauj lietotājiem tiešā veidā pārdot un iegādāties biļetes no citiem lietotājiem. Lai nodrošinātu drošību, tikai verificēti lietotāji var veikt darījumus.",
      "Mēs balstāmies uz trim galvenajām vērtībām: godīgums, drošība un klientu apmierinātība. Mēs garantējam 100% drošas transakcijas."
    ]
  },
  en: {
    title: "About Us",
    content: [
      "netieku.es is a platform where users can safely sell and purchase tickets from other users.",
      "Our platform allows users to directly sell and purchase tickets from other users. To ensure security, only verified users can perform transactions.",
      "We are based on three core values: honesty, security, and customer satisfaction. We guarantee 100% secure transactions."
    ]
  },
  ru: {
    title: "О нас",
    content: [
      "netieku.es - платформа, которая помогает людям находить и покупать билеты на различные культурные и развлекательные мероприятия в Латвии.",
      "Наша платформа позволяет пользователям напрямую продавать и покупать билеты у других пользователей. Для обеспечения безопасности только проверенные пользователи могут совершать сделки.",
      "Мы основываемся на трех основных ценностях: честность, безопасность и удовлетворенность клиентов. Мы гарантируем 100% безопасные транзакции."
    ]
  }
};
