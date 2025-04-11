
import { useLanguage } from "@/features/language";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Clock, CalendarDays } from "lucide-react";

export function ComingSoon() {
  const { translations } = useLanguage();
  const { hero } = translations;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded-full cursor-pointer shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5">
          <Clock className="h-4 w-4" />
          <span>{hero.comingSoon}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-white/90 backdrop-blur-sm border border-orange-200">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-orange-700">
              {hero.comingSoon === "Drīzumā" ? "Mēs vēl strādājam!" : 
                hero.comingSoon === "Coming soon" ? "We're still working!" : 
                "Мы еще работаем!"}
            </h4>
            <p className="text-sm text-gray-700">
              {hero.comingSoon === "Drīzumā" ? "Strādājam, lai radītu labāko biļešu apmaiņas platformu Latvijā." : 
                hero.comingSoon === "Coming soon" ? "We're working to create the best ticket exchange platform in Latvia." : 
                "Мы работаем над созданием лучшей платформы обмена билетами в Латвии."}
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                2025
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
