
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Users, Info } from "lucide-react";

const AboutUs = () => {
  const { translations } = useLanguage();
  
  const companyInfo = {
    lv: [
      {
        title: "Mūsu vīzija",
        content: "Mūsu mērķis ir radīt uzticamu platformu biļešu tirdzniecībai, kas vieno pasākumu apmeklētājus ar citiem apmeklētājiem, nodrošinot drošu un ērtu biļešu iegādes procesu.",
        icon: <Users className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "Mūsu vērtības",
        content: "Mēs balstāmies uz trim galvenajām vērtībām: godīgums, drošība un klientu apmierinātība. Mēs garantējam 100% drošas transakcijas.",
        icon: <Info className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "Ko mēs piedāvājam",
        content: "Mūsu platforma ļauj tās lietotājiem pārdot un iegādāties biļetes no citiem lietotājiem. Lai nodrošinātu drošību, tikai verificēti lietotāji var veikt darījumus mūsu platformā.",
        icon: <Check className="h-8 w-8 text-ticket-accent" />
      }
    ],
    en: [
      {
        title: "Our Vision",
        content: "Our goal is to create a reliable ticket trading platform that connects event attendees with other attendees, ensuring a secure and convenient ticket purchasing process.",
        icon: <Users className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "Our Values",
        content: "We are based on three core values: honesty, security, and customer satisfaction. We guarantee 100% secure transactions.",
        icon: <Info className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "What We Offer",
        content: "Our platform allows its users to sell and purchase tickets from other users. To ensure security, only verified users can perform transactions on our platform.",
        icon: <Check className="h-8 w-8 text-ticket-accent" />
      }
    ],
    ru: [
      {
        title: "Наше видение",
        content: "Наша цель - создать инновационную и надежную платформу для продажи билетов, которая объединяет посетителей мероприятий с другими посетителями, обеспечивая безопасный и удобный процесс покупки билетов.",
        icon: <Users className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "Наши ценности",
        content: "Мы основываемся на трех основных ценностях: честность, безопасность и удовлетворенность клиентов. Мы гарантируем 100% безопасные транзакции.",
        icon: <Info className="h-8 w-8 text-ticket-accent" />
      },
      {
        title: "Что мы предлагаем",
        content: "Наша платформа позволяет пользователям напрямую продавать и покупать билеты у других пользователей. Для обеспечения безопасности только проверенные пользователи могут совершать сделки на нашей платформе.",
        icon: <Check className="h-8 w-8 text-ticket-accent" />
      }
    ]
  };
  
  const { currentLanguage } = useLanguage();
  const content = companyInfo[currentLanguage.code as keyof typeof companyInfo] || companyInfo.en;
  
  return (
    <ThemeProvider defaultTheme="light" disableToggle={false}>
      <div className="min-h-screen flex flex-col bg-ticket-bg text-ticket-text">
        <SEO 
          title={translations.aboutUs?.title || "Par mums - netieku.es"}
          description={translations.aboutUs?.content?.[0] || "Mūsu mērķis ir radīt uzticamu platformu biļešu tirdzniecībai"}
        />
        <Header />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left text-ticket-accent">
                {translations.aboutUs?.title || "Par mums"}
              </h1>
              
              <div className="text-xl mb-12 text-ticket-text/80 text-center">
                <span className="text-ticket-accent font-semibold">netieku.es</span> {currentLanguage.code === 'en' ? 
                  "is a platform where users can safely sell and purchase tickets from other users" : 
                  "ir platforma, kurā lietotāji var droši pārdot un iegādāties biļetes no citiem lietotājiem"}
              </div>
            
              <div className="grid gap-8 md:grid-cols-3">
                {content.map((section, index) => (
                  <Card key={index} className="transition-all hover:shadow-lg border-t-4 border-t-ticket-accent bg-ticket-bg/50 border border-ticket-text/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {section.icon}
                        <h2 className="text-xl font-semibold ml-3 text-ticket-accent">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-ticket-text/80">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 bg-ticket-bg/50 p-6 rounded-lg border border-ticket-text/10">
                <h2 className="text-2xl font-semibold mb-4 text-ticket-accent">
                  {currentLanguage.code === 'lv' ? "Verificēti lietotāji" : 
                  currentLanguage.code === 'ru' ? "Проверенные пользователи" : 
                  "Verified Users"}
                </h2>
                <div className="flex items-start">
                  <Check className="h-6 w-6 text-ticket-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-ticket-text/80">
                    {currentLanguage.code === 'lv' ? 
                      "Mūsu platformā pārdot var tikai verificēti lietotāji. Tas nodrošina augstākā līmeņa drošību un uzticamību visiem mūsu lietotājiem. Katra darījuma drošība tiek garantēta." : 
                    currentLanguage.code === 'ru' ? 
                      "На нашей платформе могут работать только проверенные пользователи. Это обеспечивает высочайший уровень безопасности и надежности для всех наших пользователей. Каждый билет проверяется, и безопасность каждой транзакции гарантируется." :
                      "Only verified users can sell on our platform. This ensures the highest level of security and reliability for all our users. The security of each transaction is guaranteed."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AboutUs;
