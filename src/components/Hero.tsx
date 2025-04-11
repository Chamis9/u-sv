
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/features/language";
import { FallingTickets } from "@/components/FallingTickets";
import { Helmet } from "react-helmet-async";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Clock, CalendarDays } from "lucide-react";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  // Generate structured data for the event
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
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Structured data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-0"></div>
      
      {/* Falling tickets animation */}
      <FallingTickets />
      
      {/* Background image */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')" 
        }}
        aria-hidden="true"
      ></div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 z-10 text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            {hero.subtitle}
          </p>
          
          {/* Coming soon hover card */}
          <div className="flex justify-center mb-8">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-medium py-2.5 px-6 rounded-full cursor-pointer shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5">
                  <Clock className="h-5 w-5" />
                  <span>{hero.comingSoon}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white/90 backdrop-blur-sm border border-orange-200">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-orange-700">
                      {/* You can customize this text based on your translations */}
                      {hero.comingSoon === "Drīzumā" ? "Mēs vēl strādājam!" : 
                       hero.comingSoon === "Coming soon" ? "We're still working!" : 
                       "Мы еще работаем!"}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {/* You can customize this text based on your translations */}
                      {hero.comingSoon === "Drīzumā" ? "Strādājam, lai radītu labāko biļešu apmaiņas platformu Latvijā." : 
                       hero.comingSoon === "Coming soon" ? "We're working to create the best ticket exchange platform in Latvia." : 
                       "Мы работаем над созданием лучшей платформы обмена билетами в Латвии."}
                    </p>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {/* Expected launch timeframe */}
                        2025
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
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
          
          <div className="mt-4 text-white/70 text-sm">
            {hero.c2cExplanation}
          </div>
        </div>
      </div>
    </section>
  );
}
