
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/components/LanguageSelector";
import { Ticket } from "lucide-react";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-16">
      {/* Background overlay - made darker for ticket contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/70 z-0"></div>
      
      {/* Background image - kept the same */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
        }}
      ></div>
      
      {/* Ticket-styled Hero content */}
      <div className="container mx-auto px-4 z-10">
        <div 
          className="max-w-3xl mx-auto relative border-2 border-orange-400/80 rounded-lg overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.85))",
            boxShadow: "0 0 30px rgba(255,165,0,0.2)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 92% 96%, 8% 96%, 0 100%)"
          }}
        >
          {/* Ticket header with stub edge */}
          <div className="relative">
            <div className="py-2 px-4 border-b-2 border-orange-400/80 flex justify-between items-center">
              <div className="flex items-center">
                <Ticket className="text-orange-400 mr-2" size={20} />
                <span className="text-orange-400 font-bold">ADMIT ONE</span>
              </div>
              <div className="text-orange-400 font-bold flex items-center">
                <Ticket className="text-orange-400 mr-2" size={20} />
                <span>ADMIT ONE</span>
              </div>
            </div>
          </div>
          
          {/* Ticket main content */}
          <div className="p-6 pt-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">{hero.titleHighlight}</span>
            </h1>
            
            <h2 className="text-3xl text-orange-400 font-bold mb-4">{hero.title}</h2>
            
            <p className="text-xl text-white/90 mb-6 italic">
              {hero.subtitle}
            </p>
            
            {/* Ticket details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t border-b border-orange-400/40 py-4">
              <div className="text-left">
                <div className="text-orange-400 text-sm font-semibold">LOCATION</div>
                <div className="text-white">{hero.comingSoon}</div>
              </div>
              <div className="text-right">
                <div className="text-orange-400 text-sm font-semibold">DATE & TIME</div>
                <div className="text-white">Coming Soon</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <p className="text-white text-lg">
                {hero.subscribeText}
              </p>
              <div className="w-full max-w-md mx-auto">
                <SubscribeForm />
              </div>
            </div>
            
            {/* Bottom information */}
            <div className="mt-6 pt-2 border-t border-orange-400/40">
              <a 
                href="#how-it-works" 
                className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
              >
                <span className="mr-2">{hero.learnMoreBtn}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </a>
            </div>
            
            <div className="mt-4 text-orange-400/70 text-sm">
              {hero.c2cExplanation}
            </div>
          </div>
          
          {/* Ticket edge decorations */}
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-transparent">
            <div className="h-full flex flex-col justify-evenly">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-orange-400"></div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-transparent">
            <div className="h-full flex flex-col justify-evenly">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-orange-400"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
