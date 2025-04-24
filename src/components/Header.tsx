
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation, getNavigationLinks } from "./header/Navigation";
import { ThemeToggle } from "./theme/ThemeToggle";
import { MobileMenu } from "./header/MobileMenu";

export function Header() {
  const navigationLinks = getNavigationLinks();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4 px-4 md:px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu links={navigationLinks} />
          <Logo />
        </div>
        
        <Navigation />
        
        <div className="flex items-center gap-2 md:gap-4 text-white">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
