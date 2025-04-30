
import { Language } from '../../types';

export interface AboutUsTranslations {
  title: string;
  content: string[];
}

export const aboutUsTranslations = {
  lv: {
    title: "Par mums",
    content: [
      "Mēs esam platforma, kas palīdz cilvēkiem atrast un iegādāties biļetes uz visdažādākajiem kultūras un izklaides pasākumiem Latvijā.",
      "Mūsu platforma ļauj lietotājiem tiešā veidā pārdot un iegādāties biļetes no citiem lietotājiem. Lai nodrošinātu drošību, tikai verificēti lietotāji var veikt darījumus.",
      "Mēs sadarbojamies ar vadošajiem pasākumu organizatoriem un vietām, lai nodrošinātu plašu pasākumu klāstu - no teātra izrādēm līdz lielkoncertiem."
    ]
  },
  en: {
    title: "About Us",
    content: [
      "We are a platform that helps people find and purchase tickets for various cultural and entertainment events in Latvia.",
      "Our platform allows users to directly sell and purchase tickets from other users. To ensure security, only verified users can perform transactions.",
      "We collaborate with leading event organizers and venues to provide a wide range of events - from theater performances to major concerts."
    ]
  },
  ru: {
    title: "О нас",
    content: [
      "Мы - платформа, которая помогает людям находить и покупать билеты на различные культурные и развлекательные мероприятия в Латвии.",
      "Наша платформа позволяет пользователям напрямую продавать и покупать билеты у других пользователей. Для обеспечения безопасности только проверенные пользователи могут совершать сделки.",
      "Мы сотрудничаем с ведущими организаторами мероприятий и площадками, чтобы предоставить широкий спектр мероприятий - от театральных постановок до крупных концертов."
    ]
  }
};
