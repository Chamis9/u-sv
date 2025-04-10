
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/components/LanguageSelector";
import { FallingTickets } from "@/components/FallingTickets";
import { Helmet } from "react-helmet-async";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  // Structured data for events
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "netieku.es",
    "url": "https://netieku.es",
    "description": "Biļešu apmaiņas platforma Latvijā",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://netieku.es/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-0"></div>
        
        {/* Falling tickets animation */}
        <FallingTickets />
        
        {/* Background image with alt text for SEO */}
        <div 
          className="absolute inset-0 z-[-1] bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
          }}
          aria-label="Publisks pasākums ar skatuvi un skatītājiem"
          role="img"
        ></div>
        
        {/* Hero content with semantic HTML */}
        <div className="container mx-auto px-4 z-10 text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {hero.subtitle}
            </p>
            
            <div className="bg-orange-500 text-white text-lg md:text-xl font-semibold py-2 px-6 rounded-full inline-block mb-8">
              {hero.comingSoon}
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
                aria-label="Uzzināt vairāk par platformu"
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
    </>
  );
}
