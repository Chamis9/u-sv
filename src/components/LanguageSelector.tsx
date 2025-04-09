
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
];

export function LanguageSelector() {
  const [currentLanguage] = useState(languages[0]);

  return (
    <div className="relative language-selector">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm border-white/10 hover:bg-white/30"
        aria-label="Select language"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </Button>
    </div>
  );
}
