
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
import { Globe } from "lucide-react";

// Komponents, kas attēlo karodziņu pēc ISO koda
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
            size={isMobile ? "sm" : "default"}
            className={`
              rounded-full
              bg-background
              text-foreground
              border-border
              shadow
              backdrop-blur
              hover:bg-accent
              hover:text-accent-foreground
              focus-visible:ring-2
              focus-visible:ring-primary
              transition
              px-3 py-1
              min-w-[110px]
              gap-2
            `}
            aria-label="Select language"
          >
            <Globe size={18} className="mr-1 opacity-70" />
            <FlagIcon countryCode={currentLanguage.flag} />
            <span className="font-medium">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`
            min-w-[160px]
            bg-background
            text-foreground
            border-border
            shadow-lg
            backdrop-blur
            rounded-xl
            mt-2
          `}
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language)}
              className={`
                cursor-pointer
                flex items-center
                gap-2 px-3 py-2
                rounded-md
                transition
                focus:bg-accent focus:text-accent-foreground
                hover:bg-orange-100
                dark:hover:bg-muted
                dark:focus:bg-muted
                font-medium
              `}
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
