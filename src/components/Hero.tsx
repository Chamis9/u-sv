
import { memo } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { Helmet } from "react-helmet-async";
import { TicketVerifyIcon } from "@/components/icons/TicketVerifyIcon";
import { Card, CardContent } from "@/components/ui/card";

export const Hero = memo(function Hero() {
  const { translations, currentLanguage } = useLanguage();
  const { hero } = translations;

  const texts = getHeroTexts(currentLanguage.code);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-ticket-bg dark:bg-ticket-bg"
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "netieku.es - biļešu apmaiņas platforma",
            "description": "Pirmā biļešu apmaiņas platforma Latvijā",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/ComingSoon"
            }
          })}
        </script>
      </Helmet>
      
      <div className="absolute inset-0 bg-ticket-bg/90"></div>

      <div className="container mx-auto px-4 z-10 text-center py-20 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-10">
            <div className="md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ticket-text mb-4 md:mb-6">
                {texts.heading.map((part, index) => (
                  <span key={index} className="block mb-2" dangerouslySetInnerHTML={{ __html: part }} />
                ))}
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-ticket-text/90 mb-8 md:mb-12">
                {hero.subtitle}
              </p>
            </div>
            
            <div className="flex-shrink-0 transform transition-all hover:scale-105">
              <Card className="bg-gradient-to-br from-ticket-bg to-ticket-bg/80 border-2 border-ticket-accent/30 rounded-xl shadow-lg shadow-orange-500/20 overflow-hidden max-w-xs">
                <CardContent className="p-2 sm:p-4 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <TicketVerifyIcon size={100} />
                  </div>
                  <div className="bg-ticket-bg/40 rounded-lg p-4 border border-ticket-accent/10">
                    <div className="flex flex-col gap-3 mt-20 items-start text-left">
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Event</div>
                        <div className="text-lg font-semibold text-ticket-accent truncate">Concert Show 2025</div>
                      </div>
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Date</div>
                        <div className="text-base text-ticket-text truncate">May 21, 2025 · 19:00</div>
                      </div>
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Seat</div>
                        <div className="text-base text-ticket-text truncate">Section A, Row 12, Seat 23</div>
                      </div>
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Price</div>
                        <div className="text-lg font-semibold text-ticket-accent">€65.00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12">
            <p className="text-xl md:text-2xl text-ticket-text mb-8 max-w-3xl mx-auto">
              {texts.mainCta}
              <span className="text-ticket-accent font-bold"> NETIEKU.ES</span>!
            </p>
            
            <p className="text-lg md:text-xl text-ticket-text/90 mb-6 max-w-3xl mx-auto">
              {texts.description}
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-6 bg-ticket-accent/10 dark:bg-ticket-accent/5 rounded-xl p-4 sm:p-6 md:p-8 mt-8 border border-ticket-text/10">
            <p className="text-ticket-text text-base md:text-lg">
              {hero.subscribeText}
            </p>
            <div className="w-full max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

const getHeroTexts = (langCode: string) => {
  const translations = {
    lv: {
      heading: [
        "Netiec uz",
        "pasākumu?",
        "Pārdod <span class='text-ticket-accent'>biļeti</span> droši"
      ],
      mainCta: "Gribi uz pasākumu, bet biļetes izpārdotas? Ieskaties",
      description: "Pērc vai pārdod biļetes uz koncertiem, teātri, sporta pasākumiem u.c."
    },
    en: {
      heading: [
        "Can't attend",
        "an event?",
        "Sell your <span class='text-ticket-accent'>ticket</span> safely"
      ],
      mainCta: "Want to attend an event, but tickets are sold out? Check out",
      description: "Buy or sell tickets to concerts, theater, sports events, and more."
    },
    ru: {
      heading: [
        "Не попадаешь на",
        "мероприятие?",
        "Продай <span class='text-ticket-accent'>билет</span> безопасно"
      ],
      mainCta: "Хочешь на мероприятие, но билеты распроданы? Загляни в",
      description: "Покупай или продавай билеты на концерты, театр, спортивные мероприятия и др."
    }
  };

  return translations[langCode as keyof typeof translations] || translations.en;
};
