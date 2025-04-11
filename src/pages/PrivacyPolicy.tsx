
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
          intro: "Šī privātuma politika apraksta, kā netieku.es vāc, izmanto un aizsargā jūsu personīgo informāciju, izmantojot mūsu tīmekļa vietni un pakalpojumus.",
          sections: [
            {
              title: "Kādu informāciju mēs vācam",
              content: "Mēs varam vākt šādu personīgo informāciju: vārdu, e-pasta adresi, tālruņa numuru un citu kontaktinformāciju, ko jūs brīvprātīgi sniedzat, reģistrējoties vai izmantojot mūsu pakalpojumus."
            },
            {
              title: "Kā mēs izmantojam jūsu informāciju",
              content: "Jūsu personīgā informācija tiek izmantota, lai: nodrošinātu un uzlabotu mūsu pakalpojumus, sazinātos ar jums par jūsu kontiem vai darījumiem, nosūtītu jums svarīgus paziņojumus, kā arī mārketinga un reklāmas nolūkos, ja esat tam piekritis."
            },
            {
              title: "Sīkdatnes un izsekošanas tehnoloģijas",
              content: "Mēs izmantojam sīkdatnes un līdzīgas izsekošanas tehnoloģijas, lai uzlabotu jūsu pieredzi mūsu vietnē, analizētu tendences un administrētu vietni. Jūs varat kontrolēt sīkdatņu izmantošanu savā pārlūkprogrammā."
            },
            {
              title: "Informācijas kopīgošana",
              content: "Mēs nepārdodam un neiznomājam jūsu personīgo informāciju trešajām personām. Tomēr mēs varam kopīgot jūsu informāciju ar uzticamiem pakalpojumu sniedzējiem, kas palīdz mums sniegt pakalpojumus."
            },
            {
              title: "Datu drošība",
              content: "Mēs ieviešam atbilstošus drošības pasākumus, lai aizsargātu jūsu personīgo informāciju no neatļautas piekļuves, izmaiņām, izpaušanas vai iznīcināšanas."
            },
            {
              title: "Jūsu tiesības",
              content: "Jums ir tiesības piekļūt savai personīgajai informācijai, labot to, dzēst vai ierobežot tās apstrādi. Jūs varat arī atsaukt savu piekrišanu jebkurā laikā."
            },
            {
              title: "Izmaiņas šajā politikā",
              content: "Mēs varam periodiski atjaunināt šo privātuma politiku. Mēs informēsim jūs par būtiskām izmaiņām, publicējot paziņojumu mūsu vietnē."
            },
            {
              title: "Sazinieties ar mums",
              content: "Ja jums ir jautājumi vai bažas par mūsu privātuma politiku, lūdzu, sazinieties ar mums, izmantojot kontaktinformāciju, kas norādīta mūsu vietnē."
            }
          ]
        };
      case "ru":
        return {
          title: "Политика конфиденциальности",
          lastUpdated: "Последнее обновление: 11.04.2025",
          intro: "Эта политика конфиденциальности описывает, как netieku.es собирает, использует и защищает вашу личную информацию при использовании нашего веб-сайта и услуг.",
          sections: [
            {
              title: "Какую информацию мы собираем",
              content: "Мы можем собирать следующую личную информацию: имя, адрес электронной почты, номер телефона и другую контактную информацию, которую вы добровольно предоставляете при регистрации или использовании наших услуг."
            },
            {
              title: "Как мы используем вашу информацию",
              content: "Ваша личная информация используется для: предоставления и улучшения наших услуг, общения с вами относительно ваших учетных записей или транзакций, отправки вам важных уведомлений, а также в маркетинговых и рекламных целях, если вы дали на это согласие."
            },
            {
              title: "Файлы cookie и технологии отслеживания",
              content: "Мы используем файлы cookie и аналогичные технологии отслеживания для улучшения вашего опыта на нашем сайте, анализа тенденций и администрирования сайта. Вы можете контролировать использование файлов cookie в своем браузере."
            },
            {
              title: "Обмен информацией",
              content: "Мы не продаем и не сдаем в аренду вашу личную информацию третьим лицам. Однако мы можем делиться вашей информацией с доверенными поставщиками услуг, которые помогают нам предоставлять услуги."
            },
            {
              title: "Безопасность данных",
              content: "Мы внедряем соответствующие меры безопасности для защиты вашей личной информации от несанкционированного доступа, изменений, раскрытия или уничтожения."
            },
            {
              title: "Ваши права",
              content: "Вы имеете право доступа к своей личной информации, исправления, удаления или ограничения ее обработки. Вы также можете отозвать свое согласие в любое время."
            },
            {
              title: "Изменения в этой политике",
              content: "Мы можем периодически обновлять эту политику конфиденциальности. Мы уведомим вас о существенных изменениях, разместив уведомление на нашем сайте."
            },
            {
              title: "Связаться с нами",
              content: "Если у вас есть вопросы или опасения относительно нашей политики конфиденциальности, пожалуйста, свяжитесь с нами, используя контактную информацию, указанную на нашем сайте."
            }
          ]
        };
      default: // English
        return {
          title: "Privacy Policy",
          lastUpdated: "Last updated: 04/11/2025",
          intro: "This Privacy Policy describes how netieku.es collects, uses, and protects your personal information when you use our website and services.",
          sections: [
            {
              title: "Information We Collect",
              content: "We may collect personal information such as your name, email address, phone number, and other contact information that you voluntarily provide when you register for or use our services."
            },
            {
              title: "How We Use Your Information",
              content: "Your personal information is used to: provide and improve our services, communicate with you about your accounts or transactions, send you important notifications, and for marketing and advertising purposes if you have consented to this."
            },
            {
              title: "Cookies and Tracking Technologies",
              content: "We use cookies and similar tracking technologies to enhance your experience on our site, analyze trends, and administer the website. You can control the use of cookies in your browser."
            },
            {
              title: "Information Sharing",
              content: "We do not sell or rent your personal information to third parties. However, we may share your information with trusted service providers who help us deliver our services."
            },
            {
              title: "Data Security",
              content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."
            },
            {
              title: "Your Rights",
              content: "You have the right to access, correct, delete, or restrict the processing of your personal information. You can also withdraw your consent at any time."
            },
            {
              title: "Changes to This Policy",
              content: "We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice on our website."
            },
            {
              title: "Contact Us",
              content: "If you have questions or concerns about our Privacy Policy, please contact us using the contact information provided on our website."
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <SEO title={content.title} description={content.intro} />
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-orange-500">{content.title}</h1>
          <p className="text-gray-500 text-sm mb-8">{content.lastUpdated}</p>
          
          <div className="prose prose-orange max-w-none">
            <p className="text-lg mb-8">{content.intro}</p>
            
            {content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800">{section.title}</h2>
                <p className="text-gray-700">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
