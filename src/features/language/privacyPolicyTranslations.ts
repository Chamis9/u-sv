
import { Language } from './types';

export interface PrivacyPolicySection {
  title: string;
  content: string;
  list?: string[];
  additionalInfo?: string;
}

export interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: PrivacyPolicySection[];
}

const privacyPolicyTranslations: Record<string, PrivacyPolicyContent> = {
  lv: {
    title: "Privātuma politika",
    lastUpdated: "Pēdējie atjauninājumi: 11.04.2025",
    intro: "Šī privātuma politika apraksta, kā vietne netieku.es (\"vietne\", \"mēs\", \"mūsu\") var vākt, izmantot, glabāt un aizsargāt jūsu personīgo informāciju.",
    sections: [
      {
        title: "Kādu informāciju mēs varam vākt",
        content: "Mēs varam vākt šādu informāciju, ja jūs tai piekrītat:",
        list: [
          "Vārds un uzvārds",
          "E-pasta adrese",
          "Tālruņa numurs",
          "Kontaktinformācija (piemēram, adrese vai preferences)",
          "Lietotāja profila informācija"
        ],
        additionalInfo: "Šie dati tiek vākti tikai pamatojoties uz likumīgu pamatu: jūsu piekrišanu, līguma izpildi vai juridisku pienākumu."
      },
      {
        title: "Kā mēs izmantojam jūsu informāciju",
        content: "Jūsu informācija tiek izmantota, lai:",
        list: [
          "Nodrošinātu un uzturētu vietnes darbību",
          "Personalizētu lietotāja pieredzi",
          "Nodrošinātu klientu atbalstu",
          "Sazinātos ar jums saistībā ar kontiem vai pakalpojumiem"
        ]
      },
      {
        title: "Datu kopīgošana ar trešajām pusēm",
        content: "Mēs nekopīgojam jūsu personīgo informāciju ar trešajām pusēm, izņemot šādos gadījumos:",
        list: [
          "Juridisku pienākumu gadījumā – ja to pieprasa likums, tiesībsargājošās iestādes vai tiesas",
          "Ar jūsu piekrišanu – ja esat skaidri piekritis informācijas kopīgošanai"
        ],
        additionalInfo: "Visi dati tiek kopīgoti tikai minimālajā nepieciešamajā apjomā un saskaņā ar spēkā esošajiem datu aizsardzības likumiem (piemēram, GDPR, ja tas ir piemērojams)."
      },
      {
        title: "Datu uzglabāšanas periods",
        content: "Jūsu personīgos datus mēs uzglabājam tikai tik ilgi, cik tas ir nepieciešams mērķiem, kuriem tie tika vākti:",
        list: [
          "Klienta konta dati tiek uzglabāti tik ilgi, kamēr konts ir aktīvs",
          "Darījumu dati tiek uzglabāti atbilstoši normatīvo aktu prasībām (parasti 5-7 gadus)",
          "Saziņas dati tiek uzglabāti ne ilgāk kā 2 gadus pēc pēdējās saziņas"
        ],
        additionalInfo: "Pēc datu uzglabāšanas perioda beigām tie tiek drošā veidā dzēsti vai anonimizēti."
      },
      {
        title: "Jūsu tiesības",
        content: "Jums ir šādas tiesības attiecībā uz jūsu personīgo informāciju:",
        list: [
          "Tiesības piekļūt – iegūt informāciju par to, kādi dati par jums tiek glabāti",
          "Tiesības labot – pieprasīt neprecīzu vai nepilnīgu datu labošanu",
          "Tiesības dzēst (\"tikt aizmirstam\") – pieprasīt datu dzēšanu, ja tiem vairs nav juridiska pamata",
          "Tiesības ierobežot apstrādi – noteiktos gadījumos ierobežot datu izmantošanu",
          "Tiesības iebilst – pret datu apstrādi noteiktos nolūkos",
          "Tiesības uz datu pārnesamību – saņemt savus datus strukturētā formātā"
        ],
        additionalInfo: "Lai īstenotu savas tiesības, lūdzu, sazinieties ar mums, izmantojot kontaktinformāciju."
      },
      {
        title: "Saziņa un jautājumi",
        content: 'Ja jums ir jautājumi par šo privātuma politiku vai vēlaties izmantot savas datu aizsardzības tiesības, lūdzu, sazinieties ar mums, izmantojot <a href="/contact" className="text-orange-500 hover:text-orange-400 underline"><span className="text-orange-500">kontaktinformāciju</span></a>, kas pieejama mūsu mājaslapā.',
        additionalInfo: ""
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: 04/11/2025",
    intro: "This Privacy Policy describes how netieku.es ('site', 'we', 'our') may collect, use, store, and protect your personal information.",
    sections: [
      {
        title: "Information We May Collect",
        content: "We may collect the following information with your consent:",
        list: [
          "Full name",
          "Email address",
          "Phone number",
          "Contact information (e.g., address or preferences)",
          "User profile information"
        ],
        additionalInfo: "This data is only collected based on lawful grounds: your consent, fulfillment of a contract, or legal obligation."
      },
      {
        title: "How We Use Your Information",
        content: "Your information is used to:",
        list: [
          "Provide and maintain website operation",
          "Personalize user experience",
          "Provide customer support",
          "Communicate with you regarding accounts or services"
        ]
      },
      {
        title: "Data Sharing with Third Parties",
        content: "We do not share your personal information with third parties except in the following cases:",
        list: [
          "In case of legal obligations – if required by law, law enforcement agencies, or courts",
          "With your consent – if you have explicitly agreed to information sharing"
        ],
        additionalInfo: "All data is shared only to the minimum extent necessary and in accordance with applicable data protection laws (e.g., GDPR, if applicable)."
      },
      {
        title: "Data Retention Period",
        content: "We keep your personal data only for as long as necessary for the purposes for which it was collected:",
        list: [
          "Customer account data is stored for as long as the account is active",
          "Transaction data is kept according to regulatory requirements (typically 5-7 years)",
          "Communication data is kept for no longer than 2 years after the last communication"
        ],
        additionalInfo: "After the retention period ends, data is securely deleted or anonymized."
      },
      {
        title: "Your Rights",
        content: "You have the following rights regarding your personal information:",
        list: [
          "Right to access – obtain information about what data about you is stored",
          "Right to rectify – request correction of inaccurate or incomplete data",
          "Right to erasure ('right to be forgotten') – request deletion of data if there is no longer a legal basis",
          "Right to restrict processing – in certain cases limit the use of data",
          "Right to object – to data processing for certain purposes",
          "Right to data portability – receive your data in a structured format"
        ],
        additionalInfo: "To exercise your rights, please contact us using the contact information."
      },
      {
        title: "Contact and Questions",
        content: 'If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us using the <a href="/contact" className="text-orange-500 hover:text-orange-400 underline"><span className="text-orange-500">contact information</span></a> available on our website.',
        additionalInfo: ""
      }
    ]
  }
};

export const getPrivacyPolicyContent = (languageCode: string): PrivacyPolicyContent => {
  return privacyPolicyTranslations[languageCode] || privacyPolicyTranslations.en;
};

export default privacyPolicyTranslations;
