
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
  // Use country code directly in URL, handle errors
  return (
    <div className="w-6 h-4 inline-flex items-center justify-center mr-2 overflow-hidden">
      <img 
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png 2x`}
        width="20"
        height="15"
        alt=""
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          console.log(`Failed to load flag: ${countryCode}`);
          e.currentTarget.style.display = 'none';
        }}
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
            className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
          >
            <FlagIcon countryCode={currentLanguage.flag} />
            <span>{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border-white/20">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language)}
              className="cursor-pointer hover:bg-orange-100"
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
