
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-2 md:px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center ml-1">
          <Logo />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Navigation />
        </div>
        <div className="flex items-center mr-1">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
