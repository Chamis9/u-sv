
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageContext";
import { languages } from "./translations";

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="language-selector">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="rounded-full bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
          >
            {currentLanguage.flag} <span className="ml-1">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm border-white/20">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLanguage(language)}
              className="cursor-pointer hover:bg-orange-100"
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
