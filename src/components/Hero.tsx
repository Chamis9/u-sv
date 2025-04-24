
import { memo } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { FallingTickets } from "@/components/FallingTickets";
import { Helmet } from "react-helmet-async";

export const Hero = memo(function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800"
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
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent dark:from-black/20 dark:to-transparent"></div>

      <FallingTickets />

      <div className="container mx-auto px-4 z-10 text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            {hero.title}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-100 to-white dark:from-orange-200 dark:to-orange-100">
              {hero.titleHighlight}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-12 drop-shadow">
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col items-center space-y-6 bg-white/10 dark:bg-gray-950/20 rounded-xl p-8">
            <p className="text-white text-lg">
              {hero.subscribeText}
            </p>
            <div className="w-full max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>
          
          <div className="pt-12">
            <a
              href="#how-it-works"
              className="inline-flex items-center text-white hover:text-orange-100 transition-colors"
              aria-label="Learn more about how it works"
            >
              <span className="mr-2">{hero.learnMoreBtn}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="animate-bounce"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
