
import { SubscribeForm } from "@/components/SubscribeForm";
import { useLanguage } from "@/components/LanguageSelector";
import { Ticket, Calendar, MapPin, ArrowDown, CircleUser } from "lucide-react";

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
        {/* Ticket container */}
        <div className="max-w-2xl mx-auto">
          {/* Main ticket body with typical ticket shape */}
          <div className="relative bg-white rounded-lg p-1 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            {/* Ticket edge pattern - top */}
            <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
              <div className="flex">
                {[...Array(40)].map((_, i) => (
                  <div key={`top-${i}`} className="w-2 h-2 bg-orange-500 mx-1 rounded-full" />
                ))}
              </div>
            </div>
            
            {/* Ticket edge pattern - bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden">
              <div className="flex">
                {[...Array(40)].map((_, i) => (
                  <div key={`bottom-${i}`} className="w-2 h-2 bg-orange-500 mx-1 rounded-full" />
                ))}
              </div>
            </div>
            
            {/* Ticket Content */}
            <div className="pt-6 pb-6 px-1">
              {/* Ticket header */}
              <div className="bg-orange-500 text-white font-bold text-center py-3 px-4 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Ticket className="mr-2" size={24} />
                  <span className="text-xl tracking-wider">ADMIT ONE</span>
                </div>
                <div className="text-sm">#C2C-2025</div>
              </div>
              
              {/* Event title in classic ticket style */}
              <div className="text-center mb-6 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-2">
                  {hero.titleHighlight}
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{hero.title}</h2>
                <p className="mt-3 text-gray-600 italic">{hero.subtitle}</p>
              </div>
              
              {/* Ticket perforation */}
              <div className="relative my-4">
                <div className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300"></div>
                <div className="absolute -left-1 top-[-10px] w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute -right-1 top-[-10px] w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Event details in classic ticket format */}
              <div className="grid grid-cols-2 gap-4 mb-6 px-8 py-4">
                <div className="flex items-start">
                  <MapPin className="text-orange-500 mt-1 mr-2" size={18} />
                  <div>
                    <div className="text-orange-500 text-xs font-semibold uppercase">LOCATION</div>
                    <div className="text-gray-800 font-medium">{hero.comingSoon}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="text-orange-500 mt-1 mr-2" size={18} />
                  <div>
                    <div className="text-orange-500 text-xs font-semibold uppercase">DATE & TIME</div>
                    <div className="text-gray-800 font-medium">Coming Soon</div>
                  </div>
                </div>
                <div className="flex items-start col-span-2">
                  <CircleUser className="text-orange-500 mt-1 mr-2" size={18} />
                  <div>
                    <div className="text-orange-500 text-xs font-semibold uppercase">ATTENDEE</div>
                    <div className="text-gray-800 font-medium">You</div>
                  </div>
                </div>
              </div>
              
              {/* Subscribe section */}
              <div className="text-center mb-4 px-8">
                <p className="text-gray-700 text-lg mb-4">{hero.subscribeText}</p>
                <SubscribeForm />
              </div>
              
              {/* Ticket footer */}
              <div className="bg-gray-100 p-3 mt-6 text-center text-sm text-gray-500 rounded-b-lg">{hero.c2cExplanation}</div>
            </div>
          </div>
          
          {/* Learn more button */}
          <div className="mt-8 text-center">
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
