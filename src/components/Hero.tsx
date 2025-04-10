
import { TicketForm } from "@/components/TicketForm";
import { useLanguage } from "@/components/LanguageSelector";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background overlay - made slightly lighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 z-0"></div>
      
      {/* Background image - updated to show a concert/theater event */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
        }}
      ></div>
      
      {/* Hero content - reversed layout */}
      <div className="container mx-auto px-4 z-10 text-center py-20">
        <div className="max-w-4xl mx-auto md:flex md:flex-row-reverse md:items-center md:gap-8">
          {/* Ticket form section */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="w-full max-w-md mx-auto">
              <TicketForm />
            </div>
          </div>
          
          {/* Text content section */}
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {hero.title} <span className="text-gradient">{hero.titleHighlight}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {hero.subtitle}
            </p>
            
            <div className="bg-orange-500 text-white text-lg md:text-xl font-semibold py-2 px-6 rounded-full inline-block mb-8">
              {hero.comingSoon}
            </div>
            
            <div className="pt-6">
              <a 
                href="#how-it-works" 
                className="inline-flex items-center text-white hover:text-orange-300 transition-colors"
              >
                <span className="mr-2">{hero.learnMoreBtn}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </a>
            </div>
            
            <div className="mt-4 text-white/70 text-sm">
              {hero.c2cExplanation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
