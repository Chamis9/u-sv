
import { LanguageSelector } from "@/features/language";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <Navigation />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
