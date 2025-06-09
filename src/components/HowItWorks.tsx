
import { memo } from "react";
import { Search, TicketIcon, Users, RefreshCw } from "lucide-react";
import { useLanguage } from "@/features/language";

export const HowItWorks = memo(function HowItWorks() {
  const { translations } = useLanguage();
  const { howItWorks } = translations;

  return (
    <section className="py-10 px-4 md:py-20 bg-ticket-bg text-ticket-text" id="how-it-works">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4 text-ticket-accent">
          {howItWorks.title}
        </h2>
        <p className="text-center text-ticket-text/80 mb-8 md:mb-12 max-w-3xl mx-auto text-sm sm:text-base md:text-lg font-medium">
          {howItWorks.subtitle}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {howItWorks.steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 md:p-6 border-2 border-ticket-accent rounded-xl bg-ticket-bg/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-ticket-accent rounded-full">
                {index === 0 && <Users className="h-8 w-8 md:h-10 md:w-10 text-ticket-check" />}
                {index === 1 && <TicketIcon className="h-8 w-8 md:h-10 md:w-10 text-ticket-check" />}
                {index === 2 && <RefreshCw className="h-8 w-8 md:h-10 md:w-10 text-ticket-check" />}
                {index === 3 && <Search className="h-8 w-8 md:h-10 md:w-10 text-ticket-check" />}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-ticket-text">{step.title}</h3>
              <p className="text-sm md:text-base text-center text-ticket-text/70 font-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
