
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { ComingSoon } from "./header/ComingSoon";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex-1 flex justify-center mx-4">
          <ComingSoon />
        </div>
        <div className="flex items-center space-x-4">
          <Navigation />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
