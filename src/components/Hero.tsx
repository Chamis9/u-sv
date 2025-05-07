
import { memo } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { Helmet } from "react-helmet-async";
import { TicketVerifyIcon } from "@/components/icons/TicketVerifyIcon";

export const Hero = memo(function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

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

      <div className="container mx-auto px-4 z-10 text-center py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-10">
            <div className="md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ticket-text mb-4 md:mb-6">
                <span className="block mb-2">Netiec uz</span>
                <span className="block mb-2">pasākumu?</span>
                <span className="block">
                  Pārdod <span className="text-ticket-accent">biļeti</span>
                  <span className=""> droši</span>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-ticket-text/90 mb-8 md:mb-12">
                {hero.subtitle}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <TicketVerifyIcon size={180} />
            </div>
          </div>
          
          <div className="mt-8 md:mt-12">
            <p className="text-xl md:text-2xl text-ticket-text mb-8 max-w-3xl mx-auto">
              Gribi uz koncertu, bet biļetes izpārdotas? Ieskaties
              <span className="text-ticket-accent font-bold"> NETIEKU.ES</span>!
            </p>
            
            <p className="text-lg md:text-xl text-ticket-text/90 mb-6 max-w-3xl mx-auto">
              Pērc vai pārdod biļetes uz koncertiem, teātri, sporta
              pasākumiem u.c.
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
          
          <div className="pt-8 md:pt-12 flex justify-between items-center max-w-3xl mx-auto">
            <div className="text-ticket-text/80 text-lg">
              Droša apmaksa un verifikācija
            </div>
            <div className="text-ticket-accent font-bold text-xl tracking-wider">
              DRĪZUMĀ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
