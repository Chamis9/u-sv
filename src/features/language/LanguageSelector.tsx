
import { memo } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageContext";
import { languages } from "./languages";
import { useIsMobile } from "@/hooks/use-mobile";

// Component to display the country flag using ISO country code
const FlagIcon = ({ countryCode }: { countryCode: string }) => {
  return (
    <div className="w-6 h-4 inline-flex items-center justify-center mr-2 overflow-hidden">
      <img 
        src={`/flags/${countryCode.toLowerCase()}.svg`}
        width="20"
        height="15"
        alt=""
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export const LanguageSelector = memo(function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className={`language-selector ${isMobile ? 'pr-0' : ''}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="rounded-full bg-white/10 backdrop-blur-sm text-white dark:bg-gray-800 dark:text-white/90 border-white/20 hover:bg-white/20 dark:hover:bg-gray-700"
          >
            <FlagIcon countryCode={currentLanguage.flag} />
            <span>{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-white/90 dark:bg-gray-900 dark:border-gray-700 backdrop-blur-sm border-white/20 shadow-lg"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language)}
              className="cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-800 dark:text-white/90"
            >
              <FlagIcon countryCode={language.flag} />
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
