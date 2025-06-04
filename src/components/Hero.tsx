import { memo } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { Helmet } from "react-helmet-async";
import { TicketVerifyIcon } from "@/components/icons/TicketVerifyIcon";
import { Card, CardContent } from "@/components/ui/card";
import { format, addDays } from "date-fns";
import { lv, enUS, et, lt } from "date-fns/locale";

export const Hero = memo(function Hero() {
  const { translations, currentLanguage } = useLanguage();
  const { hero } = translations;

  const texts = getHeroTexts(currentLanguage.code);
  
  // Calculate date that is 3 days from today
  const eventDate = addDays(new Date(), 3);
  
  // Get the appropriate locale for date formatting
  const getLocale = () => {
    switch (currentLanguage.code) {
      case 'lv': return lv;
      case 'en': return enUS;
      case 'et':
      case 'ee': return et;
      case 'lt': return lt;
      default: return lv;
    }
  };
  
  const locale = getLocale();
  const formattedDate = format(eventDate, "PPP", { locale });

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
            "name": "SellTiX - biļešu apmaiņas platforma",
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
                    <TicketVerifyIcon size={100} className="opacity-100" />
                  </div>
                  <div className="bg-ticket-bg/40 rounded-lg p-4 border border-ticket-accent/10">
                    <div className="flex flex-col gap-3 mt-20 items-start text-left">
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Event</div>
                        <div className="text-lg font-semibold text-ticket-accent truncate">Concert Show 2025</div>
                      </div>
                      <div className="w-full">
                        <div className="text-xs text-ticket-text/60 uppercase tracking-wider mb-1">Date</div>
                        <div className="text-base text-ticket-text truncate">{formattedDate} · 19:00</div>
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
              <span className="text-ticket-accent font-bold"> SellTiX</span>!
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
      description: "SellTiX ir platforma, kurā lietotāji var droši pārdot un iegādāties biļetes no citiem lietotājiem."
    },
    en: {
      heading: [
        "Can't attend",
        "an event?",
        "Sell your <span class='text-ticket-accent'>ticket</span> safely"
      ],
      mainCta: "Want to attend an event, but tickets are sold out? Check out",
      description: "SellTiX is a platform where users can safely sell and purchase tickets from other users."
    },
    et: {
      heading: [
        "Ei saa",
        "üritusele?",
        "Müü oma <span class='text-ticket-accent'>pilet</span> turvaliselt"
      ],
      mainCta: "Soovid minna üritusele, kuid piletid on välja müüdud? Vaata",
      description: "SellTiX on platvorm, kus kasutajad saavad turvaliselt müüa ja osta pileteid teistelt kasutajatelt."
    },
    lt: {
      heading: [
        "Negalite dalyvauti",
        "renginyje?",
        "Parduokite savo <span class='text-ticket-accent'>bilietą</span> saugiai"
      ],
      mainCta: "Norite dalyvauti renginyje, bet bilietai išparduoti? Patikrinkite",
      description: "SellTiX yra platforma, kurioje vartotojai gali saugiai parduoti ir pirkti bilietus iš kitų vartotojų."
    }
  };

  return translations[langCode as keyof typeof translations] || translations.en;
};
