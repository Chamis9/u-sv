
import { Language } from '../../types';

export interface AboutUsTranslations {
  title: string;
  content: string[];
}

export const aboutUsTranslations = {
  lv: {
    title: "Par mums",
    content: [
      "Mēs esam komanda, kas palīdz cilvēkiem atrast un iegādāties biļetes uz visdažādākajiem kultūras un izklaides pasākumiem Latvijā.",
      "Mūsu mērķis ir padarīt biļešu iegādes procesu maksimāli vienkāršu un ērtu, sniedzot pilnīgu informāciju par pieejamajiem pasākumiem un to cenām.",
      "Mēs sadarbojamies ar vadošajiem pasākumu organizatoriem un vietām, lai nodrošinātu plašu pasākumu klāstu - no teātra izrādēm līdz lielkoncertiem."
    ]
  },
  en: {
    title: "About Us",
    content: [
      "We are a team dedicated to helping people find and purchase tickets for various cultural and entertainment events in Latvia.",
      "Our goal is to make the ticket purchasing process as simple and convenient as possible, providing complete information about available events and their prices.",
      "We collaborate with leading event organizers and venues to provide a wide range of events - from theater performances to major concerts."
    ]
  },
  ru: {
    title: "О нас",
    content: [
      "Мы - команда, которая помогает людям находить и покупать билеты на различные культурные и развлекательные мероприятия в Латвии.",
      "Наша цель - сделать процесс покупки билетов максимально простым и удобным, предоставляя полную информацию о доступных мероприятиях и их ценах.",
      "Мы сотрудничаем с ведущими организаторами мероприятий и площадками, чтобы предоставить широкий спектр мероприятий - от театральных постановок до крупных концертов."
    ]
  }
};
