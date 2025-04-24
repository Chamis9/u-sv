
import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useLanguage } from "@/features/language";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  const { translations } = useLanguage();
  
  const companyInfo = {
    lv: [
      {
        title: "Mūsu vīzija",
        content: "Mūsu mērķis ir radīt inovatīvu un uzticamu platformu biļešu tirdzniecībai, kas vieno pasākumu organizētājus ar apmeklētājiem, nodrošinot drošu un ērtu biļešu iegādes procesu."
      },
      {
        title: "Mūsu vērtības",
        content: "Mēs balstāmies uz trim galvenajām vērtībām: godīgums, drošība un klientu apmierinātība. Mēs garantējam 100% drošas transakcijas un autentiskas biļetes."
      },
      {
        title: "Ko mēs piedāvājam",
        content: "Mēs nodrošinām plašu pasākumu klāstu - no teātra izrādēm līdz sporta notikumiem. Mūsu platforma ļauj ērti pārdot un iegādāties biļetes, kā arī pārvaldīt savas biļetes digitālā formātā."
      }
    ],
    en: [
      {
        title: "Our Vision",
        content: "Our goal is to create an innovative and reliable ticket trading platform that connects event organizers with attendees, ensuring a secure and convenient ticket purchasing process."
      },
      {
        title: "Our Values",
        content: "We are based on three core values: honesty, security, and customer satisfaction. We guarantee 100% secure transactions and authentic tickets."
      },
      {
        title: "What We Offer",
        content: "We provide a wide range of events - from theater performances to sports events. Our platform allows you to easily sell and purchase tickets, as well as manage your tickets digitally."
      }
    ],
    ru: [
      {
        title: "Наше видение",
        content: "Наша цель - создать инновационную и надежную платформу для продажи билетов, которая объединяет организаторов мероприятий с посетителями, обеспечивая безопасный и удобный процесс покупки билетов."
      },
      {
        title: "Наши ценности",
        content: "Мы основываемся на трех основных ценностях: честность, безопасность и удовлетворенность клиентов. Мы гарантируем 100% безопасные транзакции и подлинные билеты."
      },
      {
        title: "Что мы предлагаем",
        content: "Мы предоставляем широкий спектр мероприятий - от театральных постановок до спортивных событий. Наша платформа позволяет легко продавать и покупать билеты, а также управлять своими билетами в цифровом формате."
      }
    ]
  };
  
  const { currentLanguage } = useLanguage();
  const content = companyInfo[currentLanguage.code as keyof typeof companyInfo] || companyInfo.en;
  
  return (
    <ThemeProvider defaultTheme="light" disableToggle={false}>
      <div className="min-h-screen flex flex-col dark:bg-gray-900">
        <SEO />
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          <section className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold dark:text-white">
                {translations.aboutUs?.title}
              </h1>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-orange-500">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default AboutUs;
