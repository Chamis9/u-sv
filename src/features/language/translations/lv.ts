
import { Translations } from '../types';

export const lvTranslations: Translations = {
  hero: {
    title: "Pārdodiet un pērciet biļetes",
    titleHighlight: "vienkārši un droši",
    subtitle: "Pirmā platforma biļešu apmaiņai Latvijā",
    subscribeText: "Piesakies, lai jau laicīgi uzzinātu par platformas atklāšanu!",
    learnMoreBtn: "Uzzināt vairāk",
  },
  howItWorks: {
    title: "Kā tas strādā",
    subtitle: "Vienkāršs un drošs veids, kā pārdot vai iegādāties biļeti uz pasākumiem",
    steps: [
      {
        title: "Ievieto biļeti",
        description: "Ievietojiet pasākuma biļeti platformā ātri un vienkārši"
      },
      {
        title: "Sazinies ar pircēju",
        description: "Izmantojiet platformas saziņas iespējas"
      },
      {
        title: "Droša apmaiņa",
        description: "Vienkāršs un drošs apmaiņas process"
      },
      {
        title: "Apmeklē pasākumu",
        description: "Pasākuma apmeklējums un emocijas ir garantētas"
      }
    ]
  },
  cookieConsent: {
    message: "Mēs izmantojam sīkdatnes. Turpinot lietot šo mājas lapu, Jūs piekrītat sīkdatņu lietošanas noteikumiem.",
    learnMore: "Uzzināt vairāk",
    accept: "Piekrītu",
    decline: "Atteikties",
    dialogTitle: "Sīkdatņu lietošanas noteikumi",
    dialogDescription: "Informācija par sīkdatnēm un to lietošanu mūsu platformā.",
    whatAreCookies: "Sīkdatnes ir nelieli teksta faili, kas tiek saglabāti jūsu ierīcē, kad apmeklējat mūsu vietni. Tās palīdz mums nodrošināt labāku lietotāja pieredzi.",
    whyWeUseCookies: "Mēs izmantojam sīkdatnes, lai uzlabotu vietnes funkcionalitāti, analizētu lietotāju plūsmu un personalizētu jūsu pieredzi.",
    typesOfCookies: "Mēs izmantojam šādus sīkdatņu veidus:",
    essentialCookiesTitle: "Nepieciešamās sīkdatnes",
    essentialCookiesDescription: "Šīs sīkdatnes ir nepieciešamas vietnes pamatfunkciju darbībai. Tās ļauj jums pārvietoties pa vietni un izmantot tās funkcijas.",
    analyticsCookiesTitle: "Analītiskās sīkdatnes",
    analyticsCookiesDescription: "Šīs sīkdatnes palīdz mums saprast, kā lietotāji mijiedarbojas ar vietni, vācot un ziņojot informāciju anonīmi.",
    privacyPolicy: "Plašāku informāciju par to, kā mēs izmantojam jūsu datus, varat skatīt mūsu privātuma politikā.",
    required: "Obligāti",
    savePreferences: "Saglabāt iestatījumus",
    cookieSettings: "Sīkdatņu iestatījumi",
    marketingCookies: "Mārketinga sīkdatnes",
    marketingCookiesDescription: "Šīs sīkdatnes tiek izmantotas, lai izsekotu lietotājus dažādās vietnēs un parādītu attiecīgas reklāmas, kas ir aktuālas un saistošas konkrētajam lietotājam."
  },
  footer: {
    allRightsReserved: "© 2025 netieku.es",
    madeWith: "Radīts ar",
    location: "Latvijā",
    cookieSettings: "Sīkdatņu iestatījumi",
    privacyPolicy: "Privātuma politika"
  },
  admin: {
    title: "Administratora panelis",
    defaultUser: "Administrators",
    logout: "Izrakstīties",
    returnToHome: "Atgriezties uz sākumlapu",
    logoutSuccess: "Jūs esat veiksmīgi izrakstījies",
    logoutError: "Kļūda izrakstīšanās laikā",
    tabs: {
      dashboard: "Pārskats",
      users: "Lietotāji",
      subscribers: "Abonenti",
      settings: "Iestatījumi"
    },
    auth: {
      supabaseAuthAvailable: "Supabase autentifikācija ir pieejama. Lūdzu, izmantojiet administratora kontu, lai pieslēgtos."
    },
    settings: {
      security: {
        title: "Drošības iestatījumi",
        description: "Pārvaldiet platformas drošības iestatījumus",
        comingSoon: "Drošības iestatījumi tiks pievienoti drīzumā..."
      },
      integrations: {
        title: "Integrācijas",
        description: "Pārvaldiet trešo pušu integrācijas",
        comingSoon: "Integrāciju iestatījumi tiks pievienoti drīzumā..."
      }
    }
  }
};
