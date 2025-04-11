
import { useLanguage } from "@/features/language";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const PrivacyPolicy = () => {
  const { currentLanguage } = useLanguage();

  // Content based on the current language
  const getContent = () => {
    switch (currentLanguage.code) {
      case "lv":
        return {
          title: "Privātuma politika",
          lastUpdated: "Pēdējie atjauninājumi: 11.04.2025",
          intro: "Šī privātuma politika apraksta, kā vietne netieku.es ("vietne", "mēs", "mūsu") vāc, izmanto, glabā un aizsargā jūsu personīgo informāciju.",
          sections: [
            {
              title: "Kādu informāciju mēs vācam",
              content: "Mēs varam vākt šādu informāciju:",
              list: [
                "Vārds un uzvārds",
                "E-pasta adrese",
                "Tālruņa numurs",
                "Kontaktinformācija (piemēram, adrese vai preferences)",
                "Lietotāja profila informācija",
                "Ierīces un pārlūka informācija",
                "IP adrese",
                "Atrašanās vietas dati",
                "Mijiedarbības žurnāli ar vietni (piemēram, klikšķi, lapu skatījumi)"
              ],
              additionalInfo: "Šie dati tiek vākti tikai pamatojoties uz likumīgu pamatu: jūsu piekrišanu, līguma izpildi, juridisku pienākumu vai mūsu leģitīmu interešu nodrošināšanu."
            },
            {
              title: "Kā mēs izmantojam jūsu informāciju",
              content: "Jūsu informācija tiek izmantota, lai:",
              list: [
                "Nodrošinātu un uzturētu vietnes darbību",
                "Personalizētu lietotāja pieredzi",
                "Nodrošinātu klientu atbalstu",
                "Sazinātos ar jums saistībā ar kontiem, pakalpojumiem vai paziņojumiem",
                "Uzlabotu vietnes veiktspēju un analizētu lietošanas paradumus",
                "Aizsargātu pret krāpniecību un drošības riskiem",
                "Piedāvātu mārketinga un reklāmas saturu tikai ar jūsu piekrišanu"
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
              title: "Jūsu tiesības",
              content: "Jums ir šādas tiesības attiecībā uz jūsu personīgo informāciju:",
              list: [
                "Tiesības piekļūt – iegūt informāciju par to, kādi dati par jums tiek glabāti",
                "Tiesības labot – pieprasīt neprecīzu vai nepilnīgu datu labošanu",
                "Tiesības dzēst ("tikt aizmirstam") – pieprasīt datu dzēšanu, ja tiem vairs nav juridiska pamata",
                "Tiesības ierobežot apstrādi – noteiktos gadījumos ierobežot datu izmantošanu",
                "Tiesības iebilst – pret datu apstrādi noteiktos nolūkos, piemēram, tiešajam mārketingam",
                "Tiesības uz datu pārnesamību – saņemt savus datus strukturētā formātā"
              ],
              additionalInfo: "Lai īstenotu savas tiesības, lūdzu, sazinieties ar mums, izmantojot zemāk norādīto kontaktinformāciju."
            },
            {
              title: "Saziņa un jautājumi",
              content: "Ja jums ir jautājumi par šo privātuma politiku vai vēlaties izmantot savas datu aizsardzības tiesības, lūdzu, sazinieties ar mums:"
            }
          ]
        };
      case "ru":
        return {
          title: "Политика конфиденциальности",
          lastUpdated: "Последнее обновление: 11.04.2025",
          intro: "Эта политика конфиденциальности описывает, как сайт netieku.es ("сайт", "мы", "наш") собирает, использует, хранит и защищает вашу личную информацию.",
          sections: [
            {
              title: "Какую информацию мы собираем",
              content: "Мы можем собирать следующую информацию:",
              list: [
                "Имя и фамилия",
                "Адрес электронной почты",
                "Номер телефона",
                "Контактная информация (например, адрес или предпочтения)",
                "Информация профиля пользователя",
                "Данные об устройстве и браузере",
                "IP-адрес",
                "Данные о местоположении",
                "Журналы взаимодействия с сайтом (например, клики, просмотры страниц)"
              ],
              additionalInfo: "Эти данные собираются только на законных основаниях: ваше согласие, исполнение договора, юридические обязательства или наши законные интересы."
            },
            {
              title: "Как мы используем вашу информацию",
              content: "Ваша информация используется для:",
              list: [
                "Обеспечения и поддержки работы сайта",
                "Персонализации пользовательского опыта",
                "Обеспечения поддержки клиентов",
                "Связи с вами по поводу аккаунтов, услуг или уведомлений",
                "Улучшения производительности сайта и анализа пользовательских привычек",
                "Защиты от мошенничества и рисков безопасности",
                "Предложения маркетингового и рекламного контента только с вашего согласия"
              ]
            },
            {
              title: "Обмен данными с третьими сторонами",
              content: "Мы не передаем вашу личную информацию третьим сторонам, за исключением следующих случаев:",
              list: [
                "В случае юридических обязательств – если это требуется по закону, правоохранительными органами или судами",
                "С вашего согласия – если вы явно согласились на обмен информацией"
              ],
              additionalInfo: "Все данные передаются только в минимально необходимом объеме и в соответствии с действующими законами о защите данных (например, GDPR, если применимо)."
            },
            {
              title: "Ваши права",
              content: "У вас есть следующие права в отношении вашей личной информации:",
              list: [
                "Право на доступ – получать информацию о том, какие данные о вас хранятся",
                "Право на исправление – запрашивать исправление неточных или неполных данных",
                "Право на удаление ("право быть забытым") – запрашивать удаление данных, если больше нет юридических оснований",
                "Право ограничить обработку – в определенных случаях ограничивать использование данных",
                "Право возражать – против обработки данных для определенных целей, например, прямого маркетинга",
                "Право на переносимость данных – получать свои данные в структурированном формате"
              ],
              additionalInfo: "Для реализации своих прав, пожалуйста, свяжитесь с нами, используя контактную информацию, указанную ниже."
            },
            {
              title: "Связь и вопросы",
              content: "Если у вас есть вопросы об этой политике конфиденциальности или вы хотите воспользоваться своими правами на защиту данных, пожалуйста, свяжитесь с нами:"
            }
          ]
        };
      default: // English
        return {
          title: "Privacy Policy",
          lastUpdated: "Last updated: 04/11/2025",
          intro: "This Privacy Policy describes how netieku.es ('site', 'we', 'our') collects, uses, stores, and protects your personal information.",
          sections: [
            {
              title: "Information We Collect",
              content: "We may collect the following information:",
              list: [
                "Full name",
                "Email address",
                "Phone number",
                "Contact information (e.g., address or preferences)",
                "User profile information",
                "Device and browser information",
                "IP address",
                "Location data",
                "Site interaction logs (e.g., clicks, page views)"
              ],
              additionalInfo: "This data is only collected based on lawful grounds: your consent, fulfillment of a contract, legal obligation, or our legitimate interests."
            },
            {
              title: "How We Use Your Information",
              content: "Your information is used to:",
              list: [
                "Provide and maintain website operation",
                "Personalize user experience",
                "Provide customer support",
                "Communicate with you regarding accounts, services, or notifications",
                "Improve website performance and analyze usage patterns",
                "Protect against fraud and security risks",
                "Offer marketing and advertising content only with your consent"
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
              title: "Your Rights",
              content: "You have the following rights regarding your personal information:",
              list: [
                "Right to access – obtain information about what data about you is stored",
                "Right to rectify – request correction of inaccurate or incomplete data",
                "Right to erasure ('right to be forgotten') – request deletion of data if there is no longer a legal basis",
                "Right to restrict processing – in certain cases limit the use of data",
                "Right to object – to data processing for certain purposes, such as direct marketing",
                "Right to data portability – receive your data in a structured format"
              ],
              additionalInfo: "To exercise your rights, please contact us using the contact information provided below."
            },
            {
              title: "Contact and Questions",
              content: "If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us:"
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <>
      <SEO 
        title={`${content.title} | netieku.es`}
        description={content.intro}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-orange-500">{content.title}</span>
              </h1>
              <p className="text-gray-300 text-sm mb-8">{content.lastUpdated}</p>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg mb-8 text-gray-300">{content.intro}</p>
                
                {content.sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold mb-3 text-orange-500">{section.title}</h2>
                    <p className="text-gray-300 mb-3">{section.content}</p>
                    {section.list && section.list.length > 0 && (
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        {section.list.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.additionalInfo && (
                      <p className="text-gray-300 mt-3">{section.additionalInfo}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
