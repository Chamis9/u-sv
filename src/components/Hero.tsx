
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/components/LanguageSelector";
import { Ticket, Calendar, MapPin, ArrowDown } from "lucide-react";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 bg-black">
      {/* Background overlay - darker for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/80 z-0"></div>
      
      {/* Background image */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center opacity-50"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" 
        }}
      ></div>
      
      <div className="container mx-auto px-4 z-10">
        {/* Ticket container with perforated edges */}
        <div className="relative max-w-3xl mx-auto">
          {/* Top ticket stub */}
          <div 
            className="bg-black border-2 border-orange-400 rounded-t-xl py-3 px-6 flex justify-between items-center"
            style={{
              borderBottom: "dashed 2px #fb923c",
            }}
          >
            <div className="flex items-center">
              <Ticket className="text-orange-400 mr-2" size={20} />
              <span className="text-orange-400 font-bold tracking-wider">ADMIT ONE</span>
            </div>
            <div className="text-orange-400 text-sm font-bold">#C2C-2025</div>
          </div>
          
          {/* Main ticket body */}
          <div 
            className="bg-black border-2 border-orange-400 border-t-0 rounded-b-xl p-6 pb-10"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(251, 146, 60, 0.15), transparent 60%)"
            }}
          >
            {/* Ticket holes */}
            <div className="absolute -left-1 top-1/4 w-2 h-4 bg-black border-r-2 border-orange-400 rounded-l-full"></div>
            <div className="absolute -right-1 top-1/4 w-2 h-4 bg-black border-l-2 border-orange-400 rounded-r-full"></div>
            <div className="absolute -left-1 bottom-1/4 w-2 h-4 bg-black border-r-2 border-orange-400 rounded-l-full"></div>
            <div className="absolute -right-1 bottom-1/4 w-2 h-4 bg-black border-l-2 border-orange-400 rounded-r-full"></div>
            
            {/* Event title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">{hero.titleHighlight}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-orange-400 font-bold">{hero.title}</h2>
              <p className="mt-3 text-white/80 italic">{hero.subtitle}</p>
            </div>
            
            {/* Event details */}
            <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-orange-400/30 py-4">
              <div className="flex items-start">
                <MapPin className="text-orange-400 mt-1 mr-2" size={16} />
                <div>
                  <div className="text-orange-400 text-xs font-semibold uppercase">LOCATION</div>
                  <div className="text-white">{hero.comingSoon}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="text-orange-400 mt-1 mr-2" size={16} />
                <div>
                  <div className="text-orange-400 text-xs font-semibold uppercase">DATE & TIME</div>
                  <div className="text-white">Coming Soon</div>
                </div>
              </div>
            </div>
            
            {/* Subscribe section */}
            <div className="text-center mb-4">
              <p className="text-white text-lg mb-4">{hero.subscribeText}</p>
              <SubscribeForm />
            </div>
            
            {/* Bottom info */}
            <div className="mt-6 text-center text-sm text-orange-400/70">{hero.c2cExplanation}</div>
            
            {/* Learn more button */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <a 
                href="#how-it-works" 
                className="flex flex-col items-center text-orange-400 hover:text-orange-300 transition-colors"
              >
                <span className="text-sm mb-1">{hero.learnMoreBtn}</span>
                <ArrowDown size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
