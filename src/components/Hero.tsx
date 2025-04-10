
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/components/LanguageSelector";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 bg-gradient-to-b from-black to-gray-900">
      {/* Background texture */}
      <div 
        className="absolute inset-0 z-[-1] opacity-20"
        style={{ 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/binding-dark.png')" 
        }}
      ></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto">
          {/* Classic ticket stub design */}
          <div className="relative bg-[#F2C94C] rounded-lg shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            {/* Cut corners */}
            <div className="absolute top-0 left-0 w-6 h-6 bg-gray-900 rounded-br-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 bg-gray-900 rounded-bl-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 bg-gray-900 rounded-tr-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-900 rounded-tl-lg"></div>
            
            {/* Ticket Content */}
            <div className="py-16 px-8 flex flex-col md:flex-row items-stretch">
              {/* Left side "ADMIT ONE" */}
              <div className="writing-mode-vertical-rl transform rotate-180 flex items-center justify-center border-r-2 border-dashed border-gray-800 pr-4 md:pr-6">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-wider">ADMIT ONE</h3>
              </div>
              
              {/* Center content */}
              <div className="flex-grow flex flex-col justify-center items-center text-center px-4 md:px-8 py-6 md:py-0">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight leading-none mb-4">
                  EVENT<br/>TICKETS
                </h1>
                <p className="text-xl text-gray-800 mb-8">{hero.subtitle}</p>
                
                {/* Subscribe form */}
                <div className="w-full">
                  <p className="text-gray-800 mb-4">{hero.subscribeText}</p>
                  <SubscribeForm />
                </div>
              </div>
              
              {/* Right side "ADMIT ONE" */}
              <div className="writing-mode-vertical-lr flex items-center justify-center border-l-2 border-dashed border-gray-800 pl-4 md:pl-6 mt-4 md:mt-0">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-wider">ADMIT ONE</h3>
              </div>
            </div>
          </div>
          
          {/* Learn more button */}
          <div className="mt-12 text-center">
            <a 
              href="#how-it-works" 
              className="inline-flex flex-col items-center text-white hover:text-orange-300 transition-colors"
            >
              <span className="text-sm mb-1">{hero.learnMoreBtn}</span>
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
