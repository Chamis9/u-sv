
import { Check, TicketIcon, Users, RefreshCw } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <TicketIcon className="h-10 w-10 text-orange-500" />,
      title: "Ievieto biļeti",
      description: "Ievietojiet pasākuma biļeti platformā ātri un vienkārši"
    },
    {
      icon: <Users className="h-10 w-10 text-orange-500" />,
      title: "Sazinies ar pircēju",
      description: "Izmantojiet platformas drošās saziņas iespējas"
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-orange-500" />,
      title: "Droša apmaiņa",
      description: "Vienkāršs un drošs apmaiņas process"
    },
    {
      icon: <Check className="h-10 w-10 text-orange-500" />,
      title: "Apmeklē pasākumu",
      description: "Pasākuma apmeklējums un emocijas ir garantētas"
    }
  ];

  return (
    <section className="py-12 px-4 md:py-20" id="how-it-works">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Kā tas strādā
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Vienkāršs un drošs veids, kā pārdot vai iegādāties biļetes uz pasākumiem
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 bg-orange-100 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-center text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
