
import { memo } from "react";
import { Check, TicketIcon, Users, RefreshCw } from "lucide-react";
import { useLanguage } from "@/features/language";

export const HowItWorks = memo(function HowItWorks() {
  const { translations } = useLanguage();
  const { howItWorks } = translations;

  const icons = [
    <Users className="h-8 w-8 md:h-10 md:w-10 text-orange-500" key="users" />,
    <TicketIcon className="h-8 w-8 md:h-10 md:w-10 text-orange-500" key="ticket" />,
    <RefreshCw className="h-8 w-8 md:h-10 md:w-10 text-orange-500" key="refresh" />,
    <Check className="h-8 w-8 md:h-10 md:w-10 text-orange-500" key="check" />
  ];

  return (
    <section className="py-10 px-4 md:py-20 dark:bg-gray-900" id="how-it-works">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4 dark:text-white">
          {howItWorks.title}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          {howItWorks.subtitle}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {howItWorks.steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                {icons[index]}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 dark:text-white">{step.title}</h3>
              <p className="text-sm md:text-base text-center text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

