
import { memo } from "react";
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { FallingTickets } from "@/components/FallingTickets";
import { Helmet } from "react-helmet-async";

export const Hero = memo(function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "netieku.es - biļešu apmaiņas platforma",
    "description": "Pirmā Latvijas C2C biļešu apmaiņas platforma",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/ComingSoon"
    }
  };

  return (
    <section 
      id="hero" 
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Pārklājums caurspīdīgs abās mode */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      
      <FallingTickets />
          
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center will-change-transform"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
        }}
        aria-hidden="true"
      ></div>
      
      <div className="container mx-auto px-4 z-10 text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col items-center space-y-6">
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
              className="inline-flex items-center text-white hover:text-orange-300 transition-colors"
              aria-label="Learn more about how it works"
            >
              <span className="mr-2">{hero.learnMoreBtn}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});
